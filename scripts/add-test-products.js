#!/usr/bin/env node

// Script para adicionar produtos de teste ao sistema

const testProducts = [
  {
    name: "Portátil Lenovo Ideapad 5",
    slug: "portatil-lenovo-ideapad-5",
    description: "Portátil de 15.6\" com processador Intel Core i5, 8GB RAM, 512GB SSD, ideal para estudantes.",
    shortDescription: "Portátil Lenovo com excelente relação qualidade-preço para estudantes",
    originalPrice: 699.99,
    currentPrice: 549.99,
    discount: 21, // Calculado automaticamente: (699.99-549.99)/699.99*100 = ~21.43%
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ["Luz embutida", "À prova de água", "6.8\" display", "32GB"],
    seoTitle: "Kindle Paperwhite - 23% Desconto na Amazon",
    seoDescription: "Kindle Paperwhite 11ª geração com 23% de desconto. Perfeito para amantes de leitura.",
    tags: ["kindle", "e-book", "leitura", "amazon", "desconto"]
  }
]

// Esta função simula a adição de produtos ao localStorage
function addTestProducts() {
  try {
    const STORAGE_KEY = 'portal-admin-database'
    
    // Recupera dados existentes ou cria estrutura vazia
    const existingData = localStorage.getItem(STORAGE_KEY)
    let database = existingData ? JSON.parse(existingData) : {
      products: [],
      categories: [],
      stores: [],
      coupons: [],
      settings: {},
      users: []
    }
    
    // Adiciona cada produto de teste se ainda não existir
    testProducts.forEach(testProduct => {
      const productExists = database.products.some(p => p.slug === testProduct.slug)
      if (!productExists) {
        database.products.push({
          id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...testProduct
        })
        console.log(`✅ Produto adicionado: ${testProduct.name}`)
      } else {
        console.log(`ℹ️  Produto já existe: ${testProduct.name}`)
      }
    })
    
    // Salva de volta no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database))
    console.log(`🎉 ${testProducts.length} produtos de teste foram adicionados/verificados`)
    
  } catch (error) {
    console.error('❌ Erro ao adicionar produtos:', error)
  }
}

// Executa a função
if (typeof window !== 'undefined') {
  addTestProducts()
} else {
  console.log('Este script deve ser executado no navegador')
}