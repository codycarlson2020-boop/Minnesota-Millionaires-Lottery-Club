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

        let totalWon = 0;
        let totalSpent = 0;

        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = "";

        history.forEach(draw => {
            // 1. Math & Stats
            totalWon += (draw.won_amount || 0);
            
            // Normalize game key (e.g., "Powerball" -> "powerball")
            let gameKey = draw.game.toLowerCase().replace(/\s/g, '');
            if (gameKey === 'north5') gameKey = 'north5'; // ensure match

            // SKIP if we don't play this game
            if (!clubNumbers[gameKey]) return;

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

                    ticketsHTML += `
                        <div class="ticket-row">
                            <span class="ticket-label">#${index + 1}</span>
                            ${numSpans}
                            ${specialSpan}
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