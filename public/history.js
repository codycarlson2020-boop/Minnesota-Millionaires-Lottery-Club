document.addEventListener('DOMContentLoaded', async () => {
    try {
        // INLINED DATA TO FIX CORS ISSUES
        // (Truncated history for performance/demo - normally this would be fetched)
        const history = [
            {
                "game": "Mega Millions",
                "date": "Feb 27th, 2026",
                "numbers": [12, 13, 43, 49, 68],
                "special": 12,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Feb 25th, 2026",
                "numbers": [14, 15, 20, 22, 52, 53],
                "special": 12,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 25th, 2026",
                "numbers": [24, 38, 46, 48, 50],
                "special": 17,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Feb 24th, 2026",
                "numbers": [41, 43, 47, 55, 56, 58],
                "special": 21,
                "won_amount": 7
            },
            {
                "game": "Lotto America",
                "date": "Feb 23rd, 2026",
                "numbers": [14, 19, 36, 42, 57],
                "special": 17,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 23rd, 2026",
                "numbers": [8, 12, 27, 35, 40],
                "special": 22,
                "won_amount": 7
            },
            {
                "game": "Lotto America",
                "date": "Feb 21st, 2026",
                "numbers": [16, 20, 34, 53, 69],
                "special": 2,
                "won_amount": 4
            },
            {
                "game": "Powerball",
                "date": "Feb 21st, 2026",
                "numbers": [3, 10, 23, 57, 63],
                "special": 11,
                "won_amount": 4
            },
            {
                "game": "Mega Millions",
                "date": "Feb 20th, 2026",
                "numbers": [20, 22, 53, 59, 69],
                "special": 3,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Feb 18th, 2026",
                "numbers": [10, 15, 42, 61, 63],
                "special": 5,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 18th, 2026",
                "numbers": [25, 32, 37, 41, 56],
                "special": 12,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Feb 17th, 2026",
                "numbers": [15, 16, 22, 27, 29],
                "special": 24,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Feb 16th, 2026",
                "numbers": [3, 46, 47, 51, 61],
                "special": 10,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 16th, 2026",
                "numbers": [1, 22, 23, 56, 60],
                "special": 19,
                "won_amount": 4
            },
            {
                "game": "Lotto America",
                "date": "Feb 14th, 2026",
                "numbers": [14, 24, 34, 60, 66],
                "special": 19,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 14th, 2026",
                "numbers": [7, 20, 47, 52, 68],
                "special": 16,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Feb 13th, 2026",
                "numbers": [4, 20, 41, 44, 67],
                "special": 8,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Feb 11th, 2026",
                "numbers": [13, 15, 23, 37, 49],
                "special": 6,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 11th, 2026",
                "numbers": [5, 10, 11, 44, 67],
                "special": 18,
                "won_amount": 4
            },
            {
                "game": "Mega Millions",
                "date": "Feb 10th, 2026",
                "numbers": [16, 23, 30, 63, 64],
                "special": 5,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Feb 9th, 2026",
                "numbers": [10, 12, 36, 44, 51],
                "special": 11,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 9th, 2026",
                "numbers": [9, 21, 50, 51, 69],
                "special": 18,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Feb 7th, 2026",
                "numbers": [3, 9, 23, 28, 46],
                "special": 5,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 7th, 2026",
                "numbers": [5, 9, 27, 36, 47],
                "special": 15,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Feb 6th, 2026",
                "numbers": [2, 9, 31, 60, 69],
                "special": 13,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Feb 4th, 2026",
                "numbers": [11, 17, 21, 29, 41],
                "special": 24,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 4th, 2026",
                "numbers": [10, 15, 33, 44, 59],
                "special": 7,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Feb 3rd, 2026",
                "numbers": [9, 39, 40, 52, 54],
                "special": 1,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Feb 2nd, 2026",
                "numbers": [6, 19, 30, 34, 44],
                "special": 8,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Feb 2nd, 2026",
                "numbers": [12, 22, 29, 41, 50],
                "special": 12,
                "won_amount": 100
            },
            {
                "game": "Lotto America",
                "date": "Jan 31st, 2026",
                "numbers": [22, 24, 31, 50, 59],
                "special": 18,
                "won_amount": 7
            },
            {
                "game": "Powerball",
                "date": "Jan 31st, 2026",
                "numbers": [19, 24, 51, 54, 64],
                "special": 12,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Jan 30th, 2026",
                "numbers": [23, 30, 43, 49, 54],
                "special": 25,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 28th, 2026",
                "numbers": [15, 27, 30, 38, 69],
                "special": 12,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Jan 28th, 2026",
                "numbers": [30, 44, 50, 57, 59],
                "special": 21,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Jan 27th, 2026",
                "numbers": [5, 10, 52, 67, 69],
                "special": 4,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 26th, 2026",
                "numbers": [32, 41, 43, 46, 65],
                "special": 6,
                "won_amount": 4
            },
            {
                "game": "Powerball",
                "date": "Jan 26th, 2026",
                "numbers": [6, 46, 63, 68, 69],
                "special": 6,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 24th, 2026",
                "numbers": [5, 12, 31, 42, 58],
                "special": 18,
                "won_amount": 4
            },
            {
                "game": "Powerball",
                "date": "Jan 24th, 2026",
                "numbers": [1, 5, 42, 53, 67],
                "special": 7,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Jan 23rd, 2026",
                "numbers": [1, 31, 33, 34, 37],
                "special": 19,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 21st, 2026",
                "numbers": [1, 7, 37, 45, 67],
                "special": 2,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Jan 21st, 2026",
                "numbers": [14, 21, 26, 30, 55],
                "special": 11,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Jan 20th, 2026",
                "numbers": [25, 29, 57, 61, 64],
                "special": 18,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 19th, 2026",
                "numbers": [13, 32, 39, 48, 62],
                "special": 1,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Jan 19th, 2026",
                "numbers": [8, 13, 27, 29, 68],
                "special": 19,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 17th, 2026",
                "numbers": [2, 18, 34, 54, 60],
                "special": 17,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Jan 17th, 2026",
                "numbers": [17, 26, 30, 54, 55],
                "special": 9,
                "won_amount": 100
            },
            {
                "game": "Mega Millions",
                "date": "Jan 16th, 2026",
                "numbers": [7, 24, 41, 46, 53],
                "special": 7,
                "won_amount": 4
            },
            {
                "game": "Lotto America",
                "date": "Jan 14th, 2026",
                "numbers": [5, 38, 50, 52, 69],
                "special": 14,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Jan 14th, 2026",
                "numbers": [17, 27, 31, 37, 46],
                "special": 1,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Jan 13th, 2026",
                "numbers": [1, 36, 41, 50, 68],
                "special": 22,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 12th, 2026",
                "numbers": [25, 35, 42, 53, 65],
                "special": 8,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Jan 12th, 2026",
                "numbers": [10, 16, 40, 41, 54],
                "special": 18,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 10th, 2026",
                "numbers": [9, 10, 14, 26, 49],
                "special": 20,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Jan 10th, 2026",
                "numbers": [14, 27, 33, 58, 60],
                "special": 2,
                "won_amount": 4
            },
            {
                "game": "Mega Millions",
                "date": "Jan 9th, 2026",
                "numbers": [2, 19, 27, 31, 45],
                "special": 21,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 7th, 2026",
                "numbers": [30, 37, 39, 44, 63],
                "special": 26,
                "won_amount": 0
            },
            {
                "game": "Powerball",
                "date": "Jan 7th, 2026",
                "numbers": [11, 27, 34, 52, 69],
                "special": 17,
                "won_amount": 0
            },
            {
                "game": "Mega Millions",
                "date": "Jan 6th, 2026",
                "numbers": [38, 41, 44, 47, 48],
                "special": 14,
                "won_amount": 0
            },
            {
                "game": "Lotto America",
                "date": "Jan 5th, 2026",
                "numbers": [3, 7, 11, 34, 65],
                "special": 14,
                "won_amount": 4
            }
        ];

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