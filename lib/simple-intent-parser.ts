// Intent parser untuk database sederhana
import type { SearchIntent } from "./simple-database"

export const parseSimpleIntent = (message: string): SearchIntent => {
  const lowerMessage = message.toLowerCase()

  const intent: SearchIntent = {
    query: message,
  }

  // Brand detection
  if (lowerMessage.includes("samsung")) {
    intent.brand = "Samsung"
  } else if (lowerMessage.includes("xiaomi")) {
    intent.brand = "Xiaomi"
  } else if (lowerMessage.includes("oppo")) {
    intent.brand = "Oppo"
  }

  // Category detection (saat ini hanya smartphone)
  if (lowerMessage.includes("smartphone") || lowerMessage.includes("hp") || lowerMessage.includes("handphone")) {
    intent.category = "Smartphone"
  }

  // Recommendation type detection
  if (lowerMessage.includes("murah") || lowerMessage.includes("termurah") || lowerMessage.includes("budget")) {
    intent.recommendationType = "Harga Termurah"
    intent.priceRange = "budget"
  } else if (
    lowerMessage.includes("kualitas") ||
    lowerMessage.includes("terbaik") ||
    lowerMessage.includes("premium")
  ) {
    intent.recommendationType = "Kualitas"
    intent.priceRange = "premium"
  } else if (lowerMessage.includes("laris") || lowerMessage.includes("populer") || lowerMessage.includes("penjualan")) {
    intent.recommendationType = "Penjualan Terbaik"
    intent.priceRange = "mid-range"
  }

  // Price range detection
  const priceMatches = message.match(/(\d+)\s*(juta|ribu|rb)/gi)
  if (priceMatches) {
    const priceMatch = priceMatches[0].toLowerCase()
    const number = Number.parseInt(priceMatch.match(/\d+/)?.[0] || "0")

    if (priceMatch.includes("juta")) {
      intent.maxPrice = number * 1000000
    } else if (priceMatch.includes("ribu") || priceMatch.includes("rb")) {
      intent.maxPrice = number * 1000
    }
  }

  // Specific price keywords
  if (lowerMessage.includes("under 5 juta") || lowerMessage.includes("di bawah 5 juta")) {
    intent.maxPrice = 5000000
    intent.priceRange = "budget"
  } else if (lowerMessage.includes("10-15 juta")) {
    intent.minPrice = 10000000
    intent.maxPrice = 15000000
    intent.priceRange = "mid-range"
  } else if (lowerMessage.includes("di atas 15 juta") || lowerMessage.includes("above 15 juta")) {
    intent.minPrice = 15000000
    intent.priceRange = "premium"
  }

  return intent
}

// Generate response berdasarkan hasil pencarian
export const generateSimpleResponse = (products: any[], intent: SearchIntent): string => {
  if (products.length === 0) {
    return "Maaf, saya tidak menemukan produk yang sesuai dengan kriteria Anda. Coba dengan kata kunci yang berbeda! 🤔"
  }

  const brandText = intent.brand ? ` dari ${intent.brand}` : ""
  const typeText = intent.recommendationType ? ` berdasarkan ${intent.recommendationType.toLowerCase()}` : ""

  const responses = [
    `🎯 Saya menemukan ${products.length} smartphone${brandText}${typeText} yang cocok untuk Anda!`,
    `✨ Perfect! Ada ${products.length} pilihan smartphone${brandText}${typeText} terbaik!`,
    `🚀 Berhasil! Saya sudah siapkan ${products.length} rekomendasi smartphone${brandText}${typeText}!`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
