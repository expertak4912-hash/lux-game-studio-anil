# Strike Arena — Sports & Gaming CMS

A full-stack sports and gaming entertainment website with a complete admin panel/CMS.
Frontend, server and database layer live in **one deployable application**.

- **Frontend** — React 19 + TanStack Router, server-rendered
- **Server** — TanStack Start server functions on a Nitro Node server
- **Database** — MongoDB (Atlas or self-hosted)
- **Auth** — session cookies with server-side authorization
- **Media** — file uploads stored in MongoDB GridFS

Everything ships as a single Node process. There is no separate frontend and backend to deploy.

---

## Table of contents

1. [Requirements](#1-requirements)
2. [Node.js version](#2-nodejs-version)
3. [Installation](#3-installation)
4. [MongoDB setup](#4-mongodb-setup)
5. [Environment variables](#5-environment-variables)
6. [Local development](#6-local-development)
7. [Database seed](#7-database-seed)
8. [Build](#8-build)
9. [Production start](#9-production-start)
10. [Deploying to Vercel](#10-deploying-to-vercel)
11. [Other deployment options](#11-other-deployment-options)
12. [Admin setup](#12-admin-setup)
13. [Architecture](#architecture)
14. [Security model](#security-model)
15. [Troubleshooting](#troubleshooting)

---

## 1. Requirements

| Requirement | Version | Notes |
| --- | --- | --- |
| Node.js | **20.x or 22.x LTS** | 22 LTS recommended. Node 18 and below will not work. |
| npm | 10+ | Ships with Node 20/22. |
| MongoDB | 6.0+ | MongoDB Atlas free tier (M0) is enough. |

No other services are required. There is no Postgres, no Redis, and no object-storage account to
configure — uploaded files live in MongoDB.

---

## 2. Node.js version

This project requires **Node 20 or newer**. Vite 8, React 19, TanStack Start and the MongoDB
driver all depend on APIs that do not exist in older releases.

```bash
node -v      # must print v20.x.x or v22.x.x
npm -v       # must print 10.x or newer
```

If it prints something older, install the current LTS from <https://nodejs.org> and reopen your
terminal. On Windows, if `node -v` still reports the old version afterwards, an older install is
earlier in your `PATH` — check for `C:\Program Files (x86)\nodejs` and remove it from `PATH`, or
use [nvm-windows](https://github.com/coreybutler/nvm-windows):

```bash
nvm install 22
nvm use 22
```

The floor is declared in `package.json` under `engines`, so npm warns if it is not met.

> **npm 11 note:** npm 11 blocks package install scripts by default. If a build fails complaining
> about a missing esbuild binary, run `npm install-scripts approve esbuild`.

---

## 3. Installation

```bash
git clone <your-repo-url>
cd lux-game-studio
npm install
```

---

## 4. MongoDB setup

### Option A — MongoDB Atlas (recommended)

1. Create a free account at <https://www.mongodb.com/atlas> and create an **M0 (free)** cluster.
2. **Database Access** → *Add New Database User*. Use password authentication; save the credentials.
3. **Network Access** → *Add IP Address*.
   - For local development, *Add Current IP Address* is enough.
   - For **Vercel, Railway, Render and most PaaS hosts**, allow `0.0.0.0/0`. These platforms have
     no fixed egress IPs on lower tiers, so an IP allowlist cannot work. The database is still
     protected by its username and password. If you need IP restrictions, use a host with a static
     outbound IP (a VPS) or Atlas private endpoints on a paid tier.
4. **Database** → *Connect* → *Drivers* → copy the connection string:

   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

   **URL-encode special characters** in the password — `@` → `%40`, `#` → `%23`, `/` → `%2F`.

The database itself does not need to exist beforehand; it is created on first write.

### Option B — Local MongoDB

```bash
docker run -d --name mongo -p 27017:27017 mongo:7
```

Then use `MONGODB_URI=mongodb://localhost:27017`.

---

## 5. Environment variables

```bash
cp .env.example .env
```

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | ✅ | Connection string from step 4. |
| `MONGODB_DATABASE` | ✅ | Database name, e.g. `lux_game_studio`. Created automatically. |
| `AUTH_SECRET` | ✅ | Signing key for session cookies. **Minimum 32 characters.** |
| `PORT` | — | Port for `npm start`. Defaults to `3000`. |
| `NITRO_PRESET` | — | Build target. Defaults to `node-server`. Set to `vercel` on Vercel. |
| `SEED_ADMIN_EMAIL` | — | Creates the first admin during `npm run seed`. |
| `SEED_ADMIN_PASSWORD` | — | Password for that admin. Minimum 8 characters. |
| `MAX_UPLOAD_BYTES` | — | Upload size cap in bytes. Defaults to 10 MB. |

Generate a strong `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

> **Never commit `.env`.** It is git-ignored; only `.env.example` belongs in version control.
> Changing `AUTH_SECRET` signs every administrator out.

> ⚠️ **Do not put `NODE_ENV` in `.env`.** Vite injects this file's variables into the build, so
> `NODE_ENV=development` leaks into `npm run build` and emits React's *development* JSX runtime
> into the production bundle. The server then dies during SSR with `jsxDEV is not a function` and
> every page returns 500. Vite sets `NODE_ENV` correctly by itself, and your host sets it for the
> running server.

Nothing in `.env` reaches the browser. Only `VITE_`-prefixed variables would be, and this project
deliberately defines none — the database is reached exclusively from server code.

---

## 6. Local development

```bash
npm run dev
```

Open <http://localhost:8080>. Both client and server code hot-reload.

> The dev server uses port **8080** (set by the Vite config wrapper). The production server
> (`npm start`) uses `PORT`, default **3000**.

```bash
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint
npm run format      # Prettier
```

---

## 7. Database seed

```bash
npm run seed
```

Creates all indexes and inserts site settings, theme, navigation, homepage sections, hero slides,
sports, games, blog categories, FAQs, the `/cricket`, `/football` and `/tennis` pages, and demo
promotions/screenshots/available-sites.

The seed is **idempotent**: every record is matched on a natural key (`slug`, `path`, or the
settings id) and inserted only when missing. Re-running never duplicates content or overwrites
edits made in the admin panel.

To create the first administrator at the same time, set both variables in `.env` first:

```bash
SEED_ADMIN_EMAIL=you@example.com
SEED_ADMIN_PASSWORD=a-strong-password
```

---

## 8. Build

```bash
npm run build
```

Output goes to `.output/`:

- `.output/public/` — static client assets
- `.output/server/` — the Node server, with runtime dependencies traced in

---

## 9. Production start

**Always test the production build locally before deploying.**

```bash
npm run build
npm start
```

Runs `node --env-file-if-exists=.env .output/server/index.mjs` on `PORT` (default 3000).

> The `--env-file-if-exists` flag matters: the compiled server does **not** read `.env` on its own
> (Vite only loads it during `npm run dev`), so without it `npm start` fails with "Missing
> environment variable(s): MONGODB_URI". The `-if-exists` variant is safe on hosts like Vercel and
> Railway where no `.env` file is present and the platform injects real environment variables.

Walk the whole site — home page,
`/cricket`, `/blog`, a game detail page, the contact form, and the admin panel including an image
upload — before pushing anywhere.

---

## 10. Deploying to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Vercel, **Add New → Project** and import the repository.
3. Under **Settings → Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `MONGODB_URI` | your Atlas connection string |
   | `MONGODB_DATABASE` | `lux_game_studio` |
   | `AUTH_SECRET` | your generated secret |
   | `NITRO_PRESET` | `vercel` |
   | `NODE_ENV` | `production` |

4. Leave the build command and output directory on their defaults — Nitro's Vercel preset produces
   the layout Vercel expects.
5. In Atlas, ensure **Network Access** allows `0.0.0.0/0` (see step 4).
6. Deploy, then seed the production database from your machine:

   ```bash
   MONGODB_URI="<prod-uri>" MONGODB_DATABASE="<prod-db>" npm run seed
   ```

`NITRO_PRESET` is the **only** Vercel-specific setting, and it is an environment variable rather
than a code change. Nothing in `src/` knows which host it runs on.

---

## 11. Other deployment options

The default build (`node-server`) is a standard Node HTTP server, so every target below runs the
same artifact with no code changes.

### VPS (Ubuntu, etc.)

```bash
git clone <your-repo-url> && cd lux-game-studio
npm ci
npm run build
NODE_ENV=production PORT=3000 node --env-file-if-exists=.env .output/server/index.mjs
```

Keep it running with a process manager, and put nginx or Caddy in front for TLS:

```bash
npm i -g pm2
pm2 start .output/server/index.mjs --name lux-game-studio
pm2 save && pm2 startup
```

### Docker

```bash
docker build -t lux-game-studio .
docker run -d -p 3000:3000 --env-file .env lux-game-studio
```

Or with Compose:

```bash
docker compose up --build
```

### Railway / Render / Fly.io

Build command `npm run build`, start command `npm start`. Add the same environment variables as
Vercel but **omit `NITRO_PRESET`** so it stays on `node-server`. These platforms set `PORT`
themselves; the server honours it.

### AWS

Any Node-capable target works — Elastic Beanstalk, ECS/Fargate (use the Dockerfile), or EC2 with
the VPS instructions. For Lambda, set `NITRO_PRESET=aws-lambda`.

### Switching hosts later

Change `NITRO_PRESET` and redeploy. No application code changes.

> Nitro also supports `cloudflare-module`, but **Cloudflare Workers cannot run this app** — Workers
> has no raw TCP support, which the MongoDB driver requires. This is why the default preset was
> changed from Cloudflare to `node-server` during the MongoDB migration.

---

## 12. Admin setup

The admin panel is at **`/admin`**.

### First run

With no administrator in the database, `/admin/login` shows a one-time **setup form**. Enter an
email and a password of at least 8 characters to create the owner account. Once an admin exists the
form is permanently replaced by the normal sign-in form — the setup path re-checks the admin count
server-side on every submission, so it cannot be re-opened by a crafted request.

Alternatively create the admin non-interactively with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
(see step 7).

### What you can manage

| Area | Screens |
| --- | --- |
| Appearance | Theme, Backgrounds, Site Settings, Navigation, Footer |
| Homepage | Sections, Hero Slider |
| Content | Pages, Games, Sports, Blog Posts, Blog Categories, FAQ, Promotions, Available Sites, Screenshots |
| System | Media Library, Support, SEO, Messages |

### Resetting a forgotten password

There is no email-based reset flow. Remove the user from the `users` collection, then re-run
`npm run seed` with the seed admin variables set.

### Creating a page at any URL

**Admin → Pages** creates a page at any slug — `/cricket`, `/promotions-2026`, anything. Set the
status to *published* and it is live. Sports and games are reachable both at their canonical nested
URLs (`/sports/cricket`, `/games/roulette`) and at their short slug (`/cricket`), with a canonical
link pointing at the nested one.

---

## Architecture

```text
Browser
   │
   ▼
Full-stack app (one Node process)
   ├── React 19 + TanStack Router      src/routes, src/components
   ├── Server functions (RPC)          src/lib/*.functions.ts
   ├── Raw HTTP routes (file I/O)      src/server.ts → src/server/media
   ├── Auth + authorization            src/server/auth, src/lib/auth-middleware.ts
   ├── Database layer                  src/server/db
   └── Shared types                    src/shared
   │
   ▼
MongoDB Atlas
```

```text
src/
├── components/
│   ├── admin/      admin panel UI (a generic ResourceManager drives all 22 screens)
│   ├── site/       public website sections
│   └── ui/         shadcn/ui primitives
├── lib/            *.functions.ts = server RPC; everything else is client-side
├── routes/         file-based routing (public + /admin)
├── server/         SERVER ONLY — the build refuses to import this into the client bundle
│   ├── auth/       passwords, sessions
│   ├── db/         connection, collection registry, repository
│   └── media/      GridFS storage + /api/media handlers
└── shared/         types used on both sides
scripts/seed.ts     database seed
```

### Collections

22 Postgres tables were consolidated into 18 collections:

- The four singleton settings tables (`site_settings`, `theme_settings`, `support_settings`,
  `footer_settings`) became one **`settings`** collection keyed by `_id`.
- **`page_blocks`** is embedded in `pages.blocks[]` — it is only ever read with its page.
- Supabase's `auth.users` + `user_roles` became one **`users`** collection with a `role` field.
- `blog_posts.category_id` stays a reference to `blog_categories`.
- Uploaded files live in GridFS (`media.files` / `media.chunks`) with metadata in `media`.

---

## Security model

The previous version relied on Postgres Row Level Security, and the browser talked to the database
directly. MongoDB has no equivalent, so all of it moved into the application:

| Concern | Implementation |
| --- | --- |
| Database credentials | Server-only. The build's import-protection plugin fails if `src/server/**` is reachable from client code. |
| Passwords | scrypt (`node:crypto`) with a per-user salt and constant-time comparison. |
| Sessions | HS256 JWT in an **httpOnly**, `SameSite=Lax` cookie — unreadable by JavaScript. `Secure` in production. |
| Admin authorization | `requireAdmin` middleware on **every** admin server function. |
| Collection access | Allowlist in `src/server/db/collections.ts`; client-supplied names are always validated. |
| Query injection | Sort and filter fields are checked against allowlists; no user string reaches a query operator. |
| Input validation | `zod` schemas on every server-function input. |
| CSRF | `createCsrfMiddleware` on all server functions — load-bearing now that auth is cookie-based. |
| Rate limiting | Login (10 / 15 min) and contact form (5 / hour), per IP. |
| Uploads | Admin-only, MIME allowlist, size cap, sandboxed CSP on served files. |
| Rich text | Admin-authored HTML is sanitized before rendering (`src/lib/sanitize-html.ts`). |

Route guards such as `/admin`'s `beforeLoad` are **UX only**. Enforcement is server-side, so
bypassing the client router gains nothing.

**Rate-limiting caveat:** counters live in process memory. A single instance is fully covered, but
on serverless (Vercel) or multi-instance deployments each instance keeps its own counter, so the
effective limit is `limit × instances`. For a hard global limit, back `src/server/rate-limit.ts`
with MongoDB or Redis — the function signature is designed so only that file changes.

---

## Troubleshooting

**`Missing environment variable(s): MONGODB_URI, MONGODB_DATABASE`**
`.env` is missing or incomplete. Copy `.env.example` to `.env` and fill it in.

**`AUTH_SECRET is missing or shorter than 32 characters`**
Generate one with the command in section 5.

**`MongoServerSelectionError` / connection timeouts**
Your IP is not allowed in Atlas **Network Access**, or the password in `MONGODB_URI` is not
URL-encoded.

**Admin panel is empty after signing in**
The database has not been seeded. Run `npm run seed`.

**Uploads return 401**
Your session expired. Sign in again at `/admin/login`.

**Build fails with a missing esbuild binary**
npm 11 blocked its install script. Run `npm install-scripts approve esbuild`.

**Lint reports `Delete ␍` on every line**
Windows CRLF checkout. `.prettierrc` sets `endOfLine: "auto"` to handle this; make sure that
setting is intact.

**Old content still showing**
CMS reads are cached for 30 seconds. Wait, or hard-refresh.
