"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Package, 
  Tag, 
  Store, 
  Ticket, 
  TrendingUp, 
  Eye, 
  Clock,
  PlusCircle,
  Download
} from "lucide-react"
import { 
  statsService, 
  productService 
} from "@/lib/supabase/services"

interface DashboardStats {
  totalProducts: number
  publishedProducts: number
  totalCategories: number
  totalStores: number
  activeCoupons: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    publishedProducts: 0,
    totalCategories: 0,
    totalStores: 0,
    activeCoupons: 0
  })
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsData, productsData] = await Promise.all([
        statsService.getDashboardStats(),
        productService.getAll({ limit: 5 })
      ])
      
      setStats(statsData)
      setRecentProducts(productsData)
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Visão geral do portal administrativo</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Novo Produto
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <Package className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold">{stats.totalProducts}</span>
          </div>
          <h3 className="text-gray-400 text-sm">Total Produtos</h3>
          <p className="text-gray-500 text-xs mt-1">
            {stats.publishedProducts} publicados
          </p>
        </div>

        <div className="bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-900/30 rounded-lg">
              <Tag className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold">{stats.totalCategories}</span>
          </div>
          <h3 className="text-gray-400 text-sm">Categorias</h3>
          <p className="text-gray-500 text-xs mt-1">Categorias ativas</p>
        </div>

        <div className="bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-900/30 rounded-lg">
              <Store className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold">{stats.totalStores}</span>
          </div>
          <h3 className="text-gray-400 text-sm">Lojas</h3>
          <p className="text-gray-500 text-xs mt-1">Parceiros ativos</p>
        </div>

        <div className="bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-900/30 rounded-lg">
              <Ticket className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold">{stats.activeCoupons}</span>
          </div>
          <h3 className="text-gray-400 text-sm">Cupons Ativos</h3>
          <p className="text-gray-500 text-xs mt-1">Descontos disponíveis</p>
        </div>

        <div className="bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-2xl font-bold">0%</span>
          </div>
          <h3 className="text-gray-400 text-sm">Conversão</h3>
          <p className="text-gray-500 text-xs mt-1">Taxa de clique</p>
        </div>
      </div>

      {/* Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Produtos Recentes</h2>
            <Link
              href="/admin/produtos"
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              Ver todos →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white truncate max-w-[200px]">
                        {product.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {product.category?.name || 'Sem categoria'}
                        </span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          product.status === 'published' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {product.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-white">
                      {product.current_price} {product.currency}
                    </div>
                    {product.discount_percentage > 0 && (
                      <div className="text-xs text-green-400">
                        -{product.discount_percentage}%
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum produto cadastrado</p>
                <Link
                  href="/admin/produtos/novo"
                  className="mt-3 inline-block text-orange-400 hover:text-orange-300 text-sm"
                >
                  Criar primeiro produto
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Ações Rápidas</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/produtos/novo"
              className="p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="p-2 bg-orange-900/30 rounded-lg mr-3">
                  <PlusCircle className="h-5 w-5 text-orange-400" />
                </div>
                <span className="font-medium">Novo Produto</span>
              </div>
              <p className="text-sm text-gray-400">Adicionar produto manualmente</p>
            </Link>

            <Link
              href="/admin/produtos/import"
              className="p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="p-2 bg-blue-900/30 rounded-lg mr-3">
                   <Download className="h-5 w-5 text-blue-400" />
                </div>
                <span className="font-medium">Importar Produto</span>
              </div>
              <p className="text-sm text-gray-400">Importar via URL, imagem ou texto</p>
            </Link>

            <Link
              href="/admin/categorias"
              className="p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="p-2 bg-green-900/30 rounded-lg mr-3">
                  <Tag className="h-5 w-5 text-green-400" />
                </div>
                <span className="font-medium">Gerenciar Categorias</span>
              </div>
              <p className="text-sm text-gray-400">Adicionar/editar categorias</p>
            </Link>

            <Link
              href="/admin/cupons"
              className="p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="p-2 bg-yellow-900/30 rounded-lg mr-3">
                  <Ticket className="h-5 w-5 text-yellow-400" />
                </div>
                <span className="font-medium">Cupons</span>
              </div>
              <p className="text-sm text-gray-400">Gerenciar códigos promocionais</p>
            </Link>
          </div>

          {/* System Status */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <h3 className="font-medium mb-4">Status do Sistema</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Banco de Dados</span>
                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Armazenamento</span>
                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                  0% usado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">País Ativo</span>
                <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">
                  Portugal 🇵🇹
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}