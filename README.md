# Portal de Ofertas Portugal

Um portal completo de ofertas e descontos para Portugal com painel administrativo integrado.

## 🚀 Funcionalidades

### 🛒 Público
- **Busca avançada** - Produtos, categorias e lojas
- **Ofertas em destaque** - Destaques do dia e semana
- **Categorias organizadas** - Navegação por categoria
- **Cupons de desconto** - Cupons ativos e verificados
- **Newsletter** - Inscrição para alertas de ofertas
- **Design responsivo** - Mobile-first e otimizado

### 🛠️ Administrativo
- **CRUD completo** - Produtos, categorias, lojas, cupons
- **Importação de produtos** - Por URL, imagem ou texto
- **Configurações de aparência** - Personalização completa
- **Barra superior editável** - Campanhas e promoções
- **Estatísticas reais** - Dados do banco de dados
- **Autenticação segura** - Supabase Auth

## 🏗️ Tecnologias

- **Next.js 16** - React framework com SSR
- **Supabase** - Banco de dados PostgreSQL + Auth + Storage
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Vercel** - Hosting e deploy automático

## 📦 Instalação Local

```bash
# Clonar repositório
git clone https://github.com/crissuboy-arch/portal-de-oferta.git
cd portal-de-oferta

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Iniciar servidor
npm run dev
```

## 🔧 Configuração Supabase

1. **Criar projeto** em [Supabase](https://supabase.com)
2. **Executar schema SQL** no SQL Editor:
   ```sql
   -- Executar conteúdo de setup-supabase.sql
   ```
3. **Criar usuário admin**:
   - Authentication → Users → Add User
   - Email: admin@portalofertas.pt
   - Password: Admin123!
4. **Criar bucket Storage**:
   - Storage → New bucket
   - Nome: portal-images
   - Público: ✅ ON

## 🌐 Deploy na Vercel

### Opção 1: Deploy Automático
1. Conectar repositório GitHub na Vercel
2. Configurar variáveis de ambiente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
   ```
3. Deploy automático com cada push

### Opção 2: Deploy Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

## 🔐 Variáveis de Ambiente

### **Variáveis Públicas (Cliente)**
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
NEXT_PUBLIC_APP_NAME="Portal de Ofertas Portugal"
NEXT_PUBLIC_APP_URL=https://seu-portal.vercel.app
```

### **Variáveis Privadas (Servidor)**
```
GROQ_API_KEY=sua_chave_groq
OPENAI_API_KEY=sua_chave_openai
NVIDIA_API_KEY=sua_chave_nvidia
OPENROUTER_API_KEY=sua_chave_openrouter
```

## 📊 Estrutura do Banco

### **Tabelas Principais**
- `products` - Produtos com preços e descontos
- `categories` - Categorias hierárquicas
- `stores` - Lojas/afiliados
- `coupons` - Cupons de desconto
- `settings` - Configurações do portal
- `users` - Usuários do sistema
- `top_bar_campaigns` - Campanhas da barra superior

### **Row Level Security (RLS)**
- Público só vê conteúdo ativo/publicado
- Apenas admins podem criar/editar/excluir
- Autenticação com Supabase Auth

## 🧪 Testes

```bash
# Testar conexão Supabase
http://localhost:3000/api/test-connection

# Testar busca
http://localhost:3000/buscar?q=tecnologia

# Painel admin
http://localhost:3000/admin/login
# Credenciais: admin@portalofertas.pt / Admin123!
```

## 📁 Estrutura de Pastas

```
src/
├── app/                    # Rotas Next.js
│   ├── admin/             # Painel administrativo
│   ├── api/               # API routes
│   ├── buscar/            # Página de busca
│   └── setup/             # Configuração inicial
├── components/            # Componentes React
│   ├── layout/            # Layout components
│   ├── ui/                # UI components
│   └── deals/             # Componentes de ofertas
├── lib/                   # Utilities e services
│   ├── supabase/          # Supabase client e services
│   ├── auth/              # Autenticação
│   └── config/            # Configurações do portal
└── styles/                # Estilos globais
```

## 🚨 Troubleshooting

### **Conexão Supabase falha**
1. Verificar `.env.local` com chaves corretas
2. Executar `supabase-schema-safe.sql` no SQL Editor
3. Testar com `/api/test-connection`

### **Build falha na Vercel**
1. Verificar variáveis de ambiente configuradas
2. Checar logs de build na Vercel Dashboard
3. Testar build local: `npm run build`

### **Autenticação não funciona**
1. Criar usuário admin no Supabase Auth
2. Verificar políticas RLS no SQL Editor
3. Testar login em `/admin/login`

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/crissuboy-arch/portal-de-oferta/issues)
- **Documentação**: `/setup` página interativa
- **SQL Schema**: `setup-supabase.sql` completo

## 📄 Licença

MIT License - Veja LICENSE para detalhes.

---

**Desenvolvido com ❤️ para Portugal** 🇵🇹