const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.mnlottery.com/winning-numbers';
const HISTORY_FILE = path.join(__dirname, '../public/data/history.json');
const CLUB_NUMBERS_FILE = path.join(__dirname, '../public/config/club_numbers.json');

(async () => {
    console.log('Starting MN Lottery Scraper...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    try {
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
        console.log('Page loaded.');

        // Extract all "Game Details" links with aria-labels
        const results = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[aria-label]'));
            return links
                .filter(a => a.innerText.includes('Game Details'))
                .map(a => a.getAttribute('aria-label'));
        });

        const parsedResults = [];
        const currentJackpots = {};
        
        results.forEach(label => {
            // Extract Jackpot amount if present (e.g. "$124,000,000")
            const jackpotMatch = label.match(/Estimated jackpot is ([\$,\d]+)/);
            const jackpotValue = jackpotMatch ? jackpotMatch[1] : 'Unknown';

            // Powerball
            if (label.includes('Powerball')) {
                const match = label.match(/drawing on (.*?)\. (.*?) Special number is (\d+)/);
                if (match) {
                    parsedResults.push({
                        game: 'Powerball',
                        date: match[1],
                        numbers: match[2].trim().split(' ').map(Number),
                        special: parseInt(match[3]),
                        jackpot: jackpotValue
                    });
                    if (!currentJackpots['powerball']) currentJackpots['powerball'] = jackpotValue;
                }
            }
            // Mega Millions
            else if (label.includes('Mega Millions')) {
                const match = label.match(/drawing on (.*?)\. (.*?) Special number is (\d+)/);
                if (match) {
                    parsedResults.push({
                        game: 'Mega Millions',
                        date: match[1],
                        numbers: match[2].trim().split(' ').map(Number),
                        special: parseInt(match[3]),
                        jackpot: jackpotValue
                    });
                    if (!currentJackpots['megamillions']) currentJackpots['megamillions'] = jackpotValue;
                }
            }
            // Lotto America
            else if (label.includes('Lotto America')) {
                const match = label.match(/drawing on (.*?)\. (.*?) Special number is (\d+)/);
                if (match) {
                    parsedResults.push({
                        game: 'Lotto America',
                        date: match[1],
                        numbers: match[2].trim().split(' ').map(Number),
                        special: parseInt(match[3]),
                        jackpot: jackpotValue
                    });
                    if (!currentJackpots['lottoamerica']) currentJackpots['lottoamerica'] = jackpotValue;
                }
            }
            // Gopher 5
            else if (label.includes('Gopher 5')) {
                const match = label.match(/drawing on (.*?)\. (.*?) Estimated/);
                if (match) {
                    parsedResults.push({
                        game: 'Gopher 5',
                        date: match[1],
                        numbers: match[2].trim().split(' ').map(Number),
                        jackpot: jackpotValue
                    });
                    if (!currentJackpots['gopher5']) currentJackpots['gopher5'] = jackpotValue;
                }
            }
            // North 5
            else if (label.includes('North 5')) {
                const match = label.match(/drawing on (.*?)\. (.*?) Estimated/);
                if (match) {
                    parsedResults.push({
                        game: 'North 5',
                        date: match[1],
                        numbers: match[2].trim().split(' ').map(Number),
                        jackpot: jackpotValue
                    });
                    if (!currentJackpots['north5']) currentJackpots['north5'] = jackpotValue;
                }
            }
        });

        console.log(`Scraped ${parsedResults.length} draw results.`);

        // Save Jackpots to a separate file for the dashboard header
        const JACKPOT_FILE = path.join(__dirname, '../public/data/jackpots.json');
        fs.writeFileSync(JACKPOT_FILE, JSON.stringify(currentJackpots, null, 2));

        // Deduplicate and merge with history
        let history = [];
        if (fs.existsSync(HISTORY_FILE)) {
            const raw = fs.readFileSync(HISTORY_FILE);
            try {
                history = JSON.parse(raw);
            } catch (e) {}
        }

        // Simple deduplication based on game and date
        parsedResults.forEach(res => {
            const exists = history.find(h => h.game === res.game && h.date === res.date);
            if (!exists) {
                history.unshift(res); // Add new ones to the top
            }
        });

        // Limit to reasonable history (e.g., last 100 draws)
        history = history.slice(0, 100);

        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        console.log('History updated.');

    } catch (error) {
        console.error('Scraping error:', error);
    } finally {
        await browser.close();
    }
})();