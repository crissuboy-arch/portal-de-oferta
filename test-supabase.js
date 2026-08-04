#!/usr/bin/env node

/**
 * Script de Teste do Supabase
 * Testa todas as funcionalidades do sistema
 */

import { createClient } from '@supabase/supabase-js'

// Configuração - usar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gfprpymovjdtmiixkubw.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseKey) {
  console.error('❌ ERRO: NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada')
  console.error('Configure a chave no arquivo .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔗 Testando conexão com Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      throw error
    }
    
    console.log('✅ Conexão estabelecida com sucesso')
    return true
  } catch (error) {
    console.error('❌ Falha na conexão:', error.message)
    return false
  }
}

async function testAuth() {
  console.log('🔐 Testando autenticação...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: process.env.ADMIN_EMAIL || 'admin@portalofertas.pt',
      password: process.env.ADMIN_PASSWORD || 'Admin123!'
    })
    
    if (error) {
      console.warn('⚠️  Autenticação falhou (usuário pode não existir ainda):', error.message)
      return false
    }
    
    console.log('✅ Autenticação bem sucedida')
    return true
  } catch (error) {
    console.warn('⚠️  Erro na autenticação:', error.message)
    return false
  }
}

async function testStorage() {
  console.log('📦 Testando Storage...')
  
  try {
    // Primeiro listar buckets para verificar se portal-images existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.warn('⚠️  Não foi possível listar buckets:', bucketsError.message)
      return false
    }
    
    const portalImagesBucket = buckets.find(b => b.name === 'portal-images')
    
    if (!portalImagesBucket) {
      console.warn('⚠️  Bucket "portal-images" não encontrado')
      console.log('📋 Buckets disponíveis:', buckets.map(b => b.name).join(', '))
      return false
    }
    
    console.log('✅ Bucket "portal-images" encontrado')
    return true
  } catch (error) {
    console.warn('⚠️  Erro no Storage:', error.message)
    return false
  }
}

async function testTables() {
  console.log('🗃️  Verificando tabelas...')
  
  const requiredTables = [
    'products',
    'categories',
    'stores',
    'coupons',
    'settings',
    'users'
  ]
  
  const results = []
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        results.push({ table, exists: false, error: error.message })
      } else {
        results.push({ table, exists: true })
      }
    } catch (error) {
      results.push({ table, exists: false, error: error.message })
    }
  }
  
  const missingTables = results.filter(r => !r.exists)
  
  if (missingTables.length > 0) {
    console.warn('⚠️  Tabelas faltando:')
    missingTables.forEach(mt => {
      console.log(`   ❌ ${mt.table}: ${mt.error || 'Não encontrada'}`)
    })
    return false
  }
  
  console.log('✅ Todas as tabelas principais existem')
  return true
}

async function testCRUD() {
  console.log('🧪 Testando operações CRUD...')
  
  try {
    // 1. CREATE - Criar produto teste
    console.log('  1. Criando produto teste...')
    
    const testProduct = {
      name: 'Produto Teste CRUD',
      slug: `produto-teste-crud-${Date.now()}`,
      short_description: 'Produto criado para teste do sistema',
      description: 'Descrição completa do produto teste para validação do CRUD',
      original_price: 199.99,
      current_price: 149.99,
      category_id: null, // Será atualizado se houver categorias
      store_id: null,    // Será atualizado se houver lojas
      country_code: 'PT',
      currency: 'EUR',
      original_url: 'https://exemplo.com/produto-teste',
      affiliate_url: 'https://exemplo.com/produto-teste?afiliado=test',
      featured_image_url: '',
      seo_title: 'Produto Teste - Teste CRUD',
      seo_description: 'Produto criado para teste do sistema CRUD',
      meta_keywords: ['teste', 'crud', 'produto'],
      status: 'draft',
      is_featured: false,
      is_deal_of_day: false,
      view_count: 0,
      click_count: 0,
      created_by: 'test-script'
    }
    
    const { data: createdProduct, error: createError } = await supabase
      .from('products')
      .insert([testProduct])
      .select()
      .single()
    
    if (createError) {
      throw new Error(`Falha ao criar: ${createError.message}`)
    }
    
    console.log('  ✅ Produto criado com ID:', createdProduct.id)
    
    // 2. READ - Ler produto criado
    console.log('  2. Lendo produto criado...')
    
    const { data: readProduct, error: readError } = await supabase
      .from('products')
      .select('*')
      .eq('id', createdProduct.id)
      .single()
    
    if (readError) {
      throw new Error(`Falha ao ler: ${readError.message}`)
    }
    
    console.log('  ✅ Produto lido com sucesso')
    
    // 3. UPDATE - Atualizar produto
    console.log('  3. Atualizando produto...')
    
    const updates = {
      name: 'Produto Teste CRUD - ATUALIZADO',
      short_description: 'Produto atualizado durante teste CRUD',
      current_price: 139.99,
      status: 'published'
    }
    
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', createdProduct.id)
      .select()
      .single()
    
    if (updateError) {
      throw new Error(`Falha ao atualizar: ${updateError.message}`)
    }
    
    console.log('  ✅ Produto atualizado')
    console.log('    Nome:', updatedProduct.name)
    console.log('    Preço:', updatedProduct.current_price)
    console.log('    Status:', updatedProduct.status)
    
    // 4. DELETE - Excluir produto
    console.log('  4. Excluindo produto...')
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', createdProduct.id)
    
    if (deleteError) {
      throw new Error(`Falha ao excluir: ${deleteError.message}`)
    }
    
    console.log('  ✅ Produto excluído com sucesso')
    
    // 5. VERIFY - Verificar se foi excluído
    console.log('  5. Verificando exclusão...')
    
    const { data: verifyProduct, error: verifyError } = await supabase
      .from('products')
      .select('*')
      .eq('id', createdProduct.id)
      .single()
    
    if (verifyError && verifyError.code === 'PGRST116') {
      // PGRST116 é o código para "nenhum resultado encontrado"
      console.log('  ✅ Produto foi excluído (não encontrado)')
    } else if (verifyProduct) {
      console.warn('  ⚠️  Produto ainda existe após exclusão')
    } else {
      console.warn('  ⚠️  Erro na verificação:', verifyError?.message)
    }
    
    return true
    
  } catch (error) {
    console.error('  ❌ Falha no teste CRUD:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando testes do Supabase...\n')
  
  const tests = [
    { name: 'Conexão', test: testConnection },
    { name: 'Tabelas', test: testTables },
    { name: 'Storage', test: testStorage },
    { name: 'Autenticação', test: testAuth },
    { name: 'CRUD', test: testCRUD }
  ]
  
  const results = []
  
  for (const test of tests) {
    console.log(`\n=== ${test.name} ===`)
    const passed = await test.test()
    results.push({ name: test.name, passed })
    
    if (!passed && test.name === 'Conexão') {
      console.error('\n❌ Conexão falhou. Verifique:')
      console.error('   1. URL do Supabase:', supabaseUrl)
      console.error('   2. Chave ANON no .env.local')
      console.error('   3. Tabelas criadas no Supabase')
      break
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMO DOS TESTES')
  console.log('='.repeat(50))
  
  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length
  
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`)
  })
  
  console.log('\n' + '='.repeat(50))
  console.log(`🎯 ${passedTests}/${totalTests} testes passaram`)
  
  if (passedTests === totalTests) {
    console.log('✨ TODOS OS TESTES PASSARAM! Sistema pronto para uso.')
  } else {
    console.log('⚠️  Alguns testes falharam. Veja as instruções acima.')
  }
  
  // Instruções finais
  if (passedTests >= 3) { // Conexão, tabelas e pelo menos um outro teste
    console.log('\n📝 PRÓXIMOS PASSOS:')
    console.log('1. Execute o schema SQL no Supabase Dashboard')
    console.log('2. Crie bucket "portal-images" no Storage')
    console.log('3. Crie usuário admin no Auth')
    console.log('4. Configure .env.local com as chaves reais')
    console.log('5. Execute `npm run dev` e acesse /admin')
  }
}

// Executar se estiver sendo executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}