# AI Interview Question Generator

## Setup

1. Install dependencies: `npm install`
2. Create local env file: `cp .env.example .env.local`
3. Fill required values: `DATABASE_URL`, `OPENAI_API_KEY`, PayPal vars, and `NEXT_PUBLIC_BASE_URL`
4. Generate Prisma client: `npx prisma generate`
5. Run migrations (requires reachable Postgres): `npx prisma migrate dev --name init`
6. Start app: `npm run dev`

## Local database

This project connects to the existing `emart-postgres` Docker container (port `5432`, user/password `postgres/postgres`) and uses a dedicated database `interview_ai`.

- Start it: `docker start emart-postgres`
- Stop it: `docker stop emart-postgres`
- Create the app DB (one-time): `docker exec -i emart-postgres psql -U postgres -c "CREATE DATABASE interview_ai"`
- Connect via psql: `docker exec -it emart-postgres psql -U postgres -d interview_ai`
- Reset migrations: `npx prisma migrate reset`

## Authentication

The app uses [Auth.js v5](https://authjs.dev) (NextAuth v5) with a Prisma adapter and two providers:

- **Credentials** — email + password (bcrypt hashed) via `/sign-up` and `/sign-in`.
- **Google OAuth** — needs credentials from the [Google Cloud Console](https://console.cloud.google.com/):
  1. Create an OAuth 2.0 Client ID (Web application).
  2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (and your prod URL).
  3. Copy the client id/secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` in `.env.local`.

Auth is **optional** for generating questions (anonymous users can still use `/generate`), but **required** for paying/unlocking and for the `/dashboard` history.

Generate a secret for local dev:

```bash
openssl rand -base64 32   # use the output as AUTH_SECRET
```

## Local webhook testing

PayPal webhooks cannot reach localhost directly. Use a tunnel:

1. Run `ngrok http 3000`
2. Configure PayPal sandbox webhook endpoint to `https://<ngrok-id>.ngrok.io/api/paypal-webhook`
3. Complete sandbox payment flow and wait for polling on `/results/[requestId]` to switch to unlocked state

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run type-check`
