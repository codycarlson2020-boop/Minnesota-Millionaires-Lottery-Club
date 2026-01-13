const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    page.on('response', response => {
        if (response.url().endsWith('style.css')) {
            console.log(`CSS URL: ${response.url()}`);
            console.log(`Status: ${response.status()}`);
            console.log(`Content-Type: ${response.headers()['content-type']}`);
        }
    });

    await page.goto('https://minnesota-millionaires-lottery-club.netlify.app/');
    
    await browser.close();
})();