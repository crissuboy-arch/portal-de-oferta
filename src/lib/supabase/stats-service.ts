import { supabase } from '@/lib/supabase/client'

export interface PortalStats {
  totalProducts: number
  publishedProducts: number
  activeStores: number
  activeCategories: number
  todayProducts: number
  totalSavings: number
  positiveRating: number
  activeMembers: number
}

export const statsService = {
  async getStats(): Promise<PortalStats> {
    try {
      // Buscar estatísticas reais do Supabase
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Contar produtos publicados
      const { count: publishedCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
      
      // Contar produtos de hoje
      const { count: todayCount, error: todayError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('created_at', today.toISOString())
      
      // Contar lojas ativas
      const { count: storesCount, error: storesError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
      
      // Contar categorias ativas
      const { count: categoriesCount, error: categoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
      
      // Calcular economias totais (soma dos descontos)
      const { data: discountsData, error: discountsError } = await supabase
        .from('products')
        .select('original_price, current_price')
        .eq('status', 'published')
      
      let totalSavings = 0
      if (discountsData) {
        totalSavings = discountsData.reduce((acc, product) => {
          if (product.original_price > product.current_price) {
            return acc + (product.original_price - product.current_price)
          }
          return acc
        }, 0)
      }
      
      // Usar dados reais ou zeros se houver erro
      const stats: PortalStats = {
        totalProducts: publishedCount || 0,
        publishedProducts: publishedCount || 0,
        activeStores: storesCount || 0,
        activeCategories: categoriesCount || 0,
        todayProducts: todayCount || 0,
        totalSavings: totalSavings || 0,
        positiveRating: 0, // Será calculado quando houver sistema de avaliações
        activeMembers: 0   // Será calculado quando houver sistema de usuários
      }
      
      return stats
      
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      // Retornar zeros em caso de erro
      return {
        totalProducts: 0,
        publishedProducts: 0,
        activeStores: 0,
        activeCategories: 0,
        todayProducts: 0,
        totalSavings: 0,
        positiveRating: 0,
        activeMembers: 0
      }
    }
  }
}