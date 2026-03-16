**File Overview**

- **What this file does:** `storage.service.ts` is a small wrapper around `localStorage` for storing the auth token and the current user object.
- **Why this file exists:** To centralize storage keys and parsing logic (JSON) so other parts of the app don't duplicate this code.
- **Role in architecture:** Utility/core service used by `AuthService` and other services that need persistent storage.

**API**

- `setToken`, `getToken`, `removeToken`
- `setUser`, `getUser`, `removeUser`
- `clear()` — remove both token and user

**Notes**

- `getUser()` parses JSON and returns `null` when absent.
- Keys are prefixed (`tari_`) to avoid collisions.

**Best practices / improvements**

- Consider encrypting sensitive data for high-security apps.
- Use sessionStorage for temporary sessions if desired.

**Summary**

`StorageService` abstracts `localStorage` usage for authentication data, providing a consistent API to the rest of the app.