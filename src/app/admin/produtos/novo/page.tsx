"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Upload, X, Link as LinkIcon } from "lucide-react"
import { 
  productService, 
  categoryService, 
  storeService, 
  couponService,
  uploadService 
} from "@/lib/supabase/services"

const countries = [
  { code: "PT", name: "Portugal", currency: "EUR" },
  { code: "BR", name: "Brasil", currency: "BRL" },
  { code: "ES", name: "Espanha", currency: "EUR" },
  { code: "FR", name: "França", currency: "EUR" },
  { code: "IT", name: "Itália", currency: "EUR" },
  { code: "US", name: "Estados Unidos", currency: "USD" }
]

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Dados para selects
  const [categories, setCategories] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    original_price: 0,
    current_price: 0,
    category_id: "",
    store_id: "",
    country_code: "PT",
    currency: "EUR",
    original_url: "",
    affiliate_url: "",
    coupon_id: "",
    featured_image_url: "",
    seo_title: "",
    seo_description: "",
    meta_keywords: [] as string[],
    status: "draft" as "draft" | "published",
    is_featured: false,
    is_deal_of_day: false
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [keywordsInput, setKeywordsInput] = useState("")

  useEffect(() => {
    loadSelectData()
  }, [])

  const loadSelectData = async () => {
    try {
      const [categoriesData, storesData, couponsData] = await Promise.all([
        categoryService.getAll(),
        storeService.getAll(),
        couponService.getAll(true)
      ])
      
      setCategories(categoriesData)
      setStores(storesData)
      setCoupons(couponsData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, featured_image_url: "" }))
    }
  }

  const handleUploadImage = async () => {
    if (!imageFile) return
    
    try {
      setLoading(true)
      const imageUrl = await uploadService.uploadImage(imageFile)
      setFormData(prev => ({ ...prev, featured_image_url: imageUrl }))
      setImagePreview("")
      setImageFile(null)
      setSuccess("Imagem carregada com sucesso!")
    } catch (error: any) {
      setError("Erro ao carregar imagem: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleKeywordsChange = (keywords: string) => {
    setKeywordsInput(keywords)
    const keywordArray = keywords
      .split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0)
    setFormData(prev => ({ ...prev, meta_keywords: keywordArray }))
  }

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode)
    setFormData(prev => ({
      ...prev,
      country_code: countryCode,
      currency: country?.currency || "EUR"
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validação básica
    if (!formData.name || !formData.current_price || !formData.affiliate_url) {
      setError("Preencha os campos obrigatórios: Nome, Preço atual e Link de afiliado")
      setLoading(false)
      return
    }

    try {
      await productService.create({
        ...formData,
        view_count: 0,
        click_count: 0,
        created_by: 'system',
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      })
      setSuccess("Produto criado com sucesso!")
      setTimeout(() => {
        router.push("/admin/produtos")
      }, 1500)
    } catch (error: any) {
      setError("Erro ao criar produto: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Novo Produto</h1>
          <p className="text-gray-400 mt-2">Cadastre um novo produto no portal</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-green-400">{success}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Portátil Lenovo Ideapad 5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL amigável)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="portatil-lenovo-ideapad-5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                País
              </label>
              <select
                value={formData.country_code}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição Curta *
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="Descrição breve que aparece nas listagens"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição Completa
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={6}
                placeholder="Descrição detalhada do produto..."
              />
            </div>
          </div>
        </div>

        {/* Preços */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Preços</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preço Original
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preço Atual *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.current_price}
                onChange={(e) => setFormData(prev => ({ ...prev, current_price: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Moeda
              </label>
              <input
                type="text"
                value={formData.currency}
                readOnly
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* Categoria e Loja */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Categoria e Loja</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loja
              </label>
              <select
                value={formData.store_id}
                onChange={(e) => setFormData(prev => ({ ...prev, store_id: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione uma loja</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cupom
              </label>
              <select
                value={formData.coupon_id}
                onChange={(e) => setFormData(prev => ({ ...prev, coupon_id: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Sem cupom</option>
                {coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.code} - {coupon.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Links</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link Original
              </label>
              <input
                type="url"
                value={formData.original_url}
                onChange={(e) => setFormData(prev => ({ ...prev, original_url: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://www.exemplo.com/produto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link de Afiliado *
              </label>
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type="url"
                  value={formData.affiliate_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, affiliate_url: e.target.value }))}
                  className="flex-1 px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://www.exemplo.com/produto?afiliado=..."
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Imagem */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Imagem Principal</h2>
          
          <div className="space-y-6">
            {/* URL da imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            {/* Upload de arquivo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload de Imagem
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                  />
                  {imageFile && (
                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={loading}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? "Carregando..." : "Carregar"}
                    </button>
                  )}
                </div>
                
                {imagePreview && (
                  <div className="relative w-40 h-40">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("")
                        setImageFile(null)
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {formData.featured_image_url && !imagePreview && (
                  <div className="relative w-40 h-40">
                    <img
                      src={formData.featured_image_url}
                      alt="Imagem carregada"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">SEO</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título SEO
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Título otimizado para busca"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição SEO
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="Descrição otimizada para busca (até 160 caracteres)"
                maxLength={160}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Palavras-chave
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Separadas por vírgula: produto, oferta, desconto"
              />
              <p className="mt-2 text-sm text-gray-400">
                {formData.meta_keywords.length} palavras-chave adicionadas
              </p>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Configurações</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "draft" | "published" }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="h-5 w-5 text-orange-500 rounded focus:ring-orange-500 focus:ring-offset-gray-800"
                />
                <span className="text-gray-300">Produto em Destaque</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_deal_of_day}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_deal_of_day: e.target.checked }))}
                  className="h-5 w-5 text-orange-500 rounded focus:ring-orange-500 focus:ring-offset-gray-800"
                />
                <span className="text-gray-300">Oferta do Dia</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/produtos")}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              "Salvando..."
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Salvar Produto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}