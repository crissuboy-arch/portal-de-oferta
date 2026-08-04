"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

export default function ImportProductsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("")

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform)
    toast.info(`Importação de ${platform} será implementada em breve`)
  }

  const platforms = [
    { id: "amazon", name: "Amazon", icon: "🛒", color: "bg-orange-50 text-orange-800 border-orange-200" },
    { id: "aliexpress", name: "AliExpress", icon: "📦", color: "bg-red-50 text-red-800 border-red-200" },
    { id: "temu", name: "Temu", icon: "🎁", color: "bg-purple-50 text-purple-800 border-purple-200" },
    { id: "csv", name: "CSV/Excel", icon: "📊", color: "bg-blue-50 text-blue-800 border-blue-200" },
    { id: "api", name: "API", icon: "🔌", color: "bg-green-50 text-green-800 border-green-200" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Importar Produtos</h1>
              <p className="text-muted-foreground">
                Importe produtos de diversas plataformas e fontes
              </p>
            </div>
          </div>
        </div>

        {/* Plataformas de importação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => (
                      <div 
            key={platform.id}
            className={`p-6 border rounded-lg cursor-pointer transition-all hover:shadow-lg ${selectedPlatform === platform.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handlePlatformSelect(platform.id)}
          >
              <div className="flex flex-col items-center text-center">
                <div className={`text-3xl mb-3 p-3 rounded-full ${platform.color}`}>
                  {platform.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {platform.id === "amazon" && "Importe produtos da Amazon com links afiliados"}
                  {platform.id === "aliexpress" && "Importe produtos do AliExpress"}
                  {platform.id === "temu" && "Importe produtos do Temu"}
                  {platform.id === "csv" && "Importe produtos de arquivos CSV ou Excel"}
                  {platform.id === "api" && "Importe produtos via API"}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlatformSelect(platform.id)
                  }}
                >
                  <Upload className="h-4 w-4" />
                  Importar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Instruções */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Como funciona</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">1</div>
                  <h3 className="font-medium">Escolha a Plataforma</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selecione a plataforma de onde deseja importar produtos
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">2</div>
                  <h3 className="font-medium">Configure a Importação</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Defina as categorias, tags e configurações de importação
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold">3</div>
                  <h3 className="font-medium">Revise e Publique</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Revise os produtos importados e publique em seus portais
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Destaques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold mb-3">Amazon Import</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">API oficial da Amazon Associates</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Busca por categoria ou palavra-chave</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Links afiliados automaticamente</span>
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handlePlatformSelect("amazon")}
            >
              <ExternalLink className="h-4 w-4" />
              Saber mais
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="text-lg font-semibold mb-3">Importação em Massa</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Suporte a CSV e Excel</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Mapeamento automático de campos</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Validação de dados em tempo real</span>
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handlePlatformSelect("csv")}
            >
              <ExternalLink className="h-4 w-4" />
              Saber mais
            </Button>
          </Card>
        </div>

        {/* Aviso */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <h4 className="font-semibold text-yellow-800">Funcionalidade em desenvolvimento</h4>
              <p className="text-sm text-yellow-700 mt-1">
                A funcionalidade de importação automática está em desenvolvimento. 
                Por enquanto, você pode criar produtos manualmente usando a página "Novo Produto".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}