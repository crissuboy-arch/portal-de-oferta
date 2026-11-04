// Configuração do Supabase
// Sem chave configurada, o cliente fica nulo em vez de rebentar o build:
// a página inicial já trata o erro e mostra a lista vazia, e as rotas
// /api/* devolvem erro em runtime em vez de falharem na compilação.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gfprpymovjdtmiixkubw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

import { createClient } from '@supabase/supabase-js'

export const supabase = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : (null as unknown as ReturnType<typeof createClient>)
