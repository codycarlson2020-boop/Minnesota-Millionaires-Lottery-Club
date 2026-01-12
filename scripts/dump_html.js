const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.mnlottery.com/winning-numbers', { waitUntil: 'networkidle2' });
    const content = await page.content();
    fs.writeFileSync(path.join(__dirname, 'page_dump.html'), content);
    console.log('HTML dumped to scripts/page_dump.html');
    await browser.close();
})();