// Database service untuk struktur sederhana
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Simple Product Type berdasarkan database Anda
export interface SimpleProduct {
  id: number
  merk: string
  nama_produk: string
  kategori: string
  rekomendasi_berdasarkan: string
  harga: number
  created_at?: string
  updated_at?: string
  search_text?: string
  price_category?: "budget" | "mid-range" | "premium"
}

export interface SearchIntent {
  query: string
  brand?: string
  category?: string
  recommendationType?: "Kualitas" | "Penjualan Terbaik" | "Harga Termurah"
  priceRange?: "budget" | "mid-range" | "premium"
  maxPrice?: number
  minPrice?: number
}
