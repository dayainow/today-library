# Vercel Public Data Debug Handoff

Last updated: 2026-04-23 KST

## Current Goal

Deploy the Today Library API on Vercel so the Expo app can read public library data from:

```text
https://today-library-sigma.vercel.app/api/libraries
```

The local API works with the public data key, but the Vercel production function currently fails when calling `api.data.go.kr`.

## Repository / Deployment

- GitHub repo: `https://github.com/dayainow/today-library`
- Vercel project scope: `dayainows-projects`
- Vercel project: `today-library`
- Production domain: `https://today-library-sigma.vercel.app`
- Current landing page works:

```text
https://today-library-sigma.vercel.app/
```

Expected landing page text: `오늘도서관 API`

## Important Files

- `api/libraries.ts`
  - Public API endpoint used by the mobile app.
- `api/_lib/publicLibraries.ts`
  - Fetches and normalizes `전국도서관표준데이터` from data.go.kr.
  - Supports endpoint override via `PUBLIC_DATA_LIBRARY_API_URL`.
- `api/debug/public-data.ts`
  - Diagnostic endpoint for the Vercel production fetch issue.
- `public/index.html`
  - Static root page to stop Vercel from serving/downloading Expo `index.ts` at `/`.
- `vercel.json`
  - Vercel function and cron settings.
- `.env.local`
  - Local secrets only. Do not commit.

## Vercel Environment Variables

Production env vars currently required:

```text
PUBLIC_DATA_SERVICE_KEY=<data.go.kr service key>
CRON_SECRET=<random secret string>
PUBLIC_DATA_LIBRARY_API_URL=http://api.data.go.kr/openapi/tn_pubr_public_lbrry_api
```

Notes:

- `PUBLIC_DATA_SERVICE_KEY` is present in Vercel production and the debug endpoint confirms `hasServiceKey: true`.
- `CRON_SECRET` was initially wrong (`sk_live...`) but was corrected to a random value.
- `PUBLIC_DATA_LIBRARY_API_URL` was added to try HTTP instead of HTTPS.
- Changing Vercel env vars requires a Production redeploy.

For the Expo app later:

```text
EXPO_PUBLIC_LIBRARY_API_URL=https://today-library-sigma.vercel.app/api/libraries
```

This is public app config and belongs in the Expo/EAS build environment or local `.env.local` when testing the app.

## Local Status

Local Vercel dev works when env vars are exported before running:

```shell
cd /Users/dobedub/Documents/source/project/today-library
source ~/.nvm/nvm.sh
nvm use 20
set -a && source .env.local && set +a && npm run api:dev
```

Then check the port shown by Vercel dev, for example:

```shell
curl http://localhost:3001/api/libraries
```

Local result: public data JSON was successfully returned.

## Production Status

Landing page now works:

```text
https://today-library-sigma.vercel.app/
```

But the production API still fails:

```text
https://today-library-sigma.vercel.app/api/libraries
```

Current error:

```json
{"error":"LIBRARY_DATA_FETCH_FAILED","message":"Public data fetch failed ... ECONNRESET ..."}
```

Diagnostic endpoint:

```text
https://today-library-sigma.vercel.app/api/debug/public-data
```

Latest diagnostic result with HTTPS endpoint:

```json
{
  "ok": false,
  "endpoint": "https://api.data.go.kr/openapi/tn_pubr_public_lbrry_api",
  "hasServiceKey": true,
  "message": "TypeError: fetch failed cause={\"errno\":-104,\"code\":\"ECONNRESET\",\"syscall\":\"read\"}"
}
```

Latest diagnostic result with HTTP override:

```json
{
  "ok": false,
  "endpoint": "http://api.data.go.kr/openapi/tn_pubr_public_lbrry_api",
  "hasServiceKey": true,
  "message": "TypeError: fetch failed cause={\"errno\":-104,\"code\":\"ECONNRESET\",\"syscall\":\"read\"}"
}
```

Conclusion: this is not a missing key problem. Vercel production can read the key, but the outbound request from Vercel to `api.data.go.kr` is reset by the remote side or an intermediate network/TLS layer.

## Git History Notes

Recent relevant commits:

```text
e2c57d8 Add Vercel landing page
8e29960 Add public data API diagnostics
```

The latest commit pushed to GitHub includes the diagnostic endpoint.

## Next Things To Try

### 1. Inspect Vercel runtime logs

Use Vercel dashboard:

```text
Project > Logs
```

Trigger:

```text
/api/debug/public-data
/api/libraries
```

Look for runtime, region, and full stack/cause around `ECONNRESET`.

### 2. Force a Node runtime / region if possible

Try pinning the function region closer to Korea/Japan if Vercel supports it for this project/plan.

Potential `vercel.json` direction to research/try:

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 15,
      "regions": ["hnd1"]
    }
  }
}
```

Need to verify whether `regions` is accepted for the current Vercel plan/runtime.

### 3. Try an alternate fetch implementation

If Vercel/Node fetch keeps getting reset, try `https` module with keep-alive disabled or explicit agent settings.

Possible idea:

- Use Node `https.request` for data.go.kr endpoint.
- Disable connection reuse.
- Add `Connection: close` header.

The current code already adds:

```text
User-Agent: today-library/1.0
Accept: application/json
```

A next simple code change would be adding:

```text
Connection: close
```

### 4. Put a proxy in front of data.go.kr

If Vercel continues failing but local works, use another small backend just for data.go.kr fetch:

- Cloudflare Worker
- Firebase / Google Cloud Function
- Supabase Edge Function
- AWS Lambda in ap-northeast-2 or ap-northeast-1

Then set Vercel `PUBLIC_DATA_LIBRARY_API_URL` or replace the fetch source with that proxy.

### 5. Cache static JSON as fallback

For MVP, run the fetch locally or from a successful environment and publish a daily JSON file to Vercel `public/` or another storage. The app can read cached JSON while server-to-server data.go.kr fetch is being resolved.

Possible file:

```text
public/data/libraries.json
```

Then app URL can temporarily be:

```text
https://today-library-sigma.vercel.app/data/libraries.json
```

But this loses automatic daily refresh until cron/cache generation is fixed.

## Helpful Commands

Check type safety:

```shell
source ~/.nvm/nvm.sh
nvm use 20
npm run typecheck
```

Deploy manually with current terminal token:

```shell
source ~/.nvm/nvm.sh
nvm use 20
npx vercel --prod --scope dayainows-projects --token "$VERCEL_TOKEN"
```

Check debug endpoint after deploy:

```shell
curl https://today-library-sigma.vercel.app/api/debug/public-data
```

Check production API:

```shell
curl https://today-library-sigma.vercel.app/api/libraries
```

## Do Not Commit

Do not commit:

- `.env.local`
- `.vercel/`
- Any public data API key
- Any Vercel token
