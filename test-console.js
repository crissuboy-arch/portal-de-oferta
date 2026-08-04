"use client"

// Script de teste para rodar no navegador
// Cole este código no console do navegador após configurar o Supabase

async function testSupabase() {
  console.log('🚀 Iniciando teste do Supabase...')
  
  // Verificar se supabase está disponível
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase não está disponível')
    return false
  }
  
  const supabase = window.supabase
  
  // Teste 1: Conexão básica
  console.log('1. Testando conexão...')
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })
    
    if (error) throw error
    console.log('✅ Conexão OK')
  } catch (error) {
    console.error('❌ Falha na conexão:', error.message)
    return false
  }
  
  // Teste 2: Verificar tabelas
  console.log('2. Verificando tabelas...')
  const tables = ['products', 'categories', 'stores', 'coupons']
  let allTablesExist = true
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error && error.code === '42P01') {
        console.log(`❌ Tabela "${table}" não existe`)
        allTablesExist = false
      } else if (error) {
        console.log(`⚠️  Erro na tabela "${table}":`, error.message)
      } else {
        console.log(`✅ Tabela "${table}" OK`)
      }
    } catch (error) {
      console.log(`⚠️  Erro verificando "${table}":`, error.message)
    }
  }
  
  // Teste 3: Testar Auth
  console.log('3. Testando autenticação...')
  try {
    const { data, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log('⚠️  Usuário não autenticado:', error.message)
      console.log('   Tente fazer login em /admin/login')
    } else {
      console.log('✅ Usuário autenticado:', data.user?.email)
    }
  } catch (error) {
    console.log('⚠️  Erro na autenticação:', error.message)
  }
  
  // Teste 4: Testar Storage
  console.log('4. Testando storage...')
  try {
    const { data, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.log('⚠️  Erro ao listar buckets:', error.message)
    } else {
      const portalBucket = data.find(b => b.name === 'portal-images')
      if (portalBucket) {
        console.log('✅ Bucket "portal-images" encontrado')
      } else {
        console.log('❌ Bucket "portal-images" não encontrado')
        console.log('   Buckets disponíveis:', data.map(b => b.name).join(', '))
      }
    }
  } catch (error) {
    console.log('⚠️  Erro no storage:', error.message)
  }
  
  // Teste 5: Testar CRUD rápido
  console.log('5. Testando CRUD rápido...')
  try {
    // Criar produto de teste
    const testProduct = {
      name: 'Teste Console ' + Date.now(),
      slug: 'teste-console-' + Date.now(),
      short_description: 'Produto criado no console',
      description: 'Produto de teste criado via console',
      original_price: 100,
      current_price: 80,
      country_code: 'PT',
      currency: 'EUR',
      status: 'draft'
    }
    
    const { data: created, error: createError } = await supabase
      .from('products')
      .insert([testProduct])
      .select()
      .single()
    
    if (createError) throw createError
    
    console.log('✅ Produto criado com ID:', created.id)
    
    // Ler produto
    const { data: read, error: readError } = await supabase
      .from('products')
      .select('*')
      .eq('id', created.id)
      .single()
    
    if (readError) throw readError
    console.log('✅ Produto lido:', read.name)
    
    // Atualizar
    const { data: updated, error: updateError } = await supabase
      .from('products')
      .update({ name: read.name + ' (ATUALIZADO)' })
      .eq('id', created.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    console.log('✅ Produto atualizado')
    
    // Excluir
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', created.id)
    
    if (deleteError) throw deleteError
    console.log('✅ Produto excluído')
    
  } catch (error) {
    console.log('⚠️  Erro no CRUD:', error.message)
  }
  
  console.log('\n🎯 Teste concluído!')
  console.log('Verifique os resultados acima.')
  
  return true
}

// Para executar, cole no console:
// testSupabase()