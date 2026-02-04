@echo off
cd /d "%~dp0"
echo --- Lottery Club Auto-Updater ---
echo [1/5] Running Scraper...
call npm run scrape
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Scraper failed!
    pause
    exit /b %ERRORLEVEL%
)

echo [2/5] Calculating Winnings...
call npm run check
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Checker failed!
    pause
    exit /b %ERRORLEVEL%
)

echo [3/5] Checking for changes...
git status --porcelain public/data/history.json > nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] No new data found. Everything is up to date.
    timeout /t 5
    exit /b 0
)

echo [4/5] Data updated! Committing changes...
git add public/data/history.json public/data/jackpots.json
git commit -m "Data: Auto-update from local script"

echo [5/5] Pushing to GitHub...
git push

echo [SUCCESS] Website updated successfully!
timeout /t 10
exit /b 0
