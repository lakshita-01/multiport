/*
  # Complete Multi-Module Application Schema

  ## Overview
  This migration creates the complete database schema for a unified portal with three main modules:
  - Property Purchase Module
  - Matrimonial Site Module
  - E-Commerce Module

  ## 1. Property Purchase Module Tables

  ### buyers
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `phone` (text)
  - `property_type` (text)
  - `preferred_location` (text)
  - `area_size` (text)
  - `budget_range` (text)
  - `additional_requirements` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### sellers
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `phone` (text)
  - `verification_status` (text, default 'pending')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### properties
  - `id` (uuid, primary key)
  - `seller_id` (uuid, references sellers)
  - `property_type` (text)
  - `location` (text)
  - `area_size` (text)
  - `selling_price` (numeric)
  - `description` (text)
  - `image_urls` (text[])
  - `video_urls` (text[])
  - `availability_status` (text, default 'available')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Matrimonial Site Module Tables

  ### matrimonial_profiles
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `full_name` (text)
  - `gender` (text)
  - `date_of_birth` (date)
  - `religion` (text)
  - `caste` (text)
  - `education` (text)
  - `occupation` (text)
  - `annual_income` (text)
  - `height` (text)
  - `weight` (text)
  - `complexion` (text)
  - `city` (text)
  - `state` (text)
  - `country` (text)
  - `contact_number` (text)
  - `email` (text)
  - `profile_image_url` (text)
  - `biodata_url` (text)
  - `profile_status` (text, default 'PENDING')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### matrimonial_payments
  - `id` (uuid, primary key)
  - `profile_id` (uuid, references matrimonial_profiles)
  - `amount` (numeric, default 500)
  - `razorpay_order_id` (text)
  - `razorpay_payment_id` (text)
  - `payment_status` (text, default 'PENDING')
  - `payment_date` (timestamptz)
  - `created_at` (timestamptz)

  ### profile_choices
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `liked_profile_id` (uuid, references matrimonial_profiles)
  - `created_at` (timestamptz)

  ## 3. E-Commerce Module Tables

  ### categories
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `created_at` (timestamptz)

  ### products
  - `id` (uuid, primary key)
  - `category_id` (uuid, references categories)
  - `name` (text)
  - `description` (text)
  - `price` (numeric)
  - `stock` (integer)
  - `image_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### cart
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `product_id` (uuid, references products)
  - `quantity` (integer, default 1)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### orders
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `total_amount` (numeric)
  - `shipping_address` (text)
  - `billing_address` (text)
  - `payment_status` (text, default 'PENDING')
  - `razorpay_order_id` (text)
  - `razorpay_payment_id` (text)
  - `order_status` (text, default 'PENDING')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### order_items
  - `id` (uuid, primary key)
  - `order_id` (uuid, references orders)
  - `product_id` (uuid, references products)
  - `quantity` (integer)
  - `price` (numeric)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add appropriate policies for authenticated users
  - Ensure data privacy and security across all modules
*/

-- Property Purchase Module

CREATE TABLE IF NOT EXISTS buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  property_type text NOT NULL,
  preferred_location text NOT NULL,
  area_size text NOT NULL,
  budget_range text NOT NULL,
  additional_requirements text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  verification_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES sellers(id) ON DELETE CASCADE,
  property_type text NOT NULL,
  location text NOT NULL,
  area_size text NOT NULL,
  selling_price numeric NOT NULL,
  description text NOT NULL,
  image_urls text[],
  video_urls text[],
  availability_status text DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Matrimonial Site Module

CREATE TABLE IF NOT EXISTS matrimonial_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  gender text NOT NULL,
  date_of_birth date NOT NULL,
  religion text,
  caste text,
  education text NOT NULL,
  occupation text NOT NULL,
  annual_income text,
  height text,
  weight text,
  complexion text,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL,
  profile_image_url text,
  biodata_url text,
  profile_status text DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matrimonial_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
  amount numeric DEFAULT 500,
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text DEFAULT 'PENDING',
  payment_date timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profile_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  liked_profile_id uuid REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, liked_profile_id)
);

-- E-Commerce Module

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  stock integer DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  total_amount numeric NOT NULL,
  shipping_address text NOT NULL,
  billing_address text NOT NULL,
  payment_status text DEFAULT 'PENDING',
  razorpay_order_id text,
  razorpay_payment_id text,
  order_status text DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables

ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE matrimonial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matrimonial_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Property Module

CREATE POLICY "Users can view all buyers"
  ON buyers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own buyer profile"
  ON buyers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own buyer profile"
  ON buyers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all sellers"
  ON sellers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own seller profile"
  ON sellers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own seller profile"
  ON sellers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view available properties"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sellers can insert their properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = properties.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can update their properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = properties.seller_id
      AND sellers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = properties.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete their properties"
  ON properties FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = properties.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

-- RLS Policies for Matrimonial Module

CREATE POLICY "Users can view active matrimonial profiles"
  ON matrimonial_profiles FOR SELECT
  TO authenticated
  USING (profile_status = 'ACTIVE' OR user_id = auth.uid());

CREATE POLICY "Users can insert own matrimonial profile"
  ON matrimonial_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own matrimonial profile"
  ON matrimonial_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own payment records"
  ON matrimonial_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matrimonial_profiles
      WHERE matrimonial_profiles.id = matrimonial_payments.profile_id
      AND matrimonial_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own payment records"
  ON matrimonial_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matrimonial_profiles
      WHERE matrimonial_profiles.id = matrimonial_payments.profile_id
      AND matrimonial_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own choices"
  ON profile_choices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add profile choices"
  ON profile_choices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own choices"
  ON profile_choices FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for E-Commerce Module

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own cart"
  ON cart FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart"
  ON cart FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create indexes for better performance

CREATE INDEX IF NOT EXISTS idx_properties_seller_id ON properties(seller_id);
CREATE INDEX IF NOT EXISTS idx_properties_availability ON properties(availability_status);
CREATE INDEX IF NOT EXISTS idx_matrimonial_profiles_status ON matrimonial_profiles(profile_status);
CREATE INDEX IF NOT EXISTS idx_matrimonial_profiles_user_id ON matrimonial_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_choices_user_id ON profile_choices(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
