document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loading dashboard...");

    try {
        // INLINED DATA TO FIX CORS/FILE PROTOCOL ISSUES
        const history = [
            {
                "game": "Powerball",
                "date": "Jan 12th, 2026",
                "numbers": [5, 27, 45, 56, 59],
                "special": 4,
                "jackpot": "$137,000,000",
                "won_amount": 0,
                "matches": []
            },
            {
                "game": "Gopher 5",
                "date": "Jan 12th, 2026",
                "numbers": [2, 25, 26, 29, 44],
                "jackpot": "$305,000"
            },
            {
                "game": "North 5",
                "date": "Jan 12th, 2026",
                "numbers": [4, 16, 21, 28, 31],
                "jackpot": "$77,000"
            },
            {
                "game": "Lotto America",
                "date": "Jan 12th, 2026",
                "numbers": [9, 20, 25, 30, 51],
                "special": 10,
                "jackpot": "$12,510,000",
                "won_amount": 0,
                "matches": []
            },
            {
                "game": "Lotto America",
                "date": "Jan 10th, 2026",
                "numbers": [6, 15, 20, 22, 25],
                "special": 10,
                "won_amount": 0,
                "matches": []
            },
            {
                "game": "North 5",
                "date": "Jan 8th, 2026",
                "numbers": [4, 5, 21, 28, 32],
                "won_amount": 1,
                "matches": [
                    { "pick": [1, 2, 3, 4, 5], "matches": 2, "won": 1 }
                ]
            },
            {
                "game": "Gopher 5",
                "date": "Jan 9th, 2026",
                "numbers": [4, 7, 15, 39, 44],
                "won_amount": 100000,
                "matches": [
                    { "pick": [4, 7, 15, 39, 44], "matches": 5, "won": 100000 }
                ]
            },
            {
                "game": "North 5",
                "date": "Jan 9th, 2026",
                "numbers": [1, 2, 6, 12, 34],
                "won_amount": 1,
                "matches": [
                    { "pick": [1, 2, 3, 4, 5], "matches": 2, "won": 1 }
                ]
            },
            {
                "game": "Mega Millions",
                "date": "Jan 9th, 2026",
                "numbers": [12, 30, 36, 42, 47],
                "special": 16,
                "won_amount": 100000000,
                "matches": [
                    { "pick": [12, 30, 36, 42, 47], "matches": 5, "special": true, "won": 100000000 }
                ]
            },
            {
                "game": "North 5",
                "date": "Jan 10th, 2026",
                "numbers": [11, 24, 25, 32, 33],
                "won_amount": 0,
                "matches": []
            },
            {
                "game": "Powerball",
                "date": "Jan 10th, 2026",
                "numbers": [5, 19, 21, 28, 64],
                "special": 14,
                "won_amount": 100000000,
                "matches": [
                    { "pick": [5, 19, 21, 28, 64], "matches": 5, "special": true, "won": 100000000 }
                ]
            },
            {
                "game": "North 5",
                "date": "Jan 11th, 2026",
                "numbers": [4, 6, 8, 9, 11],
                "won_amount": 25000,
                "matches": [
                    { "pick": [4, 6, 8, 9, 11], "matches": 5, "won": 25000 }
                ]
            }
        ];

        const rules = {
            "club_members": 50,
            "powerball": { "cost_per_play": 2.00, "plays_per_draw": 5, "draw_days": ["Mon", "Wed", "Sat"] },
            "megamillions": { "cost_per_play": 5.00, "plays_per_draw": 5, "draw_days": ["Tue", "Fri"] },
            "lottoamerica": { "cost_per_play": 1.00, "plays_per_draw": 5, "draw_days": ["Mon", "Wed", "Sat"] }
        };

        const clubNumbers = {
            "powerball": [
                { "numbers": [5, 19, 21, 28, 64], "special": 14 },
                { "numbers": [1, 2, 3, 4, 5], "special": 6 },
                { "numbers": [10, 11, 12, 13, 14], "special": 15 },
                { "numbers": [20, 21, 22, 23, 24], "special": 25 },
                { "numbers": [30, 31, 32, 33, 34], "special": 10 }
            ],
            "megamillions": [
                { "numbers": [12, 30, 36, 42, 47], "special": 16 },
                { "numbers": [5, 10, 15, 20, 25], "special": 5 },
                { "numbers": [11, 22, 33, 44, 55], "special": 11 },
                { "numbers": [1, 3, 5, 7, 9], "special": 2 },
                { "numbers": [2, 4, 6, 8, 10], "special": 4 }
            ],
            "lottoamerica": [
                { "numbers": [10, 20, 30, 40, 50], "special": 5 },
                { "numbers": [1, 5, 9, 13, 17], "special": 2 },
                { "numbers": [2, 4, 6, 8, 10], "special": 3 },
                { "numbers": [11, 12, 13, 14, 15], "special": 4 },
                { "numbers": [21, 22, 23, 24, 25], "special": 6 }
            ]
        };

        const jackpots = {
            "north5": "$66,000",
            "lottoamerica": "$12,370,000",
            "powerball": "$124,000,000",
            "megamillions": "$199,000,000",
            "gopher5": "$275,000"
        };

        // Helper to get next draw date
        const getNextDrawDate = (gameKey) => {
            const daysMap = { 'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6 };
            const drawDays = {
                'powerball': [1, 3, 6],       // Mon, Wed, Sat
                'megamillions': [2, 5],       // Tue, Fri
                'lottoamerica': [1, 3, 6]     // Mon, Wed, Sat
            };

            const targetDays = drawDays[gameKey];
            if (!targetDays) return '';

            const today = new Date();
            const currentDay = today.getDay(); // 0-6

            // Find next day in list
            let nextDay = -1;
            // Check later this week
            for (let d of targetDays) {
                if (d > currentDay) {
                    nextDay = d;
                    break;
                }
            }
            // If not found, circle back to first day next week
            if (nextDay === -1) nextDay = targetDays[0];

            // Calculate date difference
            let diff = nextDay - currentDay;
            if (diff <= 0) diff += 7;

            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + diff);

            return nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        };

        // ------------------------------------------
        // RENDER LIVE JACKPOTS
        // ------------------------------------------
        const jackpotContainer = document.getElementById('jackpot-container');
        if (jackpotContainer && jackpots) {
            jackpotContainer.innerHTML = '';
            const gamesToShow = ['powerball', 'megamillions', 'lottoamerica'];
            gamesToShow.forEach(game => {
                if (jackpots[game]) {
                    const nextDraw = getNextDrawDate(game);
                    const card = document.createElement('div');
                    card.className = 'jackpot-card';
                    card.innerHTML = `
                        <div class="jp-game">${game === 'lottoamerica' ? 'Lotto America' : game.charAt(0).toUpperCase() + game.slice(1)}</div>
                        <div class="jp-amount">${jackpots[game]}</div>
                        <div class="jp-next">Next Draw: ${nextDraw}</div>
                    `;
                    jackpotContainer.appendChild(card);
                }
            });
        }
        // ------------------------------------------

        // ------------------------------------------
        // SEASON FILTERING LOGIC
        // ------------------------------------------
        const today = new Date();
        let currentSeasonStartYear = today.getFullYear();
        // If we are in Jan or Feb, the season started March 1st of previous year
        if (today.getMonth() < 2) {
            currentSeasonStartYear -= 1;
        }
        const currentSeasonStart = new Date(currentSeasonStartYear, 2, 1); // March 1st

        // Helper to parse "Jan 10th, 2026"
        const parseDate = (dateStr) => {
            return new Date(dateStr.replace(/(st|nd|rd|th)/, ''));
        };

        // Filter history to ONLY show current season
        const currentSeasonHistory = history.filter(draw => {
            return parseDate(draw.date) >= currentSeasonStart;
        });
        // ------------------------------------------

        // Sort priority: Powerball (1), Mega Millions (2), Lotto America (3)
        const gamePriority = {
            'powerball': 1,
            'mega millions': 2,
            'lotto america': 3
        };

        // Sort history by Game Priority first, then by Date (Descending)
        currentSeasonHistory.sort((a, b) => {
            // 1. Sort by Game Priority
            const pA = gamePriority[a.game.toLowerCase()] || 99;
            const pB = gamePriority[b.game.toLowerCase()] || 99;

            if (pA !== pB) {
                return pA - pB;
            }

            // 2. If same game, sort by Date (Newest first)
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA;
        });

        let totalWon = 0;
        let totalSpent = 0;

        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = "";

        // Track which games we have already rendered to avoid duplicates
        const renderedGames = new Set();

        currentSeasonHistory.forEach(draw => {
            // Normalize game key (e.g., "Powerball" -> "powerball")
            let gameKey = draw.game.toLowerCase().replace(/\s/g, '');

            // SKIP if we don't play this game OR if we already rendered this game (only show latest)
            if (!clubNumbers[gameKey] || renderedGames.has(gameKey)) return;

            // Mark this game as rendered
            renderedGames.add(gameKey);
        });

        // RE-WRITING LOGIC:
        // 1. Calculate Totals (All Season)
        currentSeasonHistory.forEach(draw => {
            let gameKey = draw.game.toLowerCase().replace(/\s/g, '');
            if (!clubNumbers[gameKey]) return;

            totalWon += (draw.won_amount || 0);
            if (rules[gameKey]) {
                const plays = rules[gameKey].plays_per_draw || 1;
                totalSpent += (rules[gameKey].cost_per_play * plays);
            }
        });

        // 2. Render Cards (Latest Only)
        // Reset rendered set
        renderedGames.clear();

        currentSeasonHistory.forEach(draw => {
            let gameKey = draw.game.toLowerCase().replace(/\s/g, '');

            if (!clubNumbers[gameKey] || renderedGames.has(gameKey)) return;
            renderedGames.add(gameKey);

            if (rules[gameKey]) {
                const card = document.createElement('div');
                card.className = 'scorecard';

                // Header: Game Name, Date, Win Amount
                const winLabel = draw.won_amount > 0
                    ? `<span class="win-badge">WON $${draw.won_amount.toLocaleString()}</span>`
                    : '';

                // Render Winning Numbers (Big & Bold)
                const winningNumsHTML = draw.numbers.map(n => `<span class="ball drawn">${n}</span>`).join('');
                const winningSpecialHTML = draw.special ? `<span class="ball drawn special">${draw.special}</span>` : '';

                // Render Our Tickets (Grid)
                let ticketsHTML = '<div class="ticket-grid">';
                const myTickets = clubNumbers[gameKey] || [];

                if (myTickets.length === 0) {
                    ticketsHTML += '<div class="no-tickets">No tickets played for this game.</div>';
                } else {
                    myTickets.forEach((ticket, index) => {
                        // Check matches for this specific ticket
                        const numSpans = ticket.numbers.map(n => {
                            const isMatch = draw.numbers.includes(n);
                            return `<span class="ball ${isMatch ? 'match' : ''}">${n}</span>`;
                        }).join('');

                        let specialSpan = '';
                        if (ticket.special !== undefined) {
                            const isSpecialMatch = (ticket.special === draw.special);
                            specialSpan = `<span class="ball special ${isSpecialMatch ? 'match' : ''}">${ticket.special}</span>`;
                        }

                        // Check for win amount
                        let winAmountHTML = '';
                        if (draw.matches) {
                            const ticketStr = ticket.numbers.join(',');
                            const match = draw.matches.find(m => m.pick.join(',') === ticketStr);
                            if (match && match.won > 0) {
                                winAmountHTML = `<span class="ticket-win">+$${match.won.toLocaleString()}</span>`;
                            }
                        }

                        ticketsHTML += `
                            <div class="ticket-row">
                                <span class="ticket-label">#${index + 1}</span>
                                ${numSpans}
                                ${specialSpan}
                                ${winAmountHTML}
                            </div>
                        `;
                    });
                }
                ticketsHTML += '</div>';

                card.innerHTML = `
                    <div class="scorecard-header">
                        <div>
                            <h2>${draw.game}</h2>
                            <span class="draw-date">${draw.date}</span>
                        </div>
                        ${winLabel}
                    </div>
                    
                    <div class="winning-section">
                        <div class="section-label">WINNING NUMBERS</div>
                        <div class="ball-row large">
                            ${winningNumsHTML}
                            ${winningSpecialHTML}
                        </div>
                    </div>

                    <div class="tickets-section">
                        <div class="section-label">OUR TICKETS</div>
                        ${ticketsHTML}
                    </div>
                `;

                resultsList.appendChild(card);
            }
        });

        // 3. Update Totals
        document.getElementById('total-spent').innerText = `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        document.getElementById('total-won').innerText = `$${totalWon.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

        const net = totalWon - totalSpent;
        const netEl = document.getElementById('net-result');

        // Fix for text overflow: Use smaller font if number is huge
        if (Math.abs(net) > 10000) {
            netEl.style.fontSize = '1.5em';
        }

        netEl.innerText = `${net >= 0 ? '+' : '-'}$${Math.abs(net).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        // Use classes for color instead of inline styles
        netEl.className = net >= 0 ? 'text-success' : 'text-danger';
        netEl.style.color = ''; // Ensure no inline style overrides class

        // Per Member Stats
        const members = rules.club_members || 50;
        const perMemberNet = net / members;

        // Remove old per-member row if exists to prevent duplicates on reload
        const existingRow = document.getElementById('per-member-row');
        if (existingRow) existingRow.remove();

        const perMemberRow = document.createElement('div');
        perMemberRow.id = 'per-member-row';
        // Styles are now handled in CSS under #per-member-row
        perMemberRow.innerHTML = `Each of our <strong>${members} members</strong> has a net of <strong>${perMemberNet >= 0 ? '+' : '-'}$${Math.abs(perMemberNet).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> YTD.`;

        // Insert into the new container structure
        const memberArea = document.getElementById('member-stat-area');
        if (memberArea) {
            memberArea.appendChild(perMemberRow);
        } else {
            // Fallback for safety: try to find the club container
            const container = document.querySelector('.club-container');
            if (container) {
                container.insertBefore(perMemberRow, document.querySelector('.section'));
            }
        }

    } catch (err) {
        console.error("Error loading dashboard data:", err);
        document.getElementById('results-list').innerHTML = "<p>Error loading data. Make sure you are running a local server.</p>";
    }
});