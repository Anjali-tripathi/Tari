const router = require('express').Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { Order, DeliveryPartner } = require('../models');

router.use(protect, restrictTo('delivery'));

// Get my assigned orders
router.get('/orders', async (req, res) => {
  try {
    const partner = await DeliveryPartner.findOne({ userId: req.user._id });
    if (!partner) return res.status(404).json({ message: 'Delivery partner profile not found' });
    const orders = await Order.find({ deliveryPartnerId: partner._id, orderStatus: { $nin: ['delivered', 'cancelled'] } })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
    if (status === 'delivered') {
      await DeliveryPartner.findOneAndUpdate(
        { userId: req.user._id },
        { activeOrderId: null, isAvailable: true, $inc: { totalDeliveries: 1 } }
      );
    }
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
