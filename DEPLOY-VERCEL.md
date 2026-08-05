# Deploy na Vercel - Instruções Detalhadas

## 📋 PRÉ-REQUISITOS

1. **Conta Vercel** - [vercel.com/signup](https://vercel.com/signup)
2. **Conta GitHub** - Com repositório conectado
3. **Projeto Supabase** - Já configurado com schema SQL executado
4. **Chaves de API** - Para funcionalidades futuras de IA

## 🚀 PASSO A PASSO PARA DEPLOY

### **Passo 1: Conectar Repositório**
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em "Add New Project"
3. Importe o repositório `crissuboy-arch/portal-de-oferta`
4. Configure as opções de projeto:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### **Passo 2: Configurar Variáveis de Ambiente**

**VARIÁVEIS OBRIGATÓRIAS:**
```
NEXT_PUBLIC_SUPABASE_URL=https://gfprpymovjdtmiixkubw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_completa
```

**VARIÁVEIS OPCIONAIS (IA):**
```
GROQ_API_KEY=sua_chave_groq
OPENAI_API_KEY=sua_chave_openai
NVIDIA_API_KEY=sua_chave_nvidia
OPENROUTER_API_KEY=sua_chave_openrouter
```

**Como configurar:**
1. No painel do projeto Vercel → Settings → Environment Variables
2. Adicione cada variável como "Production"
3. Marque as variáveis de IA como "Sensitive"

### **Passo 3: Executar SQL Adicional no Supabase**

Antes do deploy, execute este SQL no **SQL Editor do Supabase**:

```sql
-- Tabela para campanhas da barra superior
CREATE TABLE IF NOT EXISTS top_bar_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active BOOLEAN DEFAULT false,
  title TEXT NOT NULL,
  subtitle TEXT,
  link_url TEXT,
  link_text TEXT,
  speed INTEGER DEFAULT 30,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para top_bar_campaigns
ALTER TABLE top_bar_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active campaigns" ON top_bar_campaigns
  FOR SELECT USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW())
  );

CREATE POLICY "Only admins can manage campaigns" ON top_bar_campaigns
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE TRIGGER update_top_bar_campaigns_updated_at 
BEFORE UPDATE ON top_bar_campaigns
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Passo 4: Criar Usuário Admin**
1. **Supabase Dashboard** → Authentication → Users
2. **Add User**:
   - Email: `admin@portalofertas.pt`
   - Password: `Admin123!`
   - Confirm email: Não necessário (dev)

### **Passo 5: Criar Storage Bucket**
1. **Supabase Dashboard** → Storage
2. **New Bucket**:
   - Name: `portal-images`
   - Public: ✅ ON
   - File size limit: 50 MB
   - Allowed MIME types: `image/*`

### **Passo 6: Deploy Automático**
1. **Vercel** iniciará deploy automaticamente após configurar variáveis
2. **Monitorar logs** em Deployments → [deployment]
3. **Aguardar** build completar (~2-3 minutos)

### **Passo 7: Testar Deploy**
Após deploy bem-sucedido, teste:

```
✅ https://seu-portal.vercel.app
✅ https://seu-portal.vercel.app/buscar?q=tecnologia
✅ https://seu-portal.vercel.app/admin/login
✅ https://seu-portal.vercel.app/api/test-connection
```

## 🔧 CONFIGURAÇÕES ADICIONAIS VERCEL

### **Domínio Customizado (Opcional)**
1. **Vercel Dashboard** → Settings → Domains
2. **Add Domain**: `portal-ofertas.pt`
3. **Configure DNS** no registrador de domínio

### **Monitoramento**
1. **Analytics** nativo da Vercel
2. **Logs** em tempo real
3. **Performance** insights automáticos

### **Backups Automáticos**
1. **GitHub** mantém histórico completo
2. **Supabase** tem backups automáticos
3. **Vercel** mantém últimos deploys

## 🚨 TROUBLESHOOTING VERCEL

### **Build Falha**
```
ERRO: "Cannot find module"
SOLUÇÃO: Verificar package.json e dependências

ERRO: "Environment variables missing"
SOLUÇÃO: Configurar NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

ERRO: "TypeScript errors"
SOLUÇÃO: Build local primeiro para identificar erros
```

### **Runtime Errors**
```
ERRO: "Supabase connection failed"
SOLUÇÃO: Verificar chaves ANON e URL

ERRO: "RLS policy violation"
SOLUÇÃO: Executar supabase-schema-safe.sql novamente

ERRO: "Authentication failed"
SOLUÇÃO: Criar usuário admin no Supabase Auth
```

### **Performance Issues**
```
ISSUE: "Slow page loads"
SOLUTION: Ativar Vercel Edge Functions

ISSUE: "Image optimization"
SOLUTION: Next.js Image Optimization já ativo

ISSUE: "Database queries slow"
SOLUTION: Adicionar índices no Supabase
```

## 📊 VERIFICAÇÃO PÓS-DEPLOY

### **Checklist de Sucesso**
- [ ] **Home page** carrega sem erros
- [ ] **Busca** retorna resultados
- [ ] **Login admin** funciona
- [ ] **API test connection** retorna success
- [ ] **Images** carregam do Supabase Storage
- [ ] **Mobile** responsivo
- [ ] **SSL** certificado ativo (Vercel automático)

### **Performance Metrics**
- **LCP**: < 2.5s (Vercel Edge otimizado)
- **FID**: < 100ms (Next.js server components)
- **CLS**: < 0.1 (Layout estável)

## 🔄 DEPLOY CONTÍNUO

### **GitHub Actions (Automático)**
- Cada push para `main` → deploy automático
- Pull requests → deploy preview automático
- Rollback fácil via Vercel Dashboard

### **Deploy Manual via CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy produção
vercel --prod

# Deploy preview
vercel
```

## 📞 SUPORTE

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: [github.com/crissuboy-arch/portal-de-oferta/issues](https://github.com/crissuboy-arch/portal-de-oferta/issues)

---

**🎉 SEU PORTAL ESTÁ PRONTO PARA PRODUÇÃO NA VERCEL!**