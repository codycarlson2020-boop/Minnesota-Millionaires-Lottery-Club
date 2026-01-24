document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch real data from history.json
        const response = await fetch('data/history.json');
        if (!response.ok) throw new Error("Failed to fetch history");
        const history = await response.json();

        // Helper to parse dates
        const parseDate = (dateStr) => new Date(dateStr.replace(/(st|nd|rd|th)/, ''));

        // 1. Group Data: Season -> Month -> Draws
        const seasons = {};

        history.forEach(draw => {
            const date = parseDate(draw.date);

            // Determine Season (March 1st Cycle)
            let seasonYear = date.getFullYear();
            if (date.getMonth() < 2) seasonYear -= 1;
            const seasonKey = `${seasonYear}-${seasonYear + 1}`;

            // Determine Month Key (e.g., "January 2026")
            const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            // Sort key for months (YYYY-MM)
            const monthSortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!seasons[seasonKey]) seasons[seasonKey] = { totalWon: 0, months: {} };

            seasons[seasonKey].totalWon += (draw.won_amount || 0);

            if (!seasons[seasonKey].months[monthKey]) {
                seasons[seasonKey].months[monthKey] = {
                    sortKey: monthSortKey,
                    totalWon: 0,
                    draws: []
                };
            }

            seasons[seasonKey].months[monthKey].totalWon += (draw.won_amount || 0);
            seasons[seasonKey].months[monthKey].draws.push(draw);
        });

        // 2. Render UI
        const container = document.getElementById('archive-container');
        container.innerHTML = '';

        // Sort Seasons Descending
        const sortedSeasons = Object.keys(seasons).sort().reverse();

        sortedSeasons.forEach((seasonKey, index) => {
            const seasonData = seasons[seasonKey];

            // Create Season Section
            const seasonDiv = document.createElement('div');
            seasonDiv.className = 'season-group';

            // Season Header
            const seasonHeader = document.createElement('div');
            seasonHeader.className = 'season-header';
            seasonHeader.innerHTML = `
                <span>${seasonKey} Season</span>
                <span class="season-total">Total Won: $${seasonData.totalWon.toLocaleString()}</span>
                <span class="toggle-icon">+</span>
            `;

            // Month Container (Hidden by default, unless first season)
            const monthContainer = document.createElement('div');
            monthContainer.className = index === 0 ? 'month-container' : 'month-container hidden';

            // If expanded, update icon
            if (index === 0) {
                seasonHeader.classList.add('active');
                seasonHeader.querySelector('.toggle-icon').textContent = '-';
            }

            // Sort Months Descending
            const sortedMonths = Object.keys(seasonData.months).sort((a, b) => {
                return seasonData.months[b].sortKey.localeCompare(seasonData.months[a].sortKey);
            });

            sortedMonths.forEach(monthKey => {
                const monthData = seasonData.months[monthKey];

                const monthDiv = document.createElement('div');
                monthDiv.className = 'month-group';

                const monthHeader = document.createElement('div');
                monthHeader.className = 'month-header';

                // Show Monthly Total
                const monthTotalHTML = monthData.totalWon > 0
                    ? `<span class="month-total win-text">+$${monthData.totalWon.toLocaleString()}</span>`
                    : `<span class="month-total">$0</span>`;

                monthHeader.innerHTML = `
                    <div style="display:flex; gap:15px; align-items:center;">
                        <span>${monthKey}</span>
                        ${monthTotalHTML}
                    </div>
                    <span class="toggle-icon">+</span>
                `;

                const table = document.createElement('table');
                table.className = 'history-draws hidden';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Game</th>
                            <th>Winning Numbers</th>
                            <th>Won</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${monthData.draws.map(d => `
                            <tr>
                                <td>${d.date}</td>
                                <td>${d.game}</td>
                                <td>
                                    <span class="nums">${d.numbers.join(', ')}</span> 
                                    ${d.special ? `<span class="special-num">[${d.special}]</span>` : ''}
                                </td>
                                <td class="${d.won_amount > 0 ? 'win-text' : ''}">
                                    ${d.won_amount > 0 ? '$' + d.won_amount.toLocaleString() : '-'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;

                // Month Toggle Logic
                monthHeader.addEventListener('click', () => {
                    table.classList.toggle('hidden');
                    monthHeader.classList.toggle('active');
                    monthHeader.querySelector('.toggle-icon').textContent = table.classList.contains('hidden') ? '+' : '-';
                });

                monthDiv.appendChild(monthHeader);
                monthDiv.appendChild(table);
                monthContainer.appendChild(monthDiv);
            });

            // Season Toggle Logic
            seasonHeader.addEventListener('click', () => {
                monthContainer.classList.toggle('hidden');
                seasonHeader.classList.toggle('active');
                seasonHeader.querySelector('.toggle-icon').textContent = monthContainer.classList.contains('hidden') ? '+' : '-';
            });

            seasonDiv.appendChild(seasonHeader);
            seasonDiv.appendChild(monthContainer);
            container.appendChild(seasonDiv);
        });

    } catch (err) {
        console.error(err);
        document.getElementById('archive-container').innerHTML = '<p>Error loading archives.</p>';
    }
});