# YouTube x Twitch Chat Bridge

Browser extension (Manifest V3) to open Twitch chat while watching YouTube live streams.

## Stack
- TypeScript (strict)
- Manifest V3
- esbuild bundling
- Vitest (unit)
- Playwright (e2e scaffold)
- ESLint + Prettier
- Husky + Commitlint + Conventional Commits

## Scripts
- npm run dev
- npm run build
- npm run lint
- npm run typecheck
- npm run test
- npm run test:e2e

## Run locally
1. npm install
2. npm run build
3. Open Chrome Extensions page and enable Developer Mode
4. Load unpacked extension from dist folder

## MVP flow
1. Open extension options page and save mapping YouTube channel -> Twitch channel.
2. Open a YouTube live tab.
3. Click extension popup and run Open Twitch Chat.
4. Chat opens in tab or side panel, depending on selected default mode.
