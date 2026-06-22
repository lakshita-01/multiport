const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
}, { timestamps: true });

const BuyerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  property_type: { type: String, required: true },
  preferred_location: { type: String, required: true },
  area_size: { type: String, required: true },
  budget_range: { type: String, required: true },
  additional_requirements: String,
}, { timestamps: true });

const SellerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

const PropertySchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  property_type: { type: String, required: true },
  location: { type: String, required: true },
  area_size: { type: String, required: true },
  selling_price: { type: Number, required: true },
  description: { type: String, required: true },
  image_urls: [String],
  video_urls: [String],
  availability_status: { type: String, default: 'available' },
}, { timestamps: true });

const MatrimonialProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  full_name: { type: String, required: true },
  gender: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  religion: String,
  caste: String,
  education: { type: String, required: true },
  occupation: { type: String, required: true },
  annual_income: String,
  height: String,
  weight: String,
  complexion: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  contact_number: { type: String, required: true },
  email: { type: String, required: true },
  profile_image_url: String,
  biodata_url: String,
  profile_status: { type: String, default: 'PENDING' },
}, { timestamps: true });

const MatrimonialPaymentSchema = new mongoose.Schema({
  profile_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MatrimonialProfile', required: true },
  amount: { type: Number, default: 500 },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  payment_status: { type: String, default: 'PENDING' },
  payment_date: Date,
}, { timestamps: true });

const ProfileChoiceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  liked_profile_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MatrimonialProfile', required: true },
}, { timestamps: true });
ProfileChoiceSchema.index({ user_id: 1, liked_profile_id: 1 }, { unique: true });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image_url: String,
}, { timestamps: true });

const CartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true });
CartSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_amount: { type: Number, required: true },
  shipping_address: { type: String, required: true },
  billing_address: { type: String, required: true },
  payment_status: { type: String, default: 'PENDING' },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  order_status: { type: String, default: 'PENDING' },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
  }],
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', UserSchema),
  Buyer: mongoose.model('Buyer', BuyerSchema),
  Seller: mongoose.model('Seller', SellerSchema),
  Property: mongoose.model('Property', PropertySchema),
  MatrimonialProfile: mongoose.model('MatrimonialProfile', MatrimonialProfileSchema),
  MatrimonialPayment: mongoose.model('MatrimonialPayment', MatrimonialPaymentSchema),
  ProfileChoice: mongoose.model('ProfileChoice', ProfileChoiceSchema),
  Category: mongoose.model('Category', CategorySchema),
  Product: mongoose.model('Product', ProductSchema),
  Cart: mongoose.model('Cart', CartSchema),
  Order: mongoose.model('Order', OrderSchema),
};
