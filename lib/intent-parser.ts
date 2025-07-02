export const parseUserIntent = (query: string) => {
  const intent: {
    query: string
    category?: string
    subcategory?: string
    brand?: string
    priceRange?: "budget" | "mid-range" | "premium"
    features: string[]
    priority: "price" | "quality" | "performance" | "balanced"
  } = {
    query: query,
    features: [],
    priority: "balanced",
  }

  query = query.toLowerCase()

  if (query.includes("smartphone")) {
    intent.category = "smartphone"
  } else if (query.includes("laptop")) {
    intent.category = "laptop"
  } else if (query.includes("sepatu")) {
    intent.category = "sepatu"
  }

  if (query.includes("gaming")) {
    intent.features.push("gaming")
  }

  if (query.includes("budget")) {
    intent.priceRange = "budget"
  } else if (query.includes("mid-range")) {
    intent.priceRange = "mid-range"
  } else if (query.includes("premium")) {
    intent.priceRange = "premium"
  }

  return intent
}
