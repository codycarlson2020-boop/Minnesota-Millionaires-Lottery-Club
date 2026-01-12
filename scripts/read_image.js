const Tesseract = require('tesseract.js');
const path = require('path');

const imagePath = path.join(__dirname, '../Numbers Played.JPG');

console.log('Reading text from image...');

Tesseract.recognize(
  imagePath,
  'eng',
  { logger: m => console.log(`Progress: ${Math.round(m.progress * 100)}%`) }
).then(({ data: { text } }) => {
  console.log('--- EXTRACTED TEXT ---');
  console.log(text);
  console.log('----------------------');
});