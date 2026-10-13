# SOO Coffee — Google Review Assistant

> **"Share your SOO moment. Turn your experience into your own words."**  
> A dedicated, mobile-first Google Review writing assistant custom-built for **SOO Coffee, Jubilee Hills, Hyderabad**. Designed for customers scanning tabletop QR codes or counter NFC cards.

---

## Customer Flow (One Simple Page)

```
[QR Code / NFC Card Scanned by Customer]
                     │
                     ▼
  [SOO Coffee Branded Assistant Opens]
  • Name & Location: SOO Coffee • Jubilee Hills, Hyderabad
  • Select Highlights: Coffee, Ambience, Bakes, Staff, Seating
  • Optional: Notes on items ordered or experience
  • Choose Tone & Language (English, Hindi, Hinglish)
                     │
                     ▼
       [Click "Generate My Review"]
  • AI crafts unique, grounded, natural review
  • Zero hallucination of unmentioned dishes/orders
                     │
                     ▼
        [Edit, Polish & Copy Draft]
  • Live word & character counters
  • Single-click copy or regenerate
                     │
                     ▼
  [Click "Continue to Google Reviews"]
  • Copies draft to clipboard automatically
  • Opens SOO Coffee's Google review page
  • Customer pastes & submits their review on Google
```

---

## Key Features

1. **Direct SOO Coffee Integration**:
   - Pre-configured for **SOO Coffee, Jubilee Hills, Hyderabad**.
   - No searching, no manual venue selection, and no login required for customers.
2. **Minimal & Fast UI/UX**:
   - Clean cafe aesthetic: white background, dark typography, subtle green accents.
   - Mobile-first, lightweight, and ultra-fast.
3. **Genuine & Varied AI Generation**:
   - Supports **English**, **Hindi (हिंदी)**, and modern **Hinglish**.
   - Anti-repetition engine guarantees each customer gets a newly composed draft.
   - Option to generate **3 alternatives** simultaneously.
4. **Google Reviews Deep-Link**:
   - Opens SOO Coffee's official Google review page.
   - Small instruction: *"Review your text, copy it, and paste it into Google Reviews. Submit your review on Google."*
5. **Admin Settings**:
   - Configurable Google review URL (defaults to verified SOO Coffee Jubilee Hills Google Maps listing or direct review link `https://search.google.com/local/writereview?placeid=...`).
   - Live link test button.
   - Provider settings (Gemini API, OpenAI, or the built-in natural engine).
6. **Review History**:
   - Preserves generated drafts locally with search, copy, and delete controls.

---

## Getting Started

### 1. Installation
```bash
cd "review system"
npm install
```

### 2. Configuration (`.env` or Admin Settings)
Copy `.env.example` to `.env`:
```env
PORT=3000
GEMINI_API_KEY=
OPENAI_API_KEY=
GOOGLE_REVIEW_URL=https://www.google.com/maps/search/?api=1&query=SOO+Coffee+Jubilee+Hills+Hyderabad
```

> **Note**: An external API key is **optional**. The app comes with an integrated **SOO Coffee Natural Engine** that works immediately without configuring an API key.

### 3. Launch Server
```bash
npm start
# Or for development:
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser or point your QR code directly to this URL.
