"use client"

// Main app dengan database sederhana
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Clock, Sparkles, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { SimpleProductCard } from "@/components/SimpleProductCard"
import { useSimpleProducts } from "@/hooks/useSimpleProducts"
import { parseSimpleIntent, generateSimpleResponse } from "@/lib/simple-intent-parser"

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
                  <SimpleProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Database Info:</strong> Data diambil langsung dari database produk dengan struktur
                  sederhana: ID, Merk, Nama Produk, Kategori, Rekomendasi Berdasarkan, dan Harga.
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
            <span>Simple Database</span>
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

// Quick Suggestions
const QuickSuggestions = ({ onSuggestionClick }) => {
  const suggestions = [
    "Samsung smartphone kualitas terbaik",
    "Xiaomi harga termurah",
    "Oppo penjualan terbaik",
    "Smartphone budget under 5 juta",
    "HP premium di atas 15 juta",
    "Produk Samsung terlaris",
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
export default function SimpleRecommendationChat() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const { products, loading, searchProducts } = useSimpleProducts()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: "text",
        content:
          "🛍️ Halo! Saya adalah asisten belanja dengan database produk sederhana!\n\nDatabase kami memiliki:\n• 9 produk smartphone\n• Brand: Samsung, Xiaomi, Oppo\n• Kategori rekomendasi: Kualitas, Penjualan Terbaik, Harga Termurah\n\nCeritakan apa yang Anda cari! ✨",
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

    // Parse intent dan search database
    const intent = parseSimpleIntent(message)
    await searchProducts(intent)

    // Simulasi delay untuk respons yang lebih natural
    setTimeout(() => {
      const botResponse = generateSimpleResponse(products, intent)

      if (products.length > 0) {
        const recommendationMessage = {
          id: Date.now() + 1,
          type: "recommendations",
          content: botResponse,
          products: products,
          isBot: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, recommendationMessage])
      } else {
        const textMessage = {
          id: Date.now() + 1,
          type: "text",
          content: botResponse,
          isBot: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, textMessage])
      }
    }, 800)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Simple Database Recommendation</h1>
                <p className="text-sm text-gray-600">9 Products • Simple Structure</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Database size={12} />
                Simple DB
              </Badge>
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
                    <span className="text-sm text-gray-600">Searching database...</span>
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
                onKeyPress={handleKeyPress}
                placeholder="Cari produk... (contoh: Samsung kualitas terbaik, Xiaomi murah, dll)"
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
              <span>💡 Cari berdasarkan: brand, kualitas, harga termurah, penjualan terbaik</span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
