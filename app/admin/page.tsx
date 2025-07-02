// Admin Panel untuk Insert Data
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useProducts } from "@/hooks/useProducts"
import { Upload, Database, CheckCircle, AlertCircle } from "lucide-react"

export default function AdminPanel() {
  const [jsonData, setJsonData] = useState("")
  const [result, setResult] = useState<any>(null)
  const { bulkInsertProducts } = useProducts()
  const [loading, setLoading] = useState(false)

  const handleBulkInsert = async () => {
    try {
      setLoading(true)
      const products = JSON.parse(jsonData)
      const result = await bulkInsertProducts(products)
      setResult(result)
    } catch (error) {
      setResult({ success: false, error: "Invalid JSON format" })
    } finally {
      setLoading(false)
    }
  }

  const sampleData = `[
  {
    "name": "iPhone 15 Pro Max 256GB Natural Titanium",
    "category": "smartphone",
    "subcategory": "flagship",
    "brand": "Apple",
    "price": 21999000,
    "original_price": 23999000,
    "discount": 8,
    "rating": 4.8,
    "sold_count": 2847,
    "review_count": 1205,
    "location": "Jakarta Pusat",
    "shop_name": "iBox Official Store",
    "shop_rating": 4.9,
    "features": ["5G", "Pro Camera", "Titanium", "A17 Pro", "Action Button"],
    "tags": ["premium", "flagship", "photography", "gaming", "professional"],
    "description": "iPhone terbaru dengan chip A17 Pro dan kamera pro yang revolusioner",
    "image_url": "https://example.com/iphone15pro.jpg",
    "in_stock": true,
    "fast_delivery": true,
    "official_store": true
  }
]`

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={24} />
              Product Database Admin Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sample Data */}
            <div>
              <h3 className="font-semibold mb-2">Sample JSON Format:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{sampleData}</pre>
            </div>

            {/* JSON Input */}
            <div>
              <label className="block font-semibold mb-2">Paste your JSON data here:</label>
              <Textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Paste JSON array of products here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleBulkInsert}
                disabled={!jsonData.trim() || loading}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                {loading ? "Inserting..." : "Bulk Insert Products"}
              </Button>

              <Button variant="outline" onClick={() => setJsonData(sampleData)}>
                Load Sample Data
              </Button>
            </div>

            {/* Result */}
            {result && (
              <Card className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <AlertCircle className="text-red-600" size={20} />
                    )}
                    <span className="font-semibold">{result.success ? "Success!" : "Error!"}</span>
                  </div>

                  {result.success ? (
                    <p className="text-green-700">Successfully inserted {result.count} products into the database.</p>
                  ) : (
                    <p className="text-red-700">{result.error}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
