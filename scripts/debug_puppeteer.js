const puppeteer = require('puppeteer');

(async () => {
    console.log('DEBUG: Starting minimal Puppeteer test...');
    try {
        const browser = await puppeteer.launch({
            headless: true,
            dumpio: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                '--ignore-certificate-errors'
            ]
        });
        console.log('DEBUG: Browser launched successfully.');
        
        const page = await browser.newPage();
        console.log('DEBUG: Page created.');
        
        await page.goto('https://example.com');
        console.log('DEBUG: Navigated to example.com');
        
        await browser.close();
        console.log('DEBUG: Browser closed. Test PASSED.');
        process.exit(0);
    } catch (e) {
        console.error('DEBUG: Test FAILED.', e);
        process.exit(1);
    }
})();