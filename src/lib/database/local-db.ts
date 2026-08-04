import { Database, Product, Category, Store, Coupon, PortalSettings } from './types'

// Em desenvolvimento, usar localStorage
// Em produção, substituir por chamadas API

const STORAGE_KEY = 'portal-admin-database'

// Dados iniciais padrão
const defaultDatabase: Database = {
  products: [],
  categories: [
    { id: '1', name: 'Tecnologia', slug: 'tecnologia', description: 'Produtos tecnológicos', isActive: true, order: 1, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Casa', slug: 'casa', description: 'Produtos para casa', isActive: true, order: 2, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'Livros', slug: 'livros', description: 'Livros e eBooks', isActive: true, order: 3, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', name: 'Estudo', slug: 'estudo', description: 'Material de estudo', isActive: true, order: 4, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', name: 'Aplicativos', slug: 'aplicativos', description: 'Aplicativos e softwares', isActive: true, order: 5, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '6', name: 'Cursos', slug: 'cursos', description: 'Cursos online', isActive: true, order: 6, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '7', name: 'Saúde e bem-estar', slug: 'saude-bem-estar', description: 'Produtos de saúde', isActive: true, order: 7, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '8', name: 'Beleza', slug: 'beleza', description: 'Produtos de beleza', isActive: true, order: 8, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '9', name: 'Moda', slug: 'moda', description: 'Roupas e acessórios', isActive: true, order: 9, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '10', name: 'Crianças', slug: 'criancas', description: 'Produtos infantis', isActive: true, order: 10, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '11', name: 'Ferramentas', slug: 'ferramentas', description: 'Ferramentas e equipamentos', isActive: true, order: 11, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '12', name: 'Automóvel', slug: 'automovel', description: 'Produtos para automóveis', isActive: true, order: 12, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '13', name: 'Animais', slug: 'animais', description: 'Produtos para animais', isActive: true, order: 13, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '14', name: 'Impressão 3D', slug: 'impressao-3d', description: 'Produtos para impressão 3D', isActive: true, order: 14, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '15', name: 'Produtos digitais', slug: 'produtos-digitais', description: 'Produtos digitais diversos', isActive: true, order: 15, productCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ],
  stores: [
    { id: '1', name: 'Amazon', domain: 'amazon.pt', country: 'PT', hasAffiliateProgram: true, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Worten', domain: 'worten.pt', country: 'PT', hasAffiliateProgram: true, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'FNAC', domain: 'fnac.pt', country: 'PT', hasAffiliateProgram: true, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', name: 'Continente', domain: 'continente.pt', country: 'PT', hasAffiliateProgram: false, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', name: 'MediaMarkt', domain: 'mediamarkt.pt', country: 'PT', hasAffiliateProgram: true, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '6', name: 'Leroy Merlin', domain: 'leroymerlin.pt', country: 'PT', hasAffiliateProgram: false, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '7', name: 'IKEA', domain: 'ikea.pt', country: 'PT', hasAffiliateProgram: false, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '8', name: 'Decathlon', domain: 'decathlon.pt', country: 'PT', hasAffiliateProgram: false, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '9', name: 'AliExpress', domain: 'aliexpress.com', country: 'CN', hasAffiliateProgram: true, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '10', name: 'Temu', domain: 'temu.com', country: 'CN', hasAffiliateProgram: true, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '11', name: 'SHEIN', domain: 'shein.com', country: 'CN', hasAffiliateProgram: true, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ],
  coupons: [],
  settings: {
    portalName: 'Portal de Ofertas Portugal',
    slogan: 'As melhores ofertas em Portugal',
    defaultCountry: 'PT',
    defaultLanguage: 'pt-PT',
    defaultCurrency: 'EUR',
    primaryColor: '#0F1117',
    secondaryColor: '#FF6A00',
    contactEmail: 'info@portal-ofertas.pt',
    footerTexts: {
      copyright: '© 2026 Portal de Ofertas Portugal. Todos os direitos reservados.',
      affiliateDisclosure: 'Divulgação de Afiliados'
    },
    menuCategories: ['tecnologia', 'casa', 'livros', 'estudo'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  stats: {
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    expiredProducts: 0,
    featuredProducts: 0,
    activeCoupons: 0,
    simulatedClicks: 0,
    activeCountries: ['PT']
  }
}

// Carregar ou criar banco de dados
function loadDatabase(): Database {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    }
  } catch (error) {
    console.error('Erro ao carregar banco de dados:', error)
  }
  
  // Criar banco de dados inicial
  saveDatabase(defaultDatabase)
  return defaultDatabase
}

// Salvar banco de dados
function saveDatabase(data: Database): void {
  try {
    // Atualizar estatísticas
    data.stats = {
      totalProducts: data.products.length,
      publishedProducts: data.products.filter(p => p.status === 'published').length,
      draftProducts: data.products.filter(p => p.status === 'draft').length,
      expiredProducts: data.products.filter(p => p.status === 'expired').length,
      featuredProducts: data.products.filter(p => p.isFeatured).length,
      activeCoupons: data.coupons.filter(c => c.status === 'active').length,
      simulatedClicks: data.stats?.simulatedClicks || 0,
      activeCountries: Array.from(new Set(data.products.map(p => p.country).filter(Boolean)))
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  } catch (error) {
    console.error('Erro ao salvar banco de dados:', error)
  }
}

// Instância do banco de dados
let database = loadDatabase()

// Serviço do banco de dados
export const db = {
  // Produtos
  products: {
    getAll: (): Product[] => database.products,
    getById: (id: string): Product | undefined => database.products.find(p => p.id === id),
    getBySlug: (slug: string): Product | undefined => database.products.find(p => p.slug === slug),
    getPublished: (): Product[] => database.products.filter(p => p.status === 'published'),
    getFeatured: (): Product[] => database.products.filter(p => p.isFeatured && p.status === 'published'),
    getByCategory: (categorySlug: string): Product[] => database.products.filter(p => p.category === categorySlug && p.status === 'published'),
    
    create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Calcular desconto e economia se não fornecidos
      if (!newProduct.discount && newProduct.originalPrice > 0 && newProduct.currentPrice > 0) {
        newProduct.discount = Math.round(((newProduct.originalPrice - newProduct.currentPrice) / newProduct.originalPrice) * 100)
        newProduct.savings = newProduct.originalPrice - newProduct.currentPrice
      }
      
      database.products.push(newProduct)
      saveDatabase(database)
      return newProduct
    },
    
    update: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null => {
      const index = database.products.findIndex(p => p.id === id)
      if (index === -1) return null
      
      const updatedProduct = {
        ...database.products[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      // Recalcular desconto se preços foram alterados
      if ((updates.originalPrice !== undefined || updates.currentPrice !== undefined) && updatedProduct.originalPrice > 0 && updatedProduct.currentPrice > 0) {
        updatedProduct.discount = Math.round(((updatedProduct.originalPrice - updatedProduct.currentPrice) / updatedProduct.originalPrice) * 100)
        updatedProduct.savings = updatedProduct.originalPrice - updatedProduct.currentPrice
      }
      
      database.products[index] = updatedProduct
      saveDatabase(database)
      return updatedProduct
    },
    
    delete: (id: string): boolean => {
      const initialLength = database.products.length
      database.products = database.products.filter(p => p.id !== id)
      saveDatabase(database)
      return database.products.length < initialLength
    },
    
    duplicate: (id: string): Product | null => {
      const product = database.products.find(p => p.id === id)
      if (!product) return null
      
      const { id: _, createdAt, updatedAt, ...productData } = product
      const duplicatedProduct = {
        ...productData,
        name: `${product.name} (Cópia)`,
        slug: `${product.slug}-copia-${Date.now()}`,
        status: 'draft' as const,
        isFeatured: false,
        isDealOfTheDay: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      return db.products.create(duplicatedProduct)
    }
  },
  
  // Categorias
  categories: {
    getAll: (): Category[] => database.categories,
    getById: (id: string): Category | undefined => database.categories.find(c => c.id === id),
    getBySlug: (slug: string): Category | undefined => database.categories.find(c => c.slug === slug),
    
    create: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>): Category => {
      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      database.categories.push(newCategory)
      saveDatabase(database)
      return newCategory
    },
    
    update: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Category | null => {
      const index = database.categories.findIndex(c => c.id === id)
      if (index === -1) return null
      
      database.categories[index] = {
        ...database.categories[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      saveDatabase(database)
      return database.categories[index]
    },
    
    delete: (id: string): boolean => {
      const initialLength = database.categories.length
      database.categories = database.categories.filter(c => c.id !== id)
      saveDatabase(database)
      return database.categories.length < initialLength
    }
  },
  
  // Lojas
  stores: {
    getAll: (): Store[] => database.stores,
    getById: (id: string): Store | undefined => database.stores.find(s => s.id === id),
    
    create: (store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>): Store => {
      const newStore: Store = {
        ...store,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      database.stores.push(newStore)
      saveDatabase(database)
      return newStore
    },
    
    update: (id: string, updates: Partial<Omit<Store, 'id' | 'createdAt'>>): Store | null => {
      const index = database.stores.findIndex(s => s.id === id)
      if (index === -1) return null
      
      database.stores[index] = {
        ...database.stores[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      saveDatabase(database)
      return database.stores[index]
    },
    
    delete: (id: string): boolean => {
      const initialLength = database.stores.length
      database.stores = database.stores.filter(s => s.id !== id)
      saveDatabase(database)
      return database.stores.length < initialLength
    }
  },
  
  // Cupons
  coupons: {
    getAll: (): Coupon[] => database.coupons,
    getById: (id: string): Coupon | undefined => database.coupons.find(c => c.id === id),
    getActive: (): Coupon[] => database.coupons.filter(c => c.status === 'active'),
    
    create: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>): Coupon => {
      const newCoupon: Coupon = {
        ...coupon,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      database.coupons.push(newCoupon)
      saveDatabase(database)
      return newCoupon
    },
    
    update: (id: string, updates: Partial<Omit<Coupon, 'id' | 'createdAt'>>): Coupon | null => {
      const index = database.coupons.findIndex(c => c.id === id)
      if (index === -1) return null
      
      database.coupons[index] = {
        ...database.coupons[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      saveDatabase(database)
      return database.coupons[index]
    },
    
    delete: (id: string): boolean => {
      const initialLength = database.coupons.length
      database.coupons = database.coupons.filter(c => c.id !== id)
      saveDatabase(database)
      return database.coupons.length < initialLength
    }
  },
  
  // Configurações
  settings: {
    get: (): PortalSettings => database.settings,
    
    update: (updates: Partial<Omit<PortalSettings, 'createdAt'>>): PortalSettings => {
      database.settings = {
        ...database.settings,
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      saveDatabase(database)
      return database.settings
    }
  },
  
  // Estatísticas
  stats: {
    get: () => database.stats,
    incrementClicks: () => {
      database.stats.simulatedClicks += 1
      saveDatabase(database)
    }
  },
  
  // Utilitários
  searchProducts: (query: string): Product[] => {
    const searchTerm = query.toLowerCase()
    return database.products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.shortDescription.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      p.category.toLowerCase().includes(searchTerm)
    )
  }
}