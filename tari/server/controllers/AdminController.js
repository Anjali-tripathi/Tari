const { Order, User, Product, DeliveryPartner } = require('../models');

exports.getStats = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [totalOrders, totalUsers, activeDeliveries, ordersToday, revenueAgg, revTodayAgg] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments({ orderStatus: { $in: ['picked_up', 'on_the_way'] } }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([{ $match: { orderStatus: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: today }, orderStatus: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);
    res.json({
      totalOrders, totalUsers, activeDeliveries, ordersToday,
      totalRevenue: revenueAgg[0]?.total || 0,
      revenueToday: revTodayAgg[0]?.total || 0
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};
    const orders = await Order.find(query)
      .sort({ createdAt: -1 }).skip((page-1)*limit).limit(+limit)
      .populate('userId', 'name email').populate('deliveryPartnerId', 'name phone');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.assignDeliveryPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const [order] = await Promise.all([
      Order.findByIdAndUpdate(req.params.id, { deliveryPartnerId: partnerId }, { new: true }),
      DeliveryPartner.findByIdAndUpdate(partnerId, { activeOrderId: req.params.id, isAvailable: false })
    ]);
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find().populate('userId', 'name email phone');
    res.json(partners);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = { orderStatus: { $ne: 'cancelled' } };
    if (from && to) match.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    const data = await Order.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orders: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
