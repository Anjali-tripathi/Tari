const router = require('express').Router();
const ctrl = require('../controllers/OrderController');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/', ctrl.createOrder);
router.get('/my', ctrl.getMyOrders);
router.get('/:id', ctrl.getOrder);

module.exports = router;
