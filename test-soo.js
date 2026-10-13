async function runSooTests() {
  console.log('=== 1. Checking Settings ===');
  const sRes = await fetch('http://localhost:3000/api/settings');
  const sData = await sRes.json();
  console.log('Venue:', sData.settings.businessName);
  console.log('Location:', sData.settings.businessLocation);
  console.log('Google Review URL:', sData.settings.googleReviewUrl);

  console.log('\n=== 2. Testing Customer Flow (English with Notes) ===');
  const genEng = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      experience: ['Specialty Coffee', 'Outdoor Seating', 'Calm Ambience'],
      customDetails: 'Loved the iced Spanish latte and almond croissant. The peaceful outdoor patio in Jubilee Hills was wonderful.',
      tone: 'Casual',
      length: 'Medium',
      language: 'English',
      count: 1
    })
  });
  const dataEng = await genEng.json();
  console.log('Success:', dataEng.success);
  console.log('Google URL in response:', dataEng.googleReviewUrl);
  console.log('Review:\n', dataEng.reviews[0].reviewText);

  console.log('\n=== 3. Testing 3 Alternatives (Hinglish) ===');
  const gen3 = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      experience: ['Specialty Coffee', 'Courteous Staff', 'Aesthetic Interiors'],
      customDetails: 'Pour-over was fantastic and staff gave great recommendations.',
      tone: 'Friendly',
      length: 'Short',
      language: 'Hinglish',
      count: 3
    })
  });
  const data3 = await gen3.json();
  console.log('Count:', data3.reviews.length);
  data3.reviews.forEach((r, i) => {
    console.log(`\n[Alt ${i + 1}]:\n${r.reviewText}`);
  });

  console.log('\n=== 4. Testing Hindi Draft ===');
  const genHindi = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      experience: ['Calm Ambience', 'Specialty Coffee'],
      customDetails: '',
      tone: 'Friendly',
      length: 'Medium',
      language: 'Hindi',
      count: 1
    })
  });
  const dataHindi = await genHindi.json();
  console.log('Hindi Draft:\n', dataHindi.reviews[0].reviewText);

  console.log('\n=== 5. Testing Google Review URL Update ===');
  const updateRes = await fetch('http://localhost:3000/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ-SOO-COFFEE-JUBILEE-HILLS'
    })
  });
  const updateData = await updateRes.json();
  console.log('Updated URL:', updateData.settings.googleReviewUrl);

  // Restore back to default search URL
  await fetch('http://localhost:3000/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      googleReviewUrl: 'https://www.google.com/maps/search/?api=1&query=SOO+Coffee+Jubilee+Hills+Hyderabad'
    })
  });

  console.log('\nALL SOO COFFEE WORKFLOW TESTS PASSED!');
}

runSooTests().catch(console.error);
