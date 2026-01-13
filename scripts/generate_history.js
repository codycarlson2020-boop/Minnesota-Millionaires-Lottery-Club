const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../public/data/archive.json');

// Game Schedules
const GAMES = {
    'Powerball': { days: [1, 3, 6], cost: 2, plays: 5 },      // Mon, Wed, Sat
    'Mega Millions': { days: [2, 5], cost: 5, plays: 5 },     // Tue, Fri
    'Lotto America': { days: [1, 3, 6], cost: 1, plays: 5 }   // Mon, Wed, Sat
};

// Date Range: March 1, 2025 to Feb 28, 2026
const START_DATE = new Date('2025-03-01');
const END_DATE = new Date('2026-02-28');

const history = [];

// Helper to format date like "Jan 10th, 2026"
function formatDate(date) {
    const d = new Date(date);
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    const year = d.getFullYear();
    
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return `${month} ${day}${suffix}, ${year}`;
}

// Generate random numbers
function generateNumbers(count, max) {
    const nums = new Set();
    while(nums.size < count) {
        nums.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(nums).sort((a,b) => a-b);
}

let currentDate = new Date(START_DATE);

while (currentDate <= END_DATE) {
    const dayOfWeek = currentDate.getDay(); // 0=Sun, 1=Mon, ...

    for (const [gameName, rules] of Object.entries(GAMES)) {
        if (rules.days.includes(dayOfWeek)) {
            // It's a draw day!
            
            // Simulate Winnings (mostly 0, some small, rare big)
            let won = 0;
            const rand = Math.random();
            
            if (rand > 0.98) won = 100;       // 2% chance of $100
            else if (rand > 0.90) won = 7;    // 8% chance of $7
            else if (rand > 0.80) won = 4;    // 10% chance of $4
            
            // One big win in Dec
            if (currentDate.getMonth() === 11 && currentDate.getDate() === 25 && gameName === 'Powerball') {
                won = 50000;
            }

            const entry = {
                game: gameName,
                date: formatDate(currentDate),
                numbers: generateNumbers(5, 69),
                special: Math.floor(Math.random() * 26) + 1,
                won_amount: won
            };
            
            history.push(entry);
        }
    }

    // Next day
    currentDate.setDate(currentDate.getDate() + 1);
}

// Reverse to show newest first
history.reverse();

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(history, null, 2));
console.log(`Generated ${history.length} historical draws.`);