**File Overview**

- **What this file does:** `delivery.routes.js` provides delivery-partner-specific endpoints to view assigned orders and update order status. It is restricted to the `delivery` role.

**Routes**

- `GET /orders` → returns orders assigned to the authenticated delivery partner (not delivered/cancelled).
- `PATCH /orders/:id/status` → update order status; when marking `delivered`, the partner's profile is updated to clear `activeOrderId`, mark available, and increment `totalDeliveries`.

**Middleware**

- Applies `protect` and `restrictTo('delivery')` to all routes.

**Summary**

`delivery.routes.js` exposes delivery partner functionality and keeps actions restricted to delivery users.