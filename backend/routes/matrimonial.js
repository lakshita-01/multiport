const express = require('express');
const { MatrimonialProfile, MatrimonialPayment, ProfileChoice } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/profiles', auth, async (req, res) => {
  try {
    const profile = await MatrimonialProfile.create({ ...req.body, user_id: req.user.id, profile_status: 'PENDING' });
    res.json({ data: { ...profile.toObject(), id: profile._id } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/profiles', auth, async (req, res) => {
  try {
    const profiles = await MatrimonialProfile.find({ profile_status: 'ACTIVE', user_id: { $ne: req.user.id } }).sort({ createdAt: -1 });
    res.json({ data: profiles.map((p) => ({ ...p.toObject(), id: p._id })) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/profiles/all', auth, async (req, res) => {
  try {
    const profiles = await MatrimonialProfile.find().sort({ createdAt: -1 });
    res.json({ data: profiles.map((p) => ({ ...p.toObject(), id: p._id })) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/profiles/:id/status', auth, async (req, res) => {
  try {
    const profile = await MatrimonialProfile.findByIdAndUpdate(req.params.id, { profile_status: req.body.status }, { new: true });
    res.json({ data: profile });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/payments', auth, async (req, res) => {
  try {
    const { profile_id, razorpay_order_id, razorpay_payment_id } = req.body;
    await MatrimonialPayment.create({ profile_id, razorpay_order_id, razorpay_payment_id, payment_status: 'SUCCESS', payment_date: new Date() });
    await MatrimonialProfile.findByIdAndUpdate(profile_id, { profile_status: 'ACTIVE' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/choices', auth, async (req, res) => {
  try {
    const choices = await ProfileChoice.find({ user_id: req.user.id }).populate('liked_profile_id').sort({ createdAt: -1 });
    const data = choices.map((c) => ({ id: c._id, ...c.liked_profile_id?.toObject(), created_at: c.createdAt }));
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/choices', auth, async (req, res) => {
  try {
    const choice = await ProfileChoice.findOneAndUpdate(
      { user_id: req.user.id, liked_profile_id: req.body.liked_profile_id },
      { user_id: req.user.id, liked_profile_id: req.body.liked_profile_id },
      { upsert: true, new: true }
    );
    res.json({ data: choice });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/choices/:id', auth, async (req, res) => {
  try {
    await ProfileChoice.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
