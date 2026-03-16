**File Overview**

- **What this file does:** `user.routes.js` provides endpoints for authenticated users to manage addresses and update profile information.

**Routes**

- `POST /address` — add an address to the authenticated user's addresses array.
- `DELETE /address/:addressId` — remove an address by its subdocument id.
- `PATCH /me` — update authenticated user's `name` and `phone`.

**Middleware**

- All routes use `protect` to ensure the user is authenticated.

**Summary**

`user.routes.js` allows authenticated users to manage addresses and update profile fields.