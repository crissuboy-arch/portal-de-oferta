"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Globe, 
  Calendar,
  TrendingUp,
  Users,
  Search,
  Filter
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getPortals, 
  deletePortal, 
  duplicatePortal, 
  togglePortalStatus,
  TEMPLATES,
  COUNTRIES 
} from "@/lib/services/portal-manager"
import { PortalConfig } from "@/types"

export default function PortalsPage() {
  const [portals, setPortals] = useState<PortalConfig[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const storedPortals = getPortals()
    // Se não houver portais, inicialize com alguns exemplos
    if (storedPortals.length === 0) {
      const initialPortals = [
        {
          id: "offers-portal-1",
          name: "Ofertas Brasil",
          slug: "ofertas-brasil",
          description: "Portal de ofertas para o mercado brasileiro",
          domain: "ofertasbrasil.com",
          subdomain: "br",
          logo: "/images/portals/default-logo.svg",
          favicon: "/images/portals/default-favicon.ico",
          country: "BR",
          language: "pt-BR",
          currency: "BRL",
          timezone: "America/Sao_Paulo",
          primaryColor: "#dc2626",
          secondaryColor: "#2563eb",
          menuItems: [],
          footerLinks: [],
          socialLinks: {},
          affiliateDisclaimer: "",
          showAffiliateDisclaimer: true,
          seo: { defaultTitle: "", defaultDescription: "", keywords: [], robots: "" },
          features: {
            enableBlog: true,
            enableProducts: true,
            enableAffiliates: true,
            enableMultiCountry: false,
            enableAdminPanel: true,
            enableUserAccounts: true,
            enableCheckout: true,
            enableReviews: true,
            enableNewsletter: true,
            enableSearch: true,
          },
          settings: { contactEmail: "" },
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          isDefault: false,
        },
      ]
      localStorage.setItem("multiportal_portals", JSON.stringify(initialPortals))
      setPortals(initialPortals)
    } else {
      setPortals(storedPortals)
    }
  }, [])

  const filteredPortals = portals.filter(portal => {
    const matchesSearch = portal.name.toLowerCase().includes(search.toLowerCase()) ||
                         portal.description.toLowerCase().includes(search.toLowerCase())
    
    if (filter === "all") return matchesSearch
    if (filter === "active") return matchesSearch && portal.isActive
    if (filter === "inactive") return matchesSearch && !portal.isActive
    
    return matchesSearch
  })

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este portal?")) {
      deletePortal(id)
      setPortals(getPortals())
    }
  }

  const handleDuplicate = (id: string) => {
    duplicatePortal(id)
    setPortals(getPortals())
  }

  const handleToggleStatus = (id: string) => {
    togglePortalStatus(id)
    setPortals(getPortals())
  }

  const getTemplateIcon = (portal: PortalConfig) => {
    // Implementação simplificada - em produção identificaria template pelo ID
    if (portal.name.includes("3D")) return "🖨️"
    if (portal.name.includes("Saúde")) return "💊"
    if (portal.name.includes("eBook")) return "📚"
    return "🌐"
  }

  const getCountryFlag = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode)
    return country?.flag || "🏳️"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portais</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie todos os portais da sua plataforma
              </p>
            </div>
            <Link href="/admin/portals/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar portais por nome ou descrição..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                onClick={() => setFilter("all")}
              >
                Todos
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${filter === "active" ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                onClick={() => setFilter("active")}
              >
                Ativos
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${filter === "inactive" ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
                onClick={() => setFilter("inactive")}
              >
                Inativos
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Portals Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        {filteredPortals.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-600 mb-4">🌐</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum portal encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {search || filter !== "all" 
                ? "Tente ajustar sua busca ou filtro"
                : "Comece criando seu primeiro portal"}
            </p>
            <Link href="/admin/portals/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Portal
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortals.map((portal) => (
              <Card key={portal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Portal Header */}
                <div 
                  className="h-3"
                  style={{ backgroundColor: portal.primaryColor }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: portal.secondaryColor }}
                      >
                        <span className="text-lg">{getTemplateIcon(portal)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{portal.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{portal.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {portal.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <Eye className="h-3 w-3" />
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          <EyeOff className="h-3 w-3" />
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Portal Info */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {portal.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {getCountryFlag(portal.country)} {portal.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {portal.currency}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/portals/${portal.id}/edit`} className="flex-1 min-w-[120px]">
                      <Button variant="outline" className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => handleToggleStatus(portal.id)}
                      className="flex-1 min-w-[120px]"
                    >
                      {portal.isActive ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDuplicate(portal.id)}
                      className="flex-1 min-w-[120px]"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDelete(portal.id)}
                      className="flex-1 min-w-[120px] text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
                    <span>Criado em {portal.createdAt.toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded ${portal.isDefault ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                      {portal.isDefault ? "Padrão" : "Personalizado"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <Card className="mt-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{portals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total de Portais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {portals.filter(p => p.isActive).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Portais Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(portals.map(p => p.country)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Países</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {TEMPLATES.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Templates</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}