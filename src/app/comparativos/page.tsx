import { Metadata } from "next"
import Link from "next/link"
import { BarChart3, Check, ChevronRight, Trophy, TrendingUp, Users, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getArticlesByType,
  getCategories,
  initializeDemoArticles 
} from "@/lib/services/article-manager"

export const metadata: Metadata = {
  title: "Comparativos - Análises Detalhadas de Produtos",
  description: "Comparativos completos entre produtos. Encontre a melhor opção com nossa análise técnica.",
}

export default function ComparisonsPage() {
  // Inicializar dados demo
  initializeDemoArticles()
  
  const comparisons = getArticlesByType("comparison")
  const categories = getCategories()

  // Ordenar comparativos por visualizações
  const sortedComparisons = [...comparisons].sort((a, b) => b.views - a.views)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Início
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">Comparativos</span>
          </nav>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 text-primary mb-6">
              <BarChart3 className="h-12 w-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Comparativos <span className="text-primary">Detalhados</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Análises técnicas e comparações diretas para ajudar você a tomar a melhor decisão de compra.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
{categories.map(category => {
                    const categoryComparisons = comparisons.filter(c => c.category === category.id)
                if (categoryComparisons.length === 0) return null
                
                return (
                  <Link 
                    key={category.id} 
                    href={`/categoria/${category.slug}`}
                    className="group"
                  >
                    <Button variant="outline" className="gap-2 group-hover:border-primary">
                      <span className="text-lg">{category.icon}</span>
                      {category.name}
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full">
                        {categoryComparisons.length}
                      </span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-blue-100 text-blue-800 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-2">{comparisons.length}</div>
              <div className="text-sm text-muted-foreground">Comparativos Publicados</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-green-100 text-green-800 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {comparisons.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Visualizações Totais</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-yellow-100 text-yellow-800 mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {Math.round(comparisons.reduce((sum, c) => sum + c.views, 0) / comparisons.length)}
              </div>
              <div className="text-sm text-muted-foreground">Visualizações por Artigo</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="inline-flex p-3 rounded-lg bg-purple-100 text-purple-800 mb-4">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {comparisons.filter(c => c.isFeatured).length}
              </div>
              <div className="text-sm text-muted-foreground">Em Destaque</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparativos Principais */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Comparativos em Destaque</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <select className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="popular">Mais popular</option>
                <option value="newest">Mais recente</option>
                <option value="featured">Em destaque</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Comparativos principais */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {sortedComparisons.map(comparison => {
                  const category = categories.find(c => c.id === comparison.category)
                  
                  return (
                    <article key={comparison.id} className="group">
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                        <Link href={`/blog/${comparison.slug}`} className="block">
                          <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                Comparativo
                              </Badge>
                              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <BarChart3 className="h-4 w-4" />
                                Análise Técnica
                              </span>
                              {comparison.isFeatured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                  Destaque
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 mb-6">
                              <div className={`p-3 rounded-lg ${category?.color || "bg-gray-100"}`}>
                                <span className="text-lg">{category?.icon}</span>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                  {comparison.title}
                                </h3>
                                <p className="text-muted-foreground line-clamp-2">
                                  {comparison.excerpt}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  {comparison.views.toLocaleString()} visualizações
                                </span>
                                <span className="text-muted-foreground">
                                  {comparison.publishedAt?.toLocaleDateString('pt-BR')}
                                </span>
                                <span className="text-muted-foreground">
                                  {comparison.readTime} min de leitura
                                </span>
                              </div>
                              <Button variant="ghost" size="sm" className="group-hover:text-primary">
                                Ver Comparativo →
                              </Button>
                            </div>
                          </div>
                        </Link>
                      </Card>
                    </article>
                  )
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Metodologia */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="inline-flex p-3 rounded-lg bg-blue-100 text-blue-800 mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-4">Nossa Metodologia</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Testes práticos em ambiente real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Análise técnica aprofundada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Comparação direta de características</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Recomendação baseada em uso específico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Atualização constante com novos lançamentos</span>
                  </li>
                </ul>
              </Card>

              {/* Categorias */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Categorias</h3>
                <div className="space-y-3">
                  {categories.map(category => {
const categoryComparisons = comparisons.filter(c => c.category === category.id)
                    if (categoryComparisons.length === 0) return null
                    
                    return (
                      <Link 
                        key={category.id} 
                        href={`/categoria/${category.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {category.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {categoryComparisons.length} comparativos
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    )
                  })}
                </div>
              </Card>

              {/* Melhores do Mês */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-bold">Mais Populares</h3>
                </div>
                <div className="space-y-4">
                  {sortedComparisons.slice(0, 5).map(comparison => (
                    <Link 
                      key={comparison.id} 
                      href={`/blog/${comparison.slug}`}
                      className="group block"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                            {comparison.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{comparison.readTime} min</span>
                            <span>•</span>
                            <span>{comparison.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Precisa comparar produtos específicos?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sugira comparativos que você gostaria de ver e nossa equipe analisará para futuras publicações.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              Sugerir Comparativo
            </Button>
            <Link href="/blog">
              <Button variant="outline" size="lg" className="gap-2">
                Ver Todos os Artigos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Componente auxiliar Badge
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  )
}