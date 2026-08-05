import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        message: 'Digite pelo menos 2 caracteres para buscar',
        results: [],
        count: 0
      })
    }
    
    console.log(`🔍 Buscando por: "${query}"`)
    
    // Buscar produtos (nome, descrição, tags)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        short_description,
        current_price,
        original_price,
        discount_percentage,
        featured_image_url,
        status,
        category_id,
        store_id,
        categories!inner(name, slug),
        stores!inner(name, domain)
      `)
      .eq('status', 'published')
      .or(`name.ilike.%${query}%,short_description.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20)
    
    if (productsError) {
      console.error('Erro na busca de produtos:', productsError)
      return NextResponse.json({
        success: false,
        message: 'Erro ao buscar produtos',
        results: [],
        count: 0
      }, { status: 500 })
    }
    
    // Buscar categorias
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug, description, icon')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(10)
    
    // Buscar lojas
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, name, slug, domain, logo_url, description')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(10)
    
    const results = {
      products: products || [],
      categories: categories || [],
      stores: stores || []
    }
    
    const totalResults = results.products.length + results.categories.length + results.stores.length
    
    return NextResponse.json({
      success: true,
      query,
      results,
      counts: {
        products: results.products.length,
        categories: results.categories.length,
        stores: results.stores.length,
        total: totalResults
      },
      message: totalResults === 0 
        ? `Nenhum resultado encontrado para "${query}"`
        : `Encontrados ${totalResults} resultados para "${query}"`
    })
    
  } catch (error: any) {
    console.error('Erro na busca:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno no servidor',
      error: error.message,
      results: [],
      count: 0
    }, { status: 500 })
  }
}