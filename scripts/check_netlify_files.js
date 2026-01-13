const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    const files = [
        'data/history.json',
        'data/jackpots.json',
        'config/game_rules.json',
        'config/club_numbers.json'
    ];

    for (const file of files) {
        const url = `https://minnesota-millionaires-lottery-club.netlify.app/${file}`;
        const response = await page.goto(url);
        console.log(`${file}: ${response.status()}`);
    }

    await browser.close();
})();