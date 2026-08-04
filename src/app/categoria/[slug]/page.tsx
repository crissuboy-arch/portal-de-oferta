export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Categorias em Construção</h1>
        <p className="text-gray-600 text-lg mb-8">
          A nossa página de categorias está em desenvolvimento. Em breve teremos produtos organizados por categoria.
        </p>
        <a 
          href="/"
          className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
        >
          Voltar para a Página Inicial
        </a>
      </div>
    </div>
  )
}