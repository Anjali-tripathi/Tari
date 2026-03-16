**File Overview**

- **What this file does:** `order.routes.js` defines endpoints for creating orders and retrieving a user's orders. All routes are protected by authentication middleware.

**Routes**

- `POST /` → `createOrder` — create an order for the authenticated user.
- `GET /my` → `getMyOrders` — list authenticated user's orders.
- `GET /:id` → `getOrder` — retrieve a single order (access controlled in controller).

**Middleware**

- `protect` applied to the router to require authentication for all endpoints.

**Summary**

`order.routes.js` exposes order creation and retrieval endpoints and ensures only authenticated users can access them.