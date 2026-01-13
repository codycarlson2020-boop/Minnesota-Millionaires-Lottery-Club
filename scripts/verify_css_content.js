const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    const response = await page.goto('https://minnesota-millionaires-lottery-club.netlify.app/style.css');
    const text = await response.text();
    
    console.log('--- CSS CONTENT START ---');
    console.log(text.substring(0, 200));
    console.log('--- END ---');

    await browser.close();
})();