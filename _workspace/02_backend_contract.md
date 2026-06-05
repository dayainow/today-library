# Backend Contract

Date: 2026-05-06 KST

## Public Endpoints

- Production app API: `https://today-library-sigma.vercel.app/api/libraries`
- Production diagnostic API: `https://today-library-sigma.vercel.app/api/debug/public-data`
- Public data source: `https://api.data.go.kr/openapi/tn_pubr_public_lbrry_api`

## Observed Contract

`/api/libraries` returns:

- `source: "public-data"`
- `updatedAt: ISO timestamp`
- `count: number`
- `libraries: Library[]`

`Library` includes normalized fields used by the app: `name`, `city`, `district`, coordinates, `weekdayHours`, `saturdayHours`, `sundayHours`, `closedRules`, seat/book counts, and contact links.

## Fix Applied

The public API returns some typo-shaped camelCase keys:

- `weekdayOperColseHhmm`
- `satOperOperOpenHhmm`

`api/_lib/publicLibraries.ts` now recognizes both keys, so weekday and Saturday hours are preserved instead of becoming `null`.

The API also has multiple same-name libraries in the same city/district with different addresses and coordinates. Stable ID generation now includes address, coordinates, and optional institution fields so the API returns unique IDs for all 3,390 rows.
