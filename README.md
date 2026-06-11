# Bucks2Bar

Bucks2Bar is a lightweight vanilla JavaScript financial dashboard for tracking monthly income and expenses with Chart.js visualization.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the local development server:
   ```bash
   npm start
   ```

3. Open the app in your browser at:
   ```text
   http://localhost:3000
   ```

4. Run tests:
   ```bash
   npm test
   ```

3. Run tests in watch mode:
   ```bash
   npm run test:watch
   ```

4. Generate coverage report:
   ```bash
   npm run coverage
   ```

## Project Structure

- `index.html` — main application markup and layout
- `script.js` — core application logic and event binding
- `script.test.js` — unit tests for utility and DOM behavior
- `vitest.config.js` — test runner configuration
- `package.json` — project metadata and scripts

## Testing

This project uses Vitest with the `jsdom` environment to test DOM-based helper utilities.

## Notes

- The app is intentionally static and framework-free.
- `script.js` exports utility functions for testing while still initializing in the browser.
