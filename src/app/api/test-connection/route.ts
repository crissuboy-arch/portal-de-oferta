import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    // Testar conexão básica
    const { data, error } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Erro na conexão',
        error: error.message,
        details: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
        }
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Conexão estabelecida com sucesso',
      data: {
        count: data || 0,
        tables: ['products', 'categories', 'stores', 'coupons']
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Erro inesperado',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}