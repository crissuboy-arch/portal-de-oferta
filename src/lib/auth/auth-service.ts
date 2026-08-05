import { supabase } from '@/lib/supabase/client'
import { AdminUser, AuthSession, LoginCredentials } from './types'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'

// Obter sessão do Supabase Auth
export async function getCurrentSession(): Promise<AuthSession> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Erro ao obter sessão:', error)
      return { isAuthenticated: false, user: null }
    }
    
    if (!session?.user) {
      return { isAuthenticated: false, user: null }
    }
    
    // Verificar se o usuário é admin (pode ser expandido com tabela de usuários)
    const isAdmin = session.user.email === ADMIN_EMAIL || session.user.email?.endsWith('@portal.com')
    
    if (!isAdmin) {
      return { isAuthenticated: false, user: null }
    }
    
    return {
      isAuthenticated: true,
      user: {
        email: session.user.email || '',
        name: session.user.user_metadata?.name || 'Administrador',
        role: 'admin' as const
      }
    }
  } catch (error) {
    console.error('Erro no getCurrentSession:', error)
    return { isAuthenticated: false, user: null }
  }
}

/**
 * Realiza login com Supabase Auth
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })
    
    if (error) {
      console.error('Erro no login:', error)
      throw new Error(error.message)
    }
    
    if (!data.session?.user) {
      throw new Error('Falha na autenticação')
    }
    
    // Verificar se é admin
    const isAdmin = data.session.user.email === ADMIN_EMAIL || data.session.user.email?.endsWith('@portal.com')
    
    if (!isAdmin) {
      await supabase.auth.signOut()
      throw new Error('Acesso não autorizado')
    }
    
    return {
      isAuthenticated: true,
      user: {
        email: data.session.user.email || '',
        name: data.session.user.user_metadata?.name || 'Administrador',
        role: 'admin' as const
      }
    }
  } catch (error: any) {
    throw new Error(error.message || 'Falha no login')
  }
}

/**
 * Realiza logout
 */
export async function logout(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Erro no logout:', error)
    }
  } catch (error) {
    console.error('Erro no logout:', error)
  }
}

/**
 * Verifica se o usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return session.isAuthenticated
}

/**
 * Middleware para proteger rotas
 */
export async function requireAuth(): Promise<boolean> {
  return await isAuthenticated()
}

/**
 * Obtém usuário atual
 */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const session = await getCurrentSession()
  return session.user
}