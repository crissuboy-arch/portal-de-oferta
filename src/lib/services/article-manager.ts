import { Article, ArticleType, ArticleStatus, ArticleCategory } from "@/types"

const STORAGE_KEY = "multiportal_articles"
const CATEGORIES_KEY = "multiportal_article_categories"

// Categorias padrão
export const ARTICLE_CATEGORIES = [
  { id: "3d-printing", name: "Impressão 3D", icon: "🖨️", color: "bg-purple-100 text-purple-800" },
  { id: "technology", name: "Tecnologia", icon: "💻", color: "bg-blue-100 text-blue-800" },
  { id: "gadgets", name: "Gadgets", icon: "📱", color: "bg-green-100 text-green-800" },
  { id: "reviews", name: "Análises", icon: "⭐", color: "bg-yellow-100 text-yellow-800" },
  { id: "comparisons", name: "Comparativos", icon: "⚖️", color: "bg-orange-100 text-orange-800" },
  { id: "tutorials", name: "Tutoriais", icon: "📚", color: "bg-indigo-100 text-indigo-800" },
  { id: "guides", name: "Guias", icon: "🗺️", color: "bg-pink-100 text-pink-800" },
  { id: "education", name: "Educação", icon: "🎓", color: "bg-teal-100 text-teal-800" },
]

// Tipos de artigo
export const ARTICLE_TYPES: { id: ArticleType; name: string; icon: string; color: string }[] = [
  { id: "review", name: "Análise", icon: "⭐", color: "text-yellow-600 bg-yellow-100" },
  { id: "comparison", name: "Comparativo", icon: "⚖️", color: "text-orange-600 bg-orange-100" },
  { id: "tutorial", name: "Tutorial", icon: "📚", color: "text-indigo-600 bg-indigo-100" },
  { id: "guide", name: "Guia", icon: "🗺️", color: "text-pink-600 bg-pink-100" },
  { id: "news", name: "Notícia", icon: "📰", color: "text-blue-600 bg-blue-100" },
  { id: "list", name: "Lista", icon: "📋", color: "text-green-600 bg-green-100" },
]

// Status disponíveis
export const ARTICLE_STATUSES: { id: ArticleStatus; name: string; color: string }[] = [
  { id: "draft", name: "Rascunho", color: "bg-gray-100 text-gray-800" },
  { id: "published", name: "Publicado", color: "bg-green-100 text-green-800" },
  { id: "scheduled", name: "Agendado", color: "bg-blue-100 text-blue-800" },
  { id: "archived", name: "Arquivado", color: "bg-yellow-100 text-yellow-800" },
]

// Funções de localStorage para artigos
export function getArticles(): Article[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const articles = JSON.parse(stored)
      // Converter strings de data para Date objects
      return articles.map((article: any) => ({
        ...article,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined,
        scheduledFor: article.scheduledFor ? new Date(article.scheduledFor) : undefined,
        expiresAt: article.expiresAt ? new Date(article.expiresAt) : undefined,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      }))
    }
  } catch (error) {
    console.error("Erro ao ler artigos do localStorage:", error)
  }
  
  return []
}

export function saveArticles(articles: Article[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch (error) {
    console.error("Erro ao salvar artigos no localStorage:", error)
  }
}

export function addArticle(article: Article): void {
  const articles = getArticles()
  articles.push(article)
  saveArticles(articles)
}

export function updateArticle(id: string, updates: Partial<Article>): void {
  const articles = getArticles()
  const index = articles.findIndex(a => a.id === id)
  if (index !== -1) {
    articles[index] = {
      ...articles[index],
      ...updates,
      updatedAt: new Date(),
    }
    saveArticles(articles)
  }
}

export function deleteArticle(id: string): void {
  const articles = getArticles()
  const filtered = articles.filter(a => a.id !== id)
  saveArticles(filtered)
}

export function getArticleById(id: string): Article | undefined {
  const articles = getArticles()
  return articles.find(a => a.id === id)
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getArticles()
  return articles.find(a => a.slug === slug && a.status === "published")
}

export function getArticlesByPortal(portalId: string): Article[] {
  const articles = getArticles()
  return articles.filter(a => a.portalId === portalId)
}

export function getArticlesByCategory(category: string): Article[] {
  const articles = getArticles()
  return articles.filter(a => a.category === category && a.status === "published")
}

export function getArticlesByType(type: ArticleType): Article[] {
  const articles = getArticles()
  return articles.filter(a => a.type === type && a.status === "published")
}

export function getPublishedArticles(): Article[] {
  const articles = getArticles()
  return articles.filter(a => a.status === "published")
}

export function getFeaturedArticles(): Article[] {
  const articles = getArticles()
  return articles.filter(a => a.status === "published" && a.isFeatured)
}

export function duplicateArticle(id: string): Article | null {
  const article = getArticleById(id)
  if (!article) return null
  
  const newArticle: Article = {
    ...article,
    id: `${article.id}-copy-${Date.now()}`,
    title: `${article.title} (Cópia)`,
    slug: `${article.slug}-copy`,
    status: "draft",
    isFeatured: false,
    isSponsored: false,
    views: 0,
    likes: 0,
    shares: 0,
    commentsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: undefined,
  }
  
  addArticle(newArticle)
  return newArticle
}

export function toggleArticleFeatured(id: string): void {
  const article = getArticleById(id)
  if (article) {
    updateArticle(id, { isFeatured: !article.isFeatured })
  }
}

export function incrementArticleViews(id: string): void {
  const article = getArticleById(id)
  if (article) {
    updateArticle(id, { views: (article.views || 0) + 1 })
  }
}

// Funções para categorias
export function getCategories(): ArticleCategory[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Erro ao ler categorias do localStorage:", error)
  }
  
  // Retornar categorias padrão se não houver salvas
  return ARTICLE_CATEGORIES.map(cat => ({
    id: cat.id,
    portalId: "default",
    name: cat.name,
    slug: cat.id,
    description: `Artigos sobre ${cat.name.toLowerCase()}`,
    icon: cat.icon,
    color: cat.color,
    articleCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

export function saveCategories(categories: ArticleCategory[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  } catch (error) {
    console.error("Erro ao salvar categorias no localStorage:", error)
  }
}

// Gerar ID único
export function generateArticleId(): string {
  return `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Configuração inicial baseada no tipo
export function getDefaultArticleConfig(type: ArticleType, portalId: string): Partial<Article> {
  const baseId = generateArticleId()
  
  return {
    id: baseId,
    portalId,
    type,
    status: "draft",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "3d-printing",
    tags: [],
    keywords: [],
    author: "Administrador",
    authorAvatar: "",
    countryCodes: ["BR"],
    language: "pt-BR",
    relatedProducts: [],
    faqs: [],
    callToAction: {
      text: "Ver Produtos Relacionados",
      url: "#",
      type: "internal",
    },
    seoTitle: "",
    seoDescription: "",
    readTime: 5,
    views: 0,
    likes: 0,
    shares: 0,
    commentsCount: 0,
    isFeatured: false,
    isSponsored: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Dados demonstrativos
export function createDemoArticles(): Article[] {
  const demoArticles: Article[] = [
    {
      id: "best-3d-printer-beginners",
      portalId: "3d-printing-portal",
      type: "guide",
      status: "published",
      title: "Melhor Impressora 3D para Iniciantes em 2024",
      slug: "melhor-impressora-3d-para-iniciantes",
      excerpt: "Guia completo para escolher a primeira impressora 3D, com análise das melhores opções para quem está começando.",
      content: `# Melhor Impressora 3D para Iniciantes em 2024

Se você está pensando em entrar no mundo da impressão 3D, escolher a primeira máquina pode ser desafiador. Neste guia, analisamos as melhores opções para iniciantes em 2024.

## Por onde começar?

Para iniciantes, recomendamos impressoras 3D que sejam:
- **Fáceis de montar**: Com pré-montagem parcial
- **Boa documentação**: Tutorials e comunidade ativa
- **Custo-benefício**: Equilíbrio entre preço e qualidade

## Top 3 Impressoras para Iniciantes

### 1. Creality Ender 3 V2
**Pontos fortes:**
- Excelente custo-benefício
- Grande comunidade de usuários
- Nivelamento automático
- Tela colorida de 4.3"

**Recomendação:** Ideal para quem quer aprender desde o básico.

### 2. Bambu Lab A1 Mini
**Pontos fortes:**
- Multimaterial com AMS Lite
- Fácil de usar
- Impressão rápida
- Design compacto

**Recomendação:** Perfeita para quem quer qualidade e facilidade.

### 3. Anycubic Kobra 2 Neo
**Pontos fortes:**
- Montagem rápida (15 minutos)
- Auto nivelamento
- Boa qualidade de impressão
- Preço acessível

**Recomendação:** Excelente opção para iniciantes com orçamento limitado.

## Comparação Detalhada

| Característica | Ender 3 V2 | A1 Mini | Kobra 2 Neo |
|----------------|------------|---------|-------------|
| **Preço** | R$ 1.299 | R$ chats | R$ 899 |
| **Volume** | 220x220x250mm | 180x180x180mm | 220x220x250mm |
| **Nivelamento** | Automático | Automático | Automático |
| **Velocidade** | 60mm/s | 250mm/s | 150mm/s |
| **Dificuldade** | Média | Baixa | Baixa |

## Conclusão

Para iniciantes, recomendamos:
1. **Orçamento limitado**: Anycubic Kobra 2 Neo
2. **Custo-benefício**: Creality Ender 3 V2
3. **Facilidade e qualidade**: Bambu Lab A1 Mini

Lembre-se: A melhor impressora é aquela que você vai usar regularmente.`,
      coverImage: "/images/articles/best-3d-printer.jpg",
      category: "3d-printing",
      subcategory: "beginners",
      tags: ["impressora 3D", "iniciantes", "guia", "creality", "bambu lab"],
      keywords: ["melhor impressora 3d", "iniciantes impressão 3d", "guia compra"],
      author: "João Silva",
      authorAvatar: "/images/authors/joao-silva.jpg",
      authorBio: "Especialista em impressão 3D com 5 anos de experiência.",
      countryCodes: ["BR", "PT"],
      language: "pt-BR",
      relatedProducts: [
        {
          productId: "amazon-affiliate-1",
          position: "top",
          title: "Creality Ender 3 V2",
          description: "Impressora 3D com excelente custo-benefício para iniciantes"
        },
        {
          productId: "bambu-a1-mini",
          position: "middle",
          title: "Bambu Lab A1 Mini",
          description: "Impressora compacta com sistema multimaterial"
        }
      ],
      faqs: [
        {
          question: "Quanto custa uma impressora 3D para iniciantes?",
          answer: "Os preços variam de R$ 899 a R$ 2.500 para modelos iniciantes."
        },
        {
          question: "Quanto tempo leva para aprender a usar?",
          answer: "Com as impressoras modernas, você pode imprimir seus primeiros modelos em 2-3 dias."
        }
      ],
      callToAction: {
        text: "Ver Ofertas de Impressoras 3D",
        url: "/products?category=3d-printing",
        type: "internal"
      },
      seoTitle: "Melhor Impressora 3D para Iniciantes 2024 - Guia Completo",
      seoDescription: "Guia definitivo para escolher a primeira impressora 3D. Análise das melhores opções para iniciantes em 2024.",
      readTime: 8,
      views: 3450,
      likes: 128,
      shares: 45,
      commentsCount: 32,
      isFeatured: true,
      isSponsored: false,
      publishedAt: new Date("2024-01-15"),
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-03-18"),
    },
    {
      id: "bambu-a1-mini-vs-creality-ender-3",
      portalId: "3d-printing-portal",
      type: "comparison",
      status: "published",
      title: "Bambu Lab A1 Mini vs Creality Ender 3: Qual Escolher?",
      slug: "bambu-a1-mini-vs-creality-ender-3",
      excerpt: "Comparativo detalhado entre duas das impressoras 3D mais populares para iniciantes.",
      content: `# Bambu Lab A1 Mini vs Creality Ender 3: Comparativo Detalhado

Neste artigo, comparamos duas das impressoras 3D mais populares para iniciantes: a Bambu Lab A1 Mini e a Creality Ender 3 V2.

## Visão Geral

Ambas são excelentes opções para iniciantes, mas com abordagens diferentes:
- **Bambu A1 Mini**: Foco em facilidade e velocidade
- **Creality Ender 3**: Foco em custo-benefício e customização

## Comparação Técnica

### Qualidade de Impressão
- **Bambu A1 Mini**: Excelente qualidade fora da caixa
- **Creality Ender 3**: Boa qualidade após calibração

### Velocidade
- **Bambu A1 Mini**: Até 250mm/s
- **Creality Ender 3**: Até 60mm/s

### Facilidade de Uso
- **Bambu A1 Mini**: Pronta para usar em minutos
- **Creality Ender 3**: Requer montagem e calibração

### Comunidade
- **Creality Ender 3**: Maior comunidade e suporte
- **Bambu A1 Mini**: Comunidade em crescimento

## Preço e Custo-Benefício

| Item | Bambu A1 Mini | Creality Ender 3 V2 |
|------|---------------|---------------------|
| **Preço** | R$ 2.200 | R$ 1.299 |
| **Custo por ano** | R$ 300 | R$门的 400 |
| **Facilidade** | Alta | Média |
| **Customização** | Limitada | Alta |

## Conclusão

Escolha a **Bambu A1 Mini** se:
- Quer facilidade e velocidade
- Tem orçamento maior
- Prefere imprimir sem configurações complexas

Escolha a **Creality Ender 3 V2** se:
- Quer o melhor custo-benefício
- Gosta de customizar e aprender
- Tem orçamento limitado`,
      coverImage: "/images/articles/printer-comparison.jpg",
      category: "comparisons",
      subcategory: "3d-printing",
      tags: ["comparativo", "bambu lab", "creality", "impressora 3D"],
      keywords: ["bambu a1 mini vs creality", "comparativo impressoras"],
      author: "Maria Santos",
      authorAvatar: "/images/authors/maria-santos.jpg",
      authorBio: "Engenheira especializada em manufatura aditiva.",
      countryCodes: ["BR"],
      language: "pt-BR",
      relatedProducts: [
        {
          productId: "amazon-affiliate-1",
          position: "top",
          title: "Creality Ender 3 V2",
          description: "Impressora 3D com excelente custo-benefício"
        }
      ],
      faqs: [
        {
          question: "Qual tem melhor qualidade de impressão?",
          answer: "Ambas têm boa qualidade, mas a Bambu A1 Mini tem melhor qualidade fora da caixa."
        },
        {
          question: "Qual é mais fácil para iniciantes?",
          answer: "A Bambu A1 Mini é mais fácil de usar desde o início."
        }
      ],
      callToAction: {
        text: "Comparar Preços",
        url: "#comparison-table",
        type: "internal"
      },
      seoTitle: "Bambu Lab A1 Mini vs Creality Ender 3 - Comparativo 2024",
      seoDescription: "Análise detalhada comparando Bambu Lab A1 Mini e Creality Ender 3 V2. Descubra qual é melhor para você.",
      readTime: 6,
      views: 2890,
      likes: 95,
      shares: 32,
      commentsCount: 28,
      isFeatured: true,
      isSponsored: false,
      publishedAt: new Date("2024-02-10"),
      createdAt: new Date("2024-02-05"),
      updatedAt: new Date("2024-03-18"),
    },
    {
      id: "back-to-school-products",
      portalId: "offers-portal-1",
      type: "list",
      status: "published",
      title: "Melhores Produtos para a Volta às Aulas 2024",
      slug: "melhores-produtos-volta-aulas",
      excerpt: "Lista dos melhores produtos e materiais para estudantes aproveitarem o ano letivo.",
      content: `# Melhores Produtos para a Volta às Aulas 2024

Prepare-se para o ano letivo com os melhores produtos para estudantes. Confira nossa seleção!

## 1. Notebooks para Estudantes

### Lenovo IdeaPad 3
- Processador Intel Core i5
- 8GB RAM, 256GB SSD
- Tela Full HD 15.6"
- **Preço**: R$ 2.499

### Acer Aspire 5
- AMD Ryzen 5
- 8GB RAM, 512GB SSD
- Placa gráfica dedicada
- **Preço**: R$ 2.799

## 2. Tablets para Anotações

### Samsung Galaxy Tab S9 FE
- S Pen incluído
- 128GB, 6GB RAM
- Tela 10.9" 90Hz
- **Preço**: R$ 2.199

### iPad 10ª Geração
- Apple Pencil 1ª gen
- Tela Liquid Retina 10.9"
- Chip A14 Bionic
- **Preço**: R$ 3.199

## 3. Acessórios Essenciais

### Mochila Anti-Furto
- Compartimentos seguros
- Resistente à água
- **Preço**: R$ 129

### Power Bank 20.000mAh
- Carregamento rápido
- 3 portas USB
- **Preço**: R$ 89

## 4. Apps para Estudar

### Notion
- Organização completa
- Gratuito para estudantes
- Templates prontos

### Forest
- Foco e produtividade
- Gamificação
- Plantar árvores reais

## Dicas de Economia

1. **Compre durante promoções**
2. **Compare preços**
3. **Aproveite descontos estudantis**
4. **Compre em conjunto com amigos**

Boa volta às aulas!`,
      coverImage: "/images/articles/back-to-school.jpg",
      category: "education",
      tags: ["volta às aulas", "estudantes", "notebooks", "tablets", "material escolar"],
      keywords: ["produtos volta às aulas", "material escolar 2024"],
      author: "Carlos Mendes",
      authorAvatar: "/images/authors/carlos-mendes.jpg",
      countryCodes: ["BR", "PT"],
      language: "pt-BR",
      relatedProducts: [],
      faqs: [
        {
          question: "Qual o melhor notebook para estudantes?",
          answer: "Depende do orçamento. O Lenovo IdeaPad 3 oferece bom custo-benefício."
        }
      ],
      callToAction: {
        text: "Ver Ofertas de Volta às Aulas",
        url: "/products?category=education",
        type: "internal"
      },
      seoTitle: "Melhores Produtos para Volta às Aulas 2024 - Guia Completo",
      seoDescription: "Lista completa dos melhores produtos, notebooks, tablets e acessórios para estudantes em 2024.",
      readTime: 7,
      views: 4120,
      likes: 156,
      shares: 67,
      commentsCount: 42,
      isFeatured: true,
      isSponsored: false,
      publishedAt: new Date("2024-01-25"),
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-02-15"),
    },
  ]
  
  return demoArticles
}

// Inicializar dados demonstrativos se necessário
export function initializeDemoArticles(): void {
  if (typeof window === "undefined") return
  
  const articles = getArticles()
  const categories = getCategories()
  
  if (articles.length === 0) {
    const demoArticles = createDemoArticles()
    saveArticles(demoArticles)
  }
  
  if (categories.length === 0) {
    const defaultCategories = ARTICLE_CATEGORIES.map(cat => ({
      id: cat.id,
      portalId: "default",
      name: cat.name,
      slug: cat.id,
      description: `Artigos sobre ${cat.name.toLowerCase()}`,
      icon: cat.icon,
      color: cat.color,
      articleCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    saveCategories(defaultCategories)
  }
}