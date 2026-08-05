"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { 
  Home, 
  Package, 
  Tag, 
  Store, 
  Ticket, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Download,
  BarChart3,
  FileText,
  Palette
} from "lucide-react"
import { authService } from "@/lib/supabase/services"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Produtos", href: "/admin/produtos", icon: Package },
  { name: "Importar", href: "/admin/produtos/import", icon: Download },
  { name: "Categorias", href: "/admin/categorias", icon: Tag },
  { name: "Lojas", href: "/admin/lojas", icon: Store },
  { name: "Cupons", href: "/admin/cupons", icon: Ticket },
  { name: "Aparência", href: "/admin/aparencia", icon: Palette },
  { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await authService.getCurrentUser()
      setUser(user)
    } catch (error) {
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Erro ao sair:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Sidebar para mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-card-dark border-r border-border overflow-y-auto">
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-bold">Admin Portal</h2>
                <p className="text-xs text-gray-400">Painel Administrativo</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User Info */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-gray-400">Administrador</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-3 p-2 text-gray-400 hover:text-white"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:overflow-y-auto lg:bg-card-dark lg:border-r lg:border-border lg:block">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-bold">Admin Portal</h2>
              <p className="text-xs text-gray-400">Painel Administrativo</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-3 p-2 text-gray-400 hover:text-white"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-card-dark px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-xl font-semibold">
                {navigation.find(item => pathname === item.href || pathname?.startsWith(item.href + '/'))?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-sm text-gray-400">
                {new Date().toLocaleDateString('pt-PT', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}