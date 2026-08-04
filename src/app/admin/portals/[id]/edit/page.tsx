"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  ArrowLeft, 
  Palette, 
  Globe, 
  Tag, 
  Layout,
  Eye,
  Save,
  Trash2,
  Copy
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  TEMPLATES, 
  COUNTRIES, 
  CATEGORIES, 
  getPortalById,
  updatePortal,
  deletePortal,
  duplicatePortal 
} from "@/lib/services/portal-manager"
import { PortalConfig } from "@/types"

export default function EditPortalPage() {
  const router = useRouter()
  const params = useParams()
  const portalId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [portal, setPortal] = useState<PortalConfig | null>(null)
  
  useEffect(() => {
    const storedPortal = getPortalById(portalId)
    if (storedPortal) {
      setPortal(storedPortal)
    } else {
      // Redirecionar se portal não existir
      router.push("/admin/portals")
    }
  }, [portalId, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!portal) return
    
    setLoading(true)
    
    try {
      updatePortal(portal.id, {
        ...portal,
        updatedAt: new Date(),
      })
      
      // Redirecionar para lista de portais
      router.push("/admin/portals")
    } catch (error) {
      console.error("Erro ao atualizar portal:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (!portal) return
    
    if (confirm("Tem certeza que deseja excluir este portal? Esta ação não pode ser desfeita.")) {
      deletePortal(portal.id)
      router.push("/admin/portals")
    }
  }

  const handleDuplicate = () => {
    if (!portal) return
    
    const newPortal = duplicatePortal(portal.id)
    if (newPortal) {
      router.push(`/admin/portals/${newPortal.id}/edit`)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (!portal) return
    setPortal({ ...portal, [field]: value })
  }

  if (!portal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-600 mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Carregando portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/portals">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Portal</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {portal.name} • {portal.domain}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </Button>
              <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Informações Básicas
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Portal *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={portal.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Domínio *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={portal.domain}
                      onChange={(e) => handleInputChange("domain", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subdomínio
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={portal.subdomain || ""}
                      onChange={(e) => handleInputChange("subdomain", e.target.value)}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={portal.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      value={portal.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Localização
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      País *
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={portal.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Idioma *
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={portal.language}
                      onChange={(e) => handleInputChange("language", e.target.value)}
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="pt-PT">Português (Portugal)</option>
                      <option value="en-US">Inglês (EUA)</option>
                      <option value="es-ES">Espanhol (Espanha)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Moeda *
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={portal.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                    >
                      <option value="BRL">Real Brasileiro (BRL)</option>
                      <option value="USD">Dólar Americano (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">Libra Esterlina (GBP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fuso Horário *
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={portal.timezone}
                      onChange={(e) => handleInputChange("timezone", e.target.value)}
                    >
                      <option value="America/Sao_Paulo">America/São Paulo (GMT-3)</option>
                      <option value="Europe/Lisbon">Europe/Lisbon (GMT+0/+1)</option>
                      <option value="America/New_York">America/New York (GMT-5)</option>
                      <option value="Europe/London">Europe/London (GMT+0/+1)</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Aparência
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cor Primária
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        className="h-12 w-20 rounded border border-gray-300"
                        value={portal.primaryColor}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      />
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        value={portal.primaryColor}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cor Secundária
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        className="h-12 w-20 rounded border border-gray-300"
                        value={portal.secondaryColor}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      />
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        value={portal.secondaryColor}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div 
                    className="h-12 px-6 flex items-center"
                    style={{ backgroundColor: portal.primaryColor }}
                  >
                    <div className="text-white font-bold">Logo</div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-800">
                    <div className="flex gap-4 mb-4">
                      <Button 
                        style={{ backgroundColor: portal.primaryColor }}
                        className="text-white"
                      >
                        Botão Primário
                      </Button>
                      <Button 
                        variant="outline"
                        style={{ borderColor: portal.secondaryColor, color: portal.secondaryColor }}
                      >
                        Botão Secundário
                      </Button>
                    </div>
                    <div 
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `${portal.primaryColor}20` }}
                    >
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Card de Exemplo</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Este é um exemplo de card com cor de fundo derivada da cor primária.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Configurações
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Status</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {portal.isActive ? "Portal ativo" : "Portal inativo"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange("isActive", !portal.isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${portal.isActive ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${portal.isActive ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Portal Padrão</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {portal.isDefault ? "Este é o portal padrão" : "Não é o portal padrão"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange("isDefault", !portal.isDefault)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${portal.isDefault ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${portal.isDefault ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Categorias
                </h2>
                
                <div className="space-y-3">
                  {CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={(portal.categories || []).includes(category.id)}
                        onChange={(e) => {
                          const currentCategories = portal.categories || []
                          const newCategories = e.target.checked
                            ? [...currentCategories, category.id]
                            : currentCategories.filter(id => id !== category.id)
                          handleInputChange("categories", newCategories)
                        }}
                        className="h-5 w-5 rounded border-gray-300 text-primary"
                      />
                      <label htmlFor={`category-${category.id}`} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="text-lg">{category.icon}</span>
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Afiliados
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showAffiliateDisclaimer"
                      checked={portal.showAffiliateDisclaimer}
                      onChange={(e) => handleInputChange("showAffiliateDisclaimer", e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-primary"
                    />
                    <label htmlFor="showAffiliateDisclaimer" className="text-gray-700 dark:text-gray-300">
                      Exibir aviso de afiliados
                    </label>
                  </div>
                  
                  {portal.showAffiliateDisclaimer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Texto do Aviso
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        value={portal.affiliateDisclaimer}
                        onChange={(e) => handleInputChange("affiliateDisclaimer", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Criado em</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {portal.createdAt.toLocaleDateString()} {portal.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Atualizado em</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {portal.updatedAt.toLocaleDateString()} {portal.updatedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="sticky bottom-6">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}