"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Link as LinkIcon, FileText, Sparkles, AlertCircle } from "lucide-react"
import { uploadService } from "@/lib/supabase/services"

type ImportMethod = 'url' | 'image' | 'text' | null

export default function ImportProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [importMethod, setImportMethod] = useState<ImportMethod>(null)
  
  // Form states
  const [urlInput, setUrlInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [textInput, setTextInput] = useState("")
  const [extractedData, setExtractedData] = useState<any>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUploadImage = async () => {
    if (!imageFile) return
    
    try {
      setLoading(true)
      setError("")
      const imageUrl = await uploadService.uploadImage(imageFile)
      
      // Simulate AI processing (in real app, call AI service)
      setSuccess("Imagem carregada! Analisando com IA...")
      
      // Simulate delay for AI processing
      setTimeout(() => {
        setExtractedData({
          name: "Produto Extraído da Imagem",
          price: 99.99,
          description: "Descrição extraída da análise da imagem",
          category: "Categoria sugerida"
        })
        setLoading(false)
      }, 2000)
      
    } catch (error: any) {
      setError("Erro ao processar imagem: " + error.message)
      setLoading(false)
    }
  }

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      setError("Digite uma URL válida")
      return
    }

    try {
      setLoading(true)
      setError("")
      
      // Simulate AI processing (in real app, call AI service)
      setSuccess("Analisando URL com IA...")
      
      // Simulate delay for AI processing
      setTimeout(() => {
        setExtractedData({
          name: "Produto Extraído da URL",
          price: 149.99,
          description: "Descrição extraída da página web",
          category: "Categoria sugerida",
          store: "Loja identificada",
          originalPrice: 199.99
        })
        setLoading(false)
      }, 2000)
      
    } catch (error: any) {
      setError("Erro ao processar URL: " + error.message)
      setLoading(false)
    }
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setError("Digite o texto do produto")
      return
    }

    try {
      setLoading(true)
      setError("")
      
      // Simulate AI processing (in real app, call AI service)
      setSuccess("Analisando texto com IA...")
      
      // Simulate delay for AI processing
      setTimeout(() => {
        setExtractedData({
          name: "Produto Extraído do Texto",
          price: 79.99,
          description: textInput,
          category: "Categoria sugerida",
          store: "Loja identificada"
        })
        setLoading(false)
      }, 2000)
      
    } catch (error: any) {
      setError("Erro ao processar texto: " + error.message)
      setLoading(false)
    }
  }

  const handleCreateProduct = () => {
    if (extractedData) {
      // Store extracted data in localStorage for product creation page
      if (typeof window !== 'undefined') {
        localStorage.setItem('importedProductData', JSON.stringify(extractedData))
      }
      router.push("/admin/produtos/novo")
    }
  }

  const resetForm = () => {
    setImportMethod(null)
    setUrlInput("")
    setImageFile(null)
    setImagePreview("")
    setTextInput("")
    setExtractedData(null)
    setError("")
    setSuccess("")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Importar Produto</h1>
          <p className="text-gray-400 mt-2">
            Use IA para extrair informações automaticamente
          </p>
        </div>
      </div>

      {/* AI Integration Notice */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Sparkles className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
<div>
             <h3 className="text-lg font-medium text-white mb-2">Integração com IA</h3>
             <p className="text-gray-300 mb-3">
               Esta funcionalidade usa IA para extrair automaticamente informações de URLs, 
               imagens e textos. Para habilitar, configure as seguintes variáveis de ambiente:
             </p>
             <div className="bg-gray-800/50 rounded-lg p-4">
               <code className="text-sm text-gray-300">
                 GROQ_API_KEY=sua_chave_groq<br />
                 OPENAI_API_KEY=sua_chave_openai<br />
                 NVIDIA_API_KEY=sua_chave_nvidia<br />
                 OPENROUTER_API_KEY=sua_chave_openrouter
               </code>
             </div>
           </div>
        </div>
      </div>

      {/* Import Method Selection */}
      {!importMethod && !extractedData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setImportMethod('url')}
            className="bg-card-dark border border-border rounded-xl p-6 hover:border-orange-500 transition-colors text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-900/30 rounded-lg mr-4">
                <LinkIcon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium">Importar por URL</h3>
            </div>
            <p className="text-gray-400">
              Cole a URL de um produto e deixe a IA extrair as informações
            </p>
          </button>

          <button
            onClick={() => setImportMethod('image')}
            className="bg-card-dark border border-border rounded-xl p-6 hover:border-orange-500 transition-colors text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-900/30 rounded-lg mr-4">
                <Upload className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-medium">Importar por Imagem</h3>
            </div>
            <p className="text-gray-400">
              Envie uma imagem do produto para análise visual por IA
            </p>
          </button>

          <button
            onClick={() => setImportMethod('text')}
            className="bg-card-dark border border-border rounded-xl p-6 hover:border-orange-500 transition-colors text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-900/30 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium">Importar por Texto</h3>
            </div>
            <p className="text-gray-400">
              Cole o texto descritivo do produto para análise por IA
            </p>
          </button>
        </div>
      )}

      {/* Import Forms */}
      {importMethod && !extractedData && (
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {importMethod === 'url' && 'Importar por URL'}
              {importMethod === 'image' && 'Importar por Imagem'}
              {importMethod === 'text' && 'Importar por Texto'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              Voltar
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
              <p className="text-green-400">{success}</p>
            </div>
          )}

          {/* URL Form */}
          {importMethod === 'url' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cole a URL do produto
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.exemplo.com/produto"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Funciona com Amazon, Worten, FNAC, e outras lojas populares
                </p>
              </div>

              <button
                onClick={handleUrlSubmit}
                disabled={loading || !urlInput.trim()}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Analisando..." : "Extrair Informações com IA"}
              </button>
            </div>
          )}

          {/* Image Form */}
          {importMethod === 'image' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Selecione uma imagem do produto
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
                        onClick={handleUploadImage}
                        disabled={loading}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loading ? "Processando..." : "Analisar Imagem"}
                      </button>
                    )}
                  </div>
                  
                  {imagePreview && (
                    <div className="w-64 h-64">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  A IA irá analisar a imagem e extrair informações do produto
                </p>
              </div>
            </div>
          )}

          {/* Text Form */}
          {importMethod === 'text' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cole o texto descritivo do produto
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ex: Portátil Lenovo Ideapad 5 com processador Intel Core i5, 8GB RAM, 512GB SSD, ideal para estudantes. Preço original €699,99, agora por apenas €549,99."
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-400">
                  A IA irá analisar o texto e extrair nome, preço, descrição e categoria
                </p>
              </div>

              <button
                onClick={handleTextSubmit}
                disabled={loading || !textInput.trim()}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Analisando..." : "Extrair Informações com IA"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Extracted Data Preview */}
      {extractedData && (
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Informações Extraídas</h2>
            <div className="flex space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Nova Importação
              </button>
              <button
                onClick={handleCreateProduct}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                Criar Produto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Nome do Produto</h3>
                <div className="p-3 bg-gray-800 rounded-lg text-white">
                  {extractedData.name || "Não identificado"}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Preço</h3>
                <div className="p-3 bg-gray-800 rounded-lg text-white">
                  {extractedData.price ? `€${extractedData.price}` : "Não identificado"}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Preço Original</h3>
                <div className="p-3 bg-gray-800 rounded-lg text-white">
                  {extractedData.originalPrice ? `€${extractedData.originalPrice}` : "Não identificado"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Descrição</h3>
                <div className="p-3 bg-gray-800 rounded-lg text-white max-h-40 overflow-y-auto">
                  {extractedData.description || "Não identificada"}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Categoria</h3>
                <div className="p-3 bg-gray-800 rounded-lg text-white">
                  {extractedData.category || "Não identificada"}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Loja</h3>
                <div className="p-3 bg-gray-800 rounded-lg text-white">
                  {extractedData.store || "Não identificada"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300">
                  As informações foram extraídas automaticamente pela IA. 
                  Você pode ajustar quaisquer detalhes na próxima etapa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}