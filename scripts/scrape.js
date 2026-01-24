const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.mnlottery.com/winning-numbers';
const HISTORY_FILE = path.join(__dirname, '../public/data/history.json');
const CLUB_NUMBERS_FILE = path.join(__dirname, '../public/config/club_numbers.json');

(async () => {
    console.log('--- MN Lottery Scraper Start ---');
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
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
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        console.log(`Navigating to ${TARGET_URL}...`);
        await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        const title = await page.title();
        console.log(`Page title: "${title}"`);

        // Wait a few seconds for JS to execute
        console.log('Waiting for content to settle...');
        await new Promise(r => setTimeout(r, 5000));

        // Early debug screenshot
        await page.screenshot({ path: path.join(__dirname, '../debug_page_load.png'), fullPage: true });

        console.log('Extracting aria-labels from "Game Details" links...');
        const labels = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            return links
                .filter(a => a.innerText && a.innerText.includes('Game Details'))
                .map(a => {
                    return {
                        text: a.innerText,
                        aria: a.getAttribute('aria-label'),
                        href: a.getAttribute('href')
                    };
                });
        });

        console.log(`Found ${labels.length} potential result links.`);
        
        const parsedResults = [];
        const currentJackpots = {};

        labels.forEach((item, index) => {
            const label = item.aria || "";
            if (!label) {
                console.log(`  [${index}] Item has no aria-label, skipping.`);
                return;
            }

            console.log(`  [${index}] Processing label: "${label.substring(0, 100)}..."`);

            // Extract Jackpot
            const jackpotMatch = label.match(/jackpot is ([\$,\d]+)/i);
            const jackpotValue = jackpotMatch ? jackpotMatch[1] : 'Unknown';

            let gameName = '';
            let match = null;

            if (label.includes('Powerball')) {
                gameName = 'Powerball';
                match = label.match(/drawing on (.*?)\. (.*?) Special number is (\d+)/i);
            } else if (label.includes('Mega Millions')) {
                gameName = 'Mega Millions';
                match = label.match(/drawing on (.*?)\. (.*?) Special number is (\d+)/i);
            } else if (label.includes('Lotto America')) {
                gameName = 'Lotto America';
                match = label.match(/drawing on (.*?)\. (.*?) Special number is (\d+)/i);
            } else if (label.includes('Gopher 5')) {
                gameName = 'Gopher 5';
                match = label.match(/drawing on (.*?)\. (.*?) Estimated/i);
            } else if (label.includes('North 5')) {
                gameName = 'North 5';
                match = label.match(/drawing on (.*?)\. (.*?) Estimated/i);
            }

            if (gameName && match) {
                try {
                    const drawDate = match[1].trim();
                    const numString = match[2].trim();
                    const numbers = numString.split(/\s+/).map(n => parseInt(n)).filter(n => !isNaN(n));
                    
                    const result = {
                        game: gameName,
                        date: drawDate,
                        numbers: numbers,
                        jackpot: jackpotValue
                    };

                    if (match[3]) {
                        result.special = parseInt(match[3]);
                    }

                    console.log(`    -> Parsed: ${gameName} on ${drawDate}: ${numbers.join(', ')} (Special: ${result.special || 'N/A'})`);
                    parsedResults.push(result);

                    const jackKey = gameName.toLowerCase().replace(/\s/g, '');
                    if (!currentJackpots[jackKey]) currentJackpots[jackKey] = jackpotValue;
                } catch (parseErr) {
                    console.error(`    -> Error parsing match groups:`, parseErr);
                }
            } else {
                console.log(`    -> No regex match for this game.`);
            }
        });

        console.log(`Total parsed results: ${parsedResults.length}`);

        if (parsedResults.length === 0) {
            console.error('ERROR: No results parsed. Saving HTML dump for debugging.');
            const html = await page.content();
            fs.writeFileSync(path.join(__dirname, '../page_dump.html'), html);
            process.exit(1);
        }

        // Save Jackpots
        const JACKPOT_FILE = path.join(__dirname, '../public/data/jackpots.json');
        fs.writeFileSync(JACKPOT_FILE, JSON.stringify(currentJackpots, null, 2));

        // Merge with history
        let history = [];
        if (fs.existsSync(HISTORY_FILE)) {
            try {
                history = JSON.parse(fs.readFileSync(HISTORY_FILE));
            } catch (e) {
                console.error('Error reading history file, starting fresh.');
            }
        }

        parsedResults.reverse().forEach(res => {
            const exists = history.find(h => h.game === res.game && h.date === res.date);
            if (!exists) {
                history.unshift(res);
                console.log(`Added new result to history: ${res.game} - ${res.date}`);
            }
        });

        history = history.slice(0, 100);
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        console.log('History file saved.');

    } catch (error) {
        console.error('CRITICAL SCRAPING ERROR:', error);
        if (browser) {
            try {
                const pages = await browser.pages();
                if (pages.length > 0) {
                    await pages[0].screenshot({ path: path.join(__dirname, '../scrape_error.png'), fullPage: true });
                    console.log('Saved scrape_error.png');
                }
            } catch (e) {}
        }
        process.exit(1);
    } finally {
        if (browser) await browser.close();
        console.log('--- MN Lottery Scraper End ---');
    }
})();