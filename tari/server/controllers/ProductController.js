const { Product } = require('../models');
const { mockProducts } = require('../mockData');
const mongoose = require('mongoose');

const useMock = () => !mongoose.connections[0].readyState;

exports.getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    let products = useMock() ? mockProducts : await Product.find({});
    
    if (category) products = products.filter(p => p.category === category);
    if (search) products = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginated = products.slice(start, end);
    
    res.json(paginated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCategories = async (req, res) => {
  try {
    const products = useMock() ? mockProducts : await Product.find({});
    const cats = [...new Set(products.map(p => p.category))];
    res.json(cats);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProduct = async (req, res) => {
  try {
    let p = useMock() ? 
      mockProducts.find(p => p._id === req.params.id) :
      await Product.findById(req.params.id);
      
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    if (useMock()) {
      const newProduct = { _id: Date.now().toString(), ...req.body };
      mockProducts.push(newProduct);
      res.status(201).json(newProduct);
    } else {
      const p = await Product.create(req.body);
      res.status(201).json(p);
    }
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    if (useMock()) {
      const idx = mockProducts.findIndex(p => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Product not found' });
      mockProducts[idx] = { ...mockProducts[idx], ...req.body };
      res.json(mockProducts[idx]);
    } else {
      const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!p) return res.status(404).json({ message: 'Product not found' });
      res.json(p);
    }
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (useMock()) {
      const idx = mockProducts.findIndex(p => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Product not found' });
      mockProducts.splice(idx, 1);
      res.json({ message: 'Product deleted' });
    } else {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted' });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
};
