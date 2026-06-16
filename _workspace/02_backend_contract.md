# Backend Contract: Today Library Launch Preparation

## Environment Variables
- Created `.env.production`.
- Contains: `EXPO_PUBLIC_LIBRARY_API_URL=https://today-library-sigma.vercel.app/api/libraries`.
- This ensures the production Expo app fetches data from the Vercel backend that we previously fixed via static JSON fallback.

## Build Config
- `eas.json` is configured for production autoIncrement.
- `app.json` has `com.ola.todaylibrar` and required location permissions.
