async function testMinimal() {
  console.log('Testing minimal generation with only businessType and businessName:');
  const res = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessType: 'Cafe',
      businessName: 'soo',
      count: 3
    })
  });
  const data = await res.json();
  console.log('Success:', data.success);
  console.log('Count:', data.reviews.length);
  data.reviews.forEach((r, i) => {
    console.log(`\n--- Variation ${i + 1} (${r.businessType} - ${r.businessName}) ---`);
    console.log(r.reviewText);
    console.log(`Words: ${r.wordCount}, Chars: ${r.charCount}`);
  });

  const resRest = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessType: 'Restaurant',
      businessName: 'Bella Italia',
      count: 1
    })
  });
  const dataRest = await resRest.json();
  console.log('\n--- Restaurant (Single) ---');
  console.log(dataRest.reviews[0].reviewText);
}

testMinimal().catch(console.error);
