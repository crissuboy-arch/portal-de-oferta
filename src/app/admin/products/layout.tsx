export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-lg font-semibold">Admin - Produtos</h2>
        </div>
      </div>
      <main>{children}</main>
    </div>
  )
}