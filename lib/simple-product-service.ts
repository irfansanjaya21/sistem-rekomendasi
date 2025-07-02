// Product service untuk database sederhana
import { supabase, type SimpleProduct, type SearchIntent } from "./simple-database"

export class SimpleProductService {
  // Insert single product
  static async insertProduct(product: Omit<SimpleProduct, "id" | "created_at" | "updated_at">) {
    try {
      const { data, error } = await supabase.from("products").insert([product]).select().single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error inserting product:", error)
      return { success: false, error }
    }
  }

  // Bulk insert products
  static async bulkInsertProducts(products: Omit<SimpleProduct, "id" | "created_at" | "updated_at">[]) {
    try {
      const { data, error } = await supabase.from("products").insert(products).select()

      if (error) throw error
      return { success: true, data, count: data.length }
    } catch (error) {
      console.error("Error bulk inserting products:", error)
      return { success: false, error }
    }
  }

  // Smart search berdasarkan intent
  static async searchProducts(intent: SearchIntent, limit = 10): Promise<SimpleProduct[]> {
    try {
      let query = supabase.from("products").select("*")

      // Text search di semua field
      if (intent.query) {
        const searchTerms = intent.query.toLowerCase().split(" ")

        // Search di nama produk dan merk
        const searchConditions = searchTerms.map((term) => `search_text.ilike.%${term}%`).join(",")

        query = query.or(searchConditions)
      }

      // Filter berdasarkan brand/merk
      if (intent.brand) {
        query = query.ilike("merk", `%${intent.brand}%`)
      }

      // Filter berdasarkan kategori
      if (intent.category) {
        query = query.eq("kategori", intent.category)
      }

      // Filter berdasarkan tipe rekomendasi
      if (intent.recommendationType) {
        query = query.eq("rekomendasi_berdasarkan", intent.recommendationType)
      }

      // Filter berdasarkan range harga
      if (intent.priceRange) {
        query = query.eq("price_category", intent.priceRange)
      }

      // Filter harga custom
      if (intent.minPrice) {
        query = query.gte("harga", intent.minPrice)
      }
      if (intent.maxPrice) {
        query = query.lte("harga", intent.maxPrice)
      }

      // Sorting berdasarkan prioritas
      if (intent.recommendationType === "Harga Termurah") {
        query = query.order("harga", { ascending: true })
      } else if (intent.recommendationType === "Kualitas") {
        query = query.order("harga", { ascending: false }) // Asumsi harga tinggi = kualitas tinggi
      } else {
        // Default sorting untuk "Penjualan Terbaik" atau general
        query = query.order("id", { ascending: true })
      }

      const { data, error } = await query.limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error searching products:", error)
      return []
    }
  }

  // Get products berdasarkan kategori rekomendasi
  static async getProductsByRecommendationType(type: string, limit = 5): Promise<SimpleProduct[]> {
    try {
      let query = supabase.from("products").select("*").eq("rekomendasi_berdasarkan", type)

      // Sorting berdasarkan tipe
      if (type === "Harga Termurah") {
        query = query.order("harga", { ascending: true })
      } else if (type === "Kualitas") {
        query = query.order("harga", { ascending: false })
      } else {
        query = query.order("id", { ascending: true })
      }

      const { data, error } = await query.limit(limit)
      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting products by type:", error)
      return []
    }
  }

  // Get all brands
  static async getAllBrands(): Promise<string[]> {
    try {
      const { data, error } = await supabase.from("products").select("merk").order("merk")

      if (error) throw error

      // Get unique brands
      const uniqueBrands = [...new Set(data?.map((item) => item.merk) || [])]
      return uniqueBrands
    } catch (error) {
      console.error("Error getting brands:", error)
      return []
    }
  }

  // Get price statistics
  static async getPriceStats() {
    try {
      const { data, error } = await supabase.from("products").select("harga")

      if (error) throw error

      const prices = data?.map((item) => item.harga) || []
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      }
    } catch (error) {
      console.error("Error getting price stats:", error)
      return { min: 0, max: 0, avg: 0 }
    }
  }

  // Update product
  static async updateProduct(id: number, updates: Partial<SimpleProduct>) {
    try {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error updating product:", error)
      return { success: false, error }
    }
  }

  // Delete product
  static async deleteProduct(id: number) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error("Error deleting product:", error)
      return { success: false, error }
    }
  }
}
