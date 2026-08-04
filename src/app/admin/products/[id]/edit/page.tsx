"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Copy, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  getProductById,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  toggleProductFeatured,
  PRODUCT_TYPES,
  PRODUCT_STATUSES,
  PRODUCT_CATEGORIES
} from "@/lib/services/product-manager"
import { toast } from "sonner"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string
  
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    category: "electronics",
    type: "affiliate",
    status: "draft",
    currentPrice: 0,
    originalPrice: 0,
    currency: "BRL",
    tags: [] as string[],
    isFeatured: false,
  })

  // Carregar produto
  useEffect(() => {
    if (productId) {
      const loadedProduct = getProductById(productId)
      if (loadedProduct) {
        setProduct(loadedProduct)
        setFormData({
          name: loadedProduct.name,
          shortDescription: loadedProduct.shortDescription,
          fullDescription: loadedProduct.fullDescription,
          category: loadedProduct.category,
          type: loadedProduct.type,
          status: loadedProduct.status,
          currentPrice: loadedProduct.currentPrice,
          originalPrice: loadedProduct.originalPrice,
          currency: loadedProduct.currency,
          tags: loadedProduct.tags || [],
          isFeatured: loadedProduct.isFeatured || false,
        })
      } else {
        toast.error("Produto não encontrado")
        router.push("/admin/products")
      }
    }
  }, [productId, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDelete = () => {
    if (productId && confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduct(productId)
      toast.success("Produto excluído com sucesso!")
      router.push("/admin/products")
    }
  }

  const handleDuplicate = () => {
    if (productId) {
      const newProduct = duplicateProduct(productId)
      if (newProduct) {
        toast.success("Produto duplicado com sucesso!")
        router.push(`/admin/products/${newProduct.id}/edit`)
      }
    }
  }

  const handleToggleFeatured = () => {
    if (productId) {
      toggleProductFeatured(productId)
      setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))
      toast.success(
        formData.isFeatured 
          ? "Produto removido dos destaques" 
          : "Produto adicionado aos destaques"
      )
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("O nome do produto é obrigatório")
      return false
    }
    if (!formData.shortDescription.trim()) {
      toast.error("A descrição curta é obrigatória")
      return false
    }
    if (!formData.currentPrice || formData.currentPrice <= 0) {
      toast.error("O preço deve ser maior que zero")
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    try {
      if (productId) {
        const discount = formData.originalPrice && formData.currentPrice && formData.originalPrice > 0 && formData.currentPrice < formData.originalPrice
          ? Math.round((1 - formData.currentPrice / formData.originalPrice) * 100)
          : 0

        const updatedData = {
          ...formData,
          discount,
          updatedAt: new Date(),
        }

        updateProduct(productId, {
          ...updatedData,
          type: formData.type as any,
          status: formData.status as any,
        })
        toast.success("Produto atualizado com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao atualizar produto")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando produto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
              <p className="text-muted-foreground">
                {product.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleDuplicate}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Duplicar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="gap-2"
            >
              {loading ? "Salvando..." : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <select 
              className="p-2 border rounded-md text-sm"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              {PRODUCT_STATUSES.map(status => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
          
          <Button
            variant={formData.isFeatured ? "primary" : "secondary"}
            onClick={handleToggleFeatured}
            className="gap-2"
          >
            <Star className="h-4 w-4" />
            {formData.isFeatured ? "Em Destaque" : "Destacar"}
          </Button>
          
          <Button
            variant="danger"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>

        {/* Formulário */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="shortDescription">Descrição Curta *</Label>
                  <Textarea
                    id="shortDescription"
                    rows={3}
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="fullDescription">Descrição Completa</Label>
                  <Textarea
                    id="fullDescription"
                    rows={5}
                    value={formData.fullDescription}
                    onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded-md mt-1"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    >
                      {PRODUCT_CATEGORIES.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <select
                      id="type"
                      className="w-full p-2 border rounded-md mt-1"
                      value={formData.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                    >
                      {PRODUCT_TYPES.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Preços</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Preço Original</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange("originalPrice", parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentPrice">Preço Atual *</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.currentPrice}
                      onChange={(e) => handleInputChange("currentPrice", parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Moeda</Label>
                    <select
                      id="currency"
                      className="w-full p-2 border rounded-md mt-1"
                      value={formData.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                    >
                      <option value="BRL">BRL (R$)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                {formData.originalPrice && formData.currentPrice && formData.originalPrice > 0 && formData.currentPrice < formData.originalPrice && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">
                      Desconto: {Math.round((1 - formData.currentPrice / formData.originalPrice) * 100)}% OFF
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Configurações</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status do Produto</Label>
                  <select
                    id="status"
                    className="w-full p-2 border rounded-md mt-1"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    {PRODUCT_STATUSES.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Produto em Destaque</Label>
                  <button
                    onClick={handleToggleFeatured}
                    className={`w-12 h-6 flex items-center rounded-full p-1 ${formData.isFeatured ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full transform ${formData.isFeatured ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tags</h2>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {formData.tags.length > 0 
                    ? `Tags: ${formData.tags.join(", ")}`
                    : "Nenhuma tag adicionada ainda."
                  }
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Ações</h2>
              <div className="space-y-3">
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full gap-2"
                >
                  {loading ? "Salvando..." : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDuplicate}
                  className="w-full gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Duplicar Produto
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/admin/products")}
                  className="w-full"
                >
                  Voltar para Lista
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDelete}
                  className="w-full gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Produto
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}