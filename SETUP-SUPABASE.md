# Configuração Completa do Supabase

Este guia ajudará a configurar todo o ambiente do Supabase para o Portal de Ofertas.

## 1. Configuração Inicial do Supabase

### Acesse o Dashboard do Supabase
1. Vá para: https://supabase.com/dashboard
2. Faça login com sua conta
3. Acesse o projeto: https://gfprpymovjdtmiixkubw.supabase.co

## 2. Executar o Schema SQL

### Método 1: SQL Editor
1. No dashboard do Supabase, vá para **SQL Editor**
2. Cole todo o conteúdo do arquivo `supabase-schema.sql`
3. Clique em **Run** para executar

### Método 2: Via API (se tiver service_role key)
```bash
# Se tiver a service_role key
curl -X POST 'https://gfprpymovjdtmiixkubw.supabase.co/rest/v1/rpc/exec_sql' \
  -H "apikey: SUA_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SEU_SQL_AQUI"
  }'
```

## 3. Configurar Supabase Auth

### 3.1 Habilitar Email Auth
1. Vá para **Authentication > Providers**
2. Ative **Email**
3. Configure conforme necessário

### 3.2 Criar Usuário Administrador
No SQL Editor, execute:
```sql
-- Criar usuário admin (você precisa criar via Auth UI primeiro)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@portalofertas.pt',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  ''
);

-- Inserir no perfil de usuário
INSERT INTO public.users (id, email, name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@portalofertas.pt'),
  'admin@portalofertas.pt',
  'Administrador',
  'admin'
);
```

**Nota:** É melhor criar usuário através da UI de Auth do Supabase primeiro.

## 4. Configurar Storage

### 4.1 Criar Bucket "portal-images"
1. Vá para **Storage**
2. Clique em **Create New Bucket**
3. Nome: `portal-images`
4. Público: ✅ Sim
5. File size limit: 5MB
6. Allowed MIME types: image/*

### 4.2 Configurar Políticas do Storage
No SQL Editor, execute:
```sql
-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública" ON storage.objects
FOR SELECT USING (bucket_id = 'portal-images');

-- Permitir upload para usuários autenticados
CREATE POLICY "Permitir upload para usuários" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portal-images' AND
  auth.role() = 'authenticated'
);

-- Permitir atualização para usuários autenticados
CREATE POLICY "Permitir atualização para usuários" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portal-images' AND
  auth.role() = 'authenticated'
);

-- Permitir exclusão para usuários autenticados
CREATE POLICY "Permitir exclusão para usuários" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portal-images' AND
  auth.role() = 'authenticated'
);
```

## 5. Obter Chaves de API

### 5.1 Anon Key
1. Vá para **Settings > API**
2. Copie a **anon** public key
3. Adicione ao `.env.local`:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 5.2 Service Role Key (opcional para operações administrativas)
1. Vá para **Settings > API**
2. Copie a **service_role** key (mantenha segura!)

## 6. Testar Conexão

### 6.1 Teste de Conexão Simples
```javascript
// Teste no navegador console
fetch('https://gfprpymovjdtmiixkubw.supabase.co/rest/v1/products?limit=1', {
  headers: {
    'apikey': 'SUA_ANON_KEY',
    'Authorization': 'Bearer SUA_ANON_KEY'
  }
})
.then(response => response.json())
.then(data => console.log('Conexão OK:', data))
.catch(error => console.error('Erro:', error));
```

## 7. Verificar Tabelas Criadas

Após executar o schema, verifique se todas as tabelas foram criadas:
```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deve retornar:
- affiliate_links
- categories
- coupons
- import_logs
- price_history
- product_images
- products
- settings
- stores
- users

## 8. Inserir Dados Iniciais

O schema SQL já inclui:
- Configurações padrão
- Categorias iniciais
- Lojas populares

Verifique se foram inseridos:
```sql
-- Verificar categorias
SELECT COUNT(*) as total_categories FROM categories;

-- Verificar lojas
SELECT COUNT(*) as total_stores FROM stores;

-- Verificar configurações
SELECT key FROM settings;
```

## 9. Testar CRUD Completo

### 9.1 Testar Autenticação
```javascript
// Teste de login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@portalofertas.pt',
  password: 'Admin123!'
});
```

### 9.2 Testar Upload de Imagem
```javascript
// Teste de upload
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const { data, error } = await supabase.storage
  .from('portal-images')
  .upload('test.jpg', file);
```

### 9.3 Testar CRUD de Produtos
```javascript
// Criar produto
const product = {
  name: 'Produto Teste',
  slug: 'produto-teste',
  short_description: 'Descrição curta',
  description: 'Descrição completa',
  original_price: , // EM EUR
  current_price: 99.99,
  category_id: 'categoria-id',
  store_id: 'loja-id',
  country_code: 'PT',
  currency: 'EUR',
  original_url: 'https://exemplo.com',
  affiliate_url: 'https://exemplo.com/afiliado',
  featured_image_url: 'https://url-da-imagem.com',
  status: 'draft',
  is_featured: false,
  is_deal_of_day: false
};

const { data, error } = await supabase
  .from('products')
  .insert([product])
  .select();
```

## 10. Configurar o Projeto Local

### 10.1 Atualizar .env.local
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://gfprpymovjdtmiixkubw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Credenciais do admin (criado no Supabase Auth)
ADMIN_EMAIL=admin@portalofertas.pt
ADMIN_PASSWORD=Admin123!
```

### 10.2 Iniciar Projeto
```bash
npm install
npm run dev
```

## 11. Acessar Painel Admin

1. Acesse: `http://localhost:3000/admin/login`
2. Use as credenciais:
   - Email: `admin@portalofertas.pt`
   - Senha: `Admin123!`
3. Você será redirecionado para o dashboard

## 12. Solução de Problemas

### Erro de Conexão
```bash
# Verificar variáveis
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Testar conexão direta
curl -X GET 'https://gfprpymovjdtmiixkubw.supabase.co/rest/v1/' \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

### Erro de Autenticação
1. Verifique se o usuário existe no Supabase Auth
2. Confirme email/senha
3. Verifique políticas RLS

### Erro de Storage
1. Confirme se o bucket `portal-images` existe
2. Verifique políticas do bucket
3. Teste upload manual pelo dashboard

## 13. Monitoramento

### Dashboard do Supabase
- **Database**: Verifique tabelas e tamanho
- **Storage**: Verifique uso do bucket
- **Auth**: Verifique usuários ativos
- **SQL Editor**: Para queries adicionais

### Logs
- **Edge Functions**: Se usar funções serverless
- **Realtime**: Para subscriptions
- **API**: Para monitorar requests

---

## 📞 Suporte

### Links Úteis
- Supabase Docs: https://supabase.com/docs
- Supabase Dashboard: https://app.supabase.com
- GitHub Issues: Para bugs do código

### Contato
Para problemas com configuração do Supabase, consulte a documentação oficial ou abra uma issue no repositório.

---

**✅ Configuração Completa** - Siga todos os passos para ter o ambiente totalmente funcional.