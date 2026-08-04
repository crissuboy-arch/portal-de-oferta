import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingBag, Tag, TrendingUp, Filter, Grid, List } from "lucide-react"
import { formatPrice } from "@/lib/utils"

const products = [
  {
    id: "1",
    name: "Smartphone Premium 5G",
    description: "Smartphone com câmera tripla, tela AMOLED e bateria de longa duração.",
    price: 2999.99,
    originalPrice: 3499.99,
    discount: 14,
    rating: 4.7,
    reviewCount: 124,
    category: "Eletrônicos",
    type: "own",
    image: "/images/products/smartphone.jpg",
  },
  {
    id: "2",
    name: "Notebook Gamer Pro",
    description: "Notebook com processador de última geração e placa de vídeo dedicada.",
    price: 5999.99,
    originalPrice: 6999.99,
    discount: 14,
    rating: 4.9,
    reviewCount: 89,
    category: "Eletrônicos",
    type: "affiliate",
    image: "/images/products/notebook.jpg",
  },
    {
      id: "3",
      name: "Fone de Ouvido Bluetooth",
      description: "Fone sem fio com cancelamento de ruído ativo e bateria de 30h.",
      price: 399.99,
    originalPrice: 499.99,
    discount: 20,
    rating: 4.5,
    reviewCount: 256,
    category: "Áudio",
    type: "own",
    image: "/images/products/fone.jpg",
  },
  {
    id: "4",
    name: "Smart Watch Fitness",
    description: "Relógio inteligente com monitoramento de saúde e 50 modos de exercício.",
    price: 799.99,
    originalPrice: 999.99,
    discount: 20,
    rating: 4.6,
    reviewCount: 178,
    category: "Wearables",
    type: "affiliate",
    image: "/images/products/smartwatch.jpg",
  },
  {
    id: "5",
    name: "Câmera DSLR Profissional",
    description: "Câmera com sensor full-frame e kit de lentes para fotografia profissional.",
    price: 8999.99,
    originalPrice: 10999.99,
    discount: 18,
    rating: 4.8,
    reviewCount: 42,
    category: "Fotografia",
    type: "own",
    image: "/images/products/camera.jpg",
  },
  {
    id: "6",
    name: "Console de Videogame",
    description: "Console de última geração com 1TB de armazenamento e controle sem fio.",
    price: 3499.99,
    originalPrice: 3999.99,
    discount: 13,
    rating: 4.9,
    reviewCount: 312,
    category: "Games",
    type: "affiliate",
    image: "/images/products/console.jpg",
  },
    {
      id: "7",
      name: "Tablet 10 polegadas",
      description: "Tablet com tela retina, caneta stylus e 128GB de armazenamento.",
      price: 2199.99,
      originalPrice: 2599.99,
      discount: 15,
      rating: 4.4,
      reviewCount: 96,
    category: "Eletrônicos",
    type: "own",
    image: "/images/products/tablet.jpg",
  },
  {
    id: "8",
    name: "Caixa de Som Bluetooth",
    description: "Caixa de som portátil à prova d'água com 20h de bateria.",
    price: 499.99,
    originalPrice: 599.99,
    discount: 17,
    rating: 4.3,
    reviewCount: 187,
    category: "Áudio",
    type: "affiliate",
    image: "/images/products/caixa-som.jpg",
  },
]

const categories = [
  { name: "Todos", count: 1245 },
  { name: "Eletrônicos", count: 423 },
  { name: "Moda", count: 264 },
  { name: "Casa e Decoração", count: 189 },
  { name: "Saúde e Beleza", count: 156 },
  { name: "Esportes", count: 98 },
  { name: "Livros", count: 75 },
  { name: "Brinquedos", count: 42 },
]

const filters = {
  price: ["Até R$ 500", "R$ 500 - R$ 1.000", "R$ 1.000 - R$ 2.000", "Acima de R$ 2.000"],
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Nossos Produtos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Descubra produtos próprios e afiliados com as melhores ofertas do mercado.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Card>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Categorias</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-gray-300 text-primary" />
                            <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            ({category.count})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tipo</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-primary" />
                        <span className="text-gray-700 dark:text-gray-300">Produtos Próprios</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-primary" />
                        <span className="text-gray-700 dark:text-gray-300">Produtos Afiliados</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preço</h4>
                    <div className="space-y-2">
                      {["Até R$ 500", "R$ 500 - R$ 1.000", "R$ 1.000 - R$ 2.000", "Acima de R$ 2.000"].map((range) => (
                        <label key={range} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300 text-primary" />
                          <span className="text-gray-700 dark:text-gray-300">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" fullWidth>
                    Aplicar Filtros
                  </Button>
                  <Button variant="ghost" fullWidth>
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Mostrando <span className="font-semibold text-gray-900 dark:text-white">8</span> de{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">1.245</span> produtos
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-primary dark:text-gray-400">
                    <Grid className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary dark:text-gray-600">
                    <List className="h-5 w-5" />
                  </button>
                </div>
                <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800">
                  <option>Ordenar por: Mais relevantes</option>
                  <option>Preço: Menor para maior</option>
                  <option>Preço: Maior para menor</option>
                  <option>Avaliação: Melhor primeiro</option>
                  <option>Desconto: Maior primeiro</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} hover className="group">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-4"></div>
                    {product.discount && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-danger text-white px-2 py-1 rounded text-sm font-medium">
                          -{product.discount}%
                        </span>
                      </div>
                    )}
                    {product.type === "affiliate" && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-secondary text-white px-2 py-1 rounded text-sm font-medium">
                          Afiliado
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.rating}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 dark:text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                      <Button size="sm">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled>
                  Anterior
                </Button>
                <Button variant="outline" className="bg-primary text-white hover:bg-primary-hover">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <span className="px-2">...</span>
                <Button variant="outline">25</Button>
                <Button variant="outline">
                  Próxima
                </Button>
              </div>
            </div>

            {/* Affiliate Info */}
            <Card className="mt-8 bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Torne-se um Afiliado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ganhe comissões vendendo nossos produtos. Cadastre-se gratuitamente e comece a
                    ganhar hoje mesmo.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                    Saiba Mais
                  </Button>
                  <Button className="bg-secondary hover:bg-purple-700">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Cadastrar-se
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}