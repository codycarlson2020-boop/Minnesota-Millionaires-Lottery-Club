const https = require('https');

const DATA_URL = 'https://mnmillionaireslotteryclub.com/data/history.json';

// Only check the games we are actually playing
const SCHEDULE = {
    'Powerball': [1, 3, 6],       // Mon, Wed, Sat
    'Mega Millions': [2, 5],      // Tue, Fri
    'Lotto America': [1, 3, 6]    // Mon, Wed, Sat
};

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        // Add cache buster to ensure we get fresh data
        const cacheBuster = url.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`;
        https.get(url + cacheBuster, (res) => {
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
    let checkDate = new Date(now);
    checkDate.setDate(now.getDate() - 1); // Check from yesterday backwards
    
    for (let i = 0; i < 7; i++) {
        const dayOfWeek = checkDate.getDay();
        if (drawDays.includes(dayOfWeek)) {
            return checkDate;
        }
        checkDate.setDate(checkDate.getDate() - 1);
    }
    return null;
}

function parseDate(dateStr) {
    return new Date(dateStr.replace(/(st|nd|rd|th)/, ''));
}

(async () => {
    console.log(`Checking live data freshness...`);
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

        const latestEntry = history.find(h => h.game === game);
        
        if (!latestEntry) {
            console.error(`[MISSING] No data found for ${game}!`);
            hasError = true;
            continue;
        }

        const actualDate = parseDate(latestEntry.date);
        
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
        process.exit(1);
    } else {
        console.log("\nSUCCESS: All played games are up to date.");
        process.exit(0);
    }
})();