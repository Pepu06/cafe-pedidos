/*
  # Orders Management Schema

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `table_number` (integer)
      - `status` (enum: pending, preparing, completed)
      - `total` (integer)
      - `created_at` (timestamp)
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `menu_item_id` (text)
      - `quantity` (integer)
      - `price` (integer)
      - `name` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since this is a local restaurant system)
*/

-- Create enum for order status
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'completed');

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  total integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id text NOT NULL,
  quantity integer NOT NULL,
  price integer NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Allow all to read orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to insert orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all to update orders"
  ON orders FOR UPDATE
  TO public
  USING (true);

-- Create policies for order items
CREATE POLICY "Allow all to read order items"
  ON order_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to insert order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);