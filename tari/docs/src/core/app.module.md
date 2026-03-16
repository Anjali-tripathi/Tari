**File Overview**

- **What this file does:** `app.module.ts` is the root Angular module that bootstraps the application. It imports core platform modules, application-level feature modules (`CoreModule`, `SharedModule`), and registers global HTTP interceptors.
- **Why this file exists:** Angular apps require at least one root module where the application is bootstrapped. This file wires up app-wide providers, third-party modules, and the root component.
- **Role in architecture:** Root module / composition root. It ties together Angular platform modules, app modules, and global providers.

**Imports**

- `NgModule` from `@angular/core` — decorator to define Angular modules.
- `BrowserModule` from `@angular/platform-browser` — required for running the app in a browser; exports common directives and services.
- `BrowserAnimationsModule` — enables Angular animation support for Material and other animations.
- `HttpClientModule`, `HTTP_INTERCEPTORS` from `@angular/common/http` — HTTP client and token to register interceptors.
- `MatSnackBarModule` from `@angular/material/snack-bar` — Material snack-bar UI for brief messages.
- `AppRoutingModule` — application routing configuration.
- `AppComponent` — root component.
- `CoreModule` — app core (services, guards, interceptors configured here).
- `SharedModule` — shared components, pipes used across the app.
- `JwtInterceptor`, `ErrorInterceptor`, `LoadingInterceptor` — HTTP interceptors for auth header, error handling, and loading indicators.

**Module metadata**

- `declarations`: declares `AppComponent` as part of this module.
- `imports`: imports platform modules and feature modules to make their exported declarations/providers available app-wide.
- `providers`: registers three interceptors using the `HTTP_INTERCEPTORS` multi-provider token. Order matters: requests pass through interceptors in registration order; responses pass back in reverse.
  - `JwtInterceptor` attaches auth tokens to outgoing requests.
  - `ErrorInterceptor` centralizes HTTP error handling.
  - `LoadingInterceptor` toggles global loading state around HTTP calls.
- `bootstrap`: the root component that Angular should bootstrap (`AppComponent`).

**Programming Concepts (concise explanations)**

- Angular modules: organizational units that group components, directives, pipes, and providers. Use `@NgModule` to declare them.
- Providers and DI: services are registered in modules; Angular's dependency injection (DI) uses those providers to instantiate and inject services into components and other services.
- HTTP interceptors: special injectable classes that implement `HttpInterceptor` to intercept and modify HTTP requests/responses. They are registered with `HTTP_INTERCEPTORS` and `multi: true` to allow multiple.

**Where to look next**

- `CoreModule` ([src/app/core/core.module.ts](src/app/core/core.module.ts#L1)) — contains services and interceptors. 
- Interceptor implementations: `JwtInterceptor` ([jwt.interceptor.ts](src/app/core/interceptors/jwt.interceptor.ts#L1)), `ErrorInterceptor` ([error.interceptor.ts](src/app/core/interceptors/error.interceptor.ts#L1)), and `LoadingInterceptor` ([loading.interceptor.ts](src/app/core/interceptors/loading.interceptor.ts#L1)).

**Summary**

`app.module.ts` is the app bootstrap point: it imports required Angular and app modules, provides global interceptors, and bootstraps `AppComponent` so the Angular app can start.