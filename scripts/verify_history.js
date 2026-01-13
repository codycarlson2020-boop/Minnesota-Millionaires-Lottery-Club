const puppeteer = require('puppeteer');

(async () => {
    console.log('Visiting History Page...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Visit the history page with a cache buster
    await page.goto('https://codycarlson2020-boop.github.io/Minnesota-Millionaires-Lottery-Club/history.html?check=1', { waitUntil: 'networkidle2' });

    // 1. Check for Season Headers
    const seasons = await page.evaluate(() => {
        const headers = Array.from(document.querySelectorAll('.season-header span:first-child'));
        return headers.map(h => h.innerText);
    });

    console.log('--- SEASONS FOUND ---');
    console.log(seasons.join('\n'));
    
    if (seasons.length > 0) {
        // 2. Click the first season to expand
        console.log('--- INTERACTION TEST ---');
        console.log(`Clicking "${seasons[0]}"...`);
        
        await page.click('.season-header');
        
        // Wait for animation/render
        await new Promise(r => setTimeout(r, 500));

        // 3. Check for Visible Months
        const months = await page.evaluate(() => {
            // Find visible month headers
            const monthHeaders = Array.from(document.querySelectorAll('.month-group .month-header span:first-child'));
            return monthHeaders.map(h => h.innerText);
        });

        console.log('--- MONTHS REVEALED ---');
        console.log(months.join('\n'));
    } else {
        console.log('No seasons found. Page might be empty.');
    }

    await browser.close();
})();