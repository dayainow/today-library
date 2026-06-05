# Product Brief

Date: 2026-05-06 KST

## Goal

Check whether the Today Library app is correctly connected to the public library data API.
Update the app UI to follow the provided Today Library design spec and high-fidelity mockup.

## Scope

- Verify the deployed Vercel API used by the Expo app.
- Verify required environment variables are present locally without exposing secret values.
- Confirm the app-side API URL points to the deployed cache endpoint.
- Fix narrowly scoped data-contract issues discovered during verification.
- Apply the design system direction from the provided HTML files: bright paper background, white cards, blue brand accent, green open-state accent, compact chips, dense library cards.

## Acceptance Criteria

- `/api/debug/public-data` reports a valid public data service key and `200 OK`.
- `/api/libraries` returns `source: public-data`, a non-empty `libraries` array, and normalized library objects.
- App env `EXPO_PUBLIC_LIBRARY_API_URL` points to the working Vercel `/api/libraries` endpoint.
- TypeScript typecheck passes after any code change.
- The home screen defaults to a useful full-results view and keeps filter buttons tappable on Android.
