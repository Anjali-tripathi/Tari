**File Overview**

- **What this file does:** `loading.interceptor.ts` toggles the global loading state for every outgoing HTTP request by using `LoadingService.show()` before the request and `hide()` after it completes (via `finalize`).
- **Why this file exists:** To automatically manage a global loading indicator without requiring manual show/hide calls in every component or service.
- **Role in architecture:** Global HTTP interceptor registered in `AppModule` providers.

**How it works**

- Calls `this.loading.show()` immediately in `intercept()`.
- Forwards the request and attaches `finalize(() => this.loading.hide())` to ensure `hide()` runs regardless of success or error.

**Programming concepts**

- `finalize`: RxJS operator that runs when an Observable completes or errors.
- Reference counting in `LoadingService` ensures correct behavior for concurrent requests.

**Best practices / improvements**

- Prevent spinner flicker by adding a small show-delay or minimum display time.

**Summary**

`loading.interceptor.ts` ensures the app's global loading indicator reflects active HTTP requests automatically.