const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '../public/data/history.json');
const CLUB_NUMBERS_FILE = path.join(__dirname, '../public/config/club_numbers.json');

if (!fs.existsSync(CLUB_NUMBERS_FILE)) {
    console.error("Club numbers file not found!");
    process.exit(1);
}

const CLUB_NUMBERS = JSON.parse(fs.readFileSync(CLUB_NUMBERS_FILE));

const PAYOUTS = {
    'Powerball': (matches, special) => {
        if (matches === 5 && special) return 100000000;
        if (matches === 5) return 1000000;
        if (matches === 4 && special) return 50000;
        if (matches === 4) return 100;
        if (matches === 3 && special) return 100;
        if (matches === 3) return 7;
        if (matches === 2 && special) return 7;
        if (matches === 1 && special) return 4;
        if (special) return 4;
        return 0;
    },
    'Mega Millions': (matches, special) => {
        if (matches === 5 && special) return 100000000;
        if (matches === 5) return 1000000;
        if (matches === 4 && special) return 10000;
        if (matches === 4) return 500;
        if (matches === 3 && special) return 200;
        if (matches === 3) return 10;
        if (matches === 2 && special) return 10;
        if (matches === 1 && special) return 4;
        if (special) return 2;
        return 0;
    },
    'Lotto America': (matches, special) => {
        if (matches === 5 && special) return 2000000;
        if (matches === 5) return 20000;
        if (matches === 4 && special) return 1000;
        if (matches === 4) return 100;
        if (matches === 3 && special) return 20;
        if (matches === 3) return 5;
        if (matches === 2 && special) return 5;
        if (matches === 1 && special) return 2;
        if (special) return 2;
        return 0;
    },
    'Gopher 5': (matches) => {
        if (matches === 5) return 100000;
        if (matches === 4) return 500;
        if (matches === 3) return 15;
        if (matches === 2) return 1;
        return 0;
    },
    'North 5': (matches) => {
        if (matches === 5) return 25000;
        if (matches === 4) return 50;
        if (matches === 3) return 5;
        if (matches === 2) return 1;
        return 0;
    }
};

function calculateWinnings() {
    if (!fs.existsSync(HISTORY_FILE)) {
        console.log('No history file found to check.');
        return;
    }

    let history;
    try {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE));
    } catch (e) {
        console.error("Error parsing history file:", e);
        return;
    }
    
    const updatedHistory = history.map(draw => {
        if (!draw.game || !draw.numbers) {
            console.log(`  Skipping invalid draw entry: ${JSON.stringify(draw)}`);
            return draw;
        }

        let gameKey = draw.game.toLowerCase().replace(/\s/g, '');
        const myPicks = CLUB_NUMBERS[gameKey];
        
        if (!myPicks || !Array.isArray(myPicks)) return draw;

        let totalWonInDraw = 0;
        let matchDetails = [];

        myPicks.forEach(pick => {
            if (!pick.numbers) return;

            const matchedNumbers = pick.numbers.filter(n => draw.numbers.includes(n));
            const matchesCount = matchedNumbers.length;
            const specialMatch = pick.special && draw.special === pick.special;
            
            let won = 0;
            if (PAYOUTS[draw.game]) {
                won = PAYOUTS[draw.game](matchesCount, specialMatch);
            }

            if (won > 0) {
                totalWonInDraw += won;
                matchDetails.push({
                    pick: pick.numbers,
                    matches: matchesCount,
                    special: !!specialMatch,
                    won: won
                });
            }
        });

        return {
            ...draw,
            won_amount: totalWonInDraw,
            matches: matchDetails
        };
    });

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(updatedHistory, null, 2));
    console.log('Winnings calculation complete.');
}

calculateWinnings();