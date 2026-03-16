
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { mockUsers } = require('../mockData');
const mongoose = require('mongoose');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const useMock = () => !mongoose.connections[0].readyState;


exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (useMock()) {
      const exists = mockUsers.find(u => u.email === email);
      if (exists) return res.status(400).json({ message: 'Email already registered.' });
      const user = { _id: Date.now().toString(), name, email, phone, password, role: 'user', isActive: true };
      mockUsers.push(user);
      const token = signToken(user._id);
      res.status(201).json({ token, user });
    } else {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already registered.' });
      const user = await User.create({ name, email, phone, password });
      const token = signToken(user._id);
      res.status(201).json({ token, user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (useMock()) {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (!user) return res.status(401).json({ message: 'Invalid email or password.' });
      if (user.isActive === false) return res.status(403).json({ message: 'Account deactivated.' });
      const token = signToken(user._id);
      res.json({ token, user });
    } else {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
      if (!user.isActive) return res.status(403).json({ message: 'Account deactivated.' });
      const token = signToken(user._id);
      res.json({ token, user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
