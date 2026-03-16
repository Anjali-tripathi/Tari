const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { mockUsers } = require('../mockData');
const mongoose = require('mongoose');

// Verify JWT token
const useMock = () => !mongoose.connections[0].readyState;
const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized. No token.' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (useMock()) {
      user = mockUsers.find(u => u._id === decoded.id);
    } else {
      user = await User.findById(decoded.id).select('-password');
    }
    if (!user || user.isActive === false) {
      return res.status(401).json({ message: 'User not found or deactivated.' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Role-based access
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied. Required role: ${roles.join(', ')}` });
  }
  next();
};

module.exports = { protect, restrictTo };
