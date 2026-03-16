const router = require('express').Router();
const ctrl = require('../controllers/ProductController');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/', ctrl.getProducts);
router.get('/categories', ctrl.getCategories);
router.get('/:id', ctrl.getProduct);
router.post('/', protect, restrictTo('admin'), ctrl.createProduct);
router.put('/:id', protect, restrictTo('admin'), ctrl.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), ctrl.deleteProduct);

module.exports = router;
