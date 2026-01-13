const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Try to access the JSON file directly
    const url = 'https://codycarlson2020-boop.github.io/Minnesota-Millionaires-Lottery-Club/data/mock_history.json';
    const response = await page.goto(url);
    
    console.log(`URL: ${url}`);
    console.log(`Status: ${response.status()}`); // Should be 200
    
    if (response.status() === 200) {
        const text = await response.text();
        console.log(`Content Preview: ${text.substring(0, 100)}...`);
    }

    await browser.close();
})();