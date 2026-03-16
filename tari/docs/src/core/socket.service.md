**File Overview**

- **What this file does:** `socket.service.ts` wraps a Socket.IO client to manage real-time connections and provide observable streams for order updates and delivery locations.
- **Why this file exists:** To centralize socket connection logic and provide a reactive API (Observables) consumable by Angular components and services.
- **Role in architecture:** Real-time/core service used by order tracking components and delivery features.

**Key methods**

- `connect()` — creates a Socket.IO client connected to `environment.socketUrl` and logs connection events.
- `joinOrderRoom(orderId)` — emit `join-order` for server to add the socket to a room.
- `listenOrderStatus()` / `listenDeliveryLocation()` — return Observables that emit server-sent events.
- `emitDeliveryLocation(...)` / `emitOrderStatusUpdate(...)` — send events to server.
- `disconnect()` — cleanly close socket.

**Programming concepts**

- Converts event-callback style socket API into RxJS Observables for easier composition in Angular.
- Ensures only one socket instance per service instance.

**Best practices / improvements**

- Add authentication on socket handshake to prevent unauthorized joins.
- Implement reconnection/backoff strategies if needed.

**Summary**

`SocketService` provides a simple, observable-based interface to the backend Socket.IO server for order and delivery real-time updates.