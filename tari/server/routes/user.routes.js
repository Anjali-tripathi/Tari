const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { User } = require('../models');

router.use(protect);

// Add address
router.post('/address', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Remove address
router.delete('/address/:addressId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull(req.params.addressId);
    await user.save();
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update profile
router.patch('/me', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
