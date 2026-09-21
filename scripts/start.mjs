// Production start script (no Docker): used by `npm run deploy:start` on
// Render / Railway / any Node host.
//
//   1. Defaults NEXTAUTH_URL / AUTH_SECRET when the host doesn't provide them
//   2. Applies pending Prisma migrations
//   3. Seeds the demo account when SEED_DEMO=true (never fatal)
//   4. Starts `next start` on $PORT
import { spawnSync, spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Resolve the local CLIs from each package's `bin` (no npx / .cmd shims, so it
// works on Windows too).
const require = createRequire(import.meta.url);
const cliOf = (pkg) => {
  const pkgJsonPath = require.resolve(`${pkg}/package.json`);
  const { bin: b } = require(pkgJsonPath);
  return join(dirname(pkgJsonPath), typeof b === "string" ? b : b[pkg]);
};
const bin = { prisma: cliOf("prisma"), tsx: cliOf("tsx"), next: cliOf("next") };
const run = (cli, args) =>
  spawnSync(process.execPath, [bin[cli], ...args], { stdio: "inherit", env: process.env });

if (!process.env.NEXTAUTH_URL && process.env.RENDER_EXTERNAL_URL) {
  process.env.NEXTAUTH_URL = process.env.RENDER_EXTERNAL_URL;
  console.log(`NEXTAUTH_URL not set — using RENDER_EXTERNAL_URL (${process.env.NEXTAUTH_URL}).`);
}
if (!process.env.NEXTAUTH_URL && process.env.RAILWAY_PUBLIC_DOMAIN) {
  process.env.NEXTAUTH_URL = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  console.log(`NEXTAUTH_URL not set — using RAILWAY_PUBLIC_DOMAIN (${process.env.NEXTAUTH_URL}).`);
}
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = randomBytes(32).toString("base64");
  console.warn("AUTH_SECRET was not set — generated a temporary secret; sessions reset on every restart.");
}
if (!process.env.AUTH_TRUST_HOST) process.env.AUTH_TRUST_HOST = "true";

console.log("Applying database migrations…");
const migrate = run("prisma", ["migrate", "deploy"]);
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

if (process.env.SEED_DEMO === "true") {
  console.log("SEED_DEMO=true — seeding demo account…");
  const seed = run("tsx", ["prisma/seed.ts"]);
  if (seed.status !== 0) console.warn("WARNING: demo seed failed; continuing without it.");
}

const port = process.env.PORT || "3737";
console.log(`Starting Next.js on port ${port}…`);
const server = spawn(process.execPath, [bin.next, "start", "-p", port, "-H", "0.0.0.0"], {
  stdio: "inherit",
  env: process.env,
});
server.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => server.kill(sig));
