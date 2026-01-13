const puppeteer = require('puppeteer');

(async () => {
    console.log('Taking screenshot...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set a reasonable viewport size
    await page.setViewport({ width: 1280, height: 800 });

    try {
        await page.goto('https://minnesota-millionaires-lottery-club.netlify.app/', { waitUntil: 'networkidle2' });
        
        // Take screenshot
        await page.screenshot({ path: 'netlify_debug.png', fullPage: true });
        console.log('Screenshot saved to netlify_debug.png');

    } catch (e) {
        console.error("Screenshot failed:", e);
    }

    await browser.close();
})();