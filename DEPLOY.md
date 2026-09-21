# Deploying CareerTrack to Railway

CareerTrack uses **SQLite** stored as a single file, so the only hard requirement
of any host is a **persistent volume** mounted at `/data`. On Railway this takes
about 15 minutes and gives you a public HTTPS URL — ideal for a portfolio.

The repo already ships everything Railway needs:

- [`Dockerfile`](Dockerfile) — standalone Next.js build; database at `/data/dev.db`
- [`railway.json`](railway.json) — tells Railway to build the Dockerfile and health-check `/api/health`
- [`docker-entrypoint.sh`](docker-entrypoint.sh) — runs DB migrations and starts the server on Railway's `$PORT`
- [`/api/health`](src/app/api/health/route.ts) — unauthenticated 200 endpoint for the health check

---

## 1. Push the repo to GitHub

Railway deploys from a Git repo. Create one and push this project if you
haven't already.

## 2. Create the Railway project

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. Pick this repository. Railway detects `railway.json` and builds the Dockerfile
   automatically — no build settings to configure.

## 3. Add a persistent volume (this is what makes SQLite work)

1. Open the service → **Settings** (or the **Volumes** tab) → **Add Volume**.
2. Set the **mount path** to exactly:

   ```
   /data
   ```

   The SQLite database and uploaded resumes both live here and survive every
   restart and redeploy. Without this, your data resets on each deploy.

## 4. Set environment variables

Service → **Variables** → add the following (see [`.env.production.example`](.env.production.example)):

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `file:/data/dev.db` | Points at the volume. Required. |
| `NEXTAUTH_URL` | `https://<your-app>.up.railway.app` | Your Railway domain, no trailing slash. |
| `AUTH_TRUST_HOST` | `true` | Required behind Railway's proxy. |
| `AUTH_SECRET` | *(generate)* | `openssl rand -base64 32`. Set it — don't let it auto-generate, or users get logged out on every deploy. |
| `ENCRYPTION_KEY` | *(generate)* | `openssl rand -base64 32`. Must stay stable forever, or saved AI keys break. |
| `NODE_ENV` | `production` | |
| `TZ` | `America/Edmonton` | Your timezone. |

AI provider keys (`OPENAI_API_KEY`, etc.) are optional and can be added later in
the app's **Settings** page.

> Generate both secrets locally first:
> ```sh
> openssl rand -base64 32   # AUTH_SECRET
> openssl rand -base64 32   # ENCRYPTION_KEY
> ```

## 5. Get your domain and deploy

1. Service → **Settings → Networking → Generate Domain** (or add a custom domain).
2. Copy that URL into the `NEXTAUTH_URL` variable from step 4, then redeploy.
3. Open the URL, create your account on the signup page, and you're live.

---

## Notes & gotchas

- **Port** — Railway injects `$PORT`; the entrypoint binds to it automatically.
  Don't hardcode a port.
- **Migrations** — run automatically on every boot via `prisma migrate deploy`.
  No manual step.
- **First user** — there's no seeded admin; the first account you create is yours.
- **Backups** — your entire database is one file at `/data/dev.db`. To back up,
  download it from the volume (Railway CLI: `railway run cp /data/dev.db ./backup.db`)
  on a schedule.
- **Scaling** — SQLite is single-writer, so keep `numReplicas: 1` (already set in
  `railway.json`). This is perfect for a single-user portfolio app. To support
  many concurrent users later, switch the Prisma datasource to PostgreSQL and
  point `DATABASE_URL` at a Railway Postgres plugin — the schema ports over
  with minimal changes.

## Local production test (optional)

Before deploying, you can run the exact production image locally:

```sh
docker compose up --build
```

Then open http://localhost:3737. This builds from the local `Dockerfile`
(reflecting your renamed/rethemed app), not the upstream image.
