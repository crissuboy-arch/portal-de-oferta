import { ProductType } from "@/types"

export interface DealCard {
  id: string
  title: string
  description: string
  category: string
  originalPrice: number
  currentPrice: number
  discount: number
  savings: number
  store: string
  shipping: string
  coupon?: string
  country: string
  language: string
  productType: ProductType
  badge: "affiliate" | "own" | "sponsored"
  votes: {
    up: number
    down: number
  }
  comments: number
  favorites: number
  shares: number
  date: string
  image: string
  tags: string[]
  expiryDate?: string
}

export const mockDeals: DealCard[] = [
  {
    id: "1",
    title: "MacBook Air M2 - 13\" - 256GB",
    description: "Portátil Apple MacBook Air com chip M2, ecrã Liquid Retina e 18h de bateria",
    category: "Tecnologia",
    originalPrice:1059.99,
    currentPrice: 899.99,
    discount: 15,
    savings: 160,
    store: "Amazon Portugal",
    shipping: "Entrega gratuita",
    coupon: "MAC20",
    country: "PT",
    language: "pt-PT",
    productType: "affiliate",
    badge: "affiliate",
    votes: { up: 289, down: 12 },
    comments: 56,
    favorites: 167,
    shares: 42,
    date: "há 2 horas",
    image: "/images/deals/macbook-air.jpg",
    tags: ["apple", "portátil", "m2", "novidade"]
  },
  {
    id: "2",
    title: "Kit 10 Livros Mais Vendidos 2026",
    description: "Coleção com os 10 livros mais vendidos do mês incluindo ficção e não-ficção",
    category: "Livros",
    originalPrice: 149.90,
    currentPrice: 99.90,
    discount: 33,
    savings: 50,
    store: "FNAC Portugal",
    shipping: "€ 3,90",
    coupon: "LIVROS15",
    country: "PT",
    language: "pt-PT",
    productType: "affiliate",
    badge: "affiliate",
    votes: { up: 203, down: 7 },
    comments: 34,
    favorites: 128,
    shares: 31,
    date: "há 4 horas",
    image: "/images/deals/livros-bestsellers.jpg",
    tags: ["livros", "coleção", "bestsellers", "oferta"]
  },
  {
    id: "3",
    title: "iPad 10ª Geração - 64GB - Wi-Fi",
    description: "iPad versão 2024 com ecrã Liquid Retina de 10.9\" e chip A14 Bionic",
    category: "Tecnologia",
    originalPrice: 529.99,
    currentPrice: 449.99,
    discount: 15,
    savings: 80,
    store: "Worten",
    shipping: "Entrega grátis",
    country: "PT",
    language: "pt-PT",
    productType: "affiliate",
    badge: "affiliate",
    votes: { up: 178, down: 9 },
    comments: 28,
    favorites: 95,
    shares: 27,
    date: "há либо 6 horas",
    image: "/images/deals/ipad-10gen.jpg",
    tags: ["apple", "tablet", "estudo", "produtividade"]
  },
  {
    id: "4",
    title: "Robô Aspirador Xiaomi Robot Vacuum",
    description: "Robô aspirador inteligente com mapeamento a laser e controlo por aplicação",
    category: "Casa",
    originalPrice: 399.99,
    currentPrice: 299.99,
    discount: 25,
    savings: 100,
    store: "Amazon Portugal",
    shipping: "Entrega gratuita",
    coupon: "ROBOT10",
    country: "PT",
    language: "pt-PT",
    productType: "affiliate",
    badge: "affiliate",
    votes: { up: 245, down: 12 },
    comments: 45,
    favorites: 156,
    shares: 38,
    date: "há 8 horas",
    image: "/images/deals/robo-aspirador.jpg",
    tags: ["casa", "limpeza", "xiaomi", "inteligente"]
  },
  {
    id: "5",
    title: "Curso Completo: Programação Web 2026",
    description: "Curso online com 120 horas de vídeo sobre HTML, CSS, JavaScript e React",
    category: "Estudo",
    originalPrice: 199.90,
    currentPrice: 129.90,
    discount: 35,
    savings: 70,
    store: "Udemy",
    shipping: "Digital",
    coupon: "CURSO30",
    country: "PT",
    language: "pt-PT",
    productType: "course",
    badge: "affiliate",
    votes: { up: 156, down: 4 },
    comments: 22,
    favorites: 89,
    shares: 25,
    date: "há 1 dia",
    image: "/images/deals/curso-programacao.jpg",
    tags: ["curso", "programação", "online", "web"]
  },
  {
    id: "6",
    title: "AirPods Pro 2ª Geração",
    description: "Auscultadores sem fios Apple com cancelamento de ruído ativo e áudio espacial",
    category: "Tecnologia",
    originalPrice: 279.99,
    currentPrice: 229.99,
    discount: 18,
    savings: 50,
    store: "Radio Popular",
    shipping: "€ 2,90",
    country: "PT",
    language: "pt-PT",
    productType: "affiliate",
    badge: "affiliate",
    votes: { up: 198, down: 6 },
    comments: 31,
    favorites: 112,
    shares: 29,
    date: "há 1 dia",
    image: "/images/deals/airpods-pro.jpg",
    tags: ["apple", "áudio", "sem fios", "premium"]
  },
  {
    id: "7",
    title: "Mochila North Face para Portátil 15\"",
    description: "Mochila resistente à água com compartimento acolchoado para portátil",
    category: "Material Escolar",
    originalPrice: 89.90,
    currentPrice: 69.90,
    discount: 22,
    savings: 20,
    store: "SportZone",
    shipping: "Entrega grátis",
    coupon: "MOCHILA10",
    country: "PT",
    language: "pt-PT",
    productType: "affiliate",
    badge: "affiliate",
    votes: { up: 134, down: 3 },
    comments: 18,
    favorites: 78,
    shares: 22,
    date: "há 2 dias",
    image: "/images/deals/mochila-northface.jpg",
    tags: ["mochila", "estudo", "northface", "resistente"]
  },
  {
    id: "8",
    title: "Notion Pro - Assinatura Anual",
    description: "Plano Pro do Notion com colaboração ilimitada e histórico de versões",
    category: "Aplicativos",
    originalPrice: 96.00,
    currentPrice: 72.00,
    discount: 25,
    savings: 24,
    store: "Notion",
    shipping: "Digital",
    country: "US",
    language: "en-US",
    productType: "app",
    badge: "sponsored",
    votes: { up: 89, down: 11 },
    comments: 15,
    favorites: 45,
    shares: 18,
    date: "há 2 dias",
    image: "/images/deals/notion-pro.jpg",
    tags: ["aplicativo", "produtividade", "organização", "pro"]
  },
  {
    id: "9",
    title: "Impressora 3D Ender 3 V3 SE",
    description: "Impressora 3D para iniciantes com nivelamento automático e extrusor direto",
    category: "Tecnologia",
    originalPrice: 299.99,
    currentPrice: 249.99,
    discount: 17,
    savings: 50,
    store: "AliExpress",
    shipping: "Portes grátis",
    country: "CN",
    language: "en-US",
    productType: "affiliate",
    badge: "affiliate",
    votes: { up: 112, down: 8 },
    comments: 26,
    favorites: 67,
    shares: 24,
    date: "há 3 dias",
    image: "/images/deals/ender-3-v3.jpg",
    tags: ["impressão 3d", "iniciantes", "creality", "fdm"]
  },
  {
    id: "10",
    title: "Organizador de Estudo com 32 Divisórias",
    description: "Organizador com múltiplas divisórias para material escolar e escritório",
    category: "Material Escolar",
    originalPrice: 34.90,
    currentPrice: 24.90,
    discount: 29,
    savings: 10,
    store: "Continente",
    shipping: "Retirar em loja",
    country: "PT",
    language: "pt-PT",
    productType: "own_physical",
    badge: "own",
    votes: { up: 78, down: 2 },
    comments: 14,
    favorites: 42,
    shares: 16,
    date: "há 3 dias",
    image: "/images/deals/organizador-estudo.jpg",
    tags: ["organizador", "estudo", "escritório", "prático"]
  },
  {
    id: "11",
    title: "Adobe Creative Cloud - 1 Ano",
    description: "Assinatura anual do Adobe Creative Cloud com Photoshop, Illustrator e Premiere",
    category: "Software",
    originalPrice: 719.88,
    currentPrice: 599.88,
    discount: 17,
    savings: 120,
    store: "Adobe",
    shipping: "Digital",
    coupon: "ADOBE15",
    country: "US",
    language: "en-US",
    productType: "app",
    badge: "sponsored",
    votes: { up: 67, down: 9 },
    comments: 11,
    favorites: 38,
    shares: 14,
    date: "há 4 dias",
    image: "/images/deals/adobe-cc.jpg",
    tags: ["adobe", "software", "design", "criatividade"]
  },
  {
    id: "12",
    title: "Kindle Paperwhite 11ª Geração",
    description: "E-reader Amazon com ecrã de 6.8\" à prova de água e luz quente ajustável",
    category: "Livros",
    originalPrice: 149.99,
    currentPrice: 129.99,
    discount: 13,
    savings: 20,
    store: "Amazon Portugal",
    shipping: "Entrega gratuita",
    country: "PT",
    language: "pt-PT",
    productType: "affiliate",
    badge: "affiliate",
    votes: { up: 145, down: 5 },
    comments: 29,
    favorites: 85,
    shares: 31,
    date: "há 5 dias",
    image: "/images/deals/kindle-paperwhite.jpg",
    tags: ["amazon", "ebook", "leitura", "digital"]
  }
]

export const topStores = [
  { name: "Amazon Portugal", deals: 189, rating: 4.8 },
  { name: "Worten", deals: 134, rating: 4.7 },
  { name: "FNAC Portugal", deals: 98, rating: 4.6 },
  { name: "Continente", deals: 67, rating: 4.5 },
  { name: "AliExpress", deals: 245, rating: 4.3 },
]

export const popularCoupons = [
  { code: "AMAZON15", store: "Amazon", discount: "15%", expiry: "31/12/2026", uses: 1245 },
  { code: "PORTES0", store: "Worten", discount: "Portes grátis", expiry: "30/11/2026", uses: 892 },
  { code: "FNAC20", store: "FNAC", discount: "20%", expiry: "15/12/2026", uses: 567 },
  { code: "TECNO10", store: "Continente", discount: "10% tecnologia", expiry: "20/12/2026", uses: 342 },
  { code: "ESTUDO25", store: "Udemy", discount: "25% cursos", expiry: "10/01/2027", uses: 789 },
]

export const trendingTopics = [
  { name: "MacBook Air M2", count: 289 },
  { name: "Regresso às Aulas", count: 245 },
  { name: "Livros Mais Vendidos", count: 203 },
  { name: "Impressão 3D", count: 156 },
  { name: "Produtividade", count: 134 },
]

export const topVotedDeals = [
  { id: "1", title: "MacBook Air M2", votes: 289, category: "Tecnologia" },
  { id: "4", title: "Robô Aspirador Xiaomi", votes: 245, category: "Casa" },
  { id: "2", title: "Kit 10 Livros Mais Vendidos", votes: 203, category: "Livros" },
  { id: "6", title: "AirPods Pro 2ª Geração", votes: 198, category: "Tecnologia" },
  { id: "3", title: "iPad 10ª Geração", votes: 178, category: "Tecnologia" },
]