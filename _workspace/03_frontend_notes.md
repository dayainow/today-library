# Frontend Notes

Date: 2026-05-06 KST

No frontend code changes were required.

The Expo app reads `EXPO_PUBLIC_LIBRARY_API_URL` in `src/services/libraryApi.ts`. Local `.env.local` currently points this public value to:

`https://today-library-sigma.vercel.app/api/libraries`

If remote loading fails, the app intentionally falls back to embedded seed data and shows a warning.

The app now also normalizes duplicate library IDs after loading remote data. This protects the local Expo app while production is still serving the older API payload and prevents React duplicate-key warnings in the library list.

## Design Update

Referenced files:

- `/Users/dobedub/Downloads/oneulibrary-design-spec.html`
- `/Users/dobedub/Downloads/oneulibrary-mockup.html`

Applied the mockup direction to `App.tsx`:

- Paper background `#F7F8FB`
- White cards with slate borders
- Blue brand/primary action color
- Green open-state emphasis
- Compact search field and pill filters with counts
- Denser library cards with status, distance, hours, address, and actions
- Empty state with primary "전체 보기" action

## Brand Update

- App display name changed from `오늘도서관` to `오늘의 도서관`.
- Header logo is now a book + location marker brand symbol.
- Native Expo icon, Android adaptive icon, favicon, and splash image were regenerated in `assets/`.
- Added an in-app launch screen so Expo Go also shows a branded loading state before the home screen.
- Android top spacing was increased so the logo/title does not collide with the status bar in edge-to-edge mode.
- Location pill is now an actionable control: tapping it requests current location again and re-sorts the current search/filter results by distance.
