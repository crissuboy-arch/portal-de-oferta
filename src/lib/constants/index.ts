export const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Afiliados", href: "/affiliates" },
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
]

export const PRODUCT_CATEGORIES = [
  { id: "electronics", name: "Eletrônicos", icon: "💻", count: 423 },
  { id: "fashion", name: "Moda", icon: "👕", count: 264 },
  { id: "home", name: "Casa e Decoração", icon: "🏠", count: 189 },
  { id: "health", name: "Saúde e Beleza", icon: "💄", count: 156 },
  { id: "sports", name: "Esportes", icon: "⚽", count: 98 },
  { id: "books", name: "Livros", icon: "📚", count: 75 },
  { id: "toys", name: "Brinquedos", icon: "🧸", count: 42 },
]

export const BLOG_CATEGORIES = [
  { id: "tips", name: "Dicas", count: 12 },
  { id: "technology", name: "Tecnologia", count: 8 },
  { id: "affiliates", name: "Afiliados", count: 10 },
  { id: "comparisons", name: "Comparativos", count: 6 },
  { id: "seo", name: "SEO", count: 5 },
  { id: "tools", name: "Ferramentas", count: 4 },
]

export const COUNTRIES_SUPPORTED = [
  { code: "BR", name: "Brasil", flag: "🇧🇷", currency: "BRL" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸", currency: "USD" },
  { code: "ES", name: "Espanha", flag: "🇪🇸", currency: "EUR" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", currency: "EUR" },
]

export const ADMIN_MENU_ITEMS = [
  { label: "Dashboard", icon: "📊", href: "/admin" },
  { label: "Produtos", icon: "📦", href: "/admin/products" },
  { label: "Usuários", icon: "👥", href: "/admin/users" },
  { label: "Pedidos", icon: "📋", href: "/admin/orders" },
  { label: "Afiliados", icon: "💰", href: "/admin/affiliates" },
  { label: "Blog", icon: "📝", href: "/admin/blog" },
  { label: "Configurações", icon: "⚙️", href: "/admin/settings" },
]

export const ORDER_STATUSES = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Processando", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Entregue", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
}

export const AFFILIATE_COMMISSION_RATES = {
  basic: 5,
  standard: 10,
  premium: 15,
  elite: 20,
}