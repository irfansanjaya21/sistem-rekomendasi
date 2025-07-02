"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Bot,
  User,
  Star,
  ExternalLink,
  TrendingUp,
  ShoppingBag,
  Zap,
  Sparkles,
  Database,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useProducts } from "@/hooks/useProducts"
import { parseUserIntent } from "@/lib/intent-parser"

// Enhanced Product Database (Simulasi data Tokopedia yang lebih realistis)
const tokopediaProducts = [
  // Electronics
  {
    id: "tok_1",
    name: "iPhone 15 Pro Max 256GB Natural Titanium",
    category: "smartphone",
    subcategory: "flagship",
    brand: "Apple",
    price: 21999000,
    originalPrice: 23999000,
    discount: 8,
    rating: 4.8,
    sold: 2847,
    reviews: 1205,
    location: "Jakarta Pusat",
    shop: "iBox Official Store",
    shopRating: 4.9,
    features: ["5G", "Pro Camera", "Titanium", "A17 Pro", "Action Button"],
    tags: ["premium", "flagship", "photography", "gaming", "professional"],
    description: "iPhone terbaru dengan chip A17 Pro dan kamera pro yang revolusioner",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: true,
    officialStore: true,
  },
  {
    id: "tok_2",
    name: "Samsung Galaxy S24 Ultra 512GB Titanium Black",
    category: "smartphone",
    subcategory: "flagship",
    brand: "Samsung",
    price: 19999000,
    originalPrice: 21999000,
    discount: 9,
    rating: 4.7,
    sold: 1923,
    reviews: 892,
    location: "Jakarta Selatan",
    shop: "Samsung Official Store",
    shopRating: 4.8,
    features: ["S Pen", "200MP Camera", "AI Features", "5G", "Titanium Frame"],
    tags: ["flagship", "productivity", "photography", "AI", "stylus"],
    description: "Galaxy S terbaru dengan S Pen dan AI features yang canggih",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: true,
    officialStore: true,
  },
  {
    id: "tok_3",
    name: "Xiaomi 14 Ultra 16GB/512GB Black",
    category: "smartphone",
    subcategory: "flagship",
    brand: "Xiaomi",
    price: 15999000,
    originalPrice: 17999000,
    discount: 11,
    rating: 4.6,
    sold: 3456,
    reviews: 1567,
    location: "Jakarta Barat",
    shop: "Mi Store Official",
    shopRating: 4.7,
    features: ["Leica Camera", "Snapdragon 8 Gen 3", "120W Charging", "IP68"],
    tags: ["photography", "fast-charging", "flagship", "value"],
    description: "Flagship Xiaomi dengan kamera Leica dan performa maksimal",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: true,
    officialStore: true,
  },
  {
    id: "tok_4",
    name: "ASUS ROG Phone 8 Pro 24GB/1TB",
    category: "smartphone",
    subcategory: "gaming",
    brand: "ASUS",
    price: 18999000,
    originalPrice: 19999000,
    discount: 5,
    rating: 4.9,
    sold: 892,
    reviews: 445,
    location: "Surabaya",
    shop: "ASUS Official Store",
    shopRating: 4.8,
    features: ["Gaming Triggers", "165Hz Display", "Cooling System", "RGB"],
    tags: ["gaming", "performance", "rgb", "cooling", "triggers"],
    description: "Gaming phone ultimate dengan performa dan fitur gaming terdepan",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: false,
    officialStore: true,
  },
  {
    id: "tok_5",
    name: "Realme GT 6 12GB/256GB Green",
    category: "smartphone",
    subcategory: "mid-range",
    brand: "Realme",
    price: 6999000,
    originalPrice: 7999000,
    discount: 13,
    rating: 4.5,
    sold: 5678,
    reviews: 2234,
    location: "Bandung",
    shop: "Realme Official Store",
    shopRating: 4.6,
    features: ["Snapdragon 8s Gen 3", "120Hz AMOLED", "5500mAh", "120W"],
    tags: ["mid-range", "value", "fast-charging", "gaming"],
    description: "Smartphone mid-range dengan performa flagship dan harga terjangkau",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: true,
    officialStore: true,
  },
  // Laptops
  {
    id: "tok_6",
    name: "MacBook Air M3 15-inch 16GB/512GB Midnight",
    category: "laptop",
    subcategory: "ultrabook",
    brand: "Apple",
    price: 26999000,
    originalPrice: 28999000,
    discount: 7,
    rating: 4.9,
    sold: 1234,
    reviews: 567,
    location: "Jakarta Pusat",
    shop: "iBox Official Store",
    shopRating: 4.9,
    features: ["M3 Chip", "18-hour battery", "Liquid Retina", "MagSafe"],
    tags: ["ultrabook", "premium", "productivity", "design", "battery"],
    description: "MacBook Air terbaru dengan chip M3 dan layar 15-inch yang stunning",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: true,
    officialStore: true,
  },
  {
    id: "tok_7",
    name: "ASUS ROG Strix G16 RTX 4070 32GB/1TB",
    category: "laptop",
    subcategory: "gaming",
    brand: "ASUS",
    price: 24999000,
    originalPrice: 27999000,
    discount: 11,
    rating: 4.7,
    sold: 892,
    reviews: 445,
    location: "Jakarta Selatan",
    shop: "ASUS Official Store",
    shopRating: 4.8,
    features: ["RTX 4070", "Intel i7-13650HX", "165Hz Display", "RGB Keyboard"],
    tags: ["gaming", "high-performance", "rtx", "rgb", "cooling"],
    description: "Gaming laptop powerful dengan RTX 4070 untuk gaming dan content creation",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: false,
    officialStore: true,
  },
  {
    id: "tok_8",
    name: "Lenovo ThinkPad X1 Carbon Gen 11 32GB/1TB",
    category: "laptop",
    subcategory: "business",
    brand: "Lenovo",
    price: 32999000,
    originalPrice: 35999000,
    discount: 8,
    rating: 4.8,
    sold: 567,
    reviews: 234,
    location: "Jakarta Pusat",
    shop: "Lenovo Official Store",
    shopRating: 4.7,
    features: ["Intel i7-1365U", "14-inch 2.8K", "Carbon Fiber", "MIL-STD"],
    tags: ["business", "premium", "lightweight", "durable", "professional"],
    description: "Business laptop premium dengan build quality terbaik dan performa optimal",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: true,
    officialStore: true,
  },
  // Fashion
  {
    id: "tok_9",
    name: "Nike Air Jordan 1 Retro High OG Chicago",
    category: "sepatu",
    subcategory: "sneakers",
    brand: "Nike",
    price: 2899000,
    originalPrice: 3199000,
    discount: 9,
    rating: 4.8,
    sold: 3456,
    reviews: 1789,
    location: "Jakarta Barat",
    shop: "Nike Official Store",
    shopRating: 4.9,
    features: ["Leather Upper", "Air Sole", "Retro Design", "High Top"],
    tags: ["sneakers", "retro", "basketball", "fashion", "iconic"],
    description: "Sneakers legendaris dengan desain klasik yang timeless",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: true,
    officialStore: true,
  },
  {
    id: "tok_10",
    name: "Adidas Ultraboost 23 Core Black",
    category: "sepatu",
    subcategory: "running",
    brand: "Adidas",
    price: 2599000,
    originalPrice: 2899000,
    discount: 10,
    rating: 4.7,
    sold: 4567,
    reviews: 2345,
    location: "Surabaya",
    shop: "Adidas Official Store",
    shopRating: 4.8,
    features: ["Boost Technology", "Primeknit Upper", "Continental Rubber"],
    tags: ["running", "comfort", "boost", "performance", "daily"],
    description: "Running shoes dengan teknologi Boost untuk kenyamanan maksimal",
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    fastDelivery: true,
    officialStore: true,
  },
]

// Product Card Component
const ProductCard = ({ product, index }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                <a
                  href={`https://www.tokopedia.com/search?q=${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-start gap-2"
                >
                  {product.name}
                  <ExternalLink size={16} className="mt-1 flex-shrink-0" />
                </a>
              </div>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg ml-4 flex-shrink-0"
              />
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl font-bold text-green-600">Rp {product.price.toLocaleString()}</div>
              {product.discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    Rp {product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    -{product.discount}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-yellow-500 fill-current" />
                <div>
                  <div className="font-semibold text-sm">{product.rating}</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-green-600" />
                <div>
                  <div className="font-semibold text-sm">{product.sold.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Terjual</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap size={16} className="text-blue-600" />
                <div>
                  <div className="font-semibold text-sm">{product.reviews}</div>
                  <div className="text-xs text-gray-500">Review</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-600" />
                <div>
                  <div className="font-semibold text-sm">{product.matchScore}</div>
                  <div className="text-xs text-gray-500">Match</div>
                </div>
              </div>
            </div>

            {/* Shop Info */}
            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{product.shop}</div>
                <div className="text-xs text-gray-600">{product.location}</div>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{product.shopRating}</span>
              </div>
              {product.officialStore && (
                <Badge variant="secondary" className="text-xs">
                  Official
                </Badge>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.features.slice(0, isExpanded ? undefined : 3).map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {product.features.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 px-2 text-xs text-blue-600"
                >
                  {isExpanded ? "Less" : `+${product.features.length - 3} more`}
                </Button>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 4).map((tag, idx) => (
                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                <a
                  href={`https://www.tokopedia.com/search?q=${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  Beli di Tokopedia
                </a>
              </Button>

              {product.fastDelivery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Zap size={12} />
                  Fast Delivery
                </Badge>
              )}

              {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Chat Message Component
const ChatMessage = ({ message, isBot }) => {
  return (
    <div className={`flex gap-3 mb-6 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot size={20} className="text-white" />
        </div>
      )}

      <div className={`max-w-4xl ${isBot ? "w-full" : "max-w-md"}`}>
        <div
          className={`p-4 rounded-2xl ${
            isBot ? "bg-white border shadow-sm rounded-tl-none" : "bg-blue-600 text-white rounded-tr-none"
          }`}
        >
          {message.type === "text" ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : message.type === "recommendations" ? (
            <div>
              <p className="font-medium mb-4">{message.content}</p>
              <div className="space-y-4">
                {message.products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tips:</strong> Hasil pencarian bisa berbeda setiap waktu berdasarkan ketersediaan stok,
                  harga terbaru, dan promosi yang sedang berlangsung di Tokopedia.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {isBot && (
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Clock size={12} />
            <span>
              {new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>•</span>
            <span>Powered by AI</span>
          </div>
        )}
      </div>

      {!isBot && (
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  )
}

// Quick Suggestions Component
const QuickSuggestions = ({ onSuggestionClick }) => {
  const suggestions = [
    "Smartphone gaming terbaik budget 10 juta",
    "Laptop untuk kerja dan desain grafis",
    "Sepatu running Nike atau Adidas yang nyaman",
    "iPhone terbaru dengan kamera terbaik",
    "Laptop gaming ASUS ROG dengan RTX",
    "Headphone wireless untuk musik",
    "Smartphone Xiaomi flagship murah",
    "MacBook untuk content creator",
  ]

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 mb-3">💡 Coba tanyakan:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.slice(0, 4).map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            className="text-xs hover:bg-blue-50 hover:border-blue-300"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Main App Component
export default function SmartRecommendationChat() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const { products, loading, searchProducts } = useProducts()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: "text",
        content:
          '🛍️ Halo! Saya adalah asisten belanja pintar dengan database produk real-time!\n\nCeritakan saja apa yang Anda cari, misalnya:\n• "Smartphone gaming budget 10 juta"\n• "Laptop untuk kerja dan editing video"\n• "Sepatu running yang nyaman"\n\nSaya akan carikan produk terbaik dari database kami! ✨',
        isBot: true,
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "text",
      content: message,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Parse intent and search database
    const intent = parseUserIntent(message)
    await searchProducts(intent)

    // Add bot response with real products
    setTimeout(() => {
      if (products.length > 0) {
        const botMessage = {
          id: Date.now() + 1,
          type: "recommendations",
          content: `🎯 Saya menemukan ${products.length} produk yang sesuai dengan pencarian Anda!`,
          products: products,
          isBot: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        const botMessage = {
          id: Date.now() + 1,
          type: "text",
          content: "Maaf, tidak ada produk yang sesuai dengan kriteria Anda. Coba dengan kata kunci yang berbeda! 🤔",
          isBot: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Shopping Assistant</h1>
                <p className="text-sm text-gray-600">Powered by Real Database • Live Products</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Database size={12} />
                Real-time Data
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin">Admin Panel</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border min-h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 1 && <QuickSuggestions onSuggestionClick={handleSendMessage} />}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} isBot={message.isBot} />
            ))}

            {loading && (
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="bg-white border rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">Mencari produk terbaik...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-3">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ceritakan apa yang Anda cari... (contoh: smartphone gaming budget 10 juta)"
                className="flex-1 min-h-[50px] max-h-[120px] resize-none"
                disabled={loading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6"
              >
                <Send size={20} />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>💡 Semakin detail permintaan Anda, semakin akurat rekomendasinya</span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
