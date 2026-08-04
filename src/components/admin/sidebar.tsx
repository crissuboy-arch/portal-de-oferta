"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Package, 
  Tag, 
  Store, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User,
  Folder,
  Ticket,
  BarChart3
} from "lucide-react"
import { logout } from "@/lib/auth/auth-service"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/admin/produtos", label: "Produtos", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/categorias", label: "Categorias", icon: <Folder className="h-5 w-5" /> },
    { href: "/admin/lojas", label: "Lojas", icon: <Store className="h-5 w-5" /> },
    { href: "/admin/cupons", label: "Cupons", icon: <Ticket className="h-5 w-5" /> },
    { href: "/admin/configuracoes", label: "Configurações", icon: <Settings className="h-5 w-5" /> },
  ]

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") return true
    return pathname.startsWith(href) && href !== "/admin"
  }

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900 text-white transition-all duration-300 flex flex-col h-screen border-r border-gray-800`}>
      {/* Logo e toggle */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-orange-500 flex items-center justify-center">
              <span className="font-bold text-white">A</span>
            </div>
            <span className="font-semibold">Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="h-8 w-8 rounded-md bg-orange-500 flex items-center justify-center">
              <span className="font-bold text-white">A</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-orange-500 text-white'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Perfil e logout */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="font-medium">Administrador</p>
              <p className="text-sm text-gray-400">admin@portal.com</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}