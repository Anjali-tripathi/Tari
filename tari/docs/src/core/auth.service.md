**File Overview**

- **What this file does:** `auth.service.ts` manages authentication state in the Angular app: registering, logging in, logging out, storing tokens, and exposing the current user as an observable.
- **Why this file exists:** To centralize auth responsibilities (HTTP calls to `/auth`, local storage of token/user, and a reactive `currentUser$` stream) so components can react to auth changes.
- **Role in architecture:** Core service used by guards, interceptors, and components to determine authentication and user role.

**Imports**

- `HttpClient` for network calls, `Router` to navigate on logout.
- `BehaviorSubject` to hold and emit the current user.
- `StorageService` to persist token and user in `localStorage`.
- `environment.apiUrl` for backend base URL.

**Key behavior**

- On construction the service loads user from `StorageService` and seeds `currentUserSubject` so UI can immediately reflect logged-in state.
- `register` and `login` call backend and `tap()` into the response to call `handleAuthResponse`, which stores token/user and updates the `BehaviorSubject`.
- `logout` clears storage, resets subject, and navigates home.
- `isAuthenticated()` and `hasRole(role)` are convenience helpers used by guards/interceptors.

**Programming Concepts**

- `BehaviorSubject`: an RxJS subject that stores the latest value and emits it to new subscribers immediately.
- `tap()`: RxJS operator to perform side effects (storing token/user) without changing the stream.

**Best practices / improvements**

- Consider token expiry handling and refresh flows.
- Persist minimal user info in storage and re-fetch full profile when needed.

**Summary**

`AuthService` centralizes authentication logic, persistence, and a reactive current-user stream for use across the Angular app.