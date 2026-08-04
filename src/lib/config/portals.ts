import { PortalConfig } from "@/types"

// Portal padrão PORTUGAL (pt-PT, EUR)
export const availablePortals: PortalConfig[] = [
  {
    id: "portugal-deals-portal",
    name: "Ofertas Portugal",
    slug: "portugal",
    description: "Portal especializado em ofertas, descontos e produtos mais vendidos em Portugal. Encontre as melhores promoções em tecnologia, livros, casa e muito mais.",
    domain: "localhost:3000",
    subdomain: "pt",
    logo: "/images/portals/portugal/logo.svg",
    favicon: "/images/portals/portugal/favicon.ico",
    
    // Localização PORTUGAL
    country: "PT",
    language: "pt-PT",
    currency: "EUR",
    timezone: "Europe/Lisbon",
    
    // Cores temáticas
    primaryColor: "#07111f", // Azul-marinho escuro
    secondaryColor: "#ff5a1f", // Laranja vibrante
    accentColor: "#10b981", // Verde para confirmações
    backgroundColor: "#ffffff",
    
    // Menu de navegação - GENERALISTA para Portugal
    menuItems: [
      { id: "home", label: "Início", href: "/", icon: "🏠", order: 1 },
      { id: "ofertas", label: "Ofertas", href: "/ofertas", icon: "🔥", order: 2 },
      { id: "amazon", label: "Amazon PT", href: "/amazon", icon: "📦", order: 3 },
      { id: "tecnologia", label: "Tecnologia", href: "/categoria/tecnologia", icon: "💻", order: 4 },
      { id: "livros", label: "Livros", href: "/categoria/livros", icon: "📚", order: 5 },
      { id: "casa", label: "Casa", href: "/categoria/casa", icon: "🏠", order: 6 },
      { id: "estudo", label: "Estudo", href: "/categoria/estudo", icon: "🎓", order: 7 },
      { id: "apps", label: "Aplicativos", href: "/categoria/apps", icon: "📱", order: 8 },
      { id: "blog", label: "Blog", href: "/blog", icon: "📝", order: 9 },
      { id: "cupons", label: "Cupons", href: "/cupons", icon: "🎟️", order: 10 },
    ],
    
    // Rodapé
    footerLinks: [
      {
        id: "categorias",
        title: "Categorias",
        links: [
          { id: "tecnologia", label: "Tecnologia", href: "/categoria/tecnologia" },
          { id: "livros", label: "Livros", href: "/categoria/livros" },
          { id: "casa", label: "Casa e Decoração", href: "/categoria/casa" },
          { id: "estudo", label: "Material de Estudo", href: "/categoria/estudo" },
          { id: "apps", label: "Aplicativos", href: "/categoria/apps" },
        ],
      },
      {
        id: "ajuda",
        title: "Ajuda",
        links: [
          { id: "como-funciona", label: "Como Funciona", href: "/como-funciona" },
          { id: "faq", label: "FAQ", href: "/faq" },
          { id: "contacto", label: "Contacto", href: "/contacto" },
          { id: "devolucoes", label: "Devoluções", href: "/devolucoes" },
          { id: "privacidade", label: "Privacidade", href: "/privacidade" },
        ],
      },
      {
        id: "empresa",
        title: "Empresa",
        links: [
          { id: "sobre", label: "Sobre Nós", href: "/sobre" },
          { id: "afiliados", label: "Programa de Afiliados", href: "/afiliados" },
          { id: "parcerias", label: "Parcerias", href: "/parcerias" },
          { id: "termos", label: "Termos de Uso", href: "/termos" },
          { id: "cookies", label: "Cookies", href: "/cookies" },
        ],
      },
    ],
    
    // Redes sociais
    socialLinks: {
      facebook: "https://facebook.com/ofertasportugal",
      instagram: "https://instagram.com/ofertasportugal",
      twitter: "https://twitter.com/ofertasportugal",
    },
    
    // Aviso de afiliado
    affiliateDisclaimer: "Este portal contém links de afiliados. Ao comprar através destes links, podemos receber uma comissão sem custo adicional para si.",
    showAffiliateDisclaimer: true,
    
    // Configurações de SEO
    seo: {
      defaultTitle: "Ofertas Portugal - As Melhores Promoções e Descontos em Produtos",
      defaultDescription: "Encontre as melhores ofertas, descontos e produtos mais vendidos em Portugal. Tecnologia, livros, casa, material de estudo e muito mais.",
      keywords: ["ofertas Portugal", "descontos", "promoções", "produtos baratos", "Amazon Portugal", "tecnologia", "livros", "casa", "estudo"],
      robots: "index, follow",
      openGraphImage: "/images/portals/portugal/og-image.png",
      twitterCardImage: "/images/portals/portugal/twitter-card.png",
    },
    
    // Funcionalidades habilitadas
    features: {
      enableBlog: true,
      enableProducts: true,
      enableAffiliates: true,
      enableMultiCountry: true,
      enableAdminPanel: true,
      enableUserAccounts: true,
      enableCheckout: true,
      enableReviews: true,
      enableNewsletter: true,
      enableSearch: true,
    },
    
    // Configurações específicas
    settings: {
      contactEmail: "contacto@ofertasportugal.pt",
      supportPhone: "+351 123 456 789",
      supportHours: "Seg-Sex: 9h-18h",
      address: "Lisboa, Portugal",
      privacyPolicyUrl: "/privacidade",
      termsOfServiceUrl: "/termos",
      refundPolicyUrl: "/devolucoes",
      shippingPolicyUrl: "/envios",
      cookiePolicyUrl: "/cookies",
    },
    
    // Metadados
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2026-08-04"),
    isActive: true,
    isDefault: true,  // AGORA É O PORTAL PADRÃO
  },
  {
    id: "brasil-deals-portal",
    name: "Ofertas Brasil",
    slug: "brasil",
    description: "Portal de ofertas e descontos para o mercado brasileiro. Encontre as melhores promoções em produtos diversos.",
    domain: "brasil.ofertas.com",
    subdomain: "br",
    logo: "/images/portals/brasil/logo.svg",
    favicon: "/images/portals/brasil/favicon.ico",
    
    country: "BR",
    language: "pt-BR",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    
    primaryColor: "#07111f",
    secondaryColor: "#ff5a1f",
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    
    menuItems: [
      { id: "home", label: "Início", href: "/", icon: "🏠", order: 1 },
      { id: "ofertas", label: "Ofertas", href: "/ofertas", icon: "🔥", order: 2 },
      { id: "amazon", label: "Amazon BR", href: "/amazon", icon: "📦", order: 3 },
      { id: "tecnologia", label: "Tecnologia", href: "/categoria/tecnologia", icon: "💻", order: 4 },
      { id: "livros", label: "Livros", href: "/categoria/livros", icon: "📚", order: 5 },
      { id: "casa", label: "Casa", href: "/categoria/casa", icon: "🏠", order: 6 },
      { id: "blog", label: "Blog", href: "/blog", icon: "📝", order: 7 },
      { id: "cupons", label: "Cupons", href: "/cupons", icon: "🎟️", order: 8 },
    ],
    
    footerLinks: [
      {
        id: "categorias",
        title: "Categorias",
        links: [
          { id: "tecnologia", label: "Tecnologia", href: "/categoria/tecnologia" },
          { id: "livros", label: "Livros", href: "/categoria/livros" },
          { id: "casa", label: "Casa e Decoração", href: "/categoria/casa" },
          { id: "eletronicos", label: "Eletrônicos", href: "/categoria/eletronicos" },
        ],
      },
      {
        id: "ajuda",
        title: "Ajuda",
        links: [
          { id: "como-funciona", label: "Como Funciona", href: "/como-funciona" },
          { id: "faq", label: "FAQ", href: "/faq" },
          { id: "contato", label: "Contato", href: "/contato" },
          { id: "privacidade", label: "Privacidade", href: "/privacidade" },
        ],
      },
    ],
    
    socialLinks: {
      facebook: "https://facebook.com/ofertasbrasil",
      instagram: "https://instagram.com/ofertasbrasil",
    },
    
    affiliateDisclaimer: "Este portal contém links afiliados. Ao comprar através destes links, podemos receber uma comissão sem custo adicional para você.",
    showAffiliateDisclaimer: true,
    
    seo: {
      defaultTitle: "Ofertas Brasil - As Melhores Promoções e Descontos",
      defaultDescription: "Encontre as melhores ofertas e descontos para o mercado brasileiro. Produtos em promoção com entrega rápida.",
      keywords: ["ofertas Brasil", "descontos", "promoções", "produtos baratos", "Amazon Brasil"],
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
      contactEmail: "contato@ofertasbrasil.com.br",
      privacyPolicyUrl: "/privacidade",
      termsOfServiceUrl: "/termos",
    },
    
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2026-08-04"),
    isActive: true,
    isDefault: false,
  },
  {
    id: "usa-deals-portal",
    name: "USA Deals Portal",
    slug: "usa",
    description: "Best deals and discounts for products in the United States. Find amazing offers on technology, books, home goods and more.",
    domain: "deals.us",
    subdomain: "us",
    logo: "/images/portals/usa/logo.svg",
    favicon: "/images/portals/usa/favicon.ico",
    
    country: "US",
    language: "en-US",
    currency: "USD",
    timezone: "America/New_York",
    
    primaryColor: "#07111f",
    secondaryColor: "#ff5a1f",
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    
    menuItems: [
      { id: "home", label: "Home", href: "/", icon: "🏠", order: 1 },
      { id: "deals", label: "Deals", href: "/deals", icon: "🔥", order: 2 },
      { id: "amazon", label: "Amazon US", href: "/amazon", icon: "📦", order: 3 },
      { id: "tech", label: "Technology", href: "/category/technology", icon: "💻", order: 4 },
      { id: "books", label: "Books", href: "/category/books", icon: "📚", order: 5 },
      { id: "home-goods", label: "Home & Kitchen", href: "/category/home-kitchen", icon: "🏠", order: 6 },
      { id: "blog", label: "Blog", href: "/blog", icon: "📝", order: 7 },
      { id: "coupons", label: "Coupons", href: "/coupons", icon: "🎟️", order: 8 },
    ],
    
    footerLinks: [
      {
        id: "categories",
        title: "Categories",
        links: [
          { id: "tech", label: "Technology", href: "/category/technology" },
          { id: "books", label: "Books", href: "/category/books" },
          { id: "home", label: "Home & Kitchen", href: "/category/home-kitchen" },
          { id: "fashion", label: "Fashion", href: "/category/fashion" },
        ],
      },
      {
        id: "help",
        title: "Help",
        links: [
          { id: "how-it-works", label: "How It Works", href: "/how-it-works" },
          { id: "faq", label: "FAQ", href: "/faq" },
          { id: "contact", label: "Contact", href: "/contact" },
          { id: "privacy", label: "Privacy", href: "/privacy" },
        ],
      },
    ],
    
    socialLinks: {
      facebook: "https://facebook.com/usadealsportal",
      instagram: "https://instagram.com/usadealsportal",
      twitter: "https://twitter.com/usadealsportal",
    },
    
    affiliateDisclaimer: "This portal contains affiliate links. We may earn a commission at no extra cost to you.",
    showAffiliateDisclaimer: true,
    
    seo: {
      defaultTitle: "USA Deals Portal - Best Discounts & Product Deals",
      defaultDescription: "Find the best deals, discounts and coupons for products in the United States. Electronics, fashion, home goods and more.",
      keywords: ["deals", "discounts", "USA", "coupons", "shopping", "products", "best prices"],
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
      contactEmail: "support@deals.us",
      supportPhone: "+1 (555) 123-4567",
      privacyPolicyUrl: "/privacy",
      termsOfServiceUrl: "/terms",
    },
    
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2026-08-04"),
    isActive: true,
    isDefault: false,
  },
  {
    id: "spain-deals-portal",
    name: "Ofertas España",
    slug: "espana",
    description: "Portal especializado en ofertas, descuentos y productos más vendidos en España. Encuentra las mejores promociones.",
    domain: "ofertas.es",
    subdomain: "es",
    logo: "/images/portals/spain/logo.svg",
    favicon: "/images/portals/spain/favicon.ico",
    
    country: "ES",
    language: "es-ES",
    currency: "EUR",
    timezone: "Europe/Madrid",
    
    primaryColor: "#07111f",
    secondaryColor: "#ff5a1f",
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    
    menuItems: [
      { id: "home", label: "Inicio", href: "/", icon: "🏠", order: 1 },
      { id: "ofertas", label: "Ofertas", href: "/ofertas", icon: "🔥", order: 2 },
      { id: "amazon", label: "Amazon ES", href: "/amazon", icon: "📦", order: 3 },
      { id: "tecnologia", label: "Tecnología", href: "/categoria/tecnologia", icon: "💻", order: 4 },
      { id: "libros", label: "Libros", href: "/categoria/libros", icon: "📚", order: 5 },
      { id: "hogar", label: "Hogar", href: "/categoria/hogar", icon: "🏠", order: 6 },
      { id: "blog", label: "Blog", href: "/blog", icon: "📝", order: 7 },
      { id: "cupones", label: "Cupones", href: "/cupones", icon: "🎟️", order: 8 },
    ],
    
    footerLinks: [
      {
        id: "categorias",
        title: "Categorías",
        links: [
          { id: "tecnologia", label: "Tecnología", href: "/categoria/tecnologia" },
          { id: "libros", label: "Libros", href: "/categoria/libros" },
          { id: "hogar", label: "Hogar y Decoración", href: "/categoria/hogar" },
          { id: "electronica", label: "Electrónica", href: "/categoria/electronica" },
        ],
      },
      {
        id: "ayuda",
        title: "Ayuda",
        links: [
          { id: "como-funciona", label: "Cómo Funciona", href: "/como-funciona" },
          { id: "faq", label: "FAQ", href: "/faq" },
          { id: "contacto", label: "Contacto", href: "/contacto" },
          { id: "privacidad", label: "Privacidad", href: "/privacidad" },
        ],
      },
    ],
    
    socialLinks: {
      facebook: "https://facebook.com/ofertasespana",
      instagram: "https://instagram.com/ofertasespana",
    },
    
    affiliateDisclaimer: "Este portal contiene enlaces de afiliados. Al comprar a través de estos enlaces, podemos recibir una comisión sin coste adicional para ti.",
    showAffiliateDisclaimer: true,
    
    seo: {
      defaultTitle: "Ofertas España - Las Mejores Promociones y Descuentos",
      defaultDescription: "Encuentra las mejores ofertas, descuentos y productos más vendidos en España. Tecnología, libros, hogar y mucho más.",
      keywords: ["ofertas España", "descuentos", "promociones", "productos baratos", "Amazon España"],
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
      contactEmail: "contacto@ofertasespana.es",
      privacyPolicyUrl: "/privacidad",
      termsOfServiceUrl: "/terminos",
    },
    
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2026-08-04"),
    isActive: true,
    isDefault: false,
  },
]

// Portal padrão (primeiro da lista)
export const defaultPortal = availablePortals[0]

// Funções utilitárias
export function getPortalById(id: string): PortalConfig | undefined {
  return availablePortals.find(portal => portal.id === id)
}

export function getPortalBySlug(slug: string): PortalConfig | undefined {
  return availablePortals.find(portal => portal.slug === slug)
}

export function getPortalByDomain(domain: string): PortalConfig | undefined {
  return availablePortals.find(portal => portal.domain === domain)
}

export function getPortalBySubdomain(subdomain: string): PortalConfig | undefined {
  return availablePortals.find(portal => portal.subdomain === subdomain)
}

export function getCurrentPortal(): PortalConfig {
  // Em produção, isso detectaria pelo domínio/subdomínio
  // Por enquanto retorna o portal padrão
  return defaultPortal
}