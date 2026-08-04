# Configuração Manual do Supabase - PASSO A PASSO

O servidor está rodando em: http://localhost:3000

## PASSO 1: Executar o Schema SQL no Supabase

1. Acesse: https://app.supabase.com/project/gfprpymovjdtmiixkubw
2. Faça login com sua conta Supabase
3. No menu lateral, clique em **SQL Editor**
4. Cole TODO o conteúdo do arquivo `setup-supabase.sql`
5. Clique em **RUN** para executar
6. Aguarde a mensagem "✅ Schema criado com sucesso!"

## PASSO 2: Configurar Storage

1. No dashboard do Supabase, clique em **Storage**
2. Clique em **Create New Bucket**
3. Configure:
   - **Name**: `portal-images`
   - **Public**: ✅ Marcar como público
   - **File size limit**: 5MB
   - **Allowed MIME types**: image/*
4. Clique em **Create Bucket**

## PASSO 3: Configurar Authentication

1. Clique em **Authentication**
2. Em **Providers**, ative **Email**
3. Em **Users**, clique em **Add User**
4. Preencha:
   - **Email**: `admin@portalofertas.pt`
   - **Password**: `Admin123!`
5. Clique em **Create User**

## PASSO 4: Obter Chaves de API

1. Vá para **Settings > API**
2. Copie:
   - **URL**: Já está no .env.local
   - **anon** public key
3. Abra o arquivo `.env.local` no projeto
4. Cole a chave:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```
5. Salve o arquivo

## PASSO 5: Testar o Sistema

1. Acesse: http://localhost:3000/setup
2. Clique em **Executar Todos os Testes**
3. Aguarde os resultados

Se todos os testes passarem:
- ✅ Conexão
- ✅ Tabelas  
- ✅ Storage
- ✅ Auth
- ✅ CRUD

## PASSO 6: Acessar o Painel Admin

1. Vá para: http://localhost:3000/admin/login
2. Faça login com:
   - Email: `admin@portalofertas.pt`
   - Senha: `Admin123!`
3. Você será redirecionado para o dashboard

## PASSO 7: Testar Funcionalidades

No painel admin, teste:

### 1. Adicionar Produto
- Clique em **Novo Produto**
- Preencha todos os campos:
  - Nome, descrição, preços
  - Categoria, loja, país
  - Link de afiliado
  - Imagem (upload para Storage)
  - Cupom (opcional)
  - Configurar SEO
- Clique em **Salvar Produto**

### 2. Ver Produto no Site
- Publique um produto (status: published)
- Acesse a home: http://localhost:3000
- O produto deve aparecer na lista

### 3. Editar Produto
- Na lista de produtos, clique no ícone de editar
- Altere algum campo
- Salve as alterações

### 4. Excluir Produto
- Na lista, clique no ícone de lixeira
- Confirme a exclusão

## Solução de Problemas

### ❌ Teste de Conexão Falhou
- Verifique se a chave ANON está correta no .env.local
- Confirme se o schema SQL foi executado
- Verifique se o projeto Supabase está ativo

### ❌ Tabelas Não Existem
- Execute o schema SQL novamente
- Verifique se não houve erros na execução

### ❌ Storage Falhou
- Confirme se o bucket `portal-images` existe
- Verifique políticas do bucket
- Teste upload manual no dashboard do Supabase

### ❌ Auth Falhou
- Verifique se o usuário foi criado no Supabase Auth
- Confirme email/senha
- Tente fazer login pelo dashboard do Supabase

### ❌ CRUD Falhou
- Verifique políticas RLS (Row Level Security)
- Confirme se está autenticado
- Teste operações básicas pelo SQL Editor

## Próximos Passos

Após configurar com sucesso:

1. **Produção**: Configure domínio e SSL
2. **Backup**: Configure backup automático do Supabase
3. **Monitoramento**: Configure logs e métricas
4. **Escala**: Otimize para mais tráfego

## Suporte

Para problemas:
1. Consulte a documentação do Supabase: https://supabase.com/docs
2. Verifique logs no dashboard do Supabase
3. Teste conexão direta via API REST

---

**✅ Sistema Pronto** - Após todos os testes passarem, o portal está completamente funcional!