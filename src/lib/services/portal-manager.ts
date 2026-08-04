import { PortalConfig } from "@/types"

const STORAGE_KEY = "multiportal_portals"

// Templates disponíveis
export const TEMPLATES = [
  {
    id: "offers-portal",
    name: "Portal de Ofertas",
    description: "Portal focado em ofertas, descontos e promoções",
    icon: "🔥",
    category: "comércio",
    defaultColors: { primary: "#dc2626", secondary: "#2563eb" },
  },
  {
    id: "monetized-blog",
    name: "Blog Monetizado",
    description: "Blog com monetização por artigos e afiliados",
    icon: "📝",
    category: "conteúdo",
    defaultColors: { primary: "#10b981", secondary: "#8b5cf6" },
  },
  {
    id: "affiliate-portal",
    name: "Portal de Afiliados",
    description: "Portal especializado em produtos afiliados",
    icon: "💰",
    category: "afiliados",
    defaultColors: { primary: "#f59e0b", secondary: "#7c3aed" },
  },
  {
    id: "own-products",
    name: "Produtos Próprios",
    description: "Portal para venda de produtos próprios",
    icon: "📦",
    category: "e-commerce",
    defaultColors: { primary: "#3b82f6", secondary: "#10b981" },
  },
  {
    id: "hybrid-portal",
    name: "Portal Híbrido",
    description: "Combinação de produtos próprios e afiliados",
    icon: "🔄",
    category: "híbrido",
    defaultColors: { primary: "#8b5cf6", secondary: "#3b82f6" },
  },
  {
    id: "books-ebooks",
    name: "Livros e eBooks",
    description: "Portal especializado em livros e eBooks digitais",
    icon: "📚",
    category: "digital",
    defaultColors: { primary: "#8b5cf6", secondary: "#ec4899" },
  },
  {
    id: "apps-portal",
    name: "Aplicativos",
    description: "Portal para aplicativos móveis e software",
    icon: "📱",
    category: "tecnologia",
    defaultColors: { primary: "#3b82f6", secondary: "#06b6d4" },
  },
  {
    id: "health-wellness",
    name: "Saúde e Bem-Estar",
    description: "Portal para produtos de saúde e bem-estar",
    icon: "💊",
    category: "saúde",
    defaultColors: { primary: "#10b981", secondary: "#3b82f6" },
  },
  {
    id: "3d-printing",
    name: "Impressão 3D",
    description: "Portal para produtos de impressão 3D",
    icon: "🖨️",
    category: "tecnologia",
    defaultColors: { primary: "#2563eb", secondary: "#7c3aed" },
  },
]

// Países disponíveis
export const COUNTRIES = [
  { code: "BR", name: "Brasil", language: "pt-BR", currency: "BRL", flag: "🇧🇷" },
  { code: "PT", name: "Portugal", language: "pt-PT", currency: "EUR", flag: "🇵🇹" },
  { code: "US", name: "Estados Unidos", language: "en-US", currency: "USD", flag: "🇺🇸" },
  { code: "ES", name: "Espanha", language: "es-ES", currency: "EUR", flag: "🇪🇸" },
  { code: "FR", name: "França", language: "fr-FR", currency: "EUR", flag: "🇫🇷" },
  { code: "DE", name: "Alemanha", language: "de-DE", currency: "EUR", flag: "🇩🇪" },
  { code: "IT", name: "Itália", language: "it-IT", currency: "EUR", flag: "🇮🇹" },
  { code: "UK", name: "Reino Unido", language: "en-GB", currency: "GBP", flag: "🇬🇧" },
  { code: "CA", name: "Canadá", language: "en-CA", currency: "CAD", flag: "🇨🇦" },
  { code: "AU", name: "Austrália", language: "en-AU", currency: "AUD", flag: "🇦🇺" },
]

// Categorias disponíveis
export const CATEGORIES = [
  { id: "electronics", name: "Eletrônicos", icon: "💻" },
  { id: "fashion", name: "Moda", icon: "👕" },
  { id: "home", name: "Casa e Decoração", icon: "🏠" },
  { id: "health", name: "Saúde e Beleza", icon: "💄" },
  { id: "sports", name: "Esportes", icon: "⚽" },
  { id: "books", name: "Livros", icon: "📚" },
  { id: "toys", name: "Brinquedos", icon: "🧸" },
  { id: "food", name: "Alimentos", icon: "🍎" },
  { id: "automotive", name: "Automotivo", icon: "🚗" },
  { id: "tools", name: "Ferramentas", icon: "🔧" },
  { id: "garden", name: "Jardim", icon: "🌱" },
  { id: "pets", name: "Pets", icon: "🐕" },
]

// Funções de localStorage
export function getPortals(): PortalConfig[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const portals = JSON.parse(stored)
      // Converter strings de data para Date objects
      return portals.map((portal: any) => ({
        ...portal,
        createdAt: new Date(portal.createdAt),
        updatedAt: new Date(portal.updatedAt),
      }))
    }
  } catch (error) {
    console.error("Erro ao ler portais do localStorage:", error)
  }
  
  return []
}

export function savePortals(portals: PortalConfig[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portals))
  } catch (error) {
    console.error("Erro ao salvar portais no localStorage:", error)
  }
}

export function addPortal(portal: PortalConfig): void {
  const portals = getPortals()
  portals.push(portal)
  savePortals(portals)
}

export function updatePortal(id: string, updates: Partial<PortalConfig>): void {
  const portals = getPortals()
  const index = portals.findIndex(p => p.id === id)
  if (index !== -1) {
    portals[index] = {
      ...portals[index],
      ...updates,
      updatedAt: new Date(),
    }
    savePortals(portals)
  }
}

export function deletePortal(id: string): void {
  const portals = getPortals()
  const filtered = portals.filter(p => p.id !== id)
  savePortals(filtered)
}

export function getPortalById(id: string): PortalConfig | undefined {
  const portals = getPortals()
  return portals.find(p => p.id === id)
}

export function duplicatePortal(id: string): PortalConfig | null {
  const portal = getPortalById(id)
  if (!portal) return null
  
  const newPortal: PortalConfig = {
    ...portal,
    id: `${portal.id}-copy-${Date.now()}`,
    name: `${portal.name} (Cópia)`,
    slug: `${portal.slug}-copy`,
    domain: `copy-${portal.domain}`,
    subdomain: portal.subdomain ? `copy-${portal.subdomain}` : undefined,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  addPortal(newPortal)
  return newPortal
}

export function togglePortalStatus(id: string): void {
  const portal = getPortalById(id)
  if (portal) {
    updatePortal(id, { isActive: !portal.isActive })
  }
}

// Gerar ID único
export function generatePortalId(): string {
  return `portal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Configuração inicial baseada em template
export function getDefaultConfig(templateId: string): Partial<PortalConfig> {
  const template = TEMPLATES.find(t => t.id === templateId)
  if (!template) return {}
  
  const baseId = generatePortalId()
  
  return {
    id: baseId,
    name: `Novo ${template.name}`,
    slug: `novo-${template.id}`,
    domain: "meu-portal.com",
    logo: "/images/portals/default-logo.svg",
    favicon: "/images/portals/default-favicon.ico",
    country: "BR",
    language: "pt-BR",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    primaryColor: template.defaultColors.primary,
    secondaryColor: template.defaultColors.secondary,
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    menuItems: [
      { id: "home", label: "Início", href: "/", order: 1 },
      { id: "products", label: "Produtos", href: "/products", order: 2 },
      { id: "blog", label: "Blog", href: "/blog", order: 3 },
      { id: "about", label: "Sobre", href: "/about", order: 4 },
      { id: "contact", label: "Contato", href: "/contact", order: 5 },
    ],
    footerLinks: [
      {
        id: "products",
        title: "Produtos",
        links: [
          { id: "all", label: "Todos os Produtos", href: "/products" },
          { id: "featured", label: "Destaques", href: "/featured" },
          { id: "categories", label: "Categorias", href: "/categories" },
        ],
      },
      {
        id: "company",
        title: "Empresa",
        links: [
          { id: "about", label: "Sobre Nós", href: "/about" },
          { id: "contact", label: "Contato", href: "/contact" },
          { id: "privacy", label: "Privacidade", href: "/privacy" },
        ],
      },
    ],
    socialLinks: {},
    affiliateDisclaimer: "Este portal contém links afiliados. Ao comprar através destes links, podemos receber uma comissão sem custo adicional para você.",
    showAffiliateDisclaimer: true,
    seo: {
      defaultTitle: `Novo ${template.name} - Descubra as Melhores Ofertas`,
      defaultDescription: `Portal ${template.name.toLowerCase()} com produtos selecionados e conteúdo especializado.`,
      keywords: [template.category, "produtos", "ofertas"],
      robots: "index, follow",
    },
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
    settings: {
      contactEmail: "contato@meu-portal.com",
      privacyPolicyUrl: "/privacy",
      termsOfServiceUrl: "/terms",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    isDefault: false,
  }
}