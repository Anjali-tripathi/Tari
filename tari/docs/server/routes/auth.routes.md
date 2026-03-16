**File Overview**

- **What this file does:** `auth.routes.js` provides authentication-related HTTP routes: register, login, and fetching the current user.

**Routes**

- `POST /register` → `register` — create a new user.
- `POST /login` → `login` — authenticate and receive a JWT.
- `GET /me` → protected → `getMe` — returns current authenticated user's profile.

**Middleware**

- Uses `protect` for the `/me` route.

**Summary**

`auth.routes.js` wires authentication endpoints to `AuthController` and secures the user profile endpoint.