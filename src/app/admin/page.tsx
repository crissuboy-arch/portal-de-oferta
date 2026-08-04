import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Settings,
  BarChart3,
  Bell,
  LogOut,
  Globe,
} from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Produtos Ativos", value: "1,245", change: "+12%", icon: Package },
  { label: "Total de Usuários", value: "45,892", change: "+8%", icon: Users },
  { label: "Vendas do Mês", value: "R$ 124,850", change: "+15%", icon: DollarSign },
  { label: "Taxa de Conversão", value: "3.8%", change: "+0.4%", icon: TrendingUp },
]

const recentOrders = [
  { id: "#ORD-001", customer: "João Silva", amount: "R$它所 499,90", status: "Entregue", date: "15/03/2024" },
  { id: "#ORD-002", customer: "Maria Santos", amount: "R$ 799,90", status: "Processando", date: "14/03/2024" },
  { id: "#ORD-003", customer: "Carlos Oliveira", amount: "R$ 299,90", status: "Pendente", date: "13/03/2024" },
  { id: "#ORD-004", customer: "Ana Costa", amount: "R$ 1.199,90", status: "Entregue", date: "12/03/2024" },
  { id: "#ORD-005", customer: "Pedro Alves", amount: "R$ 599,90", status: "Cancelado", date: "11/03/2024" },
]

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin", active: true },
  { icon: Globe, label: "Portais", href: "/admin/portals", active: false },
  { icon: Package, label: "Produtos", href: "/admin/products", active: false },
  { icon: Users, label: "Usuários", href: "/admin/users", active: false },
  { icon: FileText, label: "Pedidos", href: "/admin/orders", active: false },
  { icon: DollarSign, label: "Afiliados", href: "/admin/affiliates", active: false },
  { icon: FileText, label: "Blog", href: "/admin/blog", active: false },
  { icon: Settings, label: "Configurações", href: "/admin/settings", active: false },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Painel Admin</h1>
              <p className="text-xs text-gray-500 dark:text-gray-500">Portal de Ofertas</p>
            </div>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                    <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 dark:border-gray-800">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/95">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Visão geral do portal
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs text-white">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Admin Master
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    admin@portal.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <main className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Visão Geral
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Estatísticas e métricas do portal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-success mt-1">{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pedidos Recentes
                </h4>
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pedido
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cliente
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Valor
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 text-sm text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                          {order.customer}
                        </td>
                        <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {order.amount}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              order.status === "Entregue"
                                ? "bg-success/10 text-success"
                                : order.status === "Processando"
                                ? "bg-warning/10 text-warning"
                                : order.status === "Pendente"
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                : "bg-danger/10 text-danger"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Ações Rápidas
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-auto flex-col gap-2 p-6">
                  <Package className="h-8 w-8" />
                  <span>Adicionar Produto</span>
                </Button>
                <Button className="h-auto flex-col gap-2 p-6">
                  <FileText className="h-8 w-8" />
                  <span>Criar Artigo</span>
                </Button>
                <Button className="h-auto flex-col gap-2 p-6">
                  <Users className="h-8 w-8" />
                  <span>Gerenciar Usuários</span>
                </Button>
                <Button className="h-auto flex-col gap-2 p-6">
                  <DollarSign className="h-8 w-8" />
                  <span>Ver Relatórios</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Atividade Recente
            </h4>
            <div className="space-y-4">
              {[
                { action: "Novo produto adicionado", user: "Admin", time: "2 horas atrás" },
                { action: "Pedido #ORD-006 processado", user: "Sistema", time: "4 horas atrás" },
                { action: "Artigo publicado no blog", user: "Editor", time: "6 horas atrás" },
                { action: "Novo afiliado cadastrado", user: "Sistema", time: "1 dia atrás" },
                { action: "Configurações atualizadas", user: "Admin", time: "2 dias atrás" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      por {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}