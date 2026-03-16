/**
 * TARI Socket.io Handler
 *
 * Events:
 * CLIENT → SERVER:
 *   join-order         (orderId)            — User joins order room for updates
 *   update-location    ({ location, orderId }) — Delivery partner broadcasts GPS
 *   update-order-status ({ orderId, status }) — Admin/delivery updates status
 *
 * SERVER → CLIENT:
 *   order-status-update ({ status })         — Broadcast to order room
 *   delivery-location   ({ location })       — Broadcast to order room
 */

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins a room for their specific order
    socket.on('join-order', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined room: order:${orderId}`);
    });

    // Delivery partner broadcasts GPS location every ~5s
    socket.on('update-location', ({ location, orderId }) => {
      io.to(`order:${orderId}`).emit('delivery-location', { location });
    });

    // Order status changed (by admin or delivery partner)
    socket.on('update-order-status', ({ orderId, status }) => {
      io.to(`order:${orderId}`).emit('order-status-update', { status });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });

    socket.on('error', (err) => {
      console.error(`Socket error on ${socket.id}:`, err);
    });
  });
};
