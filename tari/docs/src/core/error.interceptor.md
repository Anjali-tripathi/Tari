**File Overview**

- **What this file does:** `error.interceptor.ts` handles HTTP errors centrally: logs out on 401, shows notifications for different error cases, and rethrows the error.
- **Why this file exists:** To centralize error handling and user feedback for failed HTTP requests.
- **Role in architecture:** Global HTTP interceptor that standardizes error responses UX.

**How it works**

- Uses RxJS `catchError` to inspect `HttpErrorResponse`.
- For 401: logs out via `AuthService` and shows 'Session expired' notification.
- For 403: shows 'permission' notification.
- For network failures (status 0): shows 'Cannot connect' notification.
- Otherwise: shows `err.error?.message` or a generic message.
- Rethrows the error using `throwError` so callers can handle specifics if needed.

**Best practices / improvements**

- Consider mapping server error codes to user-friendly messages centrally.
- Optionally log errors to remote monitoring service.

**Summary**

`error.interceptor.ts` provides consistent user-facing behavior for HTTP errors across the app.