// Product card component untuk struktur sederhana
import { Star, ExternalLink, ShoppingBag, Award, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SimpleProduct } from "@/lib/simple-database"

interface SimpleProductCardProps {
  product: SimpleProduct
  index: number
}

export function SimpleProductCard({ product, index }: SimpleProductCardProps) {
  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "Kualitas":
        return "bg-blue-100 text-blue-800"
      case "Penjualan Terbaik":
        return "bg-green-100 text-green-800"
      case "Harga Termurah":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "Kualitas":
        return <Star size={12} />
      case "Penjualan Terbaik":
        return <TrendingUp size={12} />
      case "Harga Termurah":
        return <Award size={12} />
      default:
        return <Star size={12} />
    }
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                <a
                  href={`https://www.tokopedia.com/search?q=${encodeURIComponent(product.nama_produk)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-start gap-2"
                >
                  {product.nama_produk}
                  <ExternalLink size={16} className="mt-1 flex-shrink-0" />
                </a>
              </CardTitle>
              <img
                src={`/placeholder.svg?height=80&width=80&text=${product.merk}`}
                alt={product.nama_produk}
                className="w-20 h-20 object-cover rounded-lg ml-4 flex-shrink-0 bg-gray-100"
              />
            </div>

            {/* Brand & Category */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {product.merk}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {product.kategori}
              </Badge>
            </div>

            {/* Recommendation Type */}
            <div className="mb-3">
              <Badge
                className={`text-xs ${getRecommendationColor(product.rekomendasi_berdasarkan)} flex items-center gap-1 w-fit`}
              >
                {getRecommendationIcon(product.rekomendasi_berdasarkan)}
                {product.rekomendasi_berdasarkan}
              </Badge>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-green-600 mb-4">Rp {product.harga.toLocaleString()}</div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-600">Brand:</span>
                <div className="font-medium">{product.merk}</div>
              </div>
              <div>
                <span className="text-gray-600">Kategori:</span>
                <div className="font-medium">{product.kategori}</div>
              </div>
              <div>
                <span className="text-gray-600">ID Produk:</span>
                <div className="font-medium">#{product.id}</div>
              </div>
              <div>
                <span className="text-gray-600">Range Harga:</span>
                <div className="font-medium capitalize">{product.price_category}</div>
              </div>
            </div>

            {/* Action Button */}
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <a
                href={`https://www.tokopedia.com/search?q=${encodeURIComponent(product.nama_produk)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShoppingBag size={16} className="mr-2" />
                Cari di Tokopedia
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
