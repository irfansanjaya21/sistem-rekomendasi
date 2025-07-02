"use client"

// Custom hook untuk simple products
import { useState } from "react"
import type { SimpleProduct, SearchIntent } from "@/lib/simple-database"
import { SimpleProductService } from "@/lib/simple-product-service"

export function useSimpleProducts() {
  const [products, setProducts] = useState<SimpleProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchProducts = async (intent: SearchIntent) => {
    setLoading(true)
    setError(null)

    try {
      const result = await SimpleProductService.searchProducts(intent, 10)
      setProducts(result)
    } catch (err) {
      setError("Failed to search products")
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getProductsByType = async (type: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await SimpleProductService.getProductsByRecommendationType(type, 5)
      setProducts(result)
    } catch (err) {
      setError("Failed to get products")
      console.error("Get products error:", err)
    } finally {
      setLoading(false)
    }
  }

  const insertProduct = async (product: Omit<SimpleProduct, "id" | "created_at" | "updated_at">) => {
    try {
      const result = await SimpleProductService.insertProduct(product)
      return result
    } catch (err) {
      console.error("Insert error:", err)
      return { success: false, error: "Failed to insert product" }
    }
  }

  const bulkInsertProducts = async (products: Omit<SimpleProduct, "id" | "created_at" | "updated_at">[]) => {
    try {
      const result = await SimpleProductService.bulkInsertProducts(products)
      return result
    } catch (err) {
      console.error("Bulk insert error:", err)
      return { success: false, error: "Failed to bulk insert products" }
    }
  }

  return {
    products,
    loading,
    error,
    searchProducts,
    getProductsByType,
    insertProduct,
    bulkInsertProducts,
  }
}
