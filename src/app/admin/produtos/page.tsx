"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, PlusCircle, Edit, Trash2, Eye, Filter, Package } from "lucide-react"
import { productService, categoryService, storeService } from "@/lib/supabase/services"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData, storesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        storeService.getAll()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
      setStores(storesData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    
    try {
      await productService.delete(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      alert("Erro ao excluir produto")
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    const matchesStatus = !selectedStatus || product.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId)
    return store?.name || "Desconhecida"
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || "Sem categoria"
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
          <h1 className="text-3xl font-bold text-white">Produtos</h1>
          <p className="text-gray-400 mt-2">
            Gerencie todos os produtos do portal ({filteredProducts.length} resultados)
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Link
            href="/admin/produtos/import"
            className="inline-flex items-center px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            <Filter className="h-5 w-5 mr-2" />
            Importar
          </Link>
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Novo Produto
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card-dark border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome ou descrição..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="expired">Expirado</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("")
                setSelectedStatus("")
              }}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card-dark border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Produto</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Preço</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Categoria</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Loja</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                          {product.featured_image_url ? (
                            <img 
                              src={product.featured_image_url} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {product.short_description || "Sem descrição"}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-white">
                          {product.current_price} {product.currency}
                        </div>
                        {product.discount_percentage > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400 line-through">
                              {product.original_price} {product.currency}
                            </span>
                            <span className="px-1 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">
                              -{product.discount_percentage}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {getCategoryName(product.category_id)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {getStoreName(product.store_id)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        product.status === 'published'
                          ? 'bg-green-900/30 text-green-400'
                          : product.status === 'expired'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {product.status === 'published' ? 'Publicado' :
                         product.status === 'expired' ? 'Expirado' : 'Rascunho'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {product.status === 'published' && (
                          <a
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded"
                            title="Ver no site"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/produtos/${product.id}/editar`}
                          className="p-1.5 text-orange-400 hover:text-orange-300 hover:bg-gray-800 rounded"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      {products.length === 0 ? (
                        <>
                          <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-lg">Nenhum produto cadastrado</p>
                          <p className="text-sm mt-2">Comece criando seu primeiro produto</p>
                          <Link
                            href="/admin/produtos/novo"
                            className="mt-4 inline-block text-orange-400 hover:text-orange-300"
                          >
                            Criar Produto
                          </Link>
                        </>
                      ) : (
                        <>
                          <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-lg">Nenhum produto encontrado</p>
                          <p className="text-sm mt-2">Tente ajustar os filtros de busca</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}