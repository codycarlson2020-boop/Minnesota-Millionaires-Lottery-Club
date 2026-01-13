const puppeteer = require('puppeteer');

(async () => {
    console.log('Visiting Rules page...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.goto('https://codycarlson2020-boop.github.io/Minnesota-Millionaires-Lottery-Club/rules.html', { waitUntil: 'networkidle2' });

    const games = await page.evaluate(() => {
        const headers = Array.from(document.querySelectorAll('.rule-card h2'));
        return headers.map(h => h.innerText);
    });

    console.log('--- VISIBLE RULES ---');
    console.log(games.join('\n'));
    console.log('---------------------');

    await browser.close();
})();