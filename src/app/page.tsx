"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ChevronRight, Search, TrendingUp, Clock, Tag, Shield, Truck, Zap, BookOpen, Video, Users, Award, Smartphone, Home, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DealCardComponent } from "@/components/deals/deal-card"
import { Sidebar } from "@/components/layout/sidebar"
import { getCurrentPortal } from "@/lib/config/portals"
import { productService } from "@/lib/supabase/services"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Todas")
  const portal = getCurrentPortal()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await productService.getAll({
          status: 'published',
          country: portal.country,
          limit: 10
        })
        setProducts(productsData)
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [portal.country])

  const categories = [
    { name: "Todas", count: products.length, icon: "🔥" },
    { name: "Tecnologia", count: products.filter(p => p.category === 'tecnologia' || p.categoryName === 'Tecnologia').length, icon: "💻" },
    { name: "Livros", count: products.filter(p => p.category === 'livros' || p.categoryName === 'Livros').length, icon: "📚" },
    { name: "Casa", count: products.filter(p => p.category === 'casa' || p.categoryName === 'Casa').length, icon: "🏠" },
    { name: "Estudo", count: products.filter(p => p.category === 'estudo' || p.categoryName === 'Estudo').length, icon: "🎓" },
    { name: "Aplicativos", count: products.filter(p => p.category === 'aplicativos' || p.categoryName === 'Aplicativos').length, icon: "📱" },
    { name: "Material Escolar", count: products.filter(p => p.category === 'material-escolar' || p.categoryName === 'Material Escolar').length, icon: "✏️" },
    { name: "Impressão 3D", count: products.filter(p => p.category === 'impressao-3d' || p.categoryName === 'Impressão 3D').length, icon: "🖨️" },
    { name: "Software", count: products.filter(p => p.category === 'software' || p.categoryName === 'Software').length, icon: "💾" },
    { name: "Cursos", count: products.filter(p => p.category === 'cursos' || p.categoryName === 'Cursos').length, icon: "🎥" },
  ]

  // Mock data for coupons and top voted deals
  const popularCoupons = [
    { store: "Amazon", code: "AMAZON15", discount: "15%", expiry: "31/12/2026" },
    { store: "Fnac", code: "FNAC20", discount: "20%", expiry: "30/11/2026" },
    { store: "Worten", code: "WORTEN10", discount: "10%", expiry: "31/10/2026" },
    { store: "PC Diga", code: "PCDIGA5", discount: "5%", expiry: "30/09/2026" },
    { store: "AliExpress", code: "ALI25", discount: "25%", expiry: "31/08/2026" },
  ]

  const topVotedDeals = products
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 3)
    .map(product => ({
      id: product.id,
      title: product.name,
      category: product.categoryName || product.category || 'Categoria',
      votes: product.votes || 0
    }))

  const guides = [
    { title: "Produtos Mais Vendidos da Amazon Portugal", description: "Descubra os produtos mais populares e melhor avaliados", votes: 289 },
    { title: "Como Encontrar Descontos Reais", description: "Guia para identificar promoções verdadeiras e evitar armadilhas", votes: 245 },
    { title: "Melhores Aplicativos para Estudar em 2026", description: "Apps essenciais para produtividade e organização de estudo", votes: 203 },
    { title: "Livros Mais Procurados do Mês", description: "Lista atualizada dos livros mais buscados pelos portugueses", votes: 178 },
    { title: "Produtos para Casa que Valem a Pena", description: "Análise de produtos domésticos com melhor relação qualidade-preço", votes: 156 },
    { title: "Impressoras 3D para Iniciantes", description: "Guia para escolher a primeira impressora 3D sem gastar demais", votes: 134 },
  ]

  const blogPosts = [
    { title: "10 Produtos Mais Vendidos da Amazon Portugal", category: "Análise", readTime: "10 min", views: "2.8K" },
    { title: "Como Detetar Descontos Falsos e Promoções Reais", category: "Guia", readTime: "12 min", views: "3.4K" },
    { title: "Os Melhores Apps para Estudantes Universitários", category: "Tecnologia", readTime: "8 min", views: "2.1K" },
    { title: "Livros que Estão a Revolucionar 2026", category: "Cultura", readTime: "14 min", views: "4.5K" },
    { title: "Produtos para Casa que Realmente Facilitam o Dia-a-Dia", category: "Casa", readTime: "11 min", views: "3.2K" },
    { title: "Começar na Impressão 3D: Guia Completo", category: "Tecnologia", readTime: "15 min", views: "2.9K" },
  ]

  const backToSchoolProducts = [
    { name: "Portáteis", icon: "💻", count: 45 },
    { name: "Tablets", icon: "📱", count: 32 },
    { name: "Mochilas", icon: "🎒", count: 28 },
    { name: "Material Escolar", icon: "✏️", count: 67 },
    { name: "Livros", icon: "📚", count: 89 },
    { name: "Aplicativos", icon: "📲", count: 23 },
    { name: "Organizadores", icon: "🗂️", count: 18 },
    { name: "Impressoras", icon: "🖨️", count: 12 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-primary to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                As Melhores <span className="text-orange-400">Ofertas</span> em Portugal
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Encontre produtos mais vendidos, descontos reais e promoções verificadas. Tudo o que precisa para estudar, trabalhar e viver melhor.
              </p>
              
              {/* Big Search */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Buscar produtos, ofertas, descontos..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
              </div>

              {/* Deal of the Day */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-orange-400 mr-2" />
                    <span className="font-bold">OFERTA DO DIA</span>
                  </div>
                  <Clock className="h-5 w-5" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">MacBook Air M2 - 13"</h3>
                    <div className="flex items-baseline space-x-2 mb-3">
                      <span className="text-3xl font-bold">€ 899,99</span>
                      <span className="text-lg text-gray-300 line-through">€ 1059,99</span>
                      <span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded">-15%</span>
                    </div>
                    <p className="text-gray-300 mb-4">Portátil Apple com chip M2, ecrã Liquid Retina e 18h de bateria</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        <span>Entrega gratuita com Amazon Prime</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        <span>Cupom: <strong className="text-orange-400">MAC20</strong></span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        <span>Garantia 2 anos • 14 dias para devolução</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="h-48 bg-gray-700 rounded-lg"></div>
                    <div className="flex space-x-3 mt-4">
                      <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                        Ver Oferta
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="flex-1 border-white text-white hover:bg-white/10">
                        Comparar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Placeholder */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">🔥 156</div>
                  <div className="text-gray-300">Novas Ofertas Hoje</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold">€ 12.4K</div>
                    <div className="text-sm text-gray-300">Economizado Hoje</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-gray-300">Avaliação Positiva</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold">45K</div>
                    <div className="text-sm text-gray-300">Membros Ativos</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-gray-300">Ofertas Monitorizadas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Categorias Populares</h2>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-600">
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 rounded-xl border transition-all ${
                  activeCategory === category.name
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-orange-300'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-sm opacity-80">{category.count} ofertas</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Two Columns */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Feed */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Feed de Ofertas Verificadas</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Ordenar
                  </Button>
                  <Button variant="outline" size="sm">
                    Filtros
                  </Button>
                </div>
              </div>

              {/* Deals Feed */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                    <p className="text-gray-400">Carregando ofertas...</p>
                  </div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <DealCardComponent 
                      key={product.id} 
                      deal={{
                        id: product.id,
                        title: product.name,
                        description: product.description || 'Descrição não disponível',
                        originalPrice: product.originalPrice,
                        currentPrice: product.currentPrice,
                        discount: product.discount,
                        category: product.categoryName || product.category || 'Categoria',
                        store: product.storeName || product.store || 'Loja',
                        votes: product.votes || Math.floor(Math.random() * 100) + 10,
                        expiryDate: product.expiryDate || '',
                        imageUrl: product.imageUrl || 'https://via.placeholder.com/400x300/f0f0f0/666666?text=Produto',
                        affiliateUrl: product.affiliateUrl || '#',
                        isFeatured: product.isFeatured || false,
                        isExpired: false,
                        rating: product.rating || 4.5,
                        country: portal.country,
                        currency: portal.currency
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Nenhuma oferta disponível no momento.</p>
                    <p className="text-gray-400 text-sm mt-2">Acesse o painel administrativo para adicionar produtos.</p>
                  </div>
                )}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <Button variant="outline" className="px-8">
                  Carregar mais ofertas ({products.length} de {products.length})
                </Button>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div>
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      {/* Back to School Campaign */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">🎓 Regresso às Aulas 2026</h2>
              <p className="text-xl">Tudo o que precisa para um ano escolar produtivo e organizado</p>
            </div>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Ver Campanha Completa
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {backToSchoolProducts.map((product) => (
              <div key={product.name} className="text-center p-4 bg-white/10 rounded-xl">
                <div className="text-3xl mb-2">{product.icon}</div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-white/70">{product.count} ofertas</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <GraduationCap className="h-6 w-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-bold">Material Essencial</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span>Portáteis e tablets com até 25% desconto</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span>Mochilas ergonómicas para transportar todo o material</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span>Organizadores e material de escritório em promoção</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span>Aplicativos de estudo com descontos exclusivos</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Home className="h-6 w-6 text-orange-400 mr-3" />
                <h3 className="text-xl font-bold">Estudo em Casa</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span>Cadeiras ergonómicas para longas sessões de estudo</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span>Mesas ajustáveis para melhor postura</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span>Iluminação adequada para reduzir cansaço visual</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span>Software educativo com licenças académicas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Guides & Comparisons */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Guias e Comparativos</h2>
              <p className="text-gray-600">Aprenda e compare antes de comprar</p>
            </div>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-600">
              Ver todos os guias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">Guia</span>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {guide.votes}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{guide.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 p-0">
                  Ler Guia Completo
                  <BookOpen className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Ofertas Portugal</h2>
              <p className="text-gray-600">Conteúdo especializado para ajudar a tomar melhores decisões de compra</p>
            </div>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-600">
              Ver blog completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">{post.category}</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime} • 👁️ {post.views}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{post.title}</h3>
                  <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 p-0">
                    Ler artigo completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coupons Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cupons Ativos</h2>
              <p className="text-gray-600">Use estes cupons para economizar ainda mais nas suas compras</p>
            </div>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-600">
              Ver todos os cupons
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {popularCoupons.slice(0, 5).map((coupon, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
                <div className="text-center mb-3">
                  <div className="text-sm text-gray-600 mb-1">Cupom para</div>
                  <div className="font-bold text-gray-900">{coupon.store}</div>
                </div>
                <div className="text-center mb-3">
                  <div className="font-mono text-2xl font-bold text-gray-900 bg-white px-3 py-2 rounded-lg border border-orange-300">
                    {coupon.code}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">Desconto: {coupon.discount}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">Válido até {coupon.expiry}</div>
                  <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Copiar Cupom
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Comunidade Ativa</h2>
              <p className="text-gray-300">Participe, vote, comente e partilhe as suas experiências</p>
            </div>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Entrar na comunidade
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">1.2K</div>
              <div className="text-gray-300">Ofertas verificadas hoje</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">45K</div>
              <div className="text-gray-300">Votos positivos</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">2.4K</div>
              <div className="text-gray-300">Comentários ativos</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-gray-300">Satisfação da comunidade</div>
            </div>
          </div>
          
          <div className="mt-8 bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🔥 Ofertas Mais Votadas da Semana</h3>
            <div className="space-y-4">
              {topVotedDeals.slice(0, 3).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <div className="font-medium">{deal.title}</div>
                    <div className="text-sm text-gray-300">{deal.category}</div>
                  </div>
                  <div className="flex items-center text-orange-400 font-bold">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {deal.votes} votos
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
