**File Overview**

- **What this file does:** `admin.routes.js` exposes admin-specific endpoints for stats, order management, user and delivery partner views, sales reports, and product CRUD for admins.

**Routes**

- All routes are protected and restricted to `admin` role via middleware.
- `GET /stats` → admin stats
- `GET /orders` → list orders
- `PATCH /orders/:id/status` → update order status
- `PATCH /orders/:id/assign` → assign delivery partner
- `GET /users` → list users
- `GET /delivery-partners` → list delivery partners
- `GET /reports/sales` → get sales report
- Product CRUD endpoints prefixed with `/products` delegated to `ProductController`.

**Summary**

`admin.routes.js` centralizes admin operations and ensures only admins can access them.