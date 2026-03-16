**File Overview**

- **What this file does:** `auth.middleware.js` provides authentication and authorization middleware for Express routes: `protect` verifies JWTs and attaches `req.user`; `restrictTo` enforces role-based access.
- **Why this file exists:** To centralize auth logic and reuse it across routes and controllers.
- **Role in architecture:** Middleware layer between routes and controllers.

**Imports**

- `jsonwebtoken` — to verify JWT tokens.
- `User` model — to fetch user data when in DB mode.
- `mockUsers` — demo users for mock mode.
- `mongoose` — used to decide whether to use mock data.

**Functions**

1. `useMock()` — returns true when no DB connection is present.

2. `protect(req, res, next)`
   - Purpose: Verify `Authorization: Bearer <token>` header, decode token, fetch user (mock or DB), attach `req.user`, call `next()`.
   - Errors: returns `401` if token missing/invalid or user not found.

3. `restrictTo(...roles)`
   - Purpose: middleware factory returning a function that checks `req.user.role` against allowed roles. If not allowed, returns `403`.

**Programming Concepts**

- Middleware pattern: functions that receive `(req, res, next)` and control request flow.
- JWT verification: ensures the token was signed by the server and is not expired.
- Role-based authorization: restricts endpoints to certain roles like `admin` or `delivery`.

**Best practices / improvements**

- Refresh token / token rotation for enhanced security.
- Use `express-jwt` or a centralized token validation utility for consistency.
- Log auth failures for security auditing.

**Summary**

`auth.middleware.js` secures routes by validating JWTs and enabling role-based restrictions, supporting both mock and DB modes.