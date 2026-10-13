const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const storage = require('./lib/storage');
const { generateReviews, testAiConnection } = require('./lib/aiEngine');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'public', 'vendor')));

// Basic rate limiting helper (in-memory per IP)
const rateLimitMap = new Map();
function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 40; // 40 requests per minute

  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }
  rateLimitMap.set(ip, record);

  if (record.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait a moment before trying again.'
    });
  }
  next();
}

app.use('/api/', rateLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Reviewly AI Engine',
    timestamp: new Date().toISOString()
  });
});

// Settings endpoints
app.get('/api/settings', (req, res) => {
  try {
    const publicSettings = storage.getPublicSettings();
    res.json({ success: true, settings: publicSettings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const updates = req.body;
    // Don't overwrite key with empty if not explicitly changed
    if (updates.geminiApiKey === undefined || updates.geminiApiKey === '') {
      delete updates.geminiApiKey;
    }
    if (updates.openaiApiKey === undefined || updates.openaiApiKey === '') {
      delete updates.openaiApiKey;
    }
    const updated = storage.updateSettings(updates);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test AI API connection
app.post('/api/test-connection', async (req, res) => {
  try {
    const { provider, apiKey, model } = req.body;
    const settings = storage.getSettings();
    const effectiveKey = apiKey || (provider === 'gemini' ? settings.geminiApiKey : settings.openaiApiKey);
    const effectiveModel = model || (provider === 'gemini' ? settings.geminiModel : settings.openaiModel);

    if (!effectiveKey) {
      return res.status(400).json({
        success: false,
        error: 'No API key provided or configured.'
      });
    }

    const result = await testAiConnection(provider, effectiveKey, effectiveModel);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Connection test failed.'
    });
  }
});

// History endpoints
app.get('/api/history', (req, res) => {
  try {
    let list = storage.getHistory();
    const { search, type } = req.query;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(item => 
        (item.businessName && item.businessName.toLowerCase().includes(q)) ||
        (item.reviewText && item.reviewText.toLowerCase().includes(q)) ||
        (item.cuisineOrSpecialty && item.cuisineOrSpecialty.toLowerCase().includes(q))
      );
    }

    if (type && type !== 'All') {
      list = list.filter(item => item.businessType && item.businessType.toLowerCase() === type.toLowerCase());
    }

    res.json({ success: true, count: list.length, items: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/history/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteHistory(id);
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/history', (req, res) => {
  try {
    storage.clearHistory();
    res.json({ success: true, message: 'All review history cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate reviews endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const {
      businessType = 'Cafe',
      businessName,
      cuisineOrSpecialty = '',
      experience = [],
      occasion = 'Casual visit',
      tone = 'Casual',
      length = 'Medium',
      language = 'English',
      customDetails = '',
      count = 1
    } = req.body;

    const settings = storage.getSettings();
    const effectiveBusinessName = (businessName && businessName.trim()) || settings.businessName || 'SOO Coffee';
    const effectiveBusinessType = businessType || settings.businessType || 'Cafe';

    const requestedCount = Number(count) === 3 ? 3 : 1;

    // Fetch recent drafts for this business to avoid repetition
    const recentDrafts = storage.getRecentDrafts(effectiveBusinessName, 5);

    // Call generation engine
    const generatedItems = await generateReviews({
      businessType: effectiveBusinessType,
      businessName: effectiveBusinessName,
      businessLocation: settings.businessLocation || 'Jubilee Hills, Hyderabad',
      cuisineOrSpecialty: cuisineOrSpecialty ? cuisineOrSpecialty.trim() : 'Specialty Coffee',
      experience: Array.isArray(experience) ? experience : [],
      occasion: occasion || 'Casual visit',
      tone: tone || settings.defaultTone || 'Casual',
      length: length || settings.defaultLength || 'Medium',
      language: language || settings.defaultLanguage || 'English',
      customDetails: customDetails ? customDetails.trim() : ''
    }, {
      count: requestedCount,
      recentDrafts
    });

    // Save generated items into history
    const savedItems = storage.addHistory(generatedItems);

    res.json({
      success: true,
      count: savedItems.length,
      reviews: savedItems,
      googleReviewUrl: settings.googleReviewUrl || 'https://www.google.com/search?q=soo%20coffee%20reviews&source=sh/x/gs/m2/5&shem=aimgspe,#lrd=0x3bcb91b0e0754eff:0x6878499b1e7e2599,3,,,,'
    });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate review. Please try again.'
    });
  }
});

// Fallback to index.html for navigation
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(` Reviewly Server running on port ${PORT}`);
  console.log(` Access URL: http://localhost:${PORT}`);
  console.log(`===========================================\n`);
});
