"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit, Trash2, Tag } from "lucide-react"
import { categoryService } from "@/lib/supabase/services"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll(false)
      setCategories(data)
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return
    
    try {
      await categoryService.delete(id)
      setCategories(categories.filter(c => c.id !== id))
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      alert("Erro ao excluir categoria")
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
          <h1 className="text-3xl font-bold text-white">Categorias</h1>
          <p className="text-gray-400 mt-2">Gerencie as categorias de produtos</p>
        </div>
        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
          <PlusCircle className="h-5 w-5 mr-2" />
          Nova Categoria
        </button>
      </div>

      <div className="bg-card-dark border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Slug</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Descrição</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">País</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-800 rounded-lg mr-3">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="font-medium text-white">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{category.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400">{category.description || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{category.country_code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      category.is_active 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {category.is_active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-orange-400 hover:text-orange-300 hover:bg-gray-800 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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