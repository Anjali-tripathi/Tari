**File Overview**

- **What this file does:** `NavbarComponent` displays the top navigation bar including links, cart icon with badge, and user menu (profile/logout). It subscribes to authentication and cart observables to reflect current state.
- **Why this file exists:** To provide consistent navigation and user actions across the app.
- **Role in architecture:** Shared UI component used by the app shell.

**Imports**

- `AuthService` — provides `currentUser$` observable and `logout()`.
- `CartService` — provides `cartCount$` observable used for the cart badge.

**Key members & behavior**

- `currentUser$` and `cartCount$` are Observables assigned in `ngOnInit()` from `AuthService` and `CartService` respectively.
- `logout()` calls `AuthService.logout()` to clear session and navigate away.

**Template**

- Shows logo linking to `/`.
- Navigation links to `/menu`, `/about`, `/newArrival`, `/contact`.
- Cart icon uses `matBadge` bound to `cartCount$ | async` and hides badge when zero.
- User section: shows menu when logged in (`currentUser$ | async`) with links to profile, orders, admin/delivery panels when role matches, and logout button. When not logged in shows `Order Now` button.

**Programming concepts**

- Async pipe (`| async`) is used to unwrap Observables in templates and manage subscription lifecycle.
- Role-based UI: template uses `*ngIf=