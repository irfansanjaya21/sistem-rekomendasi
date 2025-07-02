// Database Schema dan Connection
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

// Database Types
export interface Product {
  id: string
  name: string
  category: string
  subcategory?: string
  brand: string
  price: number
  original_price?: number
  discount?: number
  rating: number
  sold_count: number
  review_count: number
  location: string
  shop_name: string
  shop_rating: number
  features: string[]
  tags: string[]
  description: string
  image_url?: string
  in_stock: boolean
  fast_delivery: boolean
  official_store: boolean
  created_at: string
  updated_at: string
  // Search optimization fields
  search_vector?: string
  popularity_score?: number
  quality_score?: number
}

export interface SearchFilters {
  category?: string
  subcategory?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  tags?: string[]
  inStock?: boolean
  officialStore?: boolean
}

export interface SearchIntent {
  query: string
  category?: string
  subcategory?: string
  brand?: string
  priceRange?: "budget" | "mid-range" | "premium"
  features: string[]
  priority: "price" | "quality" | "performance" | "balanced"
}
