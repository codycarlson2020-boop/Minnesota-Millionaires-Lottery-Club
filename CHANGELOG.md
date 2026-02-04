# Changelog

All notable changes to this project will be documented in this file.

## [2026-01-24]

### Fixed
- **Cache Issue:** Added cache-busting timestamp (`?v=...`) to `main.js` fetch calls to ensure users always see the latest data.
- **Missing Data:** Manually scraped and restored missing Mega Millions results for Jan 23rd, 2026.
- **Staleness Monitoring:** Updated `monitor_staleness.js` to support local file checking (`--local`).

### Added
- **CI/CD Safety:** Added a "Verify Data Freshness" step to the `.github/workflows/daily_update.yml` pipeline. The workflow will now fail explicitly if the scraper runs but fails to capture the latest drawings, triggering a GitHub notification.

## [2026-02-03]

### Added
- **Local Automation:** Created `update_lottery.bat`, a robust batch script that scrapes, commits, and pushes updates automatically.
- **Scheduled Task:** Configured "LotteryClubUpdater" on the local machine to execute the update script daily at 11:00 PM CST, ensuring reliable updates even if cloud runners are blocked.
- **Scripts:** Added `npm run scrape` command to `package.json`.

### Fixed
- **Data Sync:** Manually ran the new local scraper to restore data currency (updated to Feb 3rd, 2026).

## [2026-01-28]

### Fixed
- **Silent Failures:** Implemented a "Sanity Check" in `scrape.js`. The scraper now explicitly fails (Exit Code 1) if the latest result found on the web page is older than 5 days.
- **Bot Detection:** Migrated to `puppeteer-extra` with `puppeteer-extra-plugin-stealth` and added human-like browser headers to bypass "Ghost Page" caching and bot blocking.
- **Schedule:** Adjusted GitHub Actions schedule to run later (11:30 PM & 12:30 AM CST) to ensure external results are published before scraping.

### Added
- **UI Warning:** Added a visual "Stale Data" warning banner to the website dashboard that appears if data is older than 4 days.

