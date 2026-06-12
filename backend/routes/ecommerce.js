const express = require('express');
const { Product, Category, Cart, Order } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Products
router.get('/products', async (req, res) => {
  try {
    const filter = req.query.search ? { name: new RegExp(req.query.search, 'i') } : {};
    const products = await Product.find(filter).populate('category_id', 'name').sort({ name: 1 });
    const data = products.map((p) => ({ ...p.toObject(), id: p._id, category_name: p.category_id?.name }));
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/products', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ data: { ...product.toObject(), id: product._id } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ data: { ...product.toObject(), id: product._id } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/products/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Categories
router.get('/categories', async (req, res) => {
  try {
    const data = await Category.find().sort({ name: 1 });
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Cart
router.get('/cart', auth, async (req, res) => {
  try {
    const items = await Cart.find({ user_id: req.user.id }).populate('product_id');
    const data = items.map((i) => ({
      id: i._id, quantity: i.quantity, product_id: i.product_id?._id,
      name: i.product_id?.name, price: i.product_id?.price,
      description: i.product_id?.description, image_url: i.product_id?.image_url, stock: i.product_id?.stock,
    }));
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/cart', auth, async (req, res) => {
  try {
    const item = await Cart.findOneAndUpdate(
      { user_id: req.user.id, product_id: req.body.product_id },
      { $inc: { quantity: 1 } },
      { upsert: true, new: true }
    );
    res.json({ data: item });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/cart/:id', auth, async (req, res) => {
  try {
    const item = await Cart.findOneAndUpdate({ _id: req.params.id, user_id: req.user.id }, { quantity: req.body.quantity }, { new: true });
    res.json({ data: item });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/cart/:id', auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/cart', auth, async (req, res) => {
  try {
    await Cart.deleteMany({ user_id: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Orders
router.post('/orders', auth, async (req, res) => {
  try {
    const { total_amount, shipping_address, billing_address, razorpay_order_id, razorpay_payment_id, items } = req.body;
    const order = await Order.create({
      user_id: req.user.id, total_amount, shipping_address, billing_address,
      razorpay_order_id, razorpay_payment_id, payment_status: 'SUCCESS', order_status: 'CONFIRMED', items,
    });
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: -item.quantity } });
    }
    await Cart.deleteMany({ user_id: req.user.id });
    res.json({ data: order });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/orders', auth, async (req, res) => {
  try {
    const data = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/orders/all', auth, async (req, res) => {
  try {
    const data = await Order.find().sort({ createdAt: -1 });
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/orders/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { order_status: req.body.order_status }, { new: true });
    res.json({ data: order });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
