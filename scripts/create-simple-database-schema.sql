-- Database Schema berdasarkan struktur yang Anda berikan
-- Untuk Supabase/PostgreSQL

-- Create products table sesuai struktur asli Anda
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    merk TEXT NOT NULL,
    nama_produk TEXT NOT NULL,
    kategori TEXT NOT NULL,
    rekomendasi_berdasarkan TEXT NOT NULL,
    harga BIGINT NOT NULL,
    -- Additional fields untuk optimization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Derived fields untuk search dan scoring
    search_text TEXT GENERATED ALWAYS AS (
        LOWER(merk || ' ' || nama_produk || ' ' || kategori || ' ' || rekomendasi_berdasarkan)
    ) STORED,
    price_category TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN harga < 5000000 THEN 'budget'
            WHEN harga BETWEEN 5000000 AND 15000000 THEN 'mid-range'
            ELSE 'premium'
        END
    ) STORED
);

-- Insert data dari tabel Anda
INSERT INTO products (merk, nama_produk, kategori, rekomendasi_berdasarkan, harga) VALUES
('Samsung', 'Samsung Galaxy S24 Ultra', 'Smartphone', 'Kualitas', 18999000),
('Samsung', 'Samsung Galaxy A54', 'Smartphone', 'Penjualan Terbaik', 5999000),
('Samsung', 'Samsung Galaxy M14', 'Smartphone', 'Harga Termurah', 2399000),
('Xiaomi', 'Xiaomi 14 Ultra', 'Smartphone', 'Kualitas', 15999000),
('Xiaomi', 'Redmi Note 13', 'Smartphone', 'Penjualan Terbaik', 3499000),
('Xiaomi', 'Redmi A3', 'Smartphone', 'Harga Termurah', 1299000),
('Oppo', 'Oppo Find X7', 'Smartphone', 'Kualitas', 16999000),
('Oppo', 'Oppo Reno11 F', 'Smartphone', 'Penjualan Terbaik', 4499000),
('Oppo', 'Oppo A18', 'Smartphone', 'Harga Termurah', 1699000);

-- Create indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_products_merk ON products(merk);
CREATE INDEX IF NOT EXISTS idx_products_kategori ON products(kategori);
CREATE INDEX IF NOT EXISTS idx_products_rekomendasi ON products(rekomendasi_berdasarkan);
CREATE INDEX IF NOT EXISTS idx_products_harga ON products(harga);
CREATE INDEX IF NOT EXISTS idx_products_price_category ON products(price_category);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(to_tsvector('indonesian', search_text));

-- Create function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
