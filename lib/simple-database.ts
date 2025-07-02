// Database service untuk struktur sederhana
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let _client: SupabaseClient | null = null

export function supabase(): SupabaseClient {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      "Supabase env-vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project.",
    )
  }

  _client = createClient(url, key, { auth: { persistSession: false } })
  return _client
}

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
