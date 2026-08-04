import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, Eye, ChevronRight, Share2, Link2, Copy, ShoppingBag } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getArticleBySlug,
  getPublishedArticles,
  initializeDemoArticles,
  getArticlesByType,
  ARTICLE_CATEGORIES
} from "@/lib/services/article-manager"
import { getProducts } from "@/lib/services/product-manager"

interface BlogArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  
  if (!article) {
    return {
      title: "Artigo não encontrado",
      description: "O artigo que você está procurando não foi encontrado.",
    }
  }
  
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    keywords: (article.keywords || []).join(", "),
  }
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  // Inicializar dados demo
  initializeDemoArticles()
  
  const article = getArticleBySlug(params.slug)
  
  if (!article) {
    notFound()
  }
  
  const category = ARTICLE_CATEGORIES.find(c => c.id === article.category)
  const products = getProducts()
  const publishedArticles = getPublishedArticles()
  
  // Artigos relacionados por categoria
  const relatedArticles = publishedArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 4)
  
  // Produtos relacionados
  const relatedProducts = article.relatedProducts?.map(rp => {
    const product = products.find(p => p.id === rp.productId)
    return product ? { ...rp, product } : null
  }).filter(Boolean).slice(0, 2) || []

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
          {category && (
            <>
              <Link href={`/categoria/${category.id}`} className="hover:text-primary transition-colors">
                {category.name}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
            </>
          )}
          <span className="text-foreground font-medium line-clamp-1">
            {article.title}
          </span>
        </nav>
      </div>

      {/* Article Header */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              {category && (
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${category.color}`}>
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </span>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} min de leitura
              </span>
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
                <Eye className="h-4 w-4" />
                {article.views} visualizações
              </div>
              <div className="flex items-center gap-2">
                <span>Por {article.author}</span>
              </div>
            </div>

            {/* Featured Image */}
            {article.coverImage && (
              <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 mb-8">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.coverImage})` }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>

            {/* Author Bio */}
            {article.authorBio && (
              <Card className="p-6 mb-8">
                <div className="flex items-center gap-4">
                  {article.authorAvatar && (
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={article.authorAvatar} 
                        alt={article.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{article.author}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {article.authorBio}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mb-12">
              <span className="text-sm font-medium">Compartilhar:</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6">Artigos relacionados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map(related => {
                    const relatedCategory = ARTICLE_CATEGORIES.find(c => c.id === related.category)
                    return (
                      <Link key={related.id} href={`/blog/${related.slug}`} className="group">
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            {relatedCategory && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${relatedCategory.color}`}>
                                {relatedCategory.name}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {related.readTime} min
                            </span>
                          </div>
                          <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {related.excerpt}
                          </p>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
              <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Continue explorando</h3>
              <p className="text-muted-foreground mb-6">
                Descubra mais artigos, guias e análises sobre {category?.name.toLowerCase() || "tecnologia"}.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/blog">
                  <Button>
                    Ver todos os artigos
                  </Button>
                </Link>
                <Link href="/comparativos">
                  <Button variant="outline">
                    Ver comparativos
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}