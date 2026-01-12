const puppeteer = require('puppeteer');

(async () => {
    console.log('Visiting live site...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Visit the live GitHub Pages URL
    await page.goto('https://codycarlson2020-boop.github.io/Minnesota-Millionaires-Lottery-Club/', { waitUntil: 'networkidle2' });

    // Wait for the javascript to render the scorecards
    try {
        await page.waitForSelector('.scorecard', { timeout: 5000 });
    } catch (e) {
        console.log("Timeout waiting for scorecards. Site might be empty or erroring.");
    }

    // Extract the titles of the games shown
    const games = await page.evaluate(() => {
        const headers = Array.from(document.querySelectorAll('.scorecard h2'));
        return headers.map(h => h.innerText);
    });

    console.log('--- VISIBLE GAMES ---');
    console.log(games.join('\n'));
    console.log('---------------------');

    // Extract Total Won to verify math
    const totalWon = await page.evaluate(() => {
        return document.getElementById('total-won').innerText;
    });
    console.log(`Total Won displayed: ${totalWon}`);

    await browser.close();
})();