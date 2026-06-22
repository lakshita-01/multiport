const express = require('express');
const { MatrimonialProfile, MatrimonialPayment, ProfileChoice } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

function getAge(dateOfBirth) {
  if (!dateOfBirth) return undefined;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
}

function mapProfile(profile) {
  const object = profile.toObject ? profile.toObject() : profile;
  return {
    ...object,
    id: object._id,
    name: object.name || object.full_name,
    full_name: object.full_name || object.name,
    age: object.age || getAge(object.date_of_birth),
    profile_image: object.profile_image || object.profile_image_url,
    profile_image_url: object.profile_image_url || object.profile_image,
    biodata_pdf: object.biodata_pdf || object.biodata_url,
    biodata_url: object.biodata_url || object.biodata_pdf,
  };
}

function normalizeProfileBody(body) {
  return {
    ...body,
    full_name: body.full_name || body.name,
    profile_image_url: body.profile_image_url || body.profile_image,
    biodata_url: body.biodata_url || body.biodata_pdf,
  };
}

router.post('/profiles', auth, async (req, res) => {
  try {
    const initialStatus = process.env.RAZORPAY_KEY_SECRET ? 'PENDING' : 'ACTIVE';
    const profile = await MatrimonialProfile.create({
      ...normalizeProfileBody(req.body),
      user_id: req.user.id,
      profile_status: initialStatus,
    });
    res.json({ ...mapProfile(profile), data: mapProfile(profile) });
  } catch (err) { res.status(500).json({ error: err.message, detail: err.message }); }
});

router.get('/profiles', auth, async (req, res) => {
  try {
    const profiles = await MatrimonialProfile.find({ profile_status: 'ACTIVE', user_id: { $ne: req.user.id } }).sort({ createdAt: -1 });
    res.json(profiles.map(mapProfile));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/my-profile', auth, async (req, res) => {
  try {
    const profile = await MatrimonialProfile.findOne({ user_id: req.user.id }).sort({ createdAt: -1 });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(mapProfile(profile));
  } catch (err) { res.status(500).json({ error: err.message, detail: err.message }); }
});

router.get('/profiles/all', auth, async (req, res) => {
  try {
    const profiles = await MatrimonialProfile.find().sort({ createdAt: -1 });
    res.json({ data: profiles.map(mapProfile) });
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
    const data = choices.map((c) => ({ choice_id: c._id, ...mapProfile(c.liked_profile_id || {}), created_at: c.createdAt }));
    res.json({ data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/my-choices', auth, async (req, res) => {
  try {
    const choices = await ProfileChoice.find({ user_id: req.user.id }).populate('liked_profile_id').sort({ createdAt: -1 });
    res.json(choices.map((c) => ({ choice_id: c._id, ...mapProfile(c.liked_profile_id || {}), created_at: c.createdAt })));
  } catch (err) { res.status(500).json({ error: err.message, detail: err.message }); }
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

router.post('/swipe', auth, async (req, res) => {
  try {
    if (req.body.action === 'like') {
      const choice = await ProfileChoice.findOneAndUpdate(
        { user_id: req.user.id, liked_profile_id: req.body.profile_id },
        { user_id: req.user.id, liked_profile_id: req.body.profile_id },
        { upsert: true, new: true }
      );
      return res.json({ data: choice, success: true });
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message, detail: err.message }); }
});

router.delete('/choices/:id', auth, async (req, res) => {
  try {
    await ProfileChoice.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
