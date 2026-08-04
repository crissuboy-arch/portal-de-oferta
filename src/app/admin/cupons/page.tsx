"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit, Trash2, Ticket } from "lucide-react"
import { couponService } from "@/lib/supabase/services"

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const data = await couponService.getAll(false)
      setCoupons(data)
    } catch (error) {
      console.error("Erro ao carregar cupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return
    
    try {
      await couponService.delete(id)
      setCoupons(coupons.filter(c => c.id !== id))
    } catch (error) {
      console.error("Erro ao excluir cupom:", error)
      alert("Erro ao excluir cupom")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-PT')
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
          <h1 className="text-3xl font-bold text-white">Cupons</h1>
          <p className="text-gray-400 mt-2">Gerencie os códigos promocionais</p>
        </div>
        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
          <PlusCircle className="h-5 w-5 mr-2" />
          Novo Cupom
        </button>
      </div>

      <div className="bg-card-dark border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Código</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Título</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Desconto</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Validade</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-800 rounded-lg mr-3">
                        <Ticket className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="font-medium text-white font-mono">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{coupon.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-green-400">
                      {coupon.discount_value}{coupon.discount_type === 'percentage' ? '%' : '€'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">
                      {formatDate(coupon.end_date)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      coupon.is_active 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {coupon.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-orange-400 hover:text-orange-300 hover:bg-gray-800 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
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