const puppeteer = require('puppeteer');

(async () => {
    console.log('Visiting Netlify Site...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Capture console errors
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    page.on('requestfailed', request => {
        console.log(`FAILED REQUEST: ${request.url()} - ${request.failure().errorText}`);
    });

    try {
        await page.goto('https://minnesota-millionaires-lottery-club.netlify.app/', { waitUntil: 'networkidle2' });
        
        // Check if CSS is applied by checking body background color
        const bgColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        console.log(`Body Background Color: ${bgColor}`); // Should be rgb(244, 244, 249) (#f4f4f9) if CSS loaded

        // Check content
        const title = await page.title();
        console.log(`Page Title: ${title}`);

    } catch (e) {
        console.error("Navigation failed:", e);
    }

    await browser.close();
})();