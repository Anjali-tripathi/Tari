**File Overview**

- **What this file does:** `api.service.ts` is a lightweight HTTP wrapper that centralizes REST calls to the backend API. It builds URLs from `environment.apiUrl` and exposes typed helpers (`get`, `post`, `put`, `patch`, `delete`).
- **Why this file exists:** To avoid repeating base URL concatenation and common HTTP options across the app and provide a single place to extend behavior (e.g., add default headers).
- **Role in architecture:** Core service used by feature services to communicate with the backend.

**Imports**

- `HttpClient`, `HttpParams` from `@angular/common/http` — to perform HTTP requests and build query parameters.
- `environment` — holds runtime configuration such as `apiUrl`.

**Key methods**

- `get<T>(path, params?)` — builds `HttpParams` and makes a GET request to `${base}${path}`.
- `post<T>(path, body)` — POST request helper.
- `put`, `patch`, `delete` — corresponding HTTP methods.

**Notes**

- `get()` converts the `params` object into `HttpParams` by setting keys with non-null values. It does not deeply serialize arrays/objects — consider enhancing if needed.
- All calls return `Observable<T>` from Angular's `HttpClient` enabling subscription or `async`/`rx` usage.

**Best practices / improvements**

- Add centralized error handling or retry logic here if desired.
- Consider adding optional headers or per-request options.

**Summary**

`ApiService` simplifies backend calls by centralizing URL and param handling and returning typed Observables for use across the app.