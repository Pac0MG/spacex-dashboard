# SpaceX Dashboard

A small SpaceX launches & rockets dashboard built with Vue 3 (Composition API),
Vue Router, Pinia and Axios, consuming the public
[SpaceX API](https://github.com/r-spacex/SpaceX-API) (v4) — or a local mock of
it, since the real API has a history of outages.

## Features

- **Launches** — paginated list, search by name or by year (switchable),
  filters by status (success / failure / upcoming), by year, and by
  favorites-only, with loading/error/empty states.
- **Next launch hero** — featured card at the top of the Launches page
  showing the closest upcoming launch, with a live countdown (days / hours /
  minutes / seconds) to liftoff.
- **Launch detail** — mission info, photo, and the associated rocket's data
  (fetched with a second API call), with its own loading skeleton that
  matches the page's layout instead of reusing the listing's card skeleton.
- **Rockets** — list with name, height, mass, country and active status.
- **Favorites** — mark/unmark launches as favorites, persisted in
  `localStorage`.
- **Dark mode** — toggle in the header, persisted in `localStorage` (falls
  back to the OS preference on first visit).
- **Login / sign up** — accounts stored in SQLite. Sign up with a name,
  username, email, password and an optional profile photo; log in with your
  email or username plus your password. Passwords need at least 9 characters,
  1 uppercase letter and 1 special character (shown as a live checklist while
  typing). Every page (Launches, Rockets, launch details…) requires a session
  — visitors are sent to the login page first and returned to where they were
  headed after logging in.
- **Forgot / reset password** — request a reset link by email; the link is
  valid for 1 hour and lets you choose a new password.
- **Profile** — change or remove your profile photo, or delete your account
  (asks for your password to confirm).
- **404 page** — friendly "not found" screen for any URL that doesn't match a
  known route, with a link back to Launches.

## Tech stack

- [Vue 3](https://vuejs.org/) (`<script setup>`, Composition API)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) (setup stores)
- [Axios](https://axios-http.com/)
- [Vite](https://vitejs.dev/)

## Prerequisites

- [Node.js](https://nodejs.org/) 22.13 or later (includes npm) — the auth
  API uses Node's built-in `node:sqlite` module

## Project structure

This dashboard is the frontend only. It expects a SpaceX-API-shaped backend
to talk to — either the real `https://api.spacexdata.com/v4` (when it's up)
or the local mock server that ships alongside this project
(`spacex-mock-server`), which returns the same shape of data.

```
spacex-dashboard/      this project (frontend)
spacex-mock-server/    local mock of the SpaceX API v4 (sibling project)
```

## Installation

1. Install the frontend's dependencies:

   ```bash
   cd spacex-dashboard
   npm install
   ```

2. Install the mock server's dependencies:

   ```bash
   cd spacex-mock-server
   npm install
   ```

## Running the project

The frontend needs two backends: the mock SpaceX API and the auth API (login
/ sign up, backed by SQLite). Start both **first**, then the frontend, each in
its own terminal.

**1. Start the mock API** (from `spacex-mock-server/`):

```bash
npm start
```

Runs at `http://localhost:4010`. Add `?fail=true` to any endpoint to
simulate a `500` error (useful for testing the app's error/retry state).

**2. Start the auth API** (from `spacex-dashboard/`):

```bash
npm run server
```

Runs at `http://localhost:3001`. The SQLite database is created
automatically at `server/data/app.db` (git-ignored). The Vite dev server
proxies `/api` to it, so the session cookie stays same-origin.

**3. Start the frontend** (from `spacex-dashboard/`):

```bash
npm run dev
```

Runs at `http://localhost:5173` and opens automatically in the browser. By
default it talks to the local mock server above — no extra configuration
needed.

## Configuration (optional)

The frontend's API base URL can be overridden with an environment variable,
in case you want to point it at the real SpaceX API instead of the local
mock:

```bash
# spacex-dashboard/.env.local
VITE_API_BASE_URL=https://api.spacexdata.com/v4
```

Without this file, it defaults to the local mock server
(`http://<host>:4010/v4`).

The auth API reads `spacex-dashboard/.env` (git-ignored) if it exists:

```bash
# Send password reset emails over SMTP. Without SMTP_HOST, the reset link is
# printed to the auth API's console instead — enough for local development.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your-app-password
MAIL_FROM=you@example.com

# Base URL used in reset links (default: http://localhost:5173)
APP_URL=http://localhost:5173

# Optional overrides
PORT=3001                     # auth API port (also update the proxy in vite.config.js)
DB_PATH=server/data/app.db    # SQLite database file
```

## Available scripts

Run from `spacex-dashboard/`:

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Starts the Vite dev server with hot reload |
| `npm run server`  | Starts the auth API (SQLite) on port 3001  |
| `npm run server:dev` | Same, but restarts on file changes      |
| `npm run build`   | Builds the app for production into `dist/` |
| `npm run preview` | Serves the production build locally        |

Run from `spacex-mock-server/`:

| Command       | Description                                      |
| ------------- | ------------------------------------------------ |
| `npm start`   | Starts the mock API server on port 4010          |
| `npm run dev` | Same, but restarts automatically on file changes |

## Notes

- **Auth.** Passwords are hashed with `crypto.scrypt`. Sessions are random
  tokens stored in SQLite and sent as an HttpOnly cookie (7-day expiry).
  Login and "forgot password" give the same answer whether or not an account
  exists, so they can't be used to find out who is registered. Only a SHA-256
  hash of each reset token is stored; resetting a password signs the account
  out everywhere. Accounts created before passwords were added have no
  password and can't log in — sign up again.
- The password rules are checked on the server (`server/index.js`) and
  mirrored in `src/utils/passwordRules.js` for the live checklist — change
  both together.

- Favorites and the dark mode preference are stored in the browser's
  `localStorage`, so they're per-browser and won't sync across devices.
- If you change store files (`src/store/**/*.js`) while the dev server is
  running and something starts behaving oddly, do a full browser reload
  (not just save-triggered hot reload) — Pinia's hot module reload can
  occasionally get out of sync with newly added state.
- API errors are caught centrally by an Axios response interceptor
  (`src/services/api.js`), which shows a custom toast notification
  (`src/store/ui/toast.js` + `src/components/layout/UseToast.vue`) with the error
  message, centered at the top of the page, auto-dismissing after 5 seconds
  or closeable manually. It reads both `error.response.data.message` and
  `error.response.data.error` (the mock server uses `error`), falling back
  to Axios's own message. This is on top of, not instead of, each store's
  own loading/error state — that state still drives the empty/error UI and
  retry buttons; the interceptor just adds one immediate heads-up so
  failures are never silent.
- All colors live as CSS custom properties defined once in `App.vue`
  (`:root` / `:root.dark`) — components never hardcode colors in their
  `<style>` blocks. This keeps dark mode consistent across the app and
  means a color tweak only has to happen in one place.
