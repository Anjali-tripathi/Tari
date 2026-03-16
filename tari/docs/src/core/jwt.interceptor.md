**File Overview**

- **What this file does:** `jwt.interceptor.ts` attaches the JWT stored in `localStorage` to outgoing HTTP requests as the `Authorization: Bearer <token>` header.
- **Why this file exists:** To centralize token attachment so individual HTTP calls don't need to manually add auth headers.
- **Role in architecture:** Global HTTP interceptor registered in `AppModule` providers.

**How it works**

- Reads token via `StorageService.getToken()`.
- If a token exists, clones the outgoing `HttpRequest` and sets the `Authorization` header.
- Forwards the (possibly modified) request to the next handler.

**Programming concepts**

- `HttpInterceptor` interface: allows inspection/modification of outgoing requests.
- Immutability: `HttpRequest` is immutable so `req.clone()` is used to create a modified copy.

**Best practices / improvements**

- Exclude attaching tokens to external third-party URLs if needed.

**Summary**

`jwt.interceptor.ts` transparently attaches the saved JWT to all API requests for authenticated endpoints.