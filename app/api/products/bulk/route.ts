// Bulk Insert API
import { type NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/product-service"

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json()

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: "Products array is required" }, { status: 400 })
    }

    // Validate each product
    const requiredFields = ["name", "category", "brand", "price", "shop_name"]
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      for (const field of requiredFields) {
        if (!product[field]) {
          return NextResponse.json(
            { success: false, error: `Product ${i + 1}: Missing required field: ${field}` },
            { status: 400 },
          )
        }
      }
    }

    const result = await ProductService.bulkInsertProducts(products)

    if (result.success) {
      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("Bulk Insert API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
