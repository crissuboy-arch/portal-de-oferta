"use client"

import { useState } from "react"
import { Filter, TrendingUp, Clock, DollarSign, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DealCardComponent } from "@/components/deals/deal-card"
import { Sidebar } from "@/components/layout/sidebar"
import { mockDeals } from "@/lib/data/mock-deals"

export default function OfertasPage() {
  const [sortBy, setSortBy] = useState("recentes")
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 5000],
    store: "",
    hasCoupon: false,
  })

  const getVariant = (isActive: boolean) => {
    return isActive ? "primary" : "outline"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Todas as Ofertas 3D</h1>
          <p className="text-gray-300">Encontre as melhores ofertas de impressoras, filamentos, resinas e muito mais</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filtros:</span>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={getVariant(filters.category === "")} 
                  size="sm"
                  onClick={() => setFilters({...filters, category: ""})}
                >
                  Todas Categorias
                </Button>
                <Button 
                  variant={getVariant(filters.category === "impressoras")} 
                  size="sm"
                  onClick={() => setFilters({...filters, category: "impressoras"})}
                >
                  Impressoras 3D
                </Button>
                <Button 
                  variant={getVariant(filters.category === "filamentos")} 
                  size="sm"
                  onClick={() => setFilters({...filters, category: "filamentos"})}
                >
                  Filamentos
                </Button>
                <Button 
                  variant={getVariant(filters.category === "resinas")} 
                  size="sm"
                  onClick={() => setFilters({...filters, category: "resinas"})}
                >
                  Resinas
                </Button>
                {filters.hasCoupon && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setFilters({...filters, hasCoupon: false})}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Com Cupom
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Ordenar por:</span>
              <div className="flex gap-2">
                <Button 
                  variant={getVariant(sortBy === "recentes")} 
                  size="sm"
                  onClick={() => setSortBy("recentes")}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Mais Recentes
                </Button>
                <Button 
                  variant={getVariant(sortBy === "votadas")} 
                  size="sm"
                  onClick={() => setSortBy("votadas")}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Mais Votadas
                </Button>
                <Button 
                  variant={getVariant(sortBy === "desconto")} 
                  size="sm"
                  onClick={() => setSortBy("desconto")}
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Maior Desconto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Deals List */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filters.category ? `Ofertas de ${filters.category}` : 'Todas as Ofertas'} 
                  <span className="text-gray-600 text-lg ml-2">({mockDeals.length} resultados)</span>
                </h2>
              </div>

              <div className="space-y-6">
                {mockDeals
                  .filter(deal => {
                    if (filters.category && !deal.category.toLowerCase().includes(filters.category.toLowerCase())) {
                      return false
                    }
                    if (filters.hasCoupon && !deal.coupon) {
                      return false
                    }
                    return true
                  })
                  .sort((a, b) => {
                    if (sortBy === "votadas") return b.votes.up - a.votes.up
                    if (sortBy === "desconto") return b.discount - a.discount
                    // Mais recentes por ID (simulado)
                    return parseInt(b.id) - parseInt(a.id)
                  })
                  .map((deal) => (
                    <DealCardComponent key={deal.id} deal={deal} />
                  ))}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <Button variant="outline" className="px-8">
                  Carregar mais ofertas (12 de 156)
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}