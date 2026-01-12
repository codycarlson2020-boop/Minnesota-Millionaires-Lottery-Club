document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loading dashboard...");

    try {
        const [historyRes, rulesRes] = await Promise.all([
            fetch('../data/history.json'),
            fetch('../config/game_rules.json')
        ]);

        const history = await historyRes.json();
        const rules = await rulesRes.json();

        let totalWon = 0;
        let totalSpent = 0;

        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = "";

        history.forEach(draw => {
            // Calculate Winnings
            totalWon += (draw.won_amount || 0);

            // Calculate Spending
            const gameKey = draw.game.toLowerCase().replace(/\s/g, '');
            if (rules[gameKey]) {
                totalSpent += rules[gameKey].cost_per_play;
            }

            // Render Row
            const row = document.createElement('div');
            row.className = 'draw-row';
            const winClass = (draw.won_amount > 0) ? 'win' : '';
            
            row.innerHTML = `
                <div class="draw-info">
                    <strong>${draw.game}</strong> - ${draw.date}
                    <div class="numbers">${draw.numbers.join(' ')} ${draw.special ? `[${draw.special}]` : ''}</div>
                </div>
                <div class="draw-result ${winClass}">
                    ${draw.won_amount > 0 ? `+$${draw.won_amount.toLocaleString()}` : '$0'}
                </div>
            `;
            resultsList.appendChild(row);
        });

        // Update Stats
        document.getElementById('total-spent').innerText = `$${totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('total-won').innerText = `$${totalWon.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        
        const net = totalWon - totalSpent;
        const netEl = document.getElementById('net-result');
        netEl.innerText = `${net >= 0 ? '+' : '-'}$${Math.abs(net).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        netEl.style.color = net >= 0 ? '#27ae60' : '#c0392b';

        // Per Member Stats
        const members = rules.club_members || 1;
        const perMemberNet = net / members;
        
        const perMemberRow = document.createElement('div');
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