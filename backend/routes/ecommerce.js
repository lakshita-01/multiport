const express = require('express');
const { Product, Category, Cart, Order } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

function mapProduct(product) {
  const object = product.toObject ? product.toObject() : product;
  return {
    ...object,
    id: object._id,
    image: object.image_url || object.image,
    category_name: object.category_id?.name || object.category_name,
  };
}

function mapCartItem(item) {
  const object = item.toObject ? item.toObject() : item;
  const product = object.product_id;
  return {
    id: object._id,
    cart_id: object._id,
    quantity: object.quantity,
    product_id: product?._id || object.product_id,
    name: product?.name || object.name,
    price: product?.price || object.price,
    description: product?.description || object.description,
    image: product?.image_url || object.image_url || object.image,
    image_url: product?.image_url || object.image_url,
    stock: product?.stock || object.stock,
  };
}

const sampleProducts = [
  {
    name: 'Toor Dal',
    description: 'Premium split pigeon peas for everyday cooking.',
    price: 160,
    stock: 50,
    image_url: '',
  },
  {
    name: 'Moong Dal',
    description: 'Clean yellow moong dal with a light, quick-cooking texture.',
    price: 145,
    stock: 40,
    image_url: '',
  },
  {
    name: 'Chana Dal',
    description: 'Nutty split chickpeas for dals, snacks, and sweets.',
    price: 120,
    stock: 60,
    image_url: '',
  },
  {
    name: 'Urad Dal',
    description: 'High-quality urad dal for idli, dosa, and rich curries.',
    price: 155,
    stock: 35,
    image_url: '',
  },
];

router.get('/products', async (req, res) => {
  try {
    const filter = req.query.search ? { name: new RegExp(req.query.search, 'i') } : {};
    let products = await Product.find(filter).populate('category_id', 'name').sort({ name: 1 });
    if (!products.length && !req.query.search) {
      await Product.insertMany(sampleProducts);
      products = await Product.find({}).populate('category_id', 'name').sort({ name: 1 });
    }
    const data = products.map(mapProduct);
    res.json(data);
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

router.get('/categories', async (req, res) => {
  try {
    const data = await Category.find().sort({ name: 1 });
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/cart', auth, async (req, res) => {
  try {
    const items = await Cart.find({ user_id: req.user.id }).populate('product_id');
    const data = items.map(mapCartItem);
    res.json({ items: data, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/cart', auth, async (req, res) => {
  try {
    const requestedItems = Array.isArray(req.body) ? req.body : [req.body];
    await Cart.deleteMany({ user_id: req.user.id });
    for (const requestedItem of requestedItems) {
      if (!requestedItem.product_id) continue;
      await Cart.create({
        user_id: req.user.id,
        product_id: requestedItem.product_id,
        quantity: requestedItem.quantity || 1,
      });
    }
    const items = await Cart.find({ user_id: req.user.id }).populate('product_id');
    const data = items.map(mapCartItem);
    res.json({ items: data, data });
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

router.post('/orders', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;
    const items = req.body.items || [];
    const productIds = items.map((item) => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } });
    const productById = new Map(products.map((product) => [String(product._id), product]));
    const normalizedItems = items.map((item) => {
      const product = productById.get(String(item.product_id));
      return {
        product_id: item.product_id,
        name: product?.name || item.name || item.product_name,
        quantity: item.quantity,
        price: product?.price || item.price || 0,
      };
    });
    const total_amount = req.body.total_amount || normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping_address = typeof req.body.shipping_address === 'string'
      ? req.body.shipping_address
      : JSON.stringify(req.body.shipping_address || {});
    const order = await Order.create({
      user_id: req.user.id, total_amount, shipping_address, billing_address: req.body.billing_address || shipping_address,
      razorpay_order_id, razorpay_payment_id, payment_status: 'SUCCESS', order_status: 'CONFIRMED', items: normalizedItems,
    });
    for (const item of normalizedItems) {
      await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: -item.quantity } });
    }
    await Cart.deleteMany({ user_id: req.user.id });
    res.json({ ...order.toObject(), id: order._id, data: order });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/orders', auth, async (req, res) => {
  try {
    const data = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json(data.map((order) => ({ ...order.toObject(), id: order._id, order_number: String(order._id).slice(-8) })));
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
