**File Overview**

- **What this file does:** `AuthController.js` handles user authentication: registering new users, logging users in, and returning the currently authenticated user's profile.
- **Why this file exists:** To centralize authentication-related HTTP handlers and token generation logic.
- **Role in architecture:** Controller layer; routes in `server/routes/auth.routes.js` call these functions. It uses the `User` model and `mockData` for demo mode.

**Imports**

- `User` from `../models` — Mongoose model for user documents.
- `jsonwebtoken` — Node library to sign and verify JWTs.
- `mockUsers` from `../mockData` — in-memory users for demo mode.
- `mongoose` — used to check DB connection readiness.

**Key Helpers**

- `signToken(id)` — signs a JWT with `process.env.JWT_SECRET` and optional expiry.
- `useMock()` — returns `true` when MongoDB is not connected; switches controller to demo mode.

**Functions**

1. `register(req, res)`
   - Purpose: create a new user (mock or DB), return JWT and user object.
   - Process: validate uniqueness by email, create user, sign token, return `201`.
   - Errors: returns `400` if email exists; `500` for unexpected errors.

2. `login(req, res)`
   - Purpose: authenticate user with email and password.
   - Process: find user (mock or DB), compare password (DB uses `comparePassword`), check `isActive`, sign token, return token + user.
   - Errors: `401` for invalid credentials, `403` for deactivated accounts, `500` for server errors.

3. `getMe(req, res)`
   - Purpose: return `req.user` provided by `protect` middleware.

**Programming Concepts**

- JWTs: small signed tokens representing user identity — used to authenticate requests without server-side sessions.
- Password hashing: DB user passwords are hashed via model pre-save hook; `comparePassword` verifies.
- Demo/mock mode vs DB mode: allows running without MongoDB.

**API**

- POST `/api/auth/register` — body: `{ name, email, phone, password }` → returns `{ token, user }`.
- POST `/api/auth/login` — body: `{ email, password }` → returns `{ token, user }`.
- GET `/api/auth/me` — protected — returns current user.

**Best practices & improvements**

- Should validate input shape with a validation library.
- Limit login attempts to prevent brute force.
- Use secure cookie for token storage or set appropriate CORS/CSRF protections.

**Summary**

`AuthController.js` issues JWTs on successful registration/login and returns user info; it supports mock mode for local development.