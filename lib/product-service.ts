// Product Service Layer
import { supabase, type Product, type SearchFilters, type SearchIntent } from "./database"

export class ProductService {
  // Insert single product
  static async insertProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            ...product,
            search_vector: this.generateSearchVector(product),
            popularity_score: this.calculatePopularityScore(product),
            quality_score: this.calculateQualityScore(product),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error inserting product:", error)
      return { success: false, error }
    }
  }

  // Bulk insert products
  static async bulkInsertProducts(products: Omit<Product, "id" | "created_at" | "updated_at">[]) {
    try {
      const processedProducts = products.map((product) => ({
        ...product,
        search_vector: this.generateSearchVector(product),
        popularity_score: this.calculatePopularityScore(product),
        quality_score: this.calculateQualityScore(product),
      }))

      const { data, error } = await supabase.from("products").insert(processedProducts).select()

      if (error) throw error
      return { success: true, data, count: data.length }
    } catch (error) {
      console.error("Error bulk inserting products:", error)
      return { success: false, error }
    }
  }

  // Smart search with AI-powered intent recognition
  static async searchProducts(intent: SearchIntent, limit = 10): Promise<Product[]> {
    try {
      let query = supabase.from("products").select("*")

      // Category filtering
      if (intent.category) {
        query = query.eq("category", intent.category)
      }

      if (intent.subcategory) {
        query = query.eq("subcategory", intent.subcategory)
      }

      // Brand filtering
      if (intent.brand) {
        query = query.ilike("brand", `%${intent.brand}%`)
      }

      // Price range filtering
      if (intent.priceRange) {
        const priceRanges = {
          budget: { min: 0, max: 5000000 },
          "mid-range": { min: 5000000, max: 15000000 },
          premium: { min: 15000000, max: 100000000 },
        }
        const range = priceRanges[intent.priceRange]
        query = query.gte("price", range.min).lte("price", range.max)
      }

      // Feature-based filtering
      if (intent.features.length > 0) {
        query = query.overlaps("tags", intent.features)
      }

      // Text search in name and description
      if (intent.query) {
        query = query.or(`name.ilike.%${intent.query}%,description.ilike.%${intent.query}%`)
      }

      // Stock filtering
      query = query.eq("in_stock", true)

      // Sorting based on priority
      switch (intent.priority) {
        case "price":
          query = query.order("price", { ascending: true })
          break
        case "quality":
          query = query.order("quality_score", { ascending: false })
          break
        case "performance":
          query = query.order("popularity_score", { ascending: false })
          break
        default:
          query = query.order("popularity_score", { ascending: false })
      }

      const { data, error } = await query.limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error searching products:", error)
      return []
    }
  }

  // Advanced filtering
  static async getProductsWithFilters(filters: SearchFilters, limit = 20): Promise<Product[]> {
    try {
      let query = supabase.from("products").select("*")

      if (filters.category) query = query.eq("category", filters.category)
      if (filters.subcategory) query = query.eq("subcategory", filters.subcategory)
      if (filters.brand) query = query.ilike("brand", `%${filters.brand}%`)
      if (filters.minPrice) query = query.gte("price", filters.minPrice)
      if (filters.maxPrice) query = query.lte("price", filters.maxPrice)
      if (filters.minRating) query = query.gte("rating", filters.minRating)
      if (filters.inStock !== undefined) query = query.eq("in_stock", filters.inStock)
      if (filters.officialStore !== undefined) query = query.eq("official_store", filters.officialStore)
      if (filters.tags && filters.tags.length > 0) query = query.overlaps("tags", filters.tags)

      const { data, error } = await query.order("popularity_score", { ascending: false }).limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error filtering products:", error)
      return []
    }
  }

  // Get trending products
  static async getTrendingProducts(category?: string, limit = 10): Promise<Product[]> {
    try {
      let query = supabase.from("products").select("*").eq("in_stock", true).order("sold_count", { ascending: false })

      if (category) {
        query = query.eq("category", category)
      }

      const { data, error } = await query.limit(limit)
      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting trending products:", error)
      return []
    }
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error updating product:", error)
      return { success: false, error }
    }
  }

  // Delete product
  static async deleteProduct(id: string) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error("Error deleting product:", error)
      return { success: false, error }
    }
  }

  // Helper methods
  private static generateSearchVector(product: Omit<Product, "id" | "created_at" | "updated_at">): string {
    return [
      product.name,
      product.brand,
      product.category,
      product.subcategory,
      product.description,
      ...product.tags,
      ...product.features,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
  }

  private static calculatePopularityScore(product: Omit<Product, "id" | "created_at" | "updated_at">): number {
    // Weighted score based on sales, reviews, and rating
    const salesScore = Math.min(product.sold_count / 1000, 10) // Max 10 points
    const reviewScore = Math.min(product.review_count / 100, 5) // Max 5 points
    const ratingScore = product.rating // Max 5 points

    return Number(((salesScore + reviewScore + ratingScore) / 3).toFixed(2))
  }

  private static calculateQualityScore(product: Omit<Product, "id" | "created_at" | "updated_at">): number {
    // Quality score based on rating, official store, and shop rating
    let score = product.rating * 0.6 // 60% weight
    score += product.shop_rating * 0.3 // 30% weight
    score += product.official_store ? 0.5 : 0 // 10% weight

    return Number(Math.min(score, 5).toFixed(2))
  }
}
