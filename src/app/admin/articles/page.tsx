"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  Filter,
  ChevronRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  getArticles, 
  deleteArticle,
  ARTICLE_CATEGORIES,
  initializeDemoArticles 
} from "@/lib/services/article-manager"

export default function ArticlesPage() {
  const [articles, setArticles] = useState(getArticles())
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [featuredFilter, setFeaturedFilter] = useState<string>("all")

  // Inicializar dados demo
  useEffect(() => {
    initializeDemoArticles()
    setArticles(getArticles())
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.")) {
      deleteArticle(id)
      setArticles(getArticles())
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter
    const matchesType = typeFilter === "all" || article.type === typeFilter
    const matchesFeatured = featuredFilter === "all" || 
      (featuredFilter === "featured" && article.isFeatured) ||
      (featuredFilter === "not-featured" && !article.isFeatured)
    
    return matchesSearch && matchesCategory && matchesType && matchesFeatured
  })

  const getCategoryName = (categoryId: string) => {
    return ARTICLE_CATEGORIES.find(c => c.id === categoryId)?.name || categoryId
  }

  const getCategoryColor = (categoryId: string) => {
    return ARTICLE_CATEGORIES.find(c => c.id === categoryId)?.color || "bg-gray-100"
  }

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      comparison: { bg: "bg-orange-100", text: "text-orange-800", label: "Comparativo" },
      guide: { bg: "bg-blue-100", text: "text-blue-800", label: "Guia" },
      review: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Análise" },
      tutorial: { bg: "bg-green-100", text: "text-green-800", label: "Tutorial" },
      news: { bg: "bg-purple-100", text: "text-purple-800", label: "Notícia" }
    }
    
    return typeStyles[type as keyof typeof typeStyles] || { 
      bg: "bg-gray-100", 
      text: "text-gray-800", 
      label: type 
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center text-sm text-muted-foreground mb-4">
          <Link href="/admin" className="hover:text-primary transition-colors">
            Admin
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium">Artigos</span>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Artigos</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie artigos, guias e comparativos do blog
            </p>
          </div>
          
          <Link href="/admin/articles/new">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Novo Artigo
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-2xl font-bold">{articles.length}</div>
          <div className="text-sm text-muted-foreground">Total de Artigos</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-primary">
            {articles.filter(a => a.isFeatured).length}
          </div>
          <div className="text-sm text-muted-foreground">Em Destaque</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">
            {articles.filter(a => a.type === "comparison").length}
          </div>
          <div className="text-sm text-muted-foreground">Comparativos</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">
            {articles.reduce((sum, article) => sum + article.views, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total de Visualizações</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artigos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {categoryFilter === "all" ? "Todas Categorias" : getCategoryName(categoryFilter)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                  Todas Categorias
                </DropdownMenuItem>
                {ARTICLE_CATEGORIES.map(category => (
                  <DropdownMenuItem 
                    key={category.id} 
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Type Filter */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {typeFilter === "all" ? "Todos Tipos" : 
                   typeFilter === "comparison" ? "Comparativos" :
                   typeFilter === "guide" ? "Guias" :
                   typeFilter === "review" ? "Análises" :
                   typeFilter === "tutorial" ? "Tutoriais" : "Notícias"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                  Todos Tipos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("comparison")}>
                  Comparativos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("guide")}>
                  Guias
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("review")}>
                  Análises
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("tutorial")}>
                  Tutoriais
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("news")}>
                  Notícias
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Featured Filter */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {featuredFilter === "all" ? "Todos" :
                   featuredFilter === "featured" ? "Em Destaque" : "Não Destacados"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFeaturedFilter("all")}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFeaturedFilter("featured")}>
                  Em Destaque
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFeaturedFilter("not-featured")}>
                  Não Destacados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Articles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-sm">Artigo</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Categoria</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Tipo</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Publicação</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Visualizações</th>
                <th className="text-left py-4 px-6 font-semibold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-6 text-center text-muted-foreground">
                    Nenhum artigo encontrado. Crie seu primeiro artigo!
                  </td>
                </tr>
              ) : (
                filteredArticles.map(article => {
                  const typeBadge = getTypeBadge(article.type)
                  const categoryName = getCategoryName(article.category)
                  
                  return (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          {article.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Destaque
                            </Badge>
                          )}
                          <div>
                            <Link 
                              href={`/blog/${article.slug}`}
                              target="_blank"
                              className="font-medium hover:text-primary transition-colors flex items-center gap-2"
                            >
                              {article.title}
                              <Eye className="h-3 w-3" />
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={`${getCategoryColor(article.category)}`}>
                          {categoryName}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={`${typeBadge.bg} ${typeBadge.text}`}>
                          {typeBadge.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {article.publishedAt?.toLocaleDateString('pt-BR') || "Não publicado"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {article.readTime} min • {article.views} views
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/articles/${article.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/blog/${article.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <PlusCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Comece a criar artigos</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Crie seu primeiro artigo para compartilhar conhecimento, análises ou comparativos com sua audiência.
          </p>
          <Link href="/admin/articles/new">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Criar Primeiro Artigo
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}