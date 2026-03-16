**File Overview**

- **What this file does:** `server.js` is the entry point for the backend Express server. It configures middleware, routes, MongoDB connection, static asset serving, socket.io integration, error handling, and starts the HTTP server.
- **Why this file exists:** To centralize server bootstrapping and configuration, wiring together middleware, routes, and sockets.
- **Role in architecture:** Application entry point / bootstrapper.

**Imports and environment**

- `express` — web framework for routing and middleware.
- `http` and `socket.io` — create HTTP server and attach WebSocket support for real-time features.
- `mongoose` — MongoDB ODM.
- `cors`, `helmet`, `morgan` — middleware for CORS, security headers, and logging respectively.
- `path` — Node core module for file path operations.
- `dotenv` — loads `.env` variables.

**Key areas**

1. Middleware setup: `helmet`, `cors`, body parsers, `morgan` in dev.
2. Static file serving: serves Angular assets at `/assets` with caching for images.
3. MongoDB connection: connects using `MONGODB_URI` and logs connection status; falls back to demo mode if it fails.
4. Routes: mounts API routes under `/api/*` for auth, products, orders, delivery, admin, users, payment.
5. Health check: `/api/health` returns `status: 'ok'`.
6. Error handling and 404 route: centralizes error responses.
7. Socket.io: loads the socket handler and passes `io`.
8. Server start: listens on `PORT`.

**Programming Concepts**

- Centralized error handler: captures thrown errors and returns JSON responses.
- CORS options: whitelist for local dev and allowing requests with no origin.
- Static assets: improves performance by setting caching headers.

**Best practices / improvements**

- Consider extracting configuration into a separate `config/` module.
- Add graceful shutdown handlers for SIGINT/SIGTERM to close DB and sockets.
- Add request rate limiting and production CORS settings.

**Summary**

`server.js` boots and configures the TARI backend, connects to MongoDB, mounts API routes, integrates socket.io, and starts listening for requests.
