import { TrendingUp, Award, Star, Zap, Users, Bell, Mail } from "lucide-react"
import { topVotedDeals, popularCoupons, topStores, trendingTopics } from "@/lib/data/mock-deals"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Top Voted Deals */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Award className="h-5 w-5 text-orange-500 mr-2" />
          <h3 className="font-bold text-gray-900">Mais Votados</h3>
        </div>
        <div className="space-y-3">
          {topVotedDeals.map((deal, index) => (
            <div key={deal.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded flex items-center justify-center mr-3 ${index === 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                  <span className="font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{deal.title}</p>
                  <p className="text-xs text-gray-500">{deal.category}</p>
                </div>
              </div>
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <TrendingUp className="h-3 w-3 mr-1" />
                {deal.votes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coupons */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Zap className="h-5 w-5 text-orange-500 mr-2" />
          <h3 className="font-bold text-gray-900">Cupons em Destaque</h3>
        </div>
        <div className="space-y-3">
          {popularCoupons.map((coupon) => (
            <div key={coupon.code} className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-mono font-bold text-lg bg-white px-2 py-1 rounded border border-orange-200">
                    {coupon.code}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">na {coupon.store}</span>
                </div>
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                  {coupon.discount}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>💳 {coupon.uses} usos</span>
                <span>⏰ Válido até {coupon.expiry}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Stores */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Star className="h-5 w-5 text-orange-500 mr-2" />
          <h3 className="font-bold text-gray-900">Lojas em Destaque</h3>
        </div>
        <div className="space-y-3">
          {topStores.map((store) => (
            <div key={store.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{store.name}</p>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(store.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-600">{store.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{store.deals}</div>
                <div className="text-xs text-gray-500">ofertas</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
          <h3 className="font-bold text-gray-900">Tópicos Populares</h3>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <div key={topic.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span className="text-sm text-gray-700">#{topic.name}</span>
              <span className="text-xs text-gray-500">{topic.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-orange-500 mr-2" />
          <h3 className="font-bold text-gray-900">Comunidade 3D</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1.2K</div>
            <div className="text-xs text-blue-500">Ofertas Hoje</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">45K</div>
            <div className="text-xs text-green-500">Membros</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">98%</div>
            <div className="text-xs text-orange-500">Avaliação</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-xs text-purple-500">Ativos</div>
          </div>
        </div>
      </div>

      {/* Price Alert */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center mb-3">
          <Bell className="h-5 w-5 mr-2" />
          <h3 className="font-bold">Alerta de Preços</h3>
        </div>
        <p className="text-sm mb-4">Receba alertas quando produtos que você monitora baixarem de preço!</p>
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full mb-3 px-3 py-2 rounded bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
          Criar Alerta
        </Button>
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <Mail className="h-5 w-5 text-orange-500 mr-2" />
          <h3 className="font-bold text-gray-900">Newsletter</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">Receba as melhores ofertas de impressão 3D direto no seu e-mail.</p>
        <input
          type="email"
          placeholder="seu@email.com"
          className="w-full mb-3 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          Inscrever-se
        </Button>
      </div>
    </div>
  )
}