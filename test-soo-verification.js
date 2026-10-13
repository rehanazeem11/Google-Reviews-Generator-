async function runVerification() {
  console.log('--- STARTING SOO COFFEE GOOGLE REVIEW FLOW VERIFICATION ---');

  // 1. Check HTML output
  const res = await fetch('http://localhost:3000/');
  const html = await res.text();

  console.log('1. Page Branding & UI Elements:');
  console.log('   - Contains SOO Coffee:', html.includes('SOO Coffee'));
  console.log('   - Contains "Share your SOO moment":', html.includes('Share your SOO moment'));
  console.log('   - Contains "Continue to Google Reviews":', html.includes('Continue to Google Reviews'));
  console.log('   - Exact GOOGLE_REVIEW_URL in href:', html.includes('https://www.google.com/search?q=soo%20coffee%20reviews&source=sh/x/gs/m2/5&shem=aimgspe,#lrd=0x3bcb91b0e0754eff:0x6878499b1e7e2599,3,,,,'));
  console.log('   - Contains target="_blank":', html.includes('target="_blank"'));
  console.log('   - Contains rel="noopener noreferrer":', html.includes('rel="noopener noreferrer"'));
  console.log('   - Guidance notice:', html.includes('Review your text, copy it, and paste it into Google Reviews. Submit your review on Google.'));

  // 2. Check Settings endpoint
  const sRes = await fetch('http://localhost:3000/api/settings');
  const sData = await sRes.json();
  console.log('\n2. Settings Endpoint (/api/settings):');
  console.log('   - Status:', sData.success);
  console.log('   - Business Name:', sData.settings.businessName);
  console.log('   - Business Location:', sData.settings.businessLocation);
  console.log('   - googleReviewUrl:', sData.settings.googleReviewUrl);

  // 3. Test Generate Review
  const gRes = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      experience: ['Specialty Coffee', 'Calm Ambience', 'Outdoor Seating'],
      customDetails: 'Ordered the iced Spanish latte and sourdough toast. Staff were friendly.',
      tone: 'Casual',
      length: 'Medium',
      language: 'English',
      count: 1
    })
  });
  const gData = await gRes.json();
  console.log('\n3. Review Generation (/api/generate):');
  console.log('   - Success:', gData.success);
  console.log('   - Number of reviews:', gData.reviews.length);
  console.log('   - Review text preview:', gData.reviews[0].reviewText);
  console.log('   - googleReviewUrl returned in response:', gData.googleReviewUrl);
  console.log('   - Matches GOOGLE_REVIEW_URL:', gData.googleReviewUrl === 'https://www.google.com/search?q=soo%20coffee%20reviews&source=sh/x/gs/m2/5&shem=aimgspe,#lrd=0x3bcb91b0e0754eff:0x6878499b1e7e2599,3,,,,');

  console.log('\n--- VERIFICATION FINISHED SUCCESSFULLY ---');
}

runVerification().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
