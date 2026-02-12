# Future Roadmap & Recommendations

This document outlines technical and strategic improvements to enhance the reliability, security, and member engagement of the Minnesota Millionaires Lottery Club platform.

---

## 🛠 Technical Recommendations

### 1. Automated Failure Notifications
*   **Goal:** Instant awareness of system downtime.
*   **Details:** Currently, if the MN Lottery website changes its structure, the scraper will fail silently.
*   **Action:** Integrate a Discord or Slack Webhook into the `.github/workflows/daily_update.yml`. Configure it to trigger only `on: failure`.
*   **Value:** Prevents members from seeing stale data and allows for immediate fixes.

### 2. Centralized Configuration (Source of Truth)
*   **Goal:** Easier maintenance.
*   **Details:** Game names, schedules, and payout tables are currently duplicated across `scrape.js`, `checker.js`, `main.js`, and `rules.html`.
*   **Action:** Create `public/config/constants.json`. Refactor all scripts to import rules and game metadata from this single file.
*   **Value:** Changing a payout amount or adding a new game becomes a 1-file edit instead of a 4-file scavenger hunt.

### 3. Automated Payout Validation (Unit Testing)
*   **Goal:** Financial accuracy.
*   **Details:** As the "Commissioner," your reputation relies on accurate winnings calculations.
*   **Action:** Implement a small test suite using `Jest` or a simple Node script. Feed the checker "Mock Draws" (e.g., a fake Powerball result that matches your club numbers) and assert that the output `won_amount` is exactly correct.
*   **Value:** Guarantees that updates to the logic don't accidentally break the math.

### 4. Progressive Web App (PWA) Conversion
*   **Goal:** Mobile-first experience.
*   **Details:** Most members check results on their phones.
*   **Action:** Add a `manifest.json` and a basic Service Worker.
*   **Value:** Allows members to "Install" the site to their home screen. It will look and feel like a real app (no URL bar, custom splash screen).

### 5. Data Cache-Busting (COMPLETED)
*   **Goal:** Real-time data delivery.
*   **Details:** Browsers often cache the `history.json` file, meaning members might see old numbers even after the bot has updated them.
*   **Action:** Update `fetch()` calls in `main.js` to include a timestamp: `fetch('data/history.json?v=' + Date.now())`.
*   **Value:** Forces the browser to ignore the cache and pull the freshest numbers every time.

---

## 📈 Strategic Recommendations

### 1. "Proof of Play" Verification
*   **Value:** Trust and Transparency.
*   **Strategy:** Provide visual proof that tickets were actually purchased.
*   **Action:** Create a "Ticket Gallery" in the Member Portal. Members can view photos/scans of the physical tickets. This could be automated by a script that reads a specific folder of images.

### 2. "We Won!" Email Automation
*   **Value:** Member Retention and Excitement.
*   **Strategy:** Automatically notify members when a win is detected.
*   **Action:** Use a service like **EmailJS** or **SendGrid** via a GitHub Action. If the `checker.js` detects a `won_amount > 0`, trigger an email blast to the registered member emails in Firebase.

### 3. Gamification: "The Near-Miss Tracker"
*   **Value:** Emotional Engagement.
*   **Strategy:** Keep members interested even during losing streaks.
*   **Action:** Add a section to the dashboard showing "Closest Calls." For example: "Last night we were only 1 number away from $50,000!" 
*   **Value:** Highlights how "close" the club is getting, maintaining the thrill of the game.

---

## 🗺 Implementation Priority

| Priority | Task | Difficulty | Impact |
| :--- | :--- | :--- | :--- |
| **High** | Cache-Busting (#5) | Easy | Immediate |
| **High** | Failure Notifications (#1) | Medium | High |
| **Medium** | Proof of Play Gallery (S1) | Medium | High |
| **Medium** | Unit Testing (#3) | Hard | Critical |
| **Low** | PWA Conversion (#4) | Easy | Aesthetic |
