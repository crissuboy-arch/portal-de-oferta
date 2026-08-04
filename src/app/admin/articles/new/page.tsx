"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Image as ImageIcon, Link as LinkIcon, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Article, ArticleType } from "@/types"
import { 
  addArticle,
  updateArticle,
  getArticleById,
  ARTICLE_CATEGORIES,
  initializeDemoArticles,
  generateArticleId
} from "@/lib/services/article-manager"
import { slugify } from "@/lib/utils"

interface ArticleFormProps {
  id?: string
}

export default function ArticleForm({ id }: ArticleFormProps) {
  const router = useRouter()
  const isEditMode = !!id
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    slug: "",
    content: "# Novo Artigo\n\nComece a escrever seu artigo aqui...",
    categoryId: "tech",
    type: "guide",
    isFeatured: false,
    isPublished: false,
    readTime: 5,
    publishedAt: new Date().toISOString().split('T')[0],
    coverImage: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    relatedProductIds: [] as string[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Inicializar dados demo
  useEffect(() => {
    initializeDemoArticles()
  }, [])

  // Carregar dados do artigo se estiver em modo de edição
  useEffect(() => {
    if (isEditMode) {
      const article = getArticleById(id)
      if (article) {
        setFormData({
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          content: article.content,
          categoryId: article.category || "tech",
          type: article.type,
          isFeatured: article.isFeatured,
          isPublished: article.status === "published",
          readTime: article.readTime,
          publishedAt: article.publishedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          coverImage: article.coverImage || "",
          metaTitle: article.seoTitle || article.title,
          metaDescription: article.seoDescription || article.excerpt,
          metaKeywords: (article.keywords || []).join(", "),
          relatedProductIds: (article.relatedProducts || []).map((p: any) => p.productId)
        })
      }
    }
  }, [id, isEditMode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Gerar slug automático do título
    if (name === "title" && !isEditMode) {
      setFormData(prev => ({ ...prev, slug: slugify(value) }))
      setFormData(prev => ({ ...prev, metaTitle: value }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseInt(value) || 0
    setFormData(prev => ({ ...prev, [name]: numValue }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) newErrors.title = "Título é obrigatório"
    if (!formData.slug.trim()) newErrors.slug = "Slug é obrigatório"
    if (!formData.excerpt.trim()) newErrors.excerpt = "Resumo é obrigatório"
    if (!formData.content.trim()) newErrors.content = "Conteúdo é obrigatório"
    if (!formData.categoryId) newErrors.categoryId = "Categoria é obrigatória"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

const articleData: Partial<Article> = {
        type: formData.type as ArticleType,
        status: formData.isPublished ? "published" : "draft",
        title: formData.title,
        excerpt: formData.excerpt,
        slug: formData.slug,
        content: formData.content,
        category: formData.categoryId,
        coverImage: formData.coverImage || "",
        readTime: formData.readTime,
        publishedAt: formData.isPublished ? new Date(formData.publishedAt) : undefined,
        seoTitle: formData.metaTitle,
        seoDescription: formData.metaDescription,
        keywords: formData.metaKeywords.split(",").map(k => k.trim()),
        relatedProducts: formData.relatedProductIds.map(productId => ({
          productId,
          position: "middle" as const,
          title: "",
          description: ""
        })),
        isFeatured: formData.isFeatured,
        views: 0,
        likes: 0,
        shares: 0,
        commentsCount: 0,
        isSponsored: false,
        updatedAt: new Date()
      }

    try {
      if (isEditMode) {
        updateArticle(id, articleData)
      } else {
        const articleId = generateArticleId()
        addArticle({
          id: articleId,
          portalId: "default",
          type: formData.type as any,
          status: formData.isPublished ? "published" : "draft",
          title: formData.title,
          excerpt: formData.excerpt,
          slug: formData.slug,
          content: formData.content,
          category: formData.categoryId,
          coverImage: formData.coverImage || "",
          tags: [],
          keywords: formData.metaKeywords.split(",").map(k => k.trim()),
          author: "Administrador",
          authorAvatar: "",
          authorBio: "",
          countryCodes: ["BR"],
          language: "pt-BR",
          relatedProducts: formData.relatedProductIds.map(productId => ({
            productId,
            position: "middle" as const,
            title: "",
            description: ""
          })),
          faqs: [],
          callToAction: {
            text: "Ver Produtos Relacionados",
            url: "#",
            type: "internal" as const
          },
          seoTitle: formData.metaTitle,
          seoDescription: formData.metaDescription,
          readTime: formData.readTime,
          views: 0,
          likes: 0,
          shares: 0,
          commentsCount: 0,
          isFeatured: formData.isFeatured,
          isSponsored: false,
          publishedAt: formData.isPublished ? new Date(formData.publishedAt) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          scheduledFor: undefined,
          expiresAt: undefined,
          subcategory: ""
        })
      }
      
      router.push("/admin/articles")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar artigo:", error)
      alert("Erro ao salvar artigo. Tente novamente.")
    }
  }

  const getCategoryColor = (categoryId: string) => {
    return ARTICLE_CATEGORIES.find(c => c.id === categoryId)?.color || "bg-gray-100"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Editar Artigo" : "Novo Artigo"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEditMode 
                ? "Atualize as informações do artigo" 
                : "Crie um novo artigo, guia ou comparativo"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push("/admin/articles")}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? "Atualizar Artigo" : "Criar Artigo"}
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-6">Informações Básicas</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="mb-2 block">
                    Título do Artigo *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ex: Guia Completo de Next.js 14"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug" className="mb-2 block">
                    Slug da URL *
                  </Label>
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="Ex: guia-completo-nextjs-14"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={errors.slug ? "border-destructive flex-1" : "flex-1"}
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-destructive text-sm mt-1">{errors.slug}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    O slug será usado na URL: /blog/{formData.slug}
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt" className="mb-2 block">
                    Resumo / Descrição *
                  </Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Descreva brevemente o que o leitor encontrará neste artigo..."
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className={errors.excerpt ? "border-destructive" : ""}
                  />
                  {errors.excerpt && (
                    <p className="text-destructive text-sm mt-1">{errors.excerpt}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Conteúdo */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Conteúdo</h2>
                <div className="text-sm text-muted-foreground">
                  {formData.content.split(/\s+/).length} palavras • ~{Math.ceil(formData.content.split(/\s+/).length /392)} min de leitura
                </div>
              </div>
              
              <Tabs value="edit" onValueChange={() => {}}>
                <TabsList>
                  <TabsTrigger value="edit">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit">
                  <div>
                    <Label htmlFor="content" className="mb-2 block">
                      Conteúdo do Artigo *
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={20}
                      className="font-mono text-sm"
                    />
                    {errors.content && (
                      <p className="text-destructive text-sm mt-1">{errors.content}</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="preview">
                  <div className="prose max-w-none border rounded-lg p-6 min-h-[400px]">
                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Produtos Relacionados */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-6">Produtos Relacionados</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Adicione produtos que estão relacionados a este artigo. Eles aparecerão como recomendações no artigo.
                </p>
                
                {/* Lista de produtos relacionados */}
                {formData.relatedProductIds.length > 0 ? (
                  <div className="space-y-2">
                    {formData.relatedProductIds.map(productId => (
                      <div key={productId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Produto {productId}</div>
                          <div className="text-sm text-muted-foreground">ID: {productId}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              relatedProductIds: prev.relatedProductIds.filter(id => id !== productId)
                            }))
                          }}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-muted-foreground">Nenhum produto relacionado</p>
                  </div>
                )}
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    // Aqui você normalmente abriria um modal para buscar produtos
                    const newProductId = `product-${Date.now()}`
                    setFormData(prev => ({
                      ...prev,
                      relatedProductIds: [...prev.relatedProductIds, newProductId]
                    }))
                  }}
                >
                  + Adicionar Produto
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publicação */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-6">Publicação</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublished" className="mb-1 block">
                      Publicar
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Tornar o artigo público
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
                  />
                </div>

                {formData.isPublished && (
                  <div>
                    <Label htmlFor="publishedAt" className="mb-2 block">
                      Data de Publicação
                    </Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input
                        id="publishedAt"
                        name="publishedAt"
                        type="date"
                        value={formData.publishedAt}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isFeatured" className="mb-1 block">
                      Destacar
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar na página inicial
                    </p>
                  </div>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="readTime" className="mb-2 block">
                    Tempo de Leitura (minutos)
                  </Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.readTime}
                    onChange={(e) => handleNumberChange("readTime", e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Categoria e Tipo */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-6">Categoria e Tipo</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryId" className="mb-2 block">
                    Categoria *
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ARTICLE_CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          formData.categoryId === category.id 
                            ? `${getCategoryColor(category.id)} border-primary` 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectChange("categoryId", category.id)}
                      >
                        <div className="text-lg mb-1">{category.icon}</div>
                        <div className="text-sm font-medium">{category.name}</div>
                      </button>
                    ))}
                  </div>
                  {errors.categoryId && (
                    <p className="text-destructive text-sm mt-1">{errors.categoryId}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type" className="mb-2 block">
                    Tipo de Artigo *
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "guide", label: "Guia", color: "bg-blue-100 text-blue-800" },
                      { value: "review", label: "Análise", color: "bg-yellow-100 text-yellow-800" },
                      { value: "comparison", label: "Comparativo", color: "bg-orange-100 text-orange-800" },
                      { value: "tutorial", label: "Tutorial", color: "bg-green-100 text-green-800" },
                      { value: "news", label: "Notícia", color: "bg-purple-100 text-purple-800" }
                    ].map(type => (
                      <button
                        key={type.value}
                        type="button"
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          formData.type === type.value 
                            ? `${type.color} border-primary` 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectChange("type", type.value)}
                      >
                        <div className="text-sm font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* SEO */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-6">Otimização para Buscas (SEO)</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle" className="mb-2 block">
                    Meta Título
                  </Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    placeholder="Título para motores de busca"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recomendado: até 60 caracteres ({formData.metaTitle.length}/60)
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription" className="mb-2 block">
                    Meta Descrição
                  </Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    placeholder="Descrição para resultados de busca..."
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recomendado: até我们发现160 caracteres ({formData.metaDescription.length}/160)
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaKeywords" className="mb-2 block">
                    Palavras-chave
                  </Label>
                  <Input
                    id="metaKeywords"
                    name="metaKeywords"
                    placeholder="palavra1, palavra2, palavra3"
                    value={formData.metaKeywords}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </Card>

            {/* Imagem de Capa */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-6">Imagem de Capa</h2>
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  {formData.coverImage ? (
                    <div 
                      className="w-full h-full bg-cover bg-center rounded-lg"
                      style={{ backgroundImage: `url(${formData.coverImage})` }}
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Sem imagem</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="coverImage" className="mb-2 block">
                    URL da Imagem
                  </Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                  />
                </div>
                
                <Button type="button" variant="outline" className="w-full">
                  Escolher Imagem
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}