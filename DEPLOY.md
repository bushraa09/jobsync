# Deploying CareerTrack

CareerTrack is a plain Next.js app with a single-file **SQLite** database, so it
runs on any Node.js host — no Docker needed. The repo ships everything two
free-tier platforms need:

| File | Purpose |
|---|---|
| [`render.yaml`](render.yaml) | Render Blueprint — one-click deploy |
| [`railway.json`](railway.json) | Railway build/start/health-check config |
| [`scripts/start.mjs`](scripts/start.mjs) | Production start: migrations → optional demo seed → `next start` |
| [`/api/health`](src/app/api/health/route.ts) | Unauthenticated 200 endpoint for health checks |

Two npm scripts do all the work:

```sh
npm run deploy:build   # npm ci --include=dev && prisma generate && next build
npm run deploy:start   # node scripts/start.mjs
```

---

## Deploying to Render (recommended, free)

### 1. Create the Blueprint

1. Push the repo to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Blueprint**.
3. Connect the GitHub repo. Render reads `render.yaml` and shows the `jobsync`
   web service with its env vars (`AUTH_SECRET` and `ENCRYPTION_KEY` are
   auto-generated). Click **Apply**.
4. Wait for the first build (~3–5 min). The service is **Live** once
   `/api/health` returns 200.

### 2. Open the app

Your URL is `https://jobsync-<hash>.onrender.com` (top of the service page).
Sign in with **Try the demo account** (`demo@jobsync.dev` / `demo1234`).

`NEXTAUTH_URL` is derived automatically from Render's `RENDER_EXTERNAL_URL`.
If you add a custom domain later, set `NEXTAUTH_URL` to it under
**Environment** and redeploy.

### Free-tier notes

- **No persistent disk** — the SQLite file lives on the instance, so all data
  resets on every deploy or restart. `SEED_DEMO=true` recreates the demo
  account on each boot, which is exactly what a portfolio needs. To keep real
  user data, upgrade the service to **Starter**, uncomment the `disk` block in
  `render.yaml` (mount path `/var/data`) and set
  `DATABASE_URL=file:/var/data/dev.db`.
- **Cold starts** — free services spin down after ~15 min idle; the first
  request afterwards takes 30–60 s. Mention this on your portfolio, or point a
  free uptime pinger at `/api/health`.
- **Private instance** — set `NEXT_PUBLIC_DEMO_LOGIN=false` to hide the demo
  button (build-time variable, so redeploy after changing it) and remove
  `SEED_DEMO`.

---

## Deploying to Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → pick this repo.
   Railway reads `railway.json` (Nixpacks build, `deploy:build` / `deploy:start`, health check).
2. **Variables** — add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `file:./dev.db` (or `file:/data/dev.db` with a volume, see below) |
   | `AUTH_TRUST_HOST` | `true` |
   | `AUTH_SECRET` | `openssl rand -base64 32` |
   | `ENCRYPTION_KEY` | `openssl rand -base64 32` |
   | `SEED_DEMO` | `true` for the demo account |
   | `TZ` | your timezone |

   `NEXTAUTH_URL` is derived from `RAILWAY_PUBLIC_DOMAIN` once you generate a
   domain under **Settings → Networking**.
3. **Persistent data (optional)** — add a **Volume** mounted at `/data` and set
   `DATABASE_URL=file:/data/dev.db`. Without it, data resets on each deploy.

---

## Any other Node host (VPS, etc.)

```sh
git clone https://github.com/bushraa09/jobsync.git && cd jobsync
cp .env.production.example .env   # fill in AUTH_SECRET, ENCRYPTION_KEY, NEXTAUTH_URL
npm run deploy:build
SEED_DEMO=true npm run deploy:start   # listens on $PORT (default 3737)
```

Put it behind a reverse proxy (Caddy / nginx) for HTTPS, and run it under a
process manager such as `pm2` or a systemd unit.

## Notes & gotchas

- **Port** — the start script binds to `$PORT` (Render/Railway inject it) and
  falls back to 3737.
- **Migrations** — applied on every boot via `prisma migrate deploy`.
- **Backups** — the whole database is one file (`prisma/dev.db` or your volume
  path). Copy it on a schedule.
- **Scaling** — SQLite is single-writer; keep one instance.
