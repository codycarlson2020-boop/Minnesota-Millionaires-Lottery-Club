const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.mnlottery.com/winning-numbers';
const HISTORY_FILE = path.join(__dirname, '../data/history.json');
const CLUB_NUMBERS_FILE = path.join(__dirname, '../config/club_numbers.json');

(async () => {
    console.log('Starting MN Lottery Scraper...');
    const browser = await puppeteer.launch();
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
        
        results.forEach(label => {
            // Powerball
            if (label.includes('Powerball')) {
                const match = label.match(/drawing on (.*?)\. (.*?) Special number is (\d+)/);
                if (match) {
                    parsedResults.push({
                        game: 'Powerball',
                        date: match[1],
                        numbers: match[2].trim().split(' ').map(Number),
                        special: parseInt(match[3])
                    });
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
                        special: parseInt(match[3])
                    });
                }
            }
            // Gopher 5
            else if (label.includes('Gopher 5')) {
                const match = label.match(/drawing on (.*?)\. (.*?) Estimated/);
                if (match) {
                    parsedResults.push({
                        game: 'Gopher 5',
                        date: match[1],
                        numbers: match[2].trim().split(' ').map(Number)
                    });
                }
            }
            // North 5
            else if (label.includes('North 5')) {
                const match = label.match(/drawing on (.*?)\. (.*?) Estimated/);
                if (match) {
                    parsedResults.push({
                        game: 'North 5',
                        date: match[1],
                        numbers: match[2].trim().split(' ').map(Number)
                    });
                }
            }
        });

        console.log(`Scraped ${parsedResults.length} draw results.`);

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