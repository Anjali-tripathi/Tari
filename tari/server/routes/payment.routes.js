const router = require('express').Router();
const ctrl = require('../controllers/PaymentController');
const { protect } = require('../middleware/auth.middleware');

router.post('/initiate', protect, ctrl.initiatePayment);
router.post('/verify', protect, ctrl.verifyPayment);
router.get('/status/:orderId', protect, ctrl.paymentStatus);

// UNCOMMENT WHEN RAZORPAY WEBHOOK IS CONFIGURED:
// router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.webhook);

module.exports = router;
