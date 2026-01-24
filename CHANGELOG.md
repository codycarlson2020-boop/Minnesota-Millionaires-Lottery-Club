# Changelog

All notable changes to this project will be documented in this file.

## [2026-01-24]

### Fixed
- **Cache Issue:** Added cache-busting timestamp (`?v=...`) to `main.js` fetch calls to ensure users always see the latest data.
- **Missing Data:** Manually scraped and restored missing Mega Millions results for Jan 23rd, 2026.
- **Staleness Monitoring:** Updated `monitor_staleness.js` to support local file checking (`--local`).

### Added
- **CI/CD Safety:** Added a "Verify Data Freshness" step to the `.github/workflows/daily_update.yml` pipeline. The workflow will now fail explicitly if the scraper runs but fails to capture the latest drawings, triggering a GitHub notification.
