# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server on :5173 (host: true, so reachable from LAN), proxies /api -> 127.0.0.1:3001
npm run server       # Auth API on :3001 (loads .env if present)
npm run server:dev   # Same, with node --watch
npm run build        # Production build into dist/
npm run preview      # Serve the production build
```

There is no test runner, linter or formatter configured. Requires Node 22.13+ (the auth API uses the built-in `node:sqlite`).

The SpaceX data comes from a separate project, `spacex-mock-server`, which lives at `C:\DevVue\spacex-mock-server` on this machine (not a sibling of this repo, despite what the README layout suggests). Start it there with `npm start` (or `npm run dev`). It's an Express app on :4010 serving `GET /v4/launches`, `/v4/launches/:id`, `/v4/rockets`, `/v4/rockets/:id` from `data/*.json`; `?fail=true` on any endpoint forces a 500. Set `VITE_API_BASE_URL` in `.env.local` to point at the real `https://api.spacexdata.com/v4` instead.

To see the app with data, three processes must run: the mock server, `npm run server`, and `npm run dev`.

## Architecture

Vue 3 (`<script setup>`) + Vue Router + Pinia setup stores, plain JavaScript (no TypeScript). Two independent backends, each with its own client:

- **SpaceX data** — `src/services/api.js`: an Axios instance whose base URL defaults to `http://<window hostname>:4010/v4`. A response interceptor shows a toast (`store/ui/toast.js`) for every API error, reading `data.message` or `data.error`. Stores still keep their own `loading`/`error` state, which drives the empty/error/retry UI — the toast is in addition to that.
- **Auth** — `src/services/auth.js`: plain `fetch` to same-origin `/api/auth/*` (deliberately not Axios, so auth errors render inline on forms instead of as toasts). Errors are thrown with `status` and `fieldErrors` (the server's per-field `errors` object). A 502+ without a JSON body is reported as "auth server not running".

### Auth server (`server/`)

Dependency-free Node `http` server (only `nodemailer` is external). Routes are a `"METHOD /path" -> handler` map in `server/index.js`; handlers throw errors with a `.status` to produce that HTTP status. Listens on loopback only — the Vite proxy is what keeps the session cookie same-origin, so there is no CORS setup.

- `db.js` — SQLite at `server/data/app.db` (override with `DB_PATH`). Schema is created with `CREATE TABLE IF NOT EXISTS`; new columns on `users` are added via `PRAGMA table_info` + `ALTER TABLE` migrations, so follow that pattern rather than editing the `CREATE TABLE` alone.
- Sessions: random token in an HttpOnly `session` cookie, 7-day TTL, stored in `sessions`. Password reset tokens are stored only as SHA-256 hashes; one live reset per user, 60s resend cooldown, and a reset deletes all the user's sessions.
- `password.js` — scrypt hashes stored as `salt:key`; verification runs against a dummy hash when the user doesn't exist so timing doesn't leak accounts. Login and forgot-password deliberately return identical responses whether or not the account exists — preserve this.
- `mail.js` — sends via SMTP when `SMTP_HOST` is set (`.env`); otherwise prints the reset link to the server console. `APP_URL` controls the link base (never derived from the Host header).
- Avatars are base64 data URLs (JPEG/PNG/WebP only) stored directly in the `users.avatar` column.

### Cross-cutting rules

- **Password rules are duplicated**: `server/index.js` (`passwordError`, authoritative) and `src/utils/passwordRules.js` (live checklist in the UI). Change both together.
- **i18n (EN/PT)**: `vue-i18n` in Composition mode (`src/i18n/index.js`). Locale codes are `en-GB` and `pt-PT` and double as the Intl locale for dates and numbers. Use `d(date, "date" | "dateTime")` and `n(value)` / `n(value, "usd")`, not `toLocaleString`. The choice persists in `localStorage` through `store/ui/locale.js`. No UI text is hardcoded: add every key to **both** `src/i18n/locales/en.js` and `pt.js`, and write a literal `@ { } |` as `{'@'}`. Store `error` refs hold an i18n key, not text, and views render `t(store.error)`.
- **Server messages are translated separately** in `server/messages.js`. `services/auth.js` sends the UI locale as `Accept-Language`, and the server answers its errors and the reset email in that language (`localeFrom(req)` + `t(locale, key)`). Add new server error strings there in both languages.
- **Routing guard** (`src/router/index.js`): every route requires a session except those with `meta.guestOnly` (which bounce logged-in users to Launches). The guard awaits `auth.init()`, which restores the session from `/api/auth/me` once and memoizes the promise. Post-login redirects must go through `safeRedirect` in `src/router/redirect.js`.
- **Stores** live under `src/store/<domain>/`. Launches/rockets cache what they fetch (`fetchLaunches` is a no-op once loaded; `launchById` map for detail lookups); all filtering/searching is client-side via computed properties in the launches store. Favorites and theme persist to `localStorage` (wrapped in try/catch).
- **Colors**: all colors are CSS custom properties defined once in `App.vue` (`:root` and `:root.dark`; the theme store toggles the `dark` class on `<html>`). Components must not hardcode colors in their `<style>` blocks.
- After changing `src/store/**` with the dev server running, do a full browser reload if state looks wrong — Pinia HMR can get out of sync.
