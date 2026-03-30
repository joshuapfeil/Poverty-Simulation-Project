# Poverty Simulation

This repository contains:

- a Node/Express backend with SQLite in `model/`
- a Vite + React client in `client/`
- legacy static files in `public/`

In development, the backend runs on port 3000 and the Vite dev server runs on port 5173.

## Prerequisites

- Node.js 18+ is the safest target for this repo
- npm

Confirm your versions with:

```powershell
node --version
npm --version
```

## First-time setup

From the project root:

```powershell
npm install
cd client
npm install
cd ..
```

Notes:

- The project uses `sqlite3` and stores data in `model/database.sqlite3`.
- No separate database server is required.
- Both the root and client folders include `package-lock.json` files.

## Run in development

Use two terminals.

Terminal 1 - backend API on port 3000 (from project root):

```powershell
# from your project root directory
node index.js
```

Terminal 2 - frontend dev server on port 5173 (from project root):

```powershell
# from your project root directory
cd client
npm run dev
```

Open the client at http://localhost:5173

The Vite dev server proxies `/families`, `/people`, and `/api` requests to the backend on port 3000.

Note about the root `start` script:

- `package.json` currently defines `npm start` as `node index.js && cd ./client && npm run dev`.
- Because `node index.js` keeps running, that script effectively starts the backend only unless the server exits.
- For normal development, use `node index.js` in one terminal and `npm run dev` in `client/` in a second terminal.

## Run production-style

This builds the React app into `client/dist` and then serves it through Express on port 3000.

```powershell
# from your project root directory
npm run build
node index.js
```

Then open http://localhost:3000

Notes:

- The backend serves `client/dist` automatically when that folder exists.
- The root `build` script runs `npm ci` in the root and in `client/`, then runs the client build.

## API overview

### Families

- `GET /families/` - list all families
- `GET /families/stream` - server-sent events stream for family updates
- `GET /families/:id` - get a single family
- `GET /families/search/:name` - search families by exact name, case-insensitive
- `POST /families/` - create a family
- `PUT /families/:id` - update a family
- `DELETE /families/:id` - delete a family

Example:

```powershell
curl http://localhost:3000/families/
```

### People

- `GET /people` - list all people
- `GET /people?family_id=1` - list people for one family
- `GET /people/:id` - get one person
- `POST /people` - create a person
- `PUT /people/:id` - update a person
- `DELETE /people/:id` - delete a person

### Transactions

- `POST /api/transactions/deposit`
- `POST /api/transactions/withdraw`
- `POST /api/transactions/pay-employee`
- `POST /api/transactions/pay-bill`
- `POST /api/transactions/set-status`

Transaction routes enforce positive amounts and currently reject values above 1000.

## Project layout

- `index.js` - Express server, API routes, legacy static file hosting, and production serving for `client/dist`
- `package.json` - root scripts for start, build, and test
- `model/connection.js` - SQLite connection helper that also creates required tables if missing
- `model/family.js` - families CRUD model
- `model/person.js` - people CRUD model
- `model/transactions.js` - transaction business logic and validations
- `scripts/check-transaction-limits.js` - small script for checking transaction amount bounds against a running server
- `client/package.json` - Vite client scripts
- `client/vite.config.js` - Vite config and dev proxy settings
- `client/src/` - React source files
- `public/` - legacy static assets still served by Express

## Notes

- While editing React files, run `npm run dev` in `client/` for hot reload.
- If you change backend files such as `index.js` or files in `model/`, restart the backend process.
- Optional auto-restart during backend work:

```powershell
npm i -D nodemon
npx nodemon index.js
```

- If the frontend shows API errors, verify the backend is reachable at http://localhost:3000.
- The server uses middleware, not a wildcard Express route, to return `client/dist/index.html` for non-API GET requests when the built client exists.

## Troubleshooting

- If port 3000 or 5173 is in use, stop the conflicting process or change the configured port.
- If dependencies are missing, run `npm install` in the root and `client/`.
- If `npm run build` fails, make sure the lockfiles are present because the script uses `npm ci`.
- If SQLite errors occur, ensure `model/database.sqlite3` is writable.

## Quick start

1. Run `npm install` in the project root.
2. Run `npm install` in `client/`.
3. Start the backend with `node index.js`.
4. Start the frontend with `npm run dev` in `client/`.
5. Open http://localhost:5173

