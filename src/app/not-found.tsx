import Link from "next/link"
import { Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="text-9xl font-bold text-primary opacity-20 mb-8">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
        <p className="text-gray-600 text-lg mb-8">
          A página que você está procurando pode ter sido movida, removida ou não existe.
          Enquanto isso, explore nossas ofertas de impressão 3D!
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Ofertas em Destaque</h3>
            <p className="text-sm text-gray-600">Impressoras, filamentos e acessórios com até 70% off</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Comunidade Ativa</h3>
            <p className="text-sm text-gray-600">Mais de 45K makers compartilhando ofertas</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Home className="mr-2 h-4 w-4" />
              Voltar para Início
            </Button>
          </Link>
          <Link href="/ofertas">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Ver Ofertas
            </Button>
          </Link>
          <BackButton />
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Procurando algo específico? Use nossa busca no cabeçalho ou navegue pelo menu.</p>
          <p className="mt-2">Em caso de dúvidas, entre em contato: contato@3dofertas.com</p>
        </div>
      </div>
    </div>
  )
}