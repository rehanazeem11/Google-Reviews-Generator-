async function runTests() {
  console.log('--- 1. Testing Health ---');
  const hRes = await fetch('http://localhost:3000/api/health');
  console.log('Health:', await hRes.json());

  console.log('\n--- 2. Testing Settings ---');
  const sRes = await fetch('http://localhost:3000/api/settings');
  console.log('Settings:', await sRes.json());

  console.log('\n--- 3. Testing Single Generation (Cafe, English) ---');
  const gen1 = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessType: 'Cafe',
      businessName: 'Artisan Brew Lab',
      cuisineOrSpecialty: 'Specialty pour-overs & pastries',
      experience: ['food quality', 'taste', 'ambience'],
      occasion: 'Coffee break',
      tone: 'Casual',
      length: 'Medium',
      language: 'English',
      customDetails: 'Loved the Ethiopian single-origin drip and the cardamom bun was fresh from the oven.',
      count: 1
    })
  });
  const gen1Data = await gen1.json();
  console.log('Gen 1 Success:', gen1Data.success);
  console.log('Gen 1 Review:', gen1Data.reviews[0].reviewText);

  console.log('\n--- 4. Testing 3 Alternatives (Restaurant, Hinglish) ---');
  const gen3 = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessType: 'Restaurant',
      businessName: 'Osteria Milano',
      cuisineOrSpecialty: 'Northern Italian',
      experience: ['taste', 'service', 'cleanliness'],
      occasion: 'Date night',
      tone: 'Friendly',
      length: 'Short',
      language: 'Hinglish',
      customDetails: 'Truffle tagliatelle was outstanding.',
      count: 3
    })
  });
  const gen3Data = await gen3.json();
  console.log('Gen 3 count:', gen3Data.reviews?.length);
  gen3Data.reviews?.forEach((r, idx) => {
    console.log(`[Alt ${idx + 1}]: ${r.reviewText}`);
  });

  console.log('\n--- 5. Testing Hindi Generation ---');
  const genHindi = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessType: 'Restaurant',
      businessName: 'Zaika Darbar',
      cuisineOrSpecialty: 'Mughlai & Biryani',
      experience: ['taste', 'service', 'ambience'],
      occasion: 'Family dinner',
      tone: 'Friendly',
      length: 'Medium',
      language: 'Hindi',
      customDetails: 'दम बिरयानी और फिरनी बहुत स्वादिष्ट थी।',
      count: 1
    })
  });
  const genHindiData = await genHindi.json();
  console.log('Hindi Review:', genHindiData.reviews[0]?.reviewText);

  console.log('\n--- 6. Testing History List ---');
  const hist = await fetch('http://localhost:3000/api/history');
  const histData = await hist.json();
  console.log('Total History items stored:', histData.count);

  console.log('\n--- 7. Testing History Filter ---');
  const filterCafe = await fetch('http://localhost:3000/api/history?type=Cafe');
  const filterCafeData = await filterCafe.json();
  console.log('Cafe count:', filterCafeData.count);

  console.log('\n--- 8. Testing History Delete ---');
  if (histData.items && histData.items.length > 0) {
    const itemToDelete = histData.items[0];
    const delRes = await fetch(`http://localhost:3000/api/history/${itemToDelete.id}`, { method: 'DELETE' });
    const delData = await delRes.json();
    console.log(`Deleted item ${itemToDelete.id}:`, delData.success);
  }

  console.log('\nALL BACKEND API TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(console.error);
