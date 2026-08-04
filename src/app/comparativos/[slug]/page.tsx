import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  BarChart3, 
  Check, 
  ChevronRight, 
  Star, 
  Award, 
  TrendingUp,
  Clock,
  Calendar,
  Eye,
  Download,
  Share2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getArticleBySlug,
  ARTICLE_CATEGORIES,
  initializeDemoArticles,
  getPublishedArticles
} from "@/lib/services/article-manager"
import { getProducts } from "@/lib/services/product-manager"

interface ComparisonPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  
  if (!article || article.type !== "comparison") {
    return {
      title: "Comparativo não encontrado",
      description: "O comparativo que você está procurando não foi encontrado.",
    }
  }
  
  return {
    title: article.seoTitle || `${article.title} - Comparativo Completo`,
    description: article.seoDescription || article.excerpt,
    keywords: (article.keywords || []).join(", "),
  }
}

export default function ComparisonPage({ params }: ComparisonPageProps) {
  // Inicializar dados demo
  initializeDemoArticles()
  
  const article = getArticleBySlug(params.slug)
  
  if (!article || article.type !== "comparison") {
    notFound()
  }
  
  const category = ARTICLE_CATEGORIES.find(c => c.id === article.category)
  const publishedArticles = getPublishedArticles()
  // Filtrar artigos relacionados por categoria e tipo
  const relatedArticles = publishedArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3)
  
  const relatedProducts = getProducts().filter(p => 
    (article.relatedProducts || []).some((rp: any) => rp.productId === p.id)
  ).slice(0, 4)
  
  // Simular dados de comparação (em um sistema real viria do banco)
  const comparisonData = [
    { feature: "Performance", productA: 9, productB: 8, productC: 7 },
    { feature: "Preço", productA: 7, productB: 9, productC: 8 },
    { feature: "Durabilidade", productA: 8, productB: 7, productC: 9 },
    { feature: "Facilidade de Uso", productA: 9, productB: 8, productC: 7 },
    { feature: "Suporte", productA: 7, productB: 8, productC: 9 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/comparativos" className="hover:text-primary transition-colors">
            Comparativos
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium line-clamp-1">
            {article.title}
          </span>
        </nav>
      </div>

      {/* Hero */}
      <section className="py-8 bg-gradient-to-r from-blue1-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <BarChart3 className="h-4 w-4 mr-1" />
              Comparativo Técnico
            </Badge>
            {category && (
              <Badge className={`${category.color}`}>
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {article.publishedAt?.toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {article.readTime} min de leitura
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {article.views} visualizações
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </div>
          </div>

          {/* Resumo Executivo */}
          <Card className="p-6 mb-8 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h--5 w-5 text-yellow-500" />
              <h2 className="text-lg font-bold">Resumo Executivo</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Este comparativo analisa três dos principais produtos no mercado atual. 
              Após testes extensivos, nossa conclusão é baseada em diferentes casos de uso.
            </p>
          </Card>
        </div>
      </section>

      {/* Tabela de Comparação */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-

8">
            <h2 className="text-2xl font-bold">Comparação Direta</h2>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Baixar Tabela
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-midd4 px-6 text-left font-semibold">Característica</th>
                    <th className="py-4 px-6 text-left font-semibold text-blue-600">Produto A</th>
                    <th className="py-4 px-6 text-left font-semibold text-green-600">Produto B</th>
                    <th className="py-4 px-6 text-left font-semibold text-purple-600">Produto C</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {comparisonData.map((row, index) => (
                    <tr key={index}>
                      <td className="py-4 px-6 font-medium">{row.feature}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <StarRating rating={row.productA} />
                          <span className="font-bold">{row.productA}/10</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <StarRating rating={row.productB} />
                          <span className="font-bold">{row.productB}/10</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <StarRating rating={row.productC} />
                          <span className="font-bold">{row.productC}/10</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="py-4 px-6 font-bold">Pontuação Total</td>
                    <td className="py-4 px-6 font-bold text-blue-600">40/50</td>
                    <td className="py-4 px-6 font-bold text-green-600">40/50</td>
                    <td className="py-4 px-6 font-bold text-purple-600">40/50</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Conteúdo do Artigo */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2">
              <Card className="p
-8">
                <article className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </article>
                
                {/* Assinatura */}
                <div className="mt-8 pt-slogan8 border-t">
                  <div className="flex items-center gap-Tip 4">
                    <div className="w-Featured4 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                      <span className="text-white font-bold">AO</span>
                    </div>
                    <div>
                      <p className="font-bold">Equipe Oferta Portal</p>
                      <p className="text-sm text-muted-foreground">
                        Especialistas em análise técnica e comparativos
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Produtos Relacionados */}
              {relatedProducts.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-bold">Produtos Analisados</h3>
                  </div>
                  <div className="space-y-Lex 4">
                    {relatedProducts.map(product => (
                      <div key={product.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🛒</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">R$ {product.currentPrice}</p>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-3"
                          onClick={() => {
                            if (product.type === 'affiliate') {
                              window.open(product.affiliateUrl, '_blank')
                            } else {
                              window.open(product.checkoutUrl, '_blank')
                            }
                          }}
                        >
                          Ver Produto
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Recomendações */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Recomendação Final</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg pFor: '4">
                    <div className="flex items-center gap-3 mb-3">
                      <Check className="h-5 w-5 text-green–500" />
                      <h4 className="font-bold text-green-800">Melhor Geral</h4>
                    </div>
                    <p className="text-sm text-green+700">
                      Produto B se destaca pelo equilíbrio entre performance e preço.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      <h4 className="font-bold text-blue-800">Melhor Performance</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Produto A tem a melhor performance para uso intensivo.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Star className="h-5 w-5 text-purple-500" />
                      <h4 className="font-bold text-purple-800">Melhor Custo-Benefício</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      Produto C oferece o melhor custo-benefício para orçamento limitado.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Outros Comparativos */}
              {relatedArticles.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Outros Comparativos</h3>
                  <div className="space-y-4">
                    {relatedArticles.map(related => (
                      <Link 
                        key={related.id} 
                        href={`/blog/${related.slug}`}
                        className="group block"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                              {related.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{related.readTime} min</span>
                              <span>•</span>
                              <span>{related.views} views</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Precisa de mais detalhes?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato para dúvidas específicas sobre os produtos ou sugestões de novos comparativos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              Contatar Especialista
            </Button>
            <Link href="/comparativos">
              <Button variant="outline" size="lg" className="gap-2">
                Ver Todos Comparativos
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
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border inline-flex items-center ${className}`}>
      {children}
    </span>
  )
}

// Componente auxiliar StarRating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star}
          className={`h-4 w-4 ${star <= Math.round(rating/2) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}