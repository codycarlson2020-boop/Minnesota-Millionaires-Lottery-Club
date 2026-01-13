const puppeteer = require('puppeteer');

(async () => {
    console.log('Visiting Dashboard...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Visit the new index which points to dashboard.js
    await page.goto('https://codycarlson2020-boop.github.io/Minnesota-Millionaires-Lottery-Club/index.html', { waitUntil: 'networkidle2' });

    // 1. Check Header Order
    const headerGames = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.jackpot-card .jp-game'));
        return cards.map(c => c.innerText);
    });

    console.log('--- HEADER ORDER ---');
    console.log(headerGames.join('\n'));
    console.log('--------------------');

    // 2. Check Scorecard Order
    const scorecardGames = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.scorecard h2'));
        return cards.map(c => c.innerText);
    });

    console.log('--- SCORECARD ORDER ---');
    console.log(scorecardGames.join('\n'));
    console.log('-----------------------');

    await browser.close();
})();
