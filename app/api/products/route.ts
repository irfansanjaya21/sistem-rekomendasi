// API Routes untuk CRUD Operations
import { type NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/product-service"

// GET - Search products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || undefined
    const brand = searchParams.get("brand") || undefined
    const priceRange = searchParams.get("priceRange") as "budget" | "mid-range" | "premium" | undefined
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Parse features from comma-separated string
    const featuresParam = searchParams.get("features")
    const features = featuresParam ? featuresParam.split(",") : []

    const intent = {
      query,
      category,
      brand,
      priceRange,
      features,
      priority: "balanced" as const,
    }

    const products = await ProductService.searchProducts(intent, limit)

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST - Insert new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "category", "brand", "price", "shop_name"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const result = await ProductService.insertProduct(body)

    if (result.success) {
      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
