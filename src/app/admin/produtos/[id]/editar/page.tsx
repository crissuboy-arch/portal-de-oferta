"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import ImageUploader from "@/components/admin/image-uploader"
import { db } from "@/lib/database"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    category: "tecnologia",
    subcategory: "",
    store: "",
    country: "PT",
    language: "pt-PT",
    currency: "EUR",
    currentPrice: 0,
    originalPrice: 0,
    affiliateUrl: "",
    originalUrl: "",
    mainImage: "",
    galleryImages: [] as string[],
    imageAlt: "",
    coupon: "",
    shipping: "Entrega gratuita",
    rating: 0,
    reviewCount: 0,
    type: "affiliate" as "affiliate" | "own_product" | "sponsored" | "digital",
    status: "draft" as "draft" | "published" | "expired",
    isFeatured: false,
    isDealOfTheDay: false,
    startDate: "",
    endDate: "",
    tags: [] as string[],
    seoTitle: "",
    seoDescription: ""
  })

  const [tagInput, setTagInput] = useState("")
  const [galleryImageUrl, setGalleryImageUrl] = useState("")
  const [discount, setDiscount] = useState(0)
  const [savings, setSavings] = useState(0)

  const categories = db.categories.getAll()
  const stores = db.stores.getAll()

  // Carregar produto
  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = () => {
    const product = db.products.getById(params.id)
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        shortDescription: product.shortDescription || "",
        fullDescription: product.fullDescription || "",
        category: product.category || "tecnologia",
        subcategory: product.subcategory || "",
        store: product.store || "",
        country: product.country || "PT",
        language: product.language || "pt-PT",
        currency: product.currency || "EUR",
        currentPrice: product.currentPrice || 0,
        originalPrice: product.originalPrice || 0,
        affiliateUrl: product.affiliateUrl || "",
        originalUrl: product.originalUrl || "",
        mainImage: product.mainImage || "",
        galleryImages: product.galleryImages || [],
        imageAlt: product.imageAlt || "",
        coupon: product.coupon || "",
        shipping: product.shipping || "Entrega gratuita",
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        type: product.type || "affiliate",
        status: product.status || "draft",
        isFeatured: product.isFeatured || false,
        isDealOfTheDay: product.isDealOfTheDay || false,
        startDate: product.startDate || "",
        endDate: product.endDate || "",
        tags: product.tags || [],
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || ""
      })
      
      // Calcular desconto
      if (product.originalPrice > 0 && product.currentPrice > 0) {
        const discountValue = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
        const savingsValue = product.originalPrice - product.currentPrice
        setDiscount(discountValue)
        setSavings(savingsValue)
      }
    }
    setLoading(false)
  }

  // Calcular desconto e economia
  useEffect(() => {
    if (formData.originalPrice > 0 && formData.currentPrice > 0) {
      const discountValue = Math.round(((formData.originalPrice - formData.currentPrice) / formData.originalPrice) * 100)
      const savingsValue = formData.originalPrice - formData.currentPrice
      setDiscount(discountValue)
      setSavings(savingsValue)
    } else {
      setDiscount(0)
      setSavings(0)
    }
  }, [formData.originalPrice, formData.currentPrice])

  // Gerar slug automaticamente
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name])

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddGalleryImage = () => {
    if (galleryImageUrl.trim() && !formData.galleryImages.includes(galleryImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, galleryImageUrl.trim()]
      }))
      setGalleryImageUrl("")
    }
  }

  const handleRemoveGalleryImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter(url => url !== urlToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      // Validar dados obrigatórios
      if (!formData.name || !formData.shortDescription || !formData.currentPrice || !formData.affiliateUrl) {
        throw new Error("Preencha os campos obrigatórios: Nome, Descrição curta, Preço atual e Link de afiliado")
      }

      // Atualizar produto
      const updatedProduct = db.products.update(params.id, {
        ...formData,
        discount,
        savings,
        tags: formData.tags,
        galleryImages: formData.galleryImages
      })

      if (!updatedProduct) {
        throw new Error("Produto não encontrado")
      }

      setSuccess(`Produto "${updatedProduct.name}" atualizado com sucesso!`)
      
      // Recarregar dados
      setTimeout(() => {
        loadProduct()
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar produto")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) {
      db.products.delete(params.id)
      router.push('/admin/produtos')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Carregando produto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/produtos"
            className="inline-flex items-center text-gray-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para produtos
          </Link>
          <h1 className="text-3xl font-bold text-white">Editar Produto</h1>
          <p className="text-gray-400 mt-2">Atualize os dados da oferta</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </button>
        </div>
      </div>

      {/* Mensagens */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-green-400">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção 1: Informações Básicas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do produto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do produto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: MacBook Air M2 13&quot; 256GB"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL amigável)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="macbook-air-m2-13-256gb"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: portal.com/produto/{formData.slug || 'slug-gerado'}
              </p>
            </div>

            {/* Descrição curta */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição curta *
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Descrição breve que aparece nos cards de oferta"
                rows={2}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Máximo 150 caracteres</p>
            </div>

            {/* Descrição completa */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição completa
              </label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Descrição detalhada do produto com características, benefícios, especificações técnicas..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Seção 2: Categorização */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Categorização</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategoria */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subcategoria (opcional)
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => handleInputChange('subcategory', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Portáteis, Smartphones, Tablets"
              />
            </div>

            {/* Loja */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loja *
              </label>
              <select
                value={formData.store}
                onChange={(e) => handleInputChange('store', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma loja</option>
                {stores.map(store => (
                  <option key={store.id} value={store.name}>{store.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Adicione tags (pressione Enter)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
              
              {/* Tags existentes */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção 3: Localização */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Localização</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* País */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                País *
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="PT">Portugal (PT)</option>
                <option value="BR">Brasil (BR)</option>
                <option value="US">Estados Unidos (US)</option>
                <option value="ES">Espanha (ES)</option>
              </select>
            </div>

            {/* Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idioma *
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="pt-PT">Português Portugal (pt-PT)</option>
                <option value="pt-BR">Português Brasil (pt-BR)</option>
                <option value="en-US">Inglês EUA (en-US)</option>
                <option value="es-ES">Espanhol (es-ES)</option>
              </select>
            </div>

            {/* Moeda */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Moeda *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="EUR">Euro (€)</option>
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção 4: Preços */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Preços e Desconto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Preço atual */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preço atual *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.currentPrice}
                onChange={(e) => handleInputChange('currentPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            {/* Preço original */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preço original
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Desconto e economia */}
            <div className="space-y-2">
              <div className="text-sm text-gray-300">Desconto calculado</div>
              <div className="text-2xl font-bold text-green-400">{discount}%</div>
              <div className="text-sm text-gray-400">
                Economia: {savings.toFixed(2)} {formData.currency === 'EUR' ? '€' : formData.currency === 'BRL' ? 'R$' : '$'}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 5: Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Links</h2>
          
          <div className="space-y-6">
            {/* Link de afiliado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link de afiliado *
              </label>
              <input
                type="url"
                value={formData.affiliateUrl}
                onChange={(e) => handleInputChange('affiliateUrl', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://www.amazon.pt/dp/.../?tag=seu-tag"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Este link será usado no botão "Ver oferta" com rel="nofollow sponsored noopener noreferrer"
              </p>
            </div>

            {/* Link original */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link original (opcional)
              </label>
              <input
                type="url"
                value={formData.originalUrl}
                onChange={(e) => handleInputChange('originalUrl', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://www.amazon.pt/dp/..."
              />
            </div>
          </div>
        </div>

        {/* Seção 6: Imagens */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Imagens</h2>
          
          <div className="space-y-6">
            {/* Imagem principal */}
            <div>
              <ImageUploader
                value={formData.mainImage}
                onChange={(url) => handleInputChange('mainImage', url)}
                label="Imagem Principal *"
              />
            </div>

            {/* Texto alternativo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Texto alternativo (alt) da imagem
              </label>
              <input
                type="text"
                value={formData.imageAlt}
                onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Descrição da imagem para acessibilidade"
              />
            </div>

            {/* Galeria de imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Galeria de imagens (opcional)
              </label>
              <div className="space-y-4">
                {/* Input para adicionar imagem */}
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={galleryImageUrl}
                    onChange={(e) => setGalleryImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGalleryImage())}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="URL da imagem adicional"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Preview das imagens da galeria */}
                {formData.galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.galleryImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                          <img
                            src={url}
                            alt={`Galeria ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(url)}
                          className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="sr-only">Remover</span>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 7: Informações adicionais */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Informações Adicionais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cupom */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cupom (opcional)
              </label>
              <input
                type="text"
                value={formData.coupon}
                onChange={(e) => handleInputChange('coupon', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: DESCONTO20"
              />
            </div>

            {/* Frete */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Informações de frete
              </label>
              <input
                type="text"
                value={formData.shipping}
                onChange={(e) => handleInputChange('shipping', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Entrega gratuita"
              />
            </div>

            {/* Avaliação */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Avaliação (1-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="4.5"
              />
            </div>

            {/* Número de avaliações */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Número de avaliações
              </label>
              <input
                type="number"
                min="0"
                value={formData.reviewCount}
                onChange={(e) => handleInputChange('reviewCount', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="128"
              />
            </div>
          </div>
        </div>

        {/* Seção 8: Configurações */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Configurações</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de produto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="affiliate">Afiliado</option>
                <option value="own_product">Produto próprio</option>
                <option value="sponsored">Patrocinado</option>
                <option value="digital">Digital</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="expired">Expirado</option>
              </select>
            </div>

            {/* Data de início */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de início (opcional)
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Data de fim */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de fim (opcional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="mt-6 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                className="h-4 w-4 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500 focus:ring-offset-gray-900"
              />
              <span className="ml-2 text-gray-300">Marcar como produto em destaque</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDealOfTheDay}
                onChange={(e) => handleInputChange('isDealOfTheDay', e.target.checked)}
                className="h-4 w-4 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500 focus:ring-offset-gray-900"
              />
              <span className="ml-2 text-gray-300">Marcar como oferta do dia</span>
            </label>
          </div>
        </div>

        {/* Seção 9: SEO */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">SEO</h2>
          
          <div className="space-y-6">
            {/* Título SEO */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título SEO (opcional)
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Título para motores de busca"
              />
              <p className="text-xs text-gray-500 mt-1">
                Se vazio, será usado o nome do produto
              </p>
            </div>

            {/* Descrição SEO */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição SEO (opcional)
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Descrição para motores de busca"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Se vazio, será usada a descrição curta
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-800">
          <Link
            href="/admin/produtos"
            className="px-6 py-3 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-center"
          >
            Cancelar
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? (
              <span>Salvando...</span>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Salvar Alterações
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              handleInputChange('status', 'published')
              setTimeout(() => {
                const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
                submitButton?.click()
              }, 100)
            }}
            disabled={saving}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Eye className="h-5 w-5 mr-2" />
            Salvar e Publicar
          </button>
        </div>
      </form>
    </div>
  )
}