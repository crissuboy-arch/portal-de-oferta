"use client"

import { useState, useEffect } from "react"
import { Check, X, AlertTriangle, Database, Upload, Users, Settings, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

type TestResult = {
  name: string
  status: 'success' | 'warning' | 'error' | 'pending'
  message: string
}

export default function SupabaseSetupPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Conexão', status: 'pending', message: 'Aguardando teste...' },
    { name: 'Tabelas', status: 'pending', message: 'Aguardando teste...' },
    { name: 'Storage', status: 'pending', message: 'Aguardando teste...' },
    { name: 'Auth', status: 'pending', message: 'Aguardando teste...' },
    { name: 'CRUD', status: 'pending', message: 'Aguardando teste...' }
  ])
  const [config, setConfig] = useState({
    supabaseUrl: 'https://gfprpymovjdtmiixkubw.supabase.co',
    supabaseKey: '',
    adminEmail: 'admin@portalofertas.pt',
    adminPassword: 'Admin123!'
  })

  useEffect(() => {
    // Carregar configurações do localStorage
    const savedConfig = localStorage.getItem('supabase-config')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const updateResult = (index: number, result: Partial<TestResult>) => {
    setResults(prev => prev.map((r, i) => 
      i === index ? { ...r, ...result } : r
    ))
  }

  const saveConfig = () => {
    localStorage.setItem('supabase-config', JSON.stringify(config))
  }

  const testConnection = async () => {
    updateResult(0, { status: 'pending', message: 'Testando...' })
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('count', { count: 'exact', head: true })
      
      if (error) throw error
      
      updateResult(0, { 
        status: 'success', 
        message: 'Conexão estabelecida com sucesso' 
      })
      return true
    } catch (error: any) {
      updateResult(0, { 
        status: 'error', 
        message: `Falha: ${error.message}` 
      })
      return false
    }
  }

  const testTables = async () => {
    updateResult(1, { status: 'pending', message: 'Verificando tabelas...' })
    
    const requiredTables = ['products', 'categories', 'stores', 'coupons', 'settings']
    const missingTables = []
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error && error.code === '42P01') {
          missingTables.push(table)
        }
      } catch {
        missingTables.push(table)
      }
    }
    
    if (missingTables.length === 0) {
      updateResult(1, { 
        status: 'success', 
        message: 'Todas as tabelas principais existem' 
      })
      return true
    } else {
      updateResult(1, { 
        status: 'error', 
        message: `Tabelas faltando: ${missingTables.join(', ')}` 
      })
      return false
    }
  }

  const testStorage = async () => {
    updateResult(2, { status: 'pending', message: 'Verificando storage...' })
    
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets()
      
      if (error) throw error
      
      const portalBucket = buckets?.find(b => b.name === 'portal-images')
      
      if (portalBucket) {
        updateResult(2, { 
          status: 'success', 
          message: 'Bucket "portal-images" encontrado' 
        })
        return true
      } else {
        updateResult(2, { 
          status: 'warning', 
          message: 'Bucket "portal-images" não encontrado' 
        })
        return false
      }
    } catch (error: any) {
      updateResult(2, { 
        status: 'error', 
        message: `Erro: ${error.message}` 
      })
      return false
    }
  }

  const testAuth = async () => {
    updateResult(3, { status: 'pending', message: 'Testando autenticação...' })
    
    try {
      const { data, error } = await supabase.auth.getUser()
      
      if (error) {
        updateResult(3, { 
          status: 'warning', 
          message: 'Usuário não autenticado. Faça login em /admin/login' 
        })
        return false
      } else {
        updateResult(3, { 
          status: 'success', 
          message: `Autenticado como: ${data.user?.email}` 
        })
        return true
      }
    } catch (error: any) {
      updateResult(3, { 
        status: 'error', 
        message: `Erro: ${error.message}` 
      })
      return false
    }
  }

  const testCRUD = async () => {
    updateResult(4, { status: 'pending', message: 'Testando operações CRUD...' })
    
    try {
      // Criar produto de teste
      const testProduct = {
        name: 'Produto Teste Setup',
        slug: `produto-teste-${Date.now()}`,
        short_description: 'Produto criado durante setup',
        description: 'Produto de teste para validação do CRUD',
        original_price: 199.99,
        current_price:“‘ 149.99,
        country_code: 'PT',
        currency: 'EUR',
        original_url: 'https://exemplo.com',
        affiliate_url: 'https://exemplo.com/afiliado',
        status: 'draft',
        is_featured: false,
        is_deal_of_day: false
      }
      
      const { data: created, error: createError } = await supabase
        .from('products')
        .insert([testProduct])
        .select()
        .single()
      
      if (createError) throw createError
      
      // Ler
      const { error: readError } = await supabase
        .from('products')
        .select('*')
        .eq('id', created.id)
        .single()
      
      if (readError) throw readError
      
      // Atualizar
      const { error: updateError } = await supabase
        .from('products')
        .update({ name: created.name + ' (Atualizado)' })
        .eq('id', created.id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      // Excluir
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', created.id)
      
      if (deleteError) throw deleteError
      
      updateResult(4, { 
        status: 'success', 
        message: 'CRUD completo funcionando: criar, ler, atualizar, excluir' 
      })
      return true
    } catch (error: any) {
      updateResult(4, { 
        status: 'error', 
        message: `Falha no CRUD: ${error.message}` 
      })
      return false
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    saveConfig()
    
    // Reset results
    setResults(results.map(r => ({ ...r, status: 'pending', message: 'Aguardando teste...' })))
    
    const tests = [
      testConnection,
      testTables,
      testStorage,
      testAuth,
      testCRUD
    ]
    
    for (let i = 0; i < tests.length; i++) {
      await tests[i]()
      await new Promise(resolve => setTimeout(resolve, ‚ 500)) // Pequena pausa entre testes
    }
    
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <Check className="h-5 w-5 text-green-400" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case 'error': return <X className="h-5 w-5 text-red-400" />
      default: return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const passedTests = results.filter(r => r.status === 'success').length
  const totalTests = results.length

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configuração do Supabase</h1>
          <p className="text-gray-400">
            Configure e teste toda a infraestrutura do Supabase para o Portal de Ofertas
          </p>
        </div>

        {/* Configuração */}
        <div className="bg-card-dark border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configurações
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL do Supabase
              </label>
              <input
                type="text"
                value={config.supabaseUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, supabaseUrl: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chave ANON
              </label>
              <input
                type="password"
                value={config.supabaseKey}
                onChange={(e) => setConfig(prev => ({ ...prev, supabaseKey: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="Cole sua chave ANON aqui"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Admin
              </label>
              <input
                type="email"
                value={config.adminEmail}
                onChange={(e) => setConfig(prev => ({ ...prev, adminEmail: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha Admin
              </label>
              <input
                type="password"
                value={config.adminPassword}
                onChange={(e) => setConfig(prev => ({ ...prev, adminPassword: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              As configurações são salvas automaticamente no navegador
            </div>
            <button
              onClick={saveConfig}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Salvar Configuração
            </button>
          </div>
        </div>

        {/* Testes */}
        <div className="bg-card-dark border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Testes do Sistema
            </h2>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Executar Todos os Testes
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center">
                  {getStatusIcon(result.status)}
                  <div className="ml-3">
                    <h3 className="font-medium text-white">{result.name}</h3>
                    <p className={`text-sm ${getStatusColor(result.status)}`}>
                      {result.message}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const tests = [testConnection, testTables, testStorage, testAuth, testCRUD]
                    tests[index]()
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
                  disabled={loading}
                >
                  Testar
                </button>
              </div>
            ))}
          </div>
          
          {/* Resumo */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white mb-2">Resumo</h3>
                <p className="text-gray-400">
                  {passedTests} de {totalTests} testes passaram
                </p>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  passedTests === totalTests ? 'text-green-400' :
                  passedTests >= 3 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {Math.round((passedTests / totalTests) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Concluído</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card-dark border border-border rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-900/30 rounded-lg mr-4">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium">Database</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✅ Execute supabase-schema.sql</li>
              <li>✅ Verifique se todas tabelas existem</li>
              <li>✅ Confirme dados iniciais</li>
              <li>✅ Teste conexão e CRUD</li>
            </ul>
          </div>
          
          <div className="bg-card-dark border border-border rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-900/30 rounded-lg mr-4">
                <Upload className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-medium">Storage</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✅ Crie bucket "portal-images"</li>
              <li>✅ Configure políticas públicas</li>
              <li>✅ Teste upload de imagens</li>
              <li>✅ Verifique acesso público</li>
            </ul>
          </div>
          
          <div className="bg-card-dark border border-border rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-900/30 rounded-lg mr-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium">Auth</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✅ Ative Email provider</li>
              <li>✅ Crie usuário admin</li>
              <li>✅ Teste login/logout</li>
              <li>✅ Verifique políticas RLS</li>
            </ul>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Próximos Passos</h3>
          
          {passedTests === totalTests ? (
            <div className="space-y-3">
              <p className="text-green-400">🎉 Todos os testes passaram! O sistema está pronto.</p>
              <ol className="space-y-2 text-gray-300">
                <li>1. Acesse <a href="/admin" className="text-orange-400 hover:text-orange-300">/admin</a> para o painel</li>
                <li>2. Adicione seu primeiro produto</li>
                <li>3. Configure categorias e lojas</li>
                <li>4. Publique produtos no site</li>
              </ol>
            </div>
          ) : passedTests >= 3 ? (
            <div className="space-y-3">
              <p className="text-yellow-400">⚠️ Sistema quase pronto. Falta configurar:</p>
              <ul className="space-y-2 text-gray-300">
                {results.filter(r => r.status !== 'success').map((r, i) => (
                  <li key={i}>• {r.name}: {r.message}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-red-400">❌ Configuração incompleta. Siga as instruções:</p>
              <ol className="space-y-2 text-gray-300">
                <li>1. Execute o schema SQL no Supabase</li>
                <li>2. Configure a chave ANON no .env.local</li>
                <li>3. Crie bucket "portal-images" no Storage</li>
                <li>4. Crie usuário admin no Auth</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}