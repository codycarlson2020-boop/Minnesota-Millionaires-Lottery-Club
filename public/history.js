document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [historyRes, rulesRes] = await Promise.all([
            fetch('./data/history.json'),
            fetch('./config/game_rules.json')
        ]);

        const history = await historyRes.json();
        const rules = await rulesRes.json();
        const members = rules.club_members || 50;

        // Helper to parse "Jan 10th, 2026" -> Date Object
        const parseDate = (dateStr) => {
            return new Date(dateStr.replace(/(st|nd|rd|th)/, ''));
        };

        // Determine Current Season Start (March 1st logic)
        const today = new Date();
        let currentSeasonStartYear = today.getFullYear();
        if (today.getMonth() < 2) { // Jan (0) or Feb (1)
            currentSeasonStartYear -= 1;
        }
        const currentSeasonStart = new Date(currentSeasonStartYear, 2, 1); // March 1st

        // Group data by Season
        // Season 2025 = March 1, 2025 to Feb 28, 2026
        const seasons = {};

        history.forEach(draw => {
            const drawDate = parseDate(draw.date);
            
            // Calculate Draw Cost
            let drawCost = 0;
            const gameKey = draw.game.toLowerCase().replace(/\s/g, '');
            if (rules[gameKey]) {
                drawCost = (rules[gameKey].cost_per_play * (rules[gameKey].plays_per_draw || 1));
            }

            // Determine which season this draw belongs to
            let seasonYear = drawDate.getFullYear();
            if (drawDate.getMonth() < 2) {
                seasonYear -= 1;
            }

            // Initialize season stats if not exists
            if (!seasons[seasonYear]) {
                seasons[seasonYear] = {
                    year: seasonYear,
                    spent: 0,
                    won: 0,
                    maxWin: 0,
                    isCurrent: (seasonYear === currentSeasonStartYear)
                };
            }

            // Add stats
            seasons[seasonYear].spent += drawCost;
            seasons[seasonYear].won += (draw.won_amount || 0);
            if ((draw.won_amount || 0) > seasons[seasonYear].maxWin) {
                seasons[seasonYear].maxWin = draw.won_amount;
            }
        });

        // Render Table
        const tbody = document.getElementById('history-list');
        tbody.innerHTML = "";

        // Sort seasons descending (newest first)
        const sortedSeasons = Object.values(seasons).sort((a, b) => b.year - a.year);

        if (sortedSeasons.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No history available yet.</td></tr>`;
            return;
        }

        sortedSeasons.forEach(s => {
            if (s.isCurrent) return; // Don't show current season in history (it's on dashboard)

            const net = s.won - s.spent;
            const netClass = net >= 0 ? 'win' : 'loss';
            const netSign = net >= 0 ? '+' : '-';

            const row = `
                <tr>
                    <td>
                        <strong>${s.year} - ${s.year + 1}</strong>
                    </td>
                    <td>$${s.spent.toLocaleString()}</td>
                    <td>$${s.won.toLocaleString()}</td>
                    <td class="${netClass}">
                        ${netSign}$${Math.abs(net).toLocaleString()}
                    </td>
                    <td>$${s.maxWin.toLocaleString()}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
        // If we only have the current season, show a message
        if (tbody.innerHTML === "") {
             tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color: #777;">No past seasons archived yet.<br>This season will appear here after March 1st, ${currentSeasonStartYear + 1}.</td></tr>`;
        }

    } catch (err) {
        console.error(err);
    }
});