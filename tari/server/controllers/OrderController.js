const { Order, Product, User } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { items, addressId, paymentMethod, specialInstructions, paymentRef } = req.body;
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ message: `Product ${item.productId} not found` });
      if (!product.availability) return res.status(400).json({ message: `${product.name} is currently unavailable` });
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if (!address) return res.status(400).json({ message: 'Address not found' });

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      orderStatus: 'confirmed',
      deliveryAddress: address,
      specialInstructions,
      paymentRef
    });

    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 }).populate('deliveryPartnerId', 'name phone');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('deliveryPartnerId', 'name phone vehicleNumber currentLocation');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Only owner or admin/delivery can view
    if (order.userId.toString() !== req.user._id.toString() && req.user.role === 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
