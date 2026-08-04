"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { addProduct, generateProductId } from "@/lib/services/product-manager"
import { toast } from "sonner"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    category: "electronics",
    currentPrice: 0,
    currency: "BRL",
    type: "affiliate",
    status: "draft",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
    if (formData.currentPrice <= 0) {
      toast.error("O preço deve ser maior que zero")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const product = {
        ...formData,
        id: generateProductId(),
        portalId: "3d-printing-portal", // Portal padrão
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        fullDescription: formData.shortDescription,
        editorialSummary: formData.shortDescription,
        images: [],
        tags: [],
        specifications: {},
        advantages: [],
        disadvantages: [],
        originalPrice: formData.currentPrice,
        discount: 0,
        origin: "amazon",
        country: "BR",
        language: "pt-BR",
        affiliateUrl: "",
        callToAction: "Ver Oferta",
        isFeatured: false,
        isSponsored: false,
        seoTitle: formData.name,
        seoDescription: formData.shortDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any

      addProduct(product)
      toast.success("Produto criado com sucesso!")
      router.push("/admin/products")
    } catch (error) {
      toast.error("Erro ao criar produto")
      console.error(error)
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
              <p className="text-muted-foreground">
                Crie um novo produto para a plataforma
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push("/admin/products")}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2"
            >
              {loading ? "Salvando..." : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Produto
                </>
              )}
            </Button>
          </div>
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
                    placeholder="Ex: Impressora 3D Creality Ender 3 V2"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="shortDescription">Descrição Curta *</Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="Breve descrição que aparece nas listagens"
                    rows={3}
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange("shortDescription", e.target.value)}
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
                      <option value="electronics">Eletrônicos</option>
                      <option value="fashion">Moda</option>
                      <option value="home">Casa e Decoração</option>
                      <option value="health">Saúde e Beleza</option>
                      <option value="sports">Esportes</option>
                      <option value="books">Livros</option>
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
                      <option value="affiliate">Afiliado</option>
                      <option value="own_physical">Físico Próprio</option>
                      <option value="own_digital">Digital Próprio</option>
                      <option value="ebook">eBook</option>
                      <option value="course">Curso</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Preços</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentPrice">Preço *</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
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
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status do Produto</Label>
                  <select
                    id="status"
                    className="w-full p-2 border rounded-md mt-1"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Ações</h2>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Você pode editar todas as configurações avançadas após criar o produto.
                </p>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full gap-2"
                >
                  {loading ? "Salvando..." : (
                    <>
                      <Save className="h-4 w-4" />
                      Criar Produto
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/admin/products")}
                  disabled={loading}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}