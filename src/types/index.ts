// ==================== PLATAFORMA MULTIPORTAL ====================

export interface PortalConfig {
  // Identificação
  id: string
  name: string
  slug: string
  description: string
  domain: string
  subdomain?: string
  logo: string
  favicon: string
  
  // Template e configurações
  template?: string
  categories?: string[]
  
  // Localização
  country: string
  language: string
  currency: string
  timezone: string
  
  // Cores temáticas
  primaryColor: string
  secondaryColor: string
  accentColor?: string
  backgroundColor?: string
  
  // Menu de navegação
  menuItems: MenuItem[]
  
  // Rodapé
  footerLinks: FooterSection[]
  
  // Redes sociais
  socialLinks: SocialLinks
  
  // Aviso de afiliado
  affiliateDisclaimer?: string
  showAffiliateDisclaimer: boolean
  
  // Configurações de SEO
  seo: SEOConfig
  
  // Funcionalidades habilitadas
  features: PortalFeatures
  
  // Configurações específicas do portal
  settings: PortalSettings
  
  // Metadados
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  isDefault: boolean
}

export interface MenuItem {
  id: string
  label: string
  href: string
  icon?: string
  order: number
  children?: MenuItem[]
  isExternal?: boolean
}

export interface FooterSection {
  id: string
  title: string
  links: FooterLink[]
}

export interface FooterLink {
  id: string
  label: string
  href: string
  isExternal?: boolean
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
  whatsapp?: string
  telegram?: string
}

export interface SEOConfig {
  defaultTitle: string
  defaultDescription: string
  keywords: string[]
  robots: string
  openGraphImage?: string
  twitterCardImage?: string
  structuredData?: Record<string, any>
}

export interface PortalFeatures {
  enableBlog: boolean
  enableProducts: boolean
  enableAffiliates: boolean
  enableMultiCountry: boolean
  enableAdminPanel: boolean
  enableUserAccounts: boolean
  enableCheckout: boolean
  enableReviews: boolean
  enableNewsletter: boolean
  enableSearch: boolean
}

export interface PortalSettings {
  contactEmail: string
  supportPhone?: string
  supportHours?: string
  address?: string
  privacyPolicyUrl?: string
  termsOfServiceUrl?: string
  refundPolicyUrl?: string
  shippingPolicyUrl?: string
  cookiePolicyUrl?: string
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
}

// ==================== TIPOS DE PRODUTOS ====================

export type ProductType = 
  | "affiliate"      // Produto afiliado (Amazon, AliExpress, etc)
  | "own_physical"   // Produto físico próprio
  | "own_digital"    // Produto digital próprio
  | "ebook"          // eBook
  | "app"            // Aplicativo
  | "course"         // Curso
  | "sponsored"      // Patrocinado

export type ProductStatus = "draft" | "published" | "archived" | "out_of_stock"

export interface Product {
  // Identificação básica
  id: string
  portalId: string
  type: ProductType
  status: ProductStatus
  
  // Informações do produto
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  editorialSummary: string
  
  // Mídia
  images: string[]
  videoUrl?: string
  
  // Categorização
  category: string
  subcategory?: string
  brand?: string
  tags: string[]
  
  // Especificações
  specifications: Record<string, string>
  advantages: string[]
  disadvantages: string[]
  
  // Preços e descontos
  originalPrice: number
  currentPrice: number
  currency: string
  discount?: number
  
  // Origem e localização
  origin: "amazon" | "aliexpress" | "temu" | "own" | "other"
  country: string
  language: string
  
  // Links
  affiliateUrl?: string
  checkoutUrl?: string
  officialUrl?: string
  callToAction: string
  
  // Destaques e promoções
  isFeatured: boolean
  isSponsored: boolean
  expiryDate?: Date
  
  // SEO
  seoTitle?: string
  seoDescription?: string
  
  // Metadados
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  
  // Estatísticas (opcional)
  views?: number
  clicks?: number
  conversions?: number
  rating?: number
  reviewCount?: number
}

export interface ProductCategory {
  id: string
  portalId: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentId?: string
  level: number
  order: number
  productCount: number
  isActive: boolean
}

// ==================== ARTIGOS/BLOG ====================

export interface ArticleFAQ {
  question: string
  answer: string
}

export interface ArticleCallToAction {
  text: string
  url: string
  type: "affiliate" | "internal" | "external"
}

export interface ArticleProductReference {
  productId: string
  position: "top" | "middle" | "bottom"
  title: string
  description?: string
}

export type ArticleType = 
  | "review"           // Análise/revisão
  | "comparison"       // Comparativo
  | "tutorial"         // Tutorial
  | "guide"           // Guia
  | "news"            // Notícia
  | "list"            // Lista

export type ArticleStatus = "draft" | "published" | "scheduled" | "archived"

export interface Article {
  // Identificação básica
  id: string
  portalId: string
  type: ArticleType
  status: ArticleStatus
  
  // Conteúdo principal
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  
  // Categorização
  category: string
  subcategory?: string
  tags: string[]
  keywords: string[]
  
  // Autoria
  author: string
  authorAvatar?: string
  authorBio?: string
  
  // Localização
  countryCodes: string[]
  language: string
  
  // Produtos relacionados
  relatedProducts: ArticleProductReference[]
  
  // SEO e metadados
  seoTitle?: string
  seoDescription?: string
  structuredData?: Record<string, any>
  
  // FAQ
  faqs: ArticleFAQ[]
  
  // Call-to-Action
  callToAction: ArticleCallToAction
  
  // Métricas e interação
  readTime: number // em minutos
  views: number
  likes: number
  shares: number
  commentsCount: number
  
  // Destaques
  isFeatured: boolean
  isSponsored: boolean
  
  // Datas
  publishedAt?: Date
  scheduledFor?: Date
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  
  // Relacionamentos
  previousArticleId?: string
  nextArticleId?: string
}

export interface ArticleCategory {
  id: string
  portalId: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  articleCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  portalId: string
  email: string
  name: string
  avatar?: string
  role: "user" | "admin" | "editor" | "affiliate"
  country: string
  isActive: boolean
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  preferences?: UserPreferences
}

export interface UserPreferences {
  language: string
  currency: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  theme: "light" | "dark" | "system"
}

export interface Order {
  id: string
  portalId: string
  userId: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  total: number
  image?: string
}

export interface ShippingAddress {
  fullName: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface Affiliate {
  id: string
  portalId: string
  userId: string
  code: string
  commissionRate: number
  totalEarnings: number
  paidEarnings: number
  pendingEarnings: number
  clicks: number
  conversions: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AffiliateTransaction {
  id: string
  portalId: string
  affiliateId: string
  orderId: string
  amount: number
  commission: number
  status: "pending" | "approved" | "paid" | "rejected"
  type: "sale" | "click"
  createdAt: Date
  paidAt?: Date
}