-- Run this in CockroachDB SQL shell or Cloud Console

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property Module
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_type TEXT NOT NULL,
  preferred_location TEXT NOT NULL,
  area_size TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  additional_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  property_type TEXT NOT NULL,
  location TEXT NOT NULL,
  area_size TEXT NOT NULL,
  selling_price NUMERIC NOT NULL,
  description TEXT NOT NULL,
  image_urls TEXT[],
  video_urls TEXT[],
  availability_status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Matrimonial Module
CREATE TABLE IF NOT EXISTS matrimonial_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  religion TEXT,
  caste TEXT,
  education TEXT NOT NULL,
  occupation TEXT NOT NULL,
  annual_income TEXT,
  height TEXT,
  weight TEXT,
  complexion TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  profile_image_url TEXT,
  biodata_url TEXT,
  profile_status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matrimonial_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
  amount NUMERIC DEFAULT 500,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profile_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  liked_profile_id UUID REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, liked_profile_id)
);

-- E-Commerce Module
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total_amount NUMERIC NOT NULL,
  shipping_address TEXT NOT NULL,
  billing_address TEXT NOT NULL,
  payment_status TEXT DEFAULT 'PENDING',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  order_status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed sample categories and products
INSERT INTO categories (name, description) VALUES
  ('Dal', 'Lentils and pulses'),
  ('Rajma', 'Kidney beans'),
  ('Chana', 'Chickpeas')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, description, price, stock, category_id)
SELECT 'Toor Dal', 'Premium quality toor dal', 120, 500, id FROM categories WHERE name = 'Dal'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock, category_id)
SELECT 'Moong Dal', 'Green moong dal split', 110, 400, id FROM categories WHERE name = 'Dal'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock, category_id)
SELECT 'Red Rajma', 'Kashmiri red kidney beans', 150, 300, id FROM categories WHERE name = 'Rajma'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock, category_id)
SELECT 'Kabuli Chana', 'Large white chickpeas', 130, 350, id FROM categories WHERE name = 'Chana'
ON CONFLICT DO NOTHING;
