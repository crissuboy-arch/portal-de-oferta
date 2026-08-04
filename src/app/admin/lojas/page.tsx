"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit, Trash2, Store } from "lucide-react"
import { storeService } from "@/lib/supabase/services"

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    try {
      const data = await storeService.getAll(false)
      setStores(data)
    } catch (error) {
      console.error("Erro ao carregar lojas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta loja?")) return
    
    try {
      await storeService.delete(id)
      setStores(stores.filter(s => s.id !== id))
    } catch (error) {
      console.error("Erro ao excluir loja:", error)
      alert("Erro ao excluir loja")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Lojas</h1>
          <p className="text-gray-400 mt-2">Gerencie as lojas parceiras</p>
        </div>
        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
          <PlusCircle className="h-5 w-5 mr-2" />
          Nova Loja
        </button>
      </div>

      <div className="bg-card-dark border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Domínio</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">País</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Afiliados</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-800 rounded-lg mr-3">
                        <Store className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="font-medium text-white">{store.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{store.domain}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{store.country_code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      store.has_affiliate_program 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {store.has_affiliate_program ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      store.is_active 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {store.is_active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-orange-400 hover:text-orange-300 hover:bg-gray-800 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(store.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}