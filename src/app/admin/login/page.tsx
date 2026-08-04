"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"
import { authService } from "@/lib/supabase/services"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await authService.signIn(email, password)
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-xl mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Portal Admin</h1>
          <p className="text-gray-400 mt-2">Acesso administrativo</p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-card-dark border border-border rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="admin@exemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar no Painel"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-center text-sm text-gray-400">
              Use suas credenciais de administrador do Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}