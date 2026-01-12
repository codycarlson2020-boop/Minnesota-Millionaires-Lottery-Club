document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loading dashboard...");

    try {
        const [historyRes, rulesRes, clubRes] = await Promise.all([
            fetch('./data/history.json'),
            fetch('./config/game_rules.json'),
            fetch('./config/club_numbers.json')
        ]);

        const history = await historyRes.json();
        const rules = await rulesRes.json();
        const clubNumbers = await clubRes.json();

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

        // Sort history by Date (Descending) and then by Game Priority
        currentSeasonHistory.sort((a, b) => {
            // Sort by Date first (Newest first)
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            
            if (dateB - dateA !== 0) {
                return dateB - dateA;
            }

            // If same date, sort by game priority
            const pA = gamePriority[a.game.toLowerCase()] || 99;
            const pB = gamePriority[b.game.toLowerCase()] || 99;
            return pA - pB;
        });

        let totalWon = 0;
        let totalSpent = 0;

        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = "";

        currentSeasonHistory.forEach(draw => {
            // Normalize game key (e.g., "Powerball" -> "powerball")
            let gameKey = draw.game.toLowerCase().replace(/\s/g, '');
            
            // SKIP if we don't play this game
            if (!clubNumbers[gameKey]) return;

            // 1. Math & Stats
            totalWon += (draw.won_amount || 0);

            if (rules[gameKey]) {
                const plays = rules[gameKey].plays_per_draw || 1;
                totalSpent += (rules[gameKey].cost_per_play * plays);
            }

            // 2. Render the "Scorecard"
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
                        // Compare arrays by joining them to strings
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
        });

        // 3. Update Totals
        document.getElementById('total-spent').innerText = `$${totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('total-won').innerText = `$${totalWon.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        
        const net = totalWon - totalSpent;
        const netEl = document.getElementById('net-result');
        
        // Fix for text overflow: Use smaller font if number is huge
        if (Math.abs(net) > 10000) {
            netEl.style.fontSize = '1.5em';
        }

        netEl.innerText = `${net >= 0 ? '+' : '-'}$${Math.abs(net).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        netEl.style.color = net >= 0 ? '#27ae60' : '#c0392b';

        // Per Member Stats
        const members = rules.club_members || 50;
        const perMemberNet = net / members;
        
        // Remove old per-member row if exists to prevent duplicates on reload
        const existingRow = document.getElementById('per-member-row');
        if (existingRow) existingRow.remove();

        const perMemberRow = document.createElement('div');
        perMemberRow.id = 'per-member-row';
        perMemberRow.style.textAlign = 'center';
        perMemberRow.style.marginTop = '20px';
        perMemberRow.style.color = '#666';
        perMemberRow.innerHTML = `Each of our <strong>${members} members</strong> has a net of <strong>${perMemberNet >= 0 ? '+' : '-'}$${Math.abs(perMemberNet).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong> YTD.`;
        document.querySelector('.container').insertBefore(perMemberRow, document.querySelector('.section'));

    } catch (err) {
        console.error("Error loading dashboard data:", err);
        document.getElementById('results-list').innerHTML = "<p>Error loading data. Make sure you are running a local server.</p>";
    }
});