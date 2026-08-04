// Tipos para autenticação e sessão
export interface AdminUser {
  email: string
  name: string
  role: 'admin'
}

export interface AuthSession {
  isAuthenticated: boolean
  user: AdminUser | null
}

export interface LoginCredentials {
  email: string
  password: string
}