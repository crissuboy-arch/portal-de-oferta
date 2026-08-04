import { Heart, Share2, Tag, Globe, Shield, Truck, ExternalLink } from "lucide-react"
import { DealCard } from "@/lib/data/mock-deals"

interface DealCardProps {
  deal: DealCard | {
    id: string
    title: string
    description: string
    originalPrice: number
    currentPrice: number
    discount: number
    category: string
    store: string
    votes: number
    expiryDate: string
    imageUrl: string
    affiliateUrl: string
    isFeatured: boolean
    isExpired: boolean
    rating: number
    country: string
    currency: string
    badge?: string
    coupon?: string
    date?: string
    shipping?: string
    language?: string
  }
}

export function DealCardComponent({ deal }: DealCardProps) {
  // Extract values with fallbacks
  const badge = 'badge' in deal ? deal.badge : 'affiliate'
  const badgeColor = badge === "affiliate" 
    ? "bg-blue-600" 
    : badge === "own" 
      ? "bg-green-600" 
      : "bg-purple-600"
  
  const badgeText = badge === "affiliate" 
    ? "Afiliado" 
    : badge === "own" 
      ? "Próprio" 
      : "Patrocinado"

  const votes = 'votes' in deal && typeof deal.votes === 'object' 
    ? (deal.votes as any).up || 0 
    : typeof deal.votes === 'number' 
      ? deal.votes 
      : 50

  const savings = deal.originalPrice - deal.currentPrice
  const dealCurrency = 'currency' in deal ? deal.currency : '€'
  const savingsText = savings > 0 
    ? `Economize ${savings.toFixed(2)} ${dealCurrency}` 
    : 'Oferta especial'

  const imageSrc = 'imageUrl' in deal ? deal.imageUrl : 'image' in deal ? (deal as any).image : ''
  const affiliateUrl = 'affiliateUrl' in deal ? deal.affiliateUrl : '#'

  return (
    <div className="bg-card-dark border border-border rounded-xl hover:shadow-lg transition-all duration-300">
      <div className="p-5">
        {/* Badge and Info */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${badgeColor}`}>
              {badgeText}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-300">
              {deal.category}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {'expiryDate' in deal && deal.expiryDate 
              ? `Válido até: ${new Date(deal.expiryDate).toLocaleDateString('pt-PT')}`
              : 'Oferta especial'}
          </span>
        </div>

        {/* Product Content */}
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="w-28 h-28 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={imageSrc || 'https://via.placeholder.com/400x300/1a202c/4a5568?text=Produto'}
              alt={deal.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/1a202c/4a5568?text=Produto'
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h3 className="font-bold text-xl text-white mb-2 hover:text-orange-400 transition-colors">
              {deal.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {deal.description}
            </p>

            {/* Pricing */}
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">{deal.currentPrice.toFixed(2)} {dealCurrency}</span>
              {deal.originalPrice > deal.currentPrice && (
                <>
                  <span className="ml-3 text-lg text-gray-400 line-through">{deal.originalPrice.toFixed(2)} {dealCurrency}</span>
                  <span className="ml-3 px-2 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded border border-green-800">
                    -{deal.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Store and Rating */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{deal.store}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-orange-400">
                    <span className="text-sm font-medium">{votes}</span>
                  </div>
                  <span className="text-xs text-gray-500">votos</span>
                </div>
              </div>

              <span className="text-sm text-gray-400">
                {'country' in deal && deal.country && `🌐 ${deal.country}`}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-xs">Favoritar</span>
                </button>
                <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <Share2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">Partilhar</span>
                </button>
              </div>
              
              <div>
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="px-4 py-2 bg-secondary hover:bg-secondary-hover text-white font-medium rounded-lg transition-colors inline-flex items-center"
                >
                  Ver Oferta
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Banner */}
        {savings > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-medium">
                🎉 {savingsText}!
              </span>
              <span className="text-xs text-gray-400">
                Entrega: <Truck className="inline h-3 w-3 ml-1" /> Gratuita
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}