"use client"

// Custom Hook untuk Product Operations
import { useState } from "react"
import type { Product, SearchIntent } from "@/lib/database"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchProducts = async (intent: SearchIntent) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        q: intent.query,
        ...(intent.category && { category: intent.category }),
        ...(intent.brand && { brand: intent.brand }),
        ...(intent.priceRange && { priceRange: intent.priceRange }),
        ...(intent.features.length > 0 && { features: intent.features.join(",") }),
      })

      const response = await fetch(`/api/products?${params}`)
      const result = await response.json()

      if (result.success) {
        setProducts(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to search products")
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const insertProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })

      const result = await response.json()
      return result
    } catch (err) {
      console.error("Insert error:", err)
      return { success: false, error: "Failed to insert product" }
    }
  }

  const bulkInsertProducts = async (products: Omit<Product, "id" | "created_at" | "updated_at">[]) => {
    try {
      const response = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      })

      const result = await response.json()
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
    insertProduct,
    bulkInsertProducts,
  }
}
