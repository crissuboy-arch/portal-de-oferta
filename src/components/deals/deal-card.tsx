import { Heart, Share2, MessageSquare, ThumbsUp, ThumbsDown, Tag, Truck, Globe, Shield, ExternalLink } from "lucide-react"
import { DealCard } from "@/lib/data/mock-deals"
import { Button } from "@/components/ui/button"

interface DealCardProps {
  deal: DealCard
}

export function DealCardComponent({ deal }: DealCardProps) {
  const badgeColor = deal.badge === "affiliate" 
    ? "bg-blue-600" 
    : deal.badge === "own" 
      ? "bg-green-600" 
      : "bg-purple-600"

  const badgeText = deal.badge === "affiliate" 
    ? "Afiliado" 
    : deal.badge === "own" 
      ? "Próprio" 
      : "Patrocinado"

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${badgeColor}`}>
              {badgeText}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
              {deal.category}
            </span>
            {deal.coupon && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                Cupom
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">{deal.date}</span>
        </div>

        {/* Product Info */}
        <div className="flex space-x-4">
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="w-24 h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{deal.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{deal.description}</p>
            
            {/* Price Section */}
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">R$ {deal.currentPrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">R$ {deal.originalPrice.toFixed(2)}</span>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-bold rounded">
                -{deal.discount}%
              </span>
              <span className="text-sm text-green-600 font-semibold">
                Economize R$ {deal.savings.toFixed(2)}
              </span>
            </div>

            {/* Store & Shipping */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                {deal.store}
              </span>
              <span className="flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                {deal.shipping}
              </span>
              <span className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                {deal.country} • {deal.language}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {deal.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Stats */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-orange-500">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">{deal.votes.up}</span>
              </div>
              <ThumbsDown className="h-4 w-4" />
              <span className="text-sm font-medium">{deal.votes.down}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">{deal.comments}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">{deal.favorites}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">{deal.shares}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {deal.coupon && (
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Cupom Ativo</div>
                <div className="px-3 py-1 bg-orange-100 text-orange-700 font-mono font-bold rounded border border-orange-300">
                  {deal.coupon}
                </div>
              </div>
            )}
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Oferta
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}