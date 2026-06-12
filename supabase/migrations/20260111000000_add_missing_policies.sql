-- Allow authenticated users to update product stock (needed during checkout)
CREATE POLICY IF NOT EXISTS "Users can update product stock"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow admin to insert/update/delete categories and products
CREATE POLICY IF NOT EXISTS "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can manage categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Allow users to update order status (admin use)
CREATE POLICY IF NOT EXISTS "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
