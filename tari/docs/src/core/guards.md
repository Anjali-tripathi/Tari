**File Overview**

- **What this file does:** `guards.ts` defines route guards used to protect routes based on authentication and user roles: `AuthGuard`, `AdminGuard`, and `DeliveryGuard`.
- **Why this file exists:** To centralize navigation protection logic so route definitions can reference these guards to control access.
- **Role in architecture:** Routing/security layer used by `AppRoutingModule` or feature routing modules.

**Guards**

1. `AuthGuard` (CanActivate)
   - Purpose: allow navigation only if `AuthService.isAuthenticated()` returns `true`.
   - Behavior: if not authenticated, redirect to `/` and return `false`.

2. `AdminGuard` (CanActivate)
   - Purpose: allow navigation only if `AuthService.hasRole('admin')`.
   - Behavior: redirects to `/` when unauthorized.

3. `DeliveryGuard` (CanActivate)
   - Purpose: allow navigation only for users with role `delivery`.

**Programming concepts**

- `CanActivate` is an Angular router interface used to prevent navigation to routes.
- Guards are singleton services and can inject other services (like `AuthService`) to make decisions.

**Best practices / improvements**

- Consider showing a friendly message when redirecting unauthorized users.
- Use route data to parameterize required roles instead of having separate guard classes.

**Summary**

`guards.ts` provides simple, effective route protection based on authentication and roles.