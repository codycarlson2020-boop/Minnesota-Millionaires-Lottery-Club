
const https = require('https');

const DATA_URL = 'https://mnmillionaireslotteryclub.com/data/history.json';

// Days when draws happen (0=Sun, 1=Mon, ..., 6=Sat)
const SCHEDULE = {
    'Powerball': [1, 3, 6],       // Mon, Wed, Sat
    'Mega Millions': [2, 5],      // Tue, Fri
    'Lotto America': [1, 3, 6],   // Mon, Wed, Sat
    'North 5': [0, 1, 2, 3, 4, 5, 6], // Daily
    'Gopher 5': [1, 3, 5]         // Mon, Wed, Fri
};

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function getExpectedDate(drawDays) {
    const now = new Date();
    // Start from "yesterday" because if script runs today at noon, 
    // we definitely expect yesterday's draw (if yesterday was a draw day).
    // If today is a draw day, the result comes out tonight, so we don't expect it yet.
    let checkDate = new Date(now);
    checkDate.setDate(now.getDate() - 1); // Start checking from yesterday backwards
    
    // Look back up to 7 days to find the most recent expected draw day
    for (let i = 0; i < 7; i++) {
        const dayOfWeek = checkDate.getDay();
        if (drawDays.includes(dayOfWeek)) {
            return checkDate; // This is the date of the most recent COMPLETED draw
        }
        checkDate.setDate(checkDate.getDate() - 1);
    }
    return null;
}

function parseDate(dateStr) {
    // Format: "Jan 17th, 2026"
    return new Date(dateStr.replace(/(st|nd|rd|th)/, ''));
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

(async () => {
    console.log(`Fetching live data from ${DATA_URL}...`);
    let history;
    try {
        history = await fetchJson(DATA_URL);
    } catch (e) {
        console.error("Failed to fetch data:", e.message);
        process.exit(1);
    }

    let hasError = false;

    for (const [game, drawDays] of Object.entries(SCHEDULE)) {
        const expectedDate = getExpectedDate(drawDays);
        if (!expectedDate) continue;

        // Find latest entry for this game
        const latestEntry = history.find(h => h.game === game);
        
        if (!latestEntry) {
            console.error(`[MISSING] No data found for ${game}!`);
            hasError = true;
            continue;
        }

        const actualDate = parseDate(latestEntry.date);
        
        // Check if actual date is same as or after the expected date
        // (Use midnight comparison)
        expectedDate.setHours(0,0,0,0);
        actualDate.setHours(0,0,0,0);

        if (actualDate < expectedDate) {
            console.error(`[STALE] ${game} is out of date!`);
            console.error(`   Expected: ${expectedDate.toDateString()}`);
            console.error(`   Actual:   ${actualDate.toDateString()}`);
            hasError = true;
        } else {
            console.log(`[OK] ${game}: ${latestEntry.date}`);
        }
    }

    if (hasError) {
        console.error("\nFAIL: One or more games are out of sync.");
        process.exit(1);
    } else {
        console.log("\nSUCCESS: All games are up to date.");
        process.exit(0);
    }
})();
