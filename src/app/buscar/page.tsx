'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResult {
  products: Array<{
    id: string
    name: string
    slug: string
    short_description: string | null
    current_price: number
    original_price: number
    discount_percentage: number
    featured_image_url: string | null
    categories: { name: string; slug: string }
    stores: { name: string; domain: string }
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
    description: string | null
    icon: string | null
  }>
  stores: Array<{
    id: string
    name: string
    slug: string
    domain: string
    logo_url: string | null
    description: string | null
  }>
}

export default function BuscarPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      searchProducts()
    } else {
      setLoading(false)
    }
  }, [query])

  const searchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
      } else {
        setError(data.message || 'Erro na busca')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error('Erro na busca:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">
              Buscando por: <span className="text-orange-500">"{query}"</span>
            </h1>
            <div className="bg-secondary rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Procurando resultados...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">
              Busca: <span className="text-orange-500">"{query}"</span>
            </h1>
            <div className="bg-secondary rounded-lg p-8 text-center">
              <div className="text-red-400 mb-4">⚠️ {error}</div>
              <button
                onClick={searchProducts}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalResults = results 
    ? results.products.length + results.categories.length + results.stores.length
    : 0

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Resultados para: <span className="text-orange-500">"{query}"</span>
          </h1>
          <p className="text-gray-400 mb-8">
            {totalResults === 0 
              ? `Nenhum resultado encontrado para "${query}"`
              : `Encontrados ${totalResults} resultados`}
          </p>

          {/* Resultados de Produtos */}
          {results?.products && results.products.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-lg mr-3">
                  {results.products.length}
                </span>
                Produtos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="bg-secondary hover:bg-secondary/80 rounded-xl overflow-hidden transition group"
                  >
                    <div className="p-5">
                      <div className="relative h-48 mb-4 bg-gray-800 rounded-lg overflow-hidden">
                        {product.featured_image_url ? (
                          <Image
                            src={product.featured_image_url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            Sem imagem
                          </div>
                        )}
                        {product.discount_percentage > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                            -{product.discount_percentage}%
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-white font-medium mb-2 group-hover:text-orange-500 transition line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.short_description || 'Sem descrição'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-lg">
                            {formatPrice(product.current_price)}
                          </div>
                          {product.original_price > product.current_price && (
                            <div className="text-gray-400 text-sm line-through">
                              {formatPrice(product.original_price)}
                            </div>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {product.stores.name}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <span className="text-orange-500 text-sm font-medium">
                          {product.categories.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Resultados de Categorias */}
          {results?.categories && results.categories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-lg mr-3">
                  {results.categories.length}
                </span>
                Categorias
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categoria/${category.slug}`}
                    className="bg-secondary hover:bg-secondary/80 rounded-lg p-4 text-center transition group"
                  >
                    <div className="text-2xl mb-2">{category.icon || '📁'}</div>
                    <h3 className="text-white font-medium group-hover:text-blue-500 transition">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Resultados de Lojas */}
          {results?.stores && results.stores.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-lg mr-3">
                  {results.stores.length}
                </span>
                Lojas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.stores.map((store) => (
                  <Link
                    key={store.id}
                    href={`/loja/${store.slug}`}
                    className="bg-secondary hover:bg-secondary/80 rounded-lg p-4 transition group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-lg">
                        {store.logo_url ? (
                          <Image
                            src={store.logo_url}
                            alt={store.name}
                            width={48}
                            height={48}
                            className="rounded-lg"
                          />
                        ) : (
                          '🏪'
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium group-hover:text-green-500 transition">
                          {store.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{store.domain}</p>
                      </div>
                    </div>
                    {store.description && (
                      <p className="text-gray-400 text-xs mt-3 line-clamp-2">
                        {store.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Nenhum resultado */}
          {totalResults === 0 && (
            <div className="bg-secondary rounded-xl p-12 text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Nenhum resultado encontrado
              </h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Não encontramos resultados para <span className="text-orange-500">"{query}"</span>.
                Tente outros termos ou explore nossas categorias.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  Voltar à página inicial
                </Link>
                <Link
                  href="/categorias"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  Ver todas categorias
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}