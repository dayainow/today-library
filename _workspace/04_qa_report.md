# QA Report

Date: 2026-05-06 KST

## Results

- Production diagnostic endpoint: passed, `ok: true`, public data response `200 OK`, `NORMAL_SERVICE`.
- Production `/api/libraries`: passed, `200`, 3,390 libraries, about 1.69 MB.
- Local env presence: passed, required keys are set in `.env.local`.
- Local app API URL: passed, points to production `/api/libraries`.
- Local Vercel dev with exported env: passed.
- Local `/api/debug/public-data`: passed, `ok: true`.
- Local `/api/libraries` after fix: passed, `200`, 3,390 libraries.
- Local normalized sample after fix: first library has weekday `08:00-22:00`, Saturday `08:00-22:00`.
- Production payload through client duplicate-ID guard: passed, 3,390 unique IDs.
- Local `/api/libraries` after stable ID fix: passed, 3,390 unique IDs, 0 duplicate IDs.
- `npm run typecheck`: passed.
- Design update typecheck: passed.
- Expo config check: passed, app name resolves to `오늘의 도서관` and splash/adaptive icon point to regenerated assets.
- Current-location refresh control typecheck: passed.

## Device Run Notes

- Existing Metro server is alive on local port `8081`.
- Starting an additional Expo server on `8082` failed with Expo CLI `ERR_SOCKET_BAD_PORT` from `freeport-async`.
- Use the existing Metro URL from the current terminal for Android phone testing, or restart the current Metro server with `npx expo start --lan --clear` after stopping it.

## Notes

Production is currently connected, but the operating-hours field fix is only in the local working tree until it is deployed.
