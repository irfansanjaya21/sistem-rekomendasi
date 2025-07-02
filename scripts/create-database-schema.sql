-- Database Schema untuk Supabase/PostgreSQL
-- Jalankan script ini di Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    brand TEXT NOT NULL,
    price BIGINT NOT NULL,
    original_price BIGINT,
    discount INTEGER DEFAULT 0,
    rating DECIMAL(2,1) NOT NULL DEFAULT 0,
    sold_count INTEGER DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    location TEXT,
    shop_name TEXT NOT NULL,
    shop_rating DECIMAL(2,1) DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    description TEXT,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT true,
    fast_delivery BOOLEAN DEFAULT false,
    official_store BOOLEAN DEFAULT false,
    search_vector TEXT,
    popularity_score DECIMAL(3,2) DEFAULT 0,
    quality_score DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_popularity ON products(popularity_score);
CREATE INDEX IF NOT EXISTS idx_products_quality ON products(quality_score);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_features ON products USING GIN(features);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(to_tsvector('indonesian', search_vector));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create categories table for better organization
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Elektronik', 'elektronik', 'Smartphone, laptop, gadget elektronik', '📱'),
('Fashion', 'fashion', 'Pakaian, sepatu, aksesoris fashion', '👕'),
('Olahraga', 'olahraga', 'Peralatan olahraga dan fitness', '⚽'),
('Rumah Tangga', 'rumah-tangga', 'Peralatan rumah tangga dan dapur', '🏠'),
('Hobi', 'hobi', 'Buku, mainan, koleksi', '📚')
ON CONFLICT (slug) DO NOTHING;

-- Create user preferences table (optional)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    category_preferences JSONB DEFAULT '{}',
    brand_preferences JSONB DEFAULT '{}',
    price_preferences JSONB DEFAULT '{}',
    search_history TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT NOT NULL,
    intent JSONB,
    results_count INTEGER,
    user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
