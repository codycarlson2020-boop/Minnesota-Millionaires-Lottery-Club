@echo off
cd /d "%~dp0"
echo --- Lottery Club Auto-Updater ---
echo [1/4] Running Scraper...
call npm run scrape
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Scraper failed!
    pause
    exit /b %ERRORLEVEL%
)

echo [2/4] Checking for changes...
git status --porcelain public/data/history.json > nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] No new data found. Everything is up to date.
    timeout /t 5
    exit /b 0
)

echo [3/4] Data updated! Committing changes...
git add public/data/history.json public/data/jackpots.json
git commit -m "Data: Auto-update from local script"

echo [4/4] Pushing to GitHub...
git push

echo [SUCCESS] Website updated successfully!
timeout /t 10
exit /b 0
