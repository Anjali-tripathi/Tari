**File Overview**

- **What this file does:** `AdminController.js` provides admin-only endpoints to inspect app-wide statistics, query and manage orders, users, delivery partners, and generate sales reports.
- **Why this file exists:** To group administrative operations and reporting, keeping them separate from user-facing logic.
- **Role in architecture:** Controller layer; routes in `server/routes/admin.routes.js` mount these functions behind `protect` and `restrictTo('admin')` middleware.

**Imports**

- `Order, User, Product, DeliveryPartner` from `../models` — Mongoose models for app data.

**Functions**

1. `getStats(req, res)`
   - Purpose: return aggregated statistics (total orders, users, active deliveries, today's orders, total revenue, today's revenue).
   - Implementation: uses `Promise.all` to run multiple DB counts/aggregations in parallel for performance.

2. `getAllOrders(req, res)`
   - Purpose: admin listing of orders with optional `status`, paginated via `page` and `limit` query params.
   - Uses `.skip()` and `.limit()` for DB-level pagination and `populate()` to include user and delivery partner info.

3. `updateOrderStatus(req, res)`
   - Purpose: change an order's `orderStatus` (admin action).

4. `assignDeliveryPartner(req, res)`
   - Purpose: assign a delivery partner to an order and mark partner as unavailable.
   - Implementation: uses `Promise.all` to perform order update and delivery partner update concurrently.

5. `getAllUsers(req, res)`
   - Purpose: list all users, excluding passwords.

6. `getDeliveryPartners(req, res)`
   - Purpose: list delivery partner profiles and populated user info.

7. `getSalesReport(req, res)`
   - Purpose: aggregate orders by date and compute daily order count and revenue, optionally filtered by `from` and `to` query params.

**Programming Concepts**

- Aggregation: using `Order.aggregate` to compute revenue sums and group by date.
- Pagination: DB-level via `skip` and `limit`.
- Parallel DB calls: `Promise.all` reduces total wait time.

**API**

- GET `/api/admin/stats` — admin stats
- GET `/api/admin/orders` — list orders (query: `status`, `page`, `limit`)
- PATCH `/api/admin/orders/:id/status` — update status
- PATCH `/api/admin/orders/:id/assign` — assign delivery partner with body `{ partnerId }`
- GET `/api/admin/users` — list users
- GET `/api/admin/delivery-partners` — list partners
- GET `/api/admin/reports/sales` — query sales report (query: `from`, `to`)

**Best practices / improvements**

- Add input validation for `page`, `limit`, `status`, and `partnerId`.
- Consider transactions when assigning partners and updating orders to ensure consistency.
- Cache expensive aggregations if needed.

**Summary**

`AdminController.js` centralizes admin operations and reporting with efficient DB queries and role-protected endpoints.