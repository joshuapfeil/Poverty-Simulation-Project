# Poverty Simulation — Hopefully everything to know

This repository contains a Node/Express backend (SQLite) and a Vite + React client in `client/`.
The project runs in development with two processes: the backend API (port 3000) and the Vite dev server (port 5173) - i think it's the same for y'all?

## Prerequisites
- Node.js (v16+ recommended; this repo was tested with Node 18+ / 22). Confirm with:

```powershell
node --version
npm --version
```

## First-time setup (one-time)
Open a PowerShell terminal and run the following from the project root:

```powershell
cd 'C:\Users\Owner\Documents\My Web Sites\Poverty-Simulation-Project' (or whatever your path is)
# Install server deps
npm install

# Install client deps
cd client
npm install

# Return to project root
cd ..
```

Notes:
- The project uses `sqlite3` and stores the DB at `model/database.sqlite3`. No extra DB server is required.

## Run in development (edit UI)
Open two terminals.

Terminal 1 — backend API (port 3000):

```powershell
cd 'C:\Users\Owner\Documents\My Web Sites\Poverty-Simulation-Project'
# start the API server
npm start
# or: node index.js
```

Terminal 2 — frontend dev server (Vite, port 5173):

```powershell
cd 'C:\Users\Owner\Documents\My Web Sites\Poverty-Simulation-Project\client'
npm run dev
```

Open the client at: http://localhost:5173

The Vite dev server proxies API requests such as `/families` to the backend (port 3000) so frontend code can call the API without CORS problems.

## Run production-style (single host on :3000)
This builds the client and serves the built `client/dist` statically via Express so everything is available on port 3000.

```powershell
cd 'C:\Users\Owner\Documents\My Web Sites\Poverty-Simulation-Project\client'
npm run build

cd ..
npm start

# Then open: http://localhost:3000
```

Notes:
- `npm start` runs `node index.js`, which will serve `client/dist` automatically if the folder exists.

## API (important endpoints)
- GET /families/ — list all families (returns JSON: { data: [...] })
- GET /families/:id — get single family
- POST /families/ — create family (JSON body: { name, bank_total })
- PUT /families/:id — update family (JSON body includes fields to update)
- DELETE /families/:id — delete family

```powershell
curl http://localhost:3000/families/
```

## Project layout (important files)
- `index.js` — Express server and API routes. Also configured to serve `client/dist` in production mode.
- `package.json` — root scripts: `npm start` and `npm run build` (builds client).
- `model/connection.js` — SQLite connection helper and query wrapper.
- `model/family.js` — families model (CRUD SQL functions). Database file: `model/database.sqlite3`.
- `client/` — Vite + React app. Important files:
  - `client/package.json` — client scripts (`dev`, `build`, `preview`).
  - `client/src/` — React source: `App.jsx`, `FamiliesAdmin.jsx`, `Login.jsx`, `FamilyView.jsx`, `CommunityView.jsx`, styles in `client/src/index.css`.
  - `client/vite.config.js` — dev proxy configuration forwarding `/families` to the backend.
  - `client/dist/` — created after `npm run build` (served by Express in prod).
- `public/` — legacy static pages (backups are in `public_backup/`). The React app replaced the legacy UI.

## Notes
- While editing React files, use `npm run dev` in `client/` for fast hot reload.
- If you change server code (`index.js` or `model/*.js`), restart the backend. Use `nodemon` (optional) for auto-restarts:

```powershell
npm i -D nodemon
npx nodemon index.js
```

- If the frontend shows errors about the API, verify the backend is running and reachable on http://localhost:3000.
- If you see a crash referencing `path-to-regexp` or *catch-all patterns, the server now uses middleware to return the React index.html for non-API GET routes — avoid adding Express route patterns like `app.get('*', ...)` which can trigger that error in some environments.

## Troubleshooting tips
- Port in use: if :3000 or :5173 are occupied, stop the process using them or change the port (update `index.js` or Vite config).
- Missing dependencies: run `npm install` in both root and `client/`.
- SQLite issues: ensure `model/database.sqlite3` is writable by your user. The project will create the DB file on first run if it doesn't exist.

## Quick checklist for opening the project
1. Clone the repo.
2. Run `npm install` (root) then `cd client && npm install`.
3. Start backend: `npm start` (root).
4. Start frontend: `npm run dev` (in `client/`) and open http://localhost:5173.


YUHHHH Let's start cookingggg
---

