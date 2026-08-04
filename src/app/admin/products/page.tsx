"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  Trash2,
  ShoppingCart,
  ExternalLink,
  Star,
  DollarSign,
  Tag,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  getProducts, 
  deleteProduct, 
  toggleProductFeatured, 
  duplicateProduct,
  PRODUCT_TYPES,
  PRODUCT_STATUSES,
  PRODUCT_CATEGORIES,
  PRODUCT_ORIGINS,
  initializeDemoProducts,
  getProductsByPortal
} from "@/lib/services/product-manager"
import { Product, ProductStatus, ProductType } from "@/types"
import { useParams } from "next/navigation"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<ProductType | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | "all">("all")
  
  const params = useParams()
  const portalId = params?.portalId as string

  // Inicializar produtos demo se necessário
  useEffect(() => {
    initializeDemoProducts()
    const allProducts = getProducts()
    setProducts(allProducts)
    setFilteredProducts(allProducts)
    
    // Se houver portalId, usar produtos desse portal
    if (portalId) {
      const portalProducts = getProductsByPortal(portalId)
      setProducts(portalProducts)
      setFilteredProducts(portalProducts)
    }
  }, [portalId])

  // Filtrar produtos
  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(product => product.type === selectedType)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(product => product.status === selectedStatus)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedType, selectedStatus])

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduct(id)
      const updatedProducts = getProducts()
      setProducts(updatedProducts)
    }
  }

  const handleToggleFeatured = (id: string) => {
    toggleProductFeatured(id)
    const updatedProducts = getProducts()
    setProducts(updatedProducts)
  }

  const handleDuplicate = (id: string) => {
    duplicateProduct(id)
    const updatedProducts = getProducts()
    setProducts(updatedProducts)
  }

  const getTypeIcon = (type: ProductType) => {
    const typeInfo = PRODUCT_TYPES.find(t => t.id === type)
    return typeInfo ? typeInfo.icon : "📦"
  }

  const getTypeColor = (type: ProductType) => {
    const typeInfo = PRODUCT_TYPES.find(t => t.id === type)
    return typeInfo ? typeInfo.color : "text-gray-600 bg-gray-100"
  }

  const getStatusColor = (status: ProductStatus) => {
    const statusInfo = PRODUCT_STATUSES.find(s => s.id === status)
    return statusInfo ? statusInfo.color : "bg-gray-100 text-gray-800"
  }

  // Estatísticas
  const stats = {
    total: products.length,
    published: products.filter(p => p.status === "published").length,
    draft: products.filter(p => p.status === "draft").length,
    featured: products.filter(p => p.isFeatured).length,
    affiliate: products.filter(p => p.type === "affiliate").length,
    own: products.filter(p => p.type.includes("own")).length,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os produtos da plataforma
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/products/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total", value: stats.total, icon: ShoppingCart, color: "text-gray-800" },
            { label: "Publicados", value: stats.published, icon: Eye, color: "text-green-600" },
            { label: "Rascunhos", value: stats.draft, icon: Edit, color: "text-yellow-600" },
            { label: "Destaques", value: stats.featured, icon: Star, color: "text-blue-600" },
            { label: "Afiliados", value: stats.affiliate, icon: ExternalLink, color: "text-orange-600" },
            { label: "Próprios", value: stats.own, icon: DollarSign, color: "text-purple-600" },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Filtros e busca */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos por nome, descrição ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <select 
                className="p-2 border rounded-md text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ProductType | "all")}
              >
                <option value="all">Todos os tipos</option>
                {PRODUCT_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <select 
                className="p-2 border rounded-md text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ProductStatus | "all")}
              >
                <option value="all">Todos os status</option>
                {PRODUCT_STATUSES.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de produtos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Produtos ({filteredProducts.length})</h2>
            <div className="flex gap-2 text-sm">
              <button 
                className={`px-3 py-1 rounded ${selectedStatus === "all" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
                onClick={() => setSelectedStatus("all")}
              >
                Todos ({stats.total})
              </button>
              <button 
                className={`px-3 py-1 rounded ${selectedStatus === "published" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                onClick={() => setSelectedStatus("published")}
              >
                Publicados ({stats.published})
              </button>
              <button 
                className={`px-3 py-1 rounded ${selectedStatus === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100"}`}
                onClick={() => setSelectedStatus("draft")}
              >
                Rascunhos ({stats.draft})
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm || selectedType !== "all" || selectedStatus !== "all" 
                  ? "Tente ajustar seus filtros de busca."
                  : "Comece criando seu primeiro produto."}
              </p>
              {!searchTerm && selectedType === "all" && selectedStatus === "all" && (
                <Link href="/admin/products/new">
                  <Button className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Produto
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Tags e badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getTypeColor(product.type)}>
                        {getTypeIcon(product.type)} {PRODUCT_TYPES.find(t => t.id === product.type)?.name}
                      </Badge>
                      <Badge className={getStatusColor(product.status)}>
                        {PRODUCT_STATUSES.find(s => s.id === product.status)?.name}
                      </Badge>
                      {product.isFeatured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>

                    {/* Preço */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: product.currency
                          }).format(product.currentPrice)}
                        </div>
                        {product.originalPrice > product.currentPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: product.currency
                            }).format(product.originalPrice)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Categoria</div>
                        <div className="font-medium">
                          {PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                        </div>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {product.views || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {product.conversions || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {product.rating || "N/A"}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>
                      </Link>
                      <div className="flex gap-2">
                                              <button
                        onClick={() => handleDuplicate(product.id)}
                        title="Duplicar"
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(product.id)}
                        title={product.isFeatured ? "Remover destaque" : "Destacar"}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        title="Excluir"
                        className="p-2 hover:bg-gray-100 rounded text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}