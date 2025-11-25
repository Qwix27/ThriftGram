# 🗄️ SUPABASE SETUP GUIDE - Complete Configuration

This guide walks you through setting up all database tables and configurations needed for ThriftGram's new features.

---

## 📋 What Tables Need to Be Created

1. **`product_tags`** — Tags for products (reviews & personalized feed)
2. **`reviews`** — Customer reviews and ratings
3. **`carts`** — Shopping cart items
4. **`orders`** — Purchase history
5. **`likes`** — Liked products (wishlist)

---

## 🚀 Step 1: Create `product_tags` Table

This table stores tags assigned to products by sellers.

### Go to Supabase Console:
1. Open your Supabase project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Create product_tags table
CREATE TABLE IF NOT EXISTS product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, tag)
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag);
CREATE INDEX IF NOT EXISTS idx_product_tags_category ON product_tags(category);

-- Enable RLS (Row Level Security)
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Everyone can read product tags" ON product_tags FOR SELECT USING (true);
CREATE POLICY "Shop owners can insert tags for their products" ON product_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products p
      INNER JOIN shops s ON p.shop_id = s.id
      INNER JOIN profiles pr ON s.owner_id = pr.id
      WHERE p.id = product_id AND pr.id = auth.uid()
    )
  );
CREATE POLICY "Shop owners can update their product tags" ON product_tags FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM products p
    INNER JOIN shops s ON p.shop_id = s.id
    INNER JOIN profiles pr ON s.owner_id = pr.id
    WHERE p.id = product_id AND pr.id = auth.uid()
  )
);
CREATE POLICY "Shop owners can delete their product tags" ON product_tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM products p
    INNER JOIN shops s ON p.shop_id = s.id
    INNER JOIN profiles pr ON s.owner_id = pr.id
    WHERE p.id = product_id AND pr.id = auth.uid()
  )
);
```

5. Click **Run** (or press `Ctrl+Enter`)

✅ **Result:** `product_tags` table created with indexes and RLS policies

---

## 🚀 Step 2: Create `reviews` Table

This table stores customer reviews and ratings for products.

```sql
-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Everyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert their own reviews" ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE
  USING (auth.uid() = user_id);
```

✅ **Result:** `reviews` table created with indexes and RLS policies

---

## 🚀 Step 3: Create `carts` Table

This table stores shopping cart items for customers.

```sql
-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_product_id ON carts(product_id);

-- Enable RLS
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own cart" ON carts FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into their cart" ON carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their cart" ON carts FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their cart" ON carts FOR DELETE
  USING (auth.uid() = user_id);
```

✅ **Result:** `carts` table created with indexes and RLS policies

---

## 🚀 Step 4: Create `orders` Table

This table stores purchase history and order details.

```sql
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  payment_intent_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own orders" ON orders FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE
  USING (auth.uid() = user_id);
```

✅ **Result:** `orders` table created with indexes and RLS policies

---

## 🚀 Step 5: Create `likes` Table

This table stores liked products (wishlist) for customers.

```sql
-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_product_id ON likes(product_id);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own likes" ON likes FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE
  USING (auth.uid() = user_id);
```

✅ **Result:** `likes` table created with indexes and RLS policies

---

## 📊 Complete Setup Script (All at Once)

If you prefer to run all tables at once, use this complete script:

```sql
-- 1. PRODUCT_TAGS TABLE
CREATE TABLE IF NOT EXISTS product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, tag)
);

CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag);
CREATE INDEX IF NOT EXISTS idx_product_tags_category ON product_tags(category);

ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read product tags" ON product_tags FOR SELECT USING (true);
CREATE POLICY "Shop owners can insert tags" ON product_tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM products p INNER JOIN shops s ON p.shop_id = s.id INNER JOIN profiles pr ON s.owner_id = pr.id WHERE p.id = product_id AND pr.id = auth.uid())
);
CREATE POLICY "Shop owners can update tags" ON product_tags FOR UPDATE USING (
  EXISTS (SELECT 1 FROM products p INNER JOIN shops s ON p.shop_id = s.id INNER JOIN profiles pr ON s.owner_id = pr.id WHERE p.id = product_id AND pr.id = auth.uid())
);
CREATE POLICY "Shop owners can delete tags" ON product_tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM products p INNER JOIN shops s ON p.shop_id = s.id INNER JOIN profiles pr ON s.owner_id = pr.id WHERE p.id = product_id AND pr.id = auth.uid())
);

-- 2. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- 3. CARTS TABLE
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_product_id ON carts(product_id);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own cart" ON carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into their cart" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their cart" ON carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their cart" ON carts FOR DELETE USING (auth.uid() = user_id);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  payment_intent_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- 5. LIKES TABLE
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_product_id ON likes(product_id);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own likes" ON likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);
```

---

## ✅ Verification Checklist

After running the scripts, verify all tables were created:

### In Supabase Console:

1. Go to **Table Editor**
2. You should see these new tables:
   - ✅ `product_tags`
   - ✅ `reviews`
   - ✅ `carts`
   - ✅ `orders`
   - ✅ `likes`

3. For each table, verify:
   - ✅ Columns exist
   - ✅ Data types are correct
   - ✅ Indexes are created (check **Indexes** tab)
   - ✅ RLS is enabled (check **Authentication** → **Policies**)

### Test with SQL Query:

```sql
-- Verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should show:
-- carts
-- likes
-- orders
-- product_tags
-- products
-- profiles
-- reviews
-- shops
```

---

## 🔒 Security & RLS Policies

All tables have **Row Level Security (RLS)** enabled with the following policies:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `product_tags` | Everyone | Shop owners only | Shop owners only | Shop owners only |
| `reviews` | Everyone | Authenticated users | Own reviews only | Own reviews only |
| `carts` | Own cart only | Own cart only | Own cart only | Own cart only |
| `orders` | Own orders only | Own orders only | Own orders only | Own orders only |
| `likes` | Own likes only | Own likes only | N/A | Own likes only |

---

## 🆘 Troubleshooting

### "Table already exists" error
- This is normal if you're re-running the script
- Use `CREATE TABLE IF NOT EXISTS` (already included)
- No action needed, just continue

### RLS policies not created
- Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Policies must be created after RLS is enabled
- Run policy creation SQL again

### Indexes not showing
- Indexes may take a moment to appear
- Refresh the Supabase console
- Query `SELECT * FROM pg_indexes WHERE tablename = 'product_tags';`

### Foreign key errors
- Ensure `products`, `profiles`, and `shops` tables exist
- Check that IDs match (UUID format)
- Verify tables are in `public` schema

---

## 📝 Manual Verification SQL

Run these queries to verify setup:

```sql
-- Check product_tags indexes
SELECT * FROM pg_indexes WHERE tablename = 'product_tags';

-- Check reviews constraints
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'reviews' AND constraint_type = 'UNIQUE';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'carts';

-- Count tables
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## 🎯 Next Steps

After creating all tables:

1. ✅ Tables created
2. ✅ Indexes added
3. ✅ RLS enabled
4. ✅ Policies configured

**Now:**
- Go back to your code
- All features are ready to use
- Test with sample data

---

## 📞 Support

If you encounter issues:

1. Check the **Logs** in Supabase console
2. Verify table structure: `Table Editor` → Table name
3. Check RLS policies: `Table Editor` → Table → **Policies** tab
4. Run verification SQL above
5. Ensure all tables reference correct existing tables

---

**Supabase Setup Complete!** 🎉

Your database is now ready for all ThriftGram features.
