import { Product, ProductType, ProductStatus } from "@/types"

const STORAGE_KEY = "multiportal_products"

// Categorias disponíveis
export const PRODUCT_CATEGORIES = [
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
  { id: "3d-printing", name: "Impressão 3D", icon: "🖨️" },
  { id: "software", name: "Software", icon: "💿" },
  { id: "courses", name: "Cursos", icon: "🎓" },
]

// Tipos de produto com ícones
export const PRODUCT_TYPES: { id: ProductType; name: string; icon: string; color: string }[] = [
  { id: "affiliate", name: "Afiliado", icon: "💰", color: "text-yellow-600 bg-yellow-100" },
  { id: "own_physical", name: "Físico Próprio", icon: "📦", color: "text-blue-600 bg-blue-100" },
  { id: "own_digital", name: "Digital Próprio", icon: "💾", color: "text-purple-600 bg-purple-100" },
  { id: "ebook", name: "eBook", icon: "📚", color: "text-green-600 bg-green-100" },
  { id: "app", name: "Aplicativo", icon: "📱", color: "text-indigo-600 bg-indigo-100" },
  { id: "course", name: "Curso", icon: "🎓", color: "text-red-600 bg-red-100" },
  { id: "sponsored", name: "Patrocinado", icon: "🌟", color: "text-pink-600 bg-pink-100" },
]

// Origens disponíveis
export const PRODUCT_ORIGINS = [
  { id: "amazon", name: "Amazon", icon: "📦", color: "bg-orange-100 text-orange-800" },
  { id: "aliexpress", name: "AliExpress", icon: "🛒", color: "bg-red-100 text-red-800" },
  { id: "temu", name: "Temu", icon: "🎁", color: "bg-purple-100 text-purple-800" },
  { id: "own", name: "Próprio", icon: "🏠", color: "bg-blue-100 text-blue-800" },
  { id: "other", name: "Outro", icon: "🌐", color: "bg-gray-100 text-gray-800" },
]

// Status disponíveis
export const PRODUCT_STATUSES: { id: ProductStatus; name: string; color: string }[] = [
  { id: "draft", name: "Rascunho", color: "bg-gray-100 text-gray-800" },
  { id: "published", name: "Publicado", color: "bg-green-100 text-green-800" },
  { id: "archived", name: "Arquivado", color: "bg-yellow-100 text-yellow-800" },
  { id: "out_of_stock", name: "Sem Estoque", color: "bg-red-100 text-red-800" },
]

// Funções de localStorage
export function getProducts(): Product[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const products = JSON.parse(stored)
      // Converter strings de data para Date objects
      return products.map((product: any) => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
        publishedAt: product.publishedAt ? new Date(product.publishedAt) : undefined,
        expiryDate: product.expiryDate ? new Date(product.expiryDate) : undefined,
      }))
    }
  } catch (error) {
    console.error("Erro ao ler produtos do localStorage:", error)
  }
  
  return []
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.error("Erro ao salvar produtos no localStorage:", error)
  }
}

export function addProduct(product: Product): void {
  const products = getProducts()
  products.push(product)
  saveProducts(products)
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const products = getProducts()
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date(),
    }
    saveProducts(products)
  }
}

export function deleteProduct(id: string): void {
  const products = getProducts()
  const filtered = products.filter(p => p.id !== id)
  saveProducts(filtered)
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts()
  return products.find(p => p.id === id)
}

export function getProductsByPortal(portalId: string): Product[] {
  const products = getProducts()
  return products.filter(p => p.portalId === portalId)
}

export function getProductsByType(type: ProductType): Product[] {
  const products = getProducts()
  return products.filter(p => p.type === type)
}

export function duplicateProduct(id: string): Product | null {
  const product = getProductById(id)
  if (!product) return null
  
  const newProduct: Product = {
    ...product,
    id: `${product.id}-copy-${Date.now()}`,
    name: `${product.name} (Cópia)`,
    slug: `${product.slug}-copy`,
    status: "draft",
    isFeatured: false,
    isSponsored: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  addProduct(newProduct)
  return newProduct
}

export function toggleProductFeatured(id: string): void {
  const product = getProductById(id)
  if (product) {
    updateProduct(id, { isFeatured: !product.isFeatured })
  }
}

export function toggleProductStatus(id: string, status: ProductStatus): void {
  updateProduct(id, { status })
}

// Gerar ID único
export function generateProductId(): string {
  return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Configuração inicial baseada no tipo
export function getDefaultProductConfig(type: ProductType, portalId: string): Partial<Product> {
  const baseId = generateProductId()
  
  const typeConfig = {
    affiliate: {
      callToAction: "Ver Oferta na Amazon",
      currency: "BRL",
      origin: "amazon" as const,
    },
    own_physical: {
      callToAction: "Comprar Agora",
      currency: "BRL",
      origin: "own" as const,
    },
    own_digital: {
      callToAction: "Baixar Agora",
      currency: "BRL",
      origin: "own" as const,
    },
    ebook: {
      callToAction: "Ler Agora",
      currency: "BRL",
      origin: "own" as const,
    },
    app: {
      callToAction: "Instalar Agora",
      currency: "USD",
      origin: "own" as const,
    },
    course: {
      callToAction: "Inscrever-se Agora",
      currency: "BRL",
      origin: "own" as const,
    },
    sponsored: {
      callToAction: "Saiba Mais",
      currency: "BRL",
      origin: "other" as const,
    },
  }
  
  const config = typeConfig[type]
  
  return {
    id: baseId,
    portalId,
    type,
    status: "draft",
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    editorialSummary: "",
    images: [],
    category: "electronics",
    tags: [],
    specifications: {},
    advantages: [],
    disadvantages: [],
    originalPrice: 0,
    currentPrice: 0,
    currency: config.currency,
    origin: config.origin,
    country: "BR",
    language: "pt-BR",
    callToAction: config.callToAction,
    isFeatured: false,
    isSponsored: type === "sponsored",
    seoTitle: "",
    seoDescription: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Dados demonstrativos
export function createDemoProducts(): Product[] {
  const demoProducts: Product[] = [
    {
      id: "amazon-affiliate-1",
      portalId: "3d-printing-portal",
      type: "affiliate",
      status: "published",
      name: "Impressora 3D Creality Ender 3 V2",
      slug: "impressora-3d-creality-ender-3-v2",
      shortDescription: "Impressora 3D FDM com nivelamento automático e tela colorida",
      fullDescription: "A Creality Ender 3 V2 é uma impressora 3D FDM aprimorada com nivelamento automático, tela colorida de 4.3 polegadas e motor silencioso. Ideal para iniciantes e makers.",
      editorialSummary: "Excelente custo-benefício para quem está começando na impressão 3D.",
      images: ["/images/products/ender3-v2-1.jpg", "/images/products/ender3-v2-2.jpg"],
      category: "3d-printing",
      subcategory: "impressoras",
      brand: "Creality",
      tags: ["3d", "impressora", "creality", "ender", "fdm"],
      specifications: {
        "Tecnologia": "FDM",
        "Volume de Impressão": "220x220x250mm",
        "Resolução": "0.1mm",
        "Conectividade": "SD Card, USB",
        "Nivelamento": "Automático",
      },
      advantages: [
        "Nivelamento automático",
        "Tela colorida de 4.3\"",
        "Motor silencioso",
        "Fácil montagem",
      ],
      disadvantages: [
        "Precisa de calibração inicial",
        "Sem conexão WiFi",
      ],
      originalPrice: 1499.99,
      currentPrice: 1299.99,
      currency: "BRL",
      discount: 13,
      origin: "amazon",
      country: "BR",
      language: "pt-BR",
      affiliateUrl: "https://www.amazon.com.br/Creality-Ender-Impressora-Dep%C3%B3sito-Volume/dp/B08BLSNW7L",
      callToAction: "Ver Oferta na Amazon",
      isFeatured: true,
      isSponsored: false,
      seoTitle: "Impressora 3D Creality Ender 3 V2 - Melhor Custo-Benefício",
      seoDescription: "Impressora 3D Creality Ender 3 V2 com nivelamento automático e tela colorida. Preço especial com desconto.",
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-03-18"),
      publishedAt: new Date("2024-02-20"),
      views: 1245,
      clicks: 89,
      conversions: 12,
      rating: 4.7,
      reviewCount: 156,
    },
    {
      id: "ebook-own-1",
      portalId: "ebooks-portugal",
      type: "ebook",
      status: "published",
      name: "Guia Completo de Marketing Digital 2024",
      slug: "guia-completo-marketing-digital-2024",
      shortDescription: "eBook completo com estratégias de marketing digital atualizadas para 2024",
      fullDescription: "Este eBook cobre todas as estratégias essenciais de marketing digital para 2024, incluindo SEO, mídias sociais, email marketing, marketing de conteúdo e análise de dados.",
      editorialSummary: "O guia mais completo de marketing digital para profissionais e empreendedores.",
      images: ["/images/products/marketing-ebook.jpg"],
      category: "books",
      subcategory: "negócios",
      brand: "Editora Digital",
      tags: ["marketing", "digital", "ebook", "negócios", "2024"],
      specifications: {
        "Formato": "PDF, EPUB",
        "Páginas": "245",
        "Idioma": "Português",
        "Atualização": "Anual",
      },
      advantages: [
        "Estratégias atualizadas para 2024",
        "Exemplos práticos",
        "Modelos prontos para uso",
        "Atualizações gratuitas",
      ],
      disadvantages: [
        "Focado no mercado brasileiro",
      ],
      originalPrice: 97.00,
      currentPrice: 67.00,
      currency: "BRL",
      discount: 31,
      origin: "own",
      country: "PT",
      language: "pt-PT",
      checkoutUrl: "/checkout/ebook-marketing",
      callToAction: "Comprar eBook",
      isFeatured: true,
      isSponsored: false,
      seoTitle: "Guia Completo de Marketing Digital 2024 - eBook",
      seoDescription: "eBook com estratégias de marketing digital atualizadas para 2024. Download imediato após compra.",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-03-15"),
      publishedAt: new Date("2024-01-15"),
      views: 876,
      clicks: 234,
      conversions: 45,
      rating: 4.9,
      reviewCount: 89,
    },
    {
      id: "aliexpress-affiliate-1",
      portalId: "offers-portal-1",
      type: "affiliate",
      status: "published",
      name: "Smart Watch GT3 Pro com Monitor de Saúde",
      slug: "smart-watch-gt3-pro-monitor-saude",
      shortDescription: "Relógio inteligente com monitoramento de saúde e 100 modos esportivos",
      fullDescription: "Smart Watch GT3 Pro com tela AMOLED de 1.43\", monitoramento de frequência cardíaca, oxigênio no sangue, pressão arterial e sono. Com 100 modos esportivos e bateria de 15 dias.",
      editorialSummary: "Smart watch completo com excelente custo-benefício.",
      images: ["/images/products/smartwatch-gt3.jpg"],
      category: "electronics",
      subcategory: "wearables",
      brand: "Huawei",
      tags: ["smartwatch", "saúde", "fitness", "wearable", "tecnologia"],
      specifications: {
        "Tela": "AMOLED 1.43\"",
        "Bateria": "15 dias",
        "Resistência à Água": "5ATM",
        "Conectividade": "Bluetooth 5.2",
        "Sistema Operacional": "HarmonyOS",
      },
      advantages: [
        "Monitoramento de saúde completo",
        "Bateria de longa duração",
        "Tela AMOLED de alta qualidade",
        "100 modos esportivos",
      ],
      disadvantages: [
        "App em chinês/inglês",
        "Entrega internacional pode demorar",
      ],
      originalPrice: 599.99,
      currentPrice: 349.99,
      currency: "BRL",
      discount: 42,
      origin: "aliexpress",
      country: "CN",
      language: "pt-BR",
      affiliateUrl: "https://pt.aliexpress.com/item/1005005058765432.html",
      callToAction: "Comprar no AliExpress",
      isFeatured: true,
      isSponsored: false,
      seoTitle: "Smart Watch GT3 Pro - Monitor de Saúde Completo",
      seoDescription: "Smart Watch GT3 Pro com monitoramento de saúde, tela AMOLED e bateria de 15 dias. Desconto especial.",
      createdAt: new Date("2024-02-28"),
      updatedAt: new Date("2024-03-18"),
      publishedAt: new Date("2024-03-01"),
      views: 2103,
      clicks: 345,
      conversions: 28,
      rating: 4.5,
      reviewCount: 213,
    },
  ]
  
  return demoProducts
}

// Inicializar dados demonstrativos se necessário
export function initializeDemoProducts(): void {
  if (typeof window === "undefined") return
  
  const products = getProducts()
  if (products.length === 0) {
    const demoProducts = createDemoProducts()
    saveProducts(demoProducts)
  }
}