// Tipos principais
export interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  category: string
  subcategory?: string
  store: string
  country: string
  language: string
  currency: string
  currentPrice: number
  originalPrice: number
  discount?: number
  savings?: number
  affiliateUrl: string
  originalUrl: string
  mainImage: string
  galleryImages: string[]
  imageAlt: string
  coupon?: string
  shipping?: string
  rating?: number
  reviewCount?: number
  type: 'affiliate' | 'own_product' | 'sponsored' | 'digital'
  status: 'draft' | 'published' | 'expired'
  isFeatured: boolean
  isDealOfTheDay: boolean
  startDate?: string
  endDate?: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  isActive: boolean
  order: number
  productCount: number
  createdAt: string
  updatedAt: string
}

export interface Store {
  id: string
  name: string
  logo?: string
  domain: string
  country: string
  hasAffiliateProgram: boolean
  status: 'active' | 'inactive'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Coupon {
  id: string
  storeId: string
  code: string
  title: string
  description: string
  discount: string
  expiryDate: string
  affiliateUrl: string
  status: 'active' | 'expired' | 'used'
  createdAt: string
  updatedAt: string
}

export interface PortalSettings {
  portalName: string
  slogan: string
  defaultCountry: string
  defaultLanguage: string
  defaultCurrency: string
  primaryColor: string
  secondaryColor: string
  logo?: string
  favicon?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  contactEmail: string
  contactPhone?: string
  footerTexts: Record<string, string>
  menuCategories: string[]
  createdAt: string
  updatedAt: string
}

// Interface do banco de dados
export interface Database {
  products: Product[]
  categories: Category[]
  stores: Store[]
  coupons: Coupon[]
  settings: PortalSettings
  stats: {
    totalProducts: number
    publishedProducts: number
    draftProducts: number
    expiredProducts: number
    featuredProducts: number
    activeCoupons: number
    simulatedClicks: number
    activeCountries: string[]
  }
}