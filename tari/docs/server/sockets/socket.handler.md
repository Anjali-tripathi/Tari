**File Overview**

- **What this file does:** `socket.handler.js` sets up Socket.io events for real-time order updates and delivery partner location broadcasting.
- **Why this file exists:** To enable push notifications for order status and live delivery tracking.
- **Role in architecture:** Real-time layer attached to the HTTP server via Socket.io.

**Events**

- Client → Server:
  - `join-order` (orderId): client joins a room for that order.
  - `update-location` ({ location, orderId }): delivery partner sends GPS updates.
  - `update-order-status` ({ orderId, status }): admin/delivery updates status.

- Server → Client:
  - `order-status-update` — sent to order room when status changes.
  - `delivery-location` — sent to order room when delivery partner updates location.

**Implementation details**

- Uses `socket.join('order:<orderId>')` to group sockets interested in a specific order.
- Emits updates with `io.to('order:<orderId>').emit(...)` for targeted broadcasts.
- Handles `disconnect` and `error` events for observability.

**Best practices / improvements**

- Authenticate sockets (e.g., with token in handshake) before allowing joins.
- Rate-limit location updates to avoid flooding.
- Store last-known locations in DB or cache if needed.

**Summary**

`socket.handler.js` manages real-time rooms and events to push order and location updates to connected clients.
