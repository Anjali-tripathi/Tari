const router = require('express').Router();
const ctrl = require('../controllers/AdminController');
const productCtrl = require('../controllers/ProductController');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.use(protect, restrictTo('admin'));

router.get('/stats', ctrl.getStats);
router.get('/orders', ctrl.getAllOrders);
router.patch('/orders/:id/status', ctrl.updateOrderStatus);
router.patch('/orders/:id/assign', ctrl.assignDeliveryPartner);
router.get('/users', ctrl.getAllUsers);
router.get('/delivery-partners', ctrl.getDeliveryPartners);
router.get('/reports/sales', ctrl.getSalesReport);

// Product CRUD for admin
router.get('/products', productCtrl.getProducts);
router.post('/products', productCtrl.createProduct);
router.put('/products/:id', productCtrl.updateProduct);
router.delete('/products/:id', productCtrl.deleteProduct);

module.exports = router;
