import { AdminUser, AuthSession, LoginCredentials } from './types'

// Dados do admin fixos para desenvolvimento
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'troque-esta-senha'
const ADMIN_NAME = 'Administrador do Portal'

// Simulação de banco de dados de sessões (em produção usar cookies seguros)
let currentSession: AuthSession = {
  isAuthenticated: false,
  user: null
}

/**
 * Verifica se as credenciais são válidas
 */
export async function verifyCredentials(credentials: LoginCredentials): Promise<boolean> {
  // Em produção, usar hash seguro (bcrypt)
  return credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD
}

/**
 * Realiza login
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const isValid = await verifyCredentials(credentials)
  
  if (!isValid) {
    throw new Error('Credenciais inválidas')
  }
  
  currentSession = {
    isAuthenticated: true,
    user: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: 'admin'
    }
  }
  
  return currentSession
}

/**
 * Realiza logout
 */
export async function logout(): Promise<void> {
  currentSession = {
    isAuthenticated: false,
    user: null
  }
}

/**
 * Obtém a sessão atual
 */
export function getCurrentSession(): AuthSession {
  return currentSession
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return currentSession.isAuthenticated
}

/**
 * Middleware para proteger rotas
 */
export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    return false
  }
  return true
}