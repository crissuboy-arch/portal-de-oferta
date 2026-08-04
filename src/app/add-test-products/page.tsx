"use client"

import { useState, useEffect } from "react"
import { Check, AlertCircle } from "lucide-react"

export default function AddTestProductsPage() {
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [addedCount, setAddedCount] = useState(0)

  const addTestProducts = async () => {
    setMessage("")
    setError("")
    
    try {
      const testProducts = [
        {
          name: "Portátil Lenovo Ideapad 5",
          slug: "portatil-lenovo-ideapad-5",
          description: "Portátil de 15.6\" com processador Intel Core i5, 8GB RAM, 512GB SSD, ideal para estudantes.",
          shortDescription: "Portátil Lenovo com excelente relação qualidade-preço para estudantes",
          originalPrice: 699.99,
          currentPrice: 549.99,
          discount: 21,
          category: "tecnologia",
          categoryName: "Tecnologia",
          store: "worten",
          storeName: "Worten",
          affiliateUrl: "https://www.worten.pt/product/portatil-lenovo-ideapad-5",
          imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          rating: 4.7,
          votes: 128,
          expiryDate: "2026-12-31",
          isFeatured: true,
          status: "active",
          country: "PT",
          currency: "EUR",
          features: ["Intel Core i5", "8GB RAM", "512GB SSD", "Windows 11"],
          seoTitle: "Portátil Lenovo Ideapad 5 em Promoção - 21% Desconto",
          seoDescription: "Compre o portátil Lenovo Ideapad 5 com 21% de desconto na Worten. Ideal para estudantes com excelente performance.",
          tags: ["portátil", "lenovo", "estudante", "desconto", "tecnologia"]
        },
        {
          name: "Samsung Galaxy Tab S9 FE",
          slug: "samsung-galaxy-tab-s9-fe",
          description: "Tablet Samsung Galaxy Tab S9 FE com tela de 12.4\", ideal para estudo e produtividade.",
          shortDescription: "Tablet Samsung perfeito para anotações e estudo digital",
          originalPrice: 449.99,
          currentPrice: 379.99,
          discount: 16,
          category: "tecnologia",
          categoryName: "Tecnologia",
          store: "fnac",
          storeName: "Fnac",
          affiliateUrl: "https://www.fnac.pt/tablet-samsung-galaxy-tab-s9-fe",
          imageUrl: "https://images.unsplash.com/photo-1546054450-469c6d0f52d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          rating: 4.8,
          votes: 95,
          expiryDate: "2026-11-30",
          isFeatured: true,
          status: "active",
          country: "PT",
          currency: "EUR",
          features: ["12.4\" display", "S-Pen incluído", "128GB armazenamento", "Android"],
          seoTitle: "Tablet Samsung Galaxy Tab S9 FE - 16% Desconto",
          seoDescription: "Tablet Samsung Galaxy Tab S9 FE em promoção na Fnac. Perfeito para estudantes e profissionais.",
          tags: ["tablet", "samsung", "estudo", "digital", "promoção"]
        },
        {
          name: "Kindle Paperwhite 11ª Geração",
          slug: "kindle-paperwhite-11-geracao",
          description: "Leitor de e-books Kindle Paperwhite com luz embutida ajustável e tela à prova de água.",
          shortDescription: "Kindle Paperwhite para leitura confortável em qualquer lugar",
          originalPrice: 129.99,
          currentPrice: 99.99,
          discount: 23,
          category: "livros",
          categoryName: "Livros",
          store: "amazon",
          storeName: "Amazon",
          affiliateUrl: "https://www.amazon.pt/kindle-paperwhite-11th-generation",
          imageUrl: "https://images.unsplash.com/photo-1544716278-e513176f20b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          rating: 4.9,
          votes: 210,
          expiryDate: "2026-10-31",
          isFeatured: false,
          status: "active",
          country: "PT",
          currency: "EUR",
          features: ["Luz embutida", "À prova de água", "6.8\" display", "32GB"],
          seoTitle: "Kindle Paperwhite - 23% Desconto na Amazon",
          seoDescription: "Kindle Paperwhite 11ª geração com 23% de desconto. Perfeito para amantes de leitura.",
          tags: ["kindle", "e-book", "leitura", "amazon", "desconto"]
        }
      ]

      const STORAGE_KEY = 'portal-admin-database'
      const existingData = localStorage.getItem(STORAGE_KEY)
      let database = existingData ? JSON.parse(existingData) : {
        products: [],
        categories: [],
        stores: [],
        coupons: [],
        settings: {},
        users: []
      }

      let added = 0
      testProducts.forEach(testProduct => {
        const productExists = database.products.some((p: any) => p.slug === testProduct.slug)
        if (!productExists) {
          database.products.push({
            id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...testProduct
          })
          added++
        }
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(database))
      setAddedCount(added)
      setMessage(added > 0 ? `✅ ${added} produtos de teste foram adicionados com sucesso!` : "ℹ️ Todos os produtos de teste já existem no sistema.")
      
    } catch (err) {
      setError("❌ Erro ao adicionar produtos. Verifique o console para mais detalhes.")
      console.error("Erro:", err)
    }
  }

  const clearDatabase = () => {
    if (confirm("Tem certeza que deseja limpar todos os produtos do sistema?")) {
      try {
        const STORAGE_KEY = 'portal-admin-database'
        const existingData = localStorage.getItem(STORAGE_KEY)
        let database = existingData ? JSON.parse(existingData) : {
          products: [],
          categories: [],
          stores: [],
          coupons: [],
          settings: {},
          users: []
        }
        
        database.products = []
        localStorage.setItem(STORAGE_KEY, JSON.stringify(database))
        setMessage("✅ Todos os produtos foram removidos.")
        setAddedCount(0)
      } catch (err) {
        setError("❌ Erro ao limpar produtos.")
        console.error("Erro:", err)
      }
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adicionar Produtos de Teste</h1>
        <p className="text-gray-600">
          Use esta página para adicionar produtos de teste ao sistema. Os produtos aparecerão automaticamente na página inicial.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <Check className="h-5 w-5 text-green-600 mr-3" />
          <span className="text-green-700">{message}</span>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Produtos de Teste</h2>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
            <span className="text-gray-700">Portátil Lenovo Ideapad 5 - 21% desconto</span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
            <span className="text-gray-700">Samsung Galaxy Tab S9 FE - 16% desconto</span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
            <span className="text-gray-700">Kindle Paperwhite 11ª Geração - 23% desconto</span>
          </li>
        </ul>

        <div className="flex space-x-4">
          <button
            onClick={addTestProducts}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            Adicionar Produtos de Teste
          </button>
          
          <button
            onClick={clearDatabase}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Limpar Todos os Produtos
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Próximos Passos</h2>
        <ol className="space-y-4">
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded mr-3">1</span>
            <div>
              <p className="font-medium text-gray-900">Clique em "Adicionar Produtos de Teste"</p>
              <p className="text-sm text-gray-600">Isso adicionará 3 produtos de exemplo ao sistema.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded mr-3">2</span>
            <div>
              <p className="font-medium text-gray-900">Acesse a página inicial</p>
              <p className="text-sm text-gray-600">Os produtos aparecerão automaticamente na lista de ofertas.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded mr-3">3</span>
            <div>
              <p className="font-medium text-gray-900">Use o painel administrativo</p>
              <p className="text-sm text-gray-600">Acesse /admin para adicionar, editar ou remover produtos manualmente.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  )
}