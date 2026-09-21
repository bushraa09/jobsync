#!/bin/sh
set -e

# Auto-generate AUTH_SECRET if not provided
if [ -z "$AUTH_SECRET" ]; then
  export AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
  echo "AUTH_SECRET was not set — generated a temporary secret for this container."
fi

# On Render, default the public URL to the one Render assigns.
if [ -z "$NEXTAUTH_URL" ] && [ -n "$RENDER_EXTERNAL_URL" ]; then
  export NEXTAUTH_URL="$RENDER_EXTERNAL_URL"
  echo "NEXTAUTH_URL not set — using RENDER_EXTERNAL_URL ($NEXTAUTH_URL)."
fi

# Run migrations as root (before switching users)
npx -y prisma@6.19.0 migrate deploy

# Optionally (re)create the demo account with sample data (SEED_DEMO=true).
# Never blocks startup: a failed seed only logs a warning.
if [ "$SEED_DEMO" = "true" ]; then
  echo "SEED_DEMO=true — seeding demo account..."
  npx -y tsx@4 prisma/seed.ts || echo "WARNING: demo seed failed; continuing without it."
fi

# Ensure upload directory exists (a mounted volume shadows the image's /data)
mkdir -p /data/files/resumes

# Fix /data permissions and run app as nextjs user
chown -R nextjs:nodejs /data
export HOME=/home/nextjs
exec su -s /bin/sh nextjs -c "HOSTNAME=0.0.0.0 PORT=${PORT:-3737} node server.js"
