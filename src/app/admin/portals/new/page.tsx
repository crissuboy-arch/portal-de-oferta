"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Palette, 
  Globe, 
  Tag, 
  Layout,
  Eye,
  Save,
  X
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  TEMPLATES, 
  COUNTRIES, 
  CATEGORIES, 
  getDefaultConfig,
  addPortal 
} from "@/lib/services/portal-manager"
import { PortalConfig } from "@/types"

export default function NewPortalPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<PortalConfig>>({
    template: "offers-portal",
    name: "",
    description: "",
    domain: "",
    subdomain: "",
    country: "BR",
    language: "pt-BR",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    primaryColor: "#2563eb",
    secondaryColor: "#7c3aed",
    categories: [],
    showAffiliateDisclaimer: true,
    affiliateDisclaimer: "Este portal contém links afiliados. Ao comprar através destes links, podemos receber uma comissão sem custo adicional para você.",
  })

  const selectedTemplate = TEMPLATES.find(t => t.id === formData.template)

  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId)
    if (template) {
      const defaults = getDefaultConfig(templateId)
      setFormData(prev => ({
        ...prev,
        ...defaults,
        template: templateId,
        name: `Meu ${template.name}`,
        primaryColor: template.defaultColors.primary,
        secondaryColor: template.defaultColors.secondary,
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Criar portal completo
      const defaults = getDefaultConfig(formData.template || "offers-portal")
      const portal: PortalConfig = {
        ...defaults,
        ...formData,
        id: `portal-${Date.now()}`,
        name: formData.name || defaults.name || "",
        slug: formData.name?.toLowerCase().replace(/\s+/g, "-") || defaults.slug || "",
        domain: formData.domain || defaults.domain || "",
        subdomain: formData.subdomain || defaults.subdomain,
        description: formData.description || defaults.description || "",
        country: formData.country || defaults.country || "",
        language: formData.language || defaults.language || "",
        currency: formData.currency || defaults.currency || "",
        timezone: formData.timezone || defaults.timezone || "",
        primaryColor: formData.primaryColor || defaults.primaryColor || "",
        secondaryColor: formData.secondaryColor || defaults.secondaryColor || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isDefault: false,
      } as PortalConfig

      addPortal(portal)
      
      // Redirecionar para lista de portais
      router.push("/admin/portals")
    } catch (error) {
      console.error("Erro ao criar portal:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const steps = [
    { number: 1, title: "Template", icon: <Layout className="h-5 w-5" /> },
    { number: 2, title: "Configurações", icon: <Globe className="h-5 w-5" /> },
    { number: 3, title: "Aparência", icon: <Palette className="h-5 w-5" /> },
    { number: 4, title: "Conteúdo", icon: <Tag className="h-5 w-5" /> },
    { number: 5, title: "Revisão", icon: <Eye className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/portals">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Novo Portal</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure um novo portal para sua plataforma
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-2">
            {steps.map((stepItem) => (
              <button
                key={stepItem.number}
                onClick={() => setStep(stepItem.number)}
                className={`flex flex-col items-center flex-1 min-w-0 px-4 py-3 ${step === stepItem.number ? "text-primary" : "text-gray-500"}`}
              >
                <div className={`flex items-center justify-center h-10 w-10 rounded-full mb-2 ${step === stepItem.number ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                  {stepItem.icon}
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{stepItem.title}</span>
                <div className={`mt-2 h-1 w-full rounded ${step >= stepItem.number ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`} />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Escolha um Template
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Selecione um template para começar. Cada template vem com configurações pré-definidas.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${formData.template === template.id ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{template.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{template.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {template.description}
                    </p>
                    <div className="flex gap-2">
                      <div 
                        className="h-4 w-8 rounded"
                        style={{ backgroundColor: template.defaultColors.primary }}
                      />
                      <div 
                        className="h-4 w-8 rounded"
                        style={{ backgroundColor: template.defaultColors.secondary }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <div></div>
                <Button onClick={() => setStep(2)}>
                  Continuar
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Basic Configuration */}
          {step === 2 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Configurações Básicas
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
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Meu Portal de Ofertas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva o propósito deste portal..."
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
                    value={formData.domain}
                    onChange={(e) => handleInputChange("domain", e.target.value)}
                    placeholder="Ex: meusite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subdomínio (opcional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.subdomain}
                    onChange={(e) => handleInputChange("subdomain", e.target.value)}
                    placeholder="Ex: blog, loja"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    País *
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.code})
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
                    value={formData.language}
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
                    value={formData.currency}
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
                    value={formData.timezone}
                    onChange={(e) => handleInputChange("timezone", e.target.value)}
                  >
                    <option value="America/Sao_Paulo">America/São Paulo (GMT-3)</option>
                    <option value="Europe/Lisbon">Europe/Lisbon (GMT+0/+1)</option>
                    <option value="America/New_York">America/New York (GMT-5)</option>
                    <option value="Europe/London">Europe/London (GMT+0/+1)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continuar
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Appearance */}
          {step === 3 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Aparência e Cores
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
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    />
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    />
                  </div>
                  <div 
                    className="mt-2 h-4 rounded"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cor Secundária
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      className="h-12 w-20 rounded border border-gray-300"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    />
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    />
                  </div>
                  <div 
                    className="mt-2 h-4 rounded"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                </div>
              </div>

              {/* Color Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Pré-visualização
                </h3>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div 
                    className="h-12 px-6 flex items-center"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    <div className="text-white font-bold">Logo</div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-800">
                    <div className="flex gap-4 mb-4">
                      <Button 
                        style={{ backgroundColor: formData.primaryColor }}
                        className="text-white"
                      >
                        Botão Primário
                      </Button>
                      <Button 
                        variant="outline"
                        style={{ borderColor: formData.secondaryColor, color: formData.secondaryColor }}
                      >
                        Botão Secundário
                      </Button>
                    </div>
                    <div 
                      className="p-4 rounded-lg mb-4"
                      style={{ backgroundColor: `${formData.primaryColor}20` }}
                    >
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Card de Exemplo</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Este é um exemplo de card com cor de fundo derivada da cor primária.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={() => setStep(4)}>
                  Continuar
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step pxam: Content */}
          {step === 4 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Categorias e Conteúdo
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Categorias do Portal
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Selecione as categorias que melhor representam o conteúdo do seu portal.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        const currentCategories = formData.categories || []
                        const isSelected = currentCategories.includes(category.id)
                        const newCategories = isSelected
                          ? currentCategories.filter(id => id !== category.id)
                          : [...currentCategories, category.id]
                        handleInputChange("categories", newCategories)
                      }}
                      className={`p-4 rounded-lg border text-center ${(formData.categories || []).includes(category.id) ? "border-primary bg-primary/10" : "border-gray-200 dark:border-gray-700"}`}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Aviso de Afiliados
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showAffiliateDisclaimer"
                      checked={formData.showAffiliateDisclaimer}
                      onChange={(e) => handleInputChange("showAffiliateDisclaimer", e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-primary"
                    />
                    <label htmlFor="showAffiliateDisclaimer" className="text-gray-700 dark:text-gray-300">
                      Exibir aviso de afiliados no portal
                    </label>
                  </div>
                  
                  {formData.showAffiliateDisclaimer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Texto do Aviso
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        value={formData.affiliateDisclaimer}
                        onChange={(e) => handleInputChange("affiliateDisclaimer", e.target.value)}
                        placeholder="Ex: Este portal contém links afiliados..."
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={() => setStep(5)}>
                  Continuar
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </Card>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Revisão e Criação
              </h2>
              
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Informações Básicas</h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                      <div><strong>Nome:</strong> {formData.name}</div>
                      <div><strong>Descrição:</strong> {formData.description}</div>
                      <div><strong>Domínio:</strong> {formData.domain}</div>
                      <div><strong>Subdomínio:</strong> {formData.subdomain || "Não definido"}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Localização</h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                      <div><strong>País:</strong> {formData.country}</div>
                      <div><strong>Idioma:</strong> {formData.language}</div>
                      <div><strong>Moeda:</strong> {formData.currency}</div>
                      <div><strong>Fuso Horário:</strong> {formData.timezone}</div>
                    </div>
                  </div>
                </div>

                {/* Template */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Template</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{selectedTemplate?.icon}</div>
                    <div>
                      <div className="text-gray-900 dark:text-white">{selectedTemplate?.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{selectedTemplate?.description}</div>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Cores</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-6 w-6 rounded"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <span className="text-gray-600 dark:text-gray-400">Primária: {formData.primaryColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-6 w-6 rounded"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <span className="text-gray-600 dark:text-gray-400">Secundária: {formData.secondaryColor}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Categorias Selecionadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.categories?.map(categoryId => {
                      const category = CATEGORIES.find(c => c.id === categoryId)
                      return category ? (
                        <span key={category.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {category.icon} {category.name}
                        </span>
                      ) : null
                    })}
                    {(formData.categories?.length || 0) === 0 && (
                      <span className="text-gray-500 dark:text-gray-500">Nenhuma categoria selecionada</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(4)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar Portal"}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}