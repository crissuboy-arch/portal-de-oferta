# Plataforma Multiportal - Next.js 15

Uma plataforma multiportal reutilizável desenvolvida com Next.js 15, TypeScript e Tailwind CSS. Permite criar múltiplos portais independentes com configurações personalizadas.

## 🎯 Portais Disponíveis

### Portal 3D Brasil (`3d-printing-portal`) - **Portal Padrão**
- **Domínio**: localhost:3000
- **Especialização**: Impressão 3D, filamentos, impressoras, acessórios
- **Cores**: Azul (#2563eb) e Roxo (#7c3aed)
- **País**: Brasil (pt-BR, BRL)

### Portal eBooks Portugal (`ebooks-portugal`)
- **Domínio**: ebooks.pt
- **Especialização**: eBooks, livros digitais, conteúdos educativos
- **Cores**: Verde (#10b981) e Violeta (#8b5cf6)
- **País**: Portugal (pt-PT, EUR)

### USA Deals Portal (`usa-deals`)
- **Domínio**: deals.us
- **Especialização**: Ofertas e descontos nos EUA
- **Cores**: Vermelho (#dc2626) e Azul (#2563eb)
- **País**: Estados Unidos (en-US, USD)

### Portal Saúde & Bem-Estar (`saude-bemestar`)
- **Domínio**: saudebemestar.com.br
- **Especialização**: Saúde, bem-estar, suplementos
- **Cores**: Verde (#10b981) e Azul (#3b82f6)
- **País**: Brasil (pt-BR, BRL)

## 🏗️ Arquitetura Multiportal

### Sistema de Configuração
Cada portal tem configurações independentes:
- **Identificação**: nome, slug, domínio, subdomínio
- **Localização**: país, idioma, moeda, fuso horário
- **Design**: cores temáticas primária/secundária
- **Navegação**: menu personalizado por portal
- **SEO**: meta tags, Open Graph, configurações específicas
- **Funcionalidades**: quais módulos estão habilitados

### Estrutura de Diretórios Atualizada
```
src/
├── lib/config/
│   ├── portals.ts          # Configuração de todos os portais
│   ├── app.ts              # API para portal atual
│   └── countries.ts        # Configuração de países (legado)
├── types/
│   └── index.ts           # Tipos TypeScript para multiportal
├── app/
│   ├── page.tsx           # Homepage dinâmica por portal
│   ├── layout.tsx         # Layout dinâmico com cores do portal
│   ├── products/          # Produtos específicos
│   ├── blog/              # Blog específico
│   └── admin/             # Painel administrativo
└── components/
    ├── layout/
    │   ├── header.tsx     # Header dinâmico com menu do portal
    │   └── footer.tsx     # Footer dinâmico com links do portal
    └── ui/               # Componentes UI reutilizáveis
```

## 🚀 Funcionalidades por Portal

### Configurações Personalizadas
- **Nome e Descrição**: Únicos para cada portal
- **Cores Temáticas**: Paleta de cores personalizada
- **Menu de Navegação**: Itens específicos por portal
- **Rodapé**: Links e seções configuráveis
- **Redes Sociais**: Configurações independentes
- **SEO**: Meta tags, keywords, Open Graph específicos

### Funcionalidades Habilitáveis
```typescript
interface PortalFeatures {
  enableBlog: boolean           // Sistema de blog
  enableProducts: boolean       // Catálogo de produtos
  enableAffiliates: boolean     // Programa de afiliados
  enableMultiCountry: boolean   // Suporte a múltiplos países
  enableAdminPanel: boolean     // Painel administrativo
  enableUserAccounts: boolean   // Sistema de usuários
  enableCheckout: boolean       // Processo de checkout
  enableReviews: boolean        // Sistema de avaliações
  enableNewsletter: boolean     // Newsletter
  enableSearch: boolean         // Busca
}
```

## 🔧 Como Adicionar um Novo Portal

1. **Adicionar configuração** em `src/lib/config/portals.ts`:
```typescript
{
  id: "novo-portal",
  name: "Nome do Portal",
  slug: "slug-unico",
  domain: "dominio.com",
  // ... outras configurações
}
```

2. **Configurar cores temáticas**:
```typescript
primaryColor: "#cor-primaria",
secondaryColor: "#cor-secundaria",
accentColor: "#cor-destaque",
```

3. **Definir menu e navegação**:
```typescript
menuItems: [
  { id: "home", label: "Início", href: "/", order: 1 },
  { id: "products", label: "Produtos", href: "/products", order: 2 },
  // ... outros itens
]
```

4. **Configurar SEO**:
```typescript
seo: {
  defaultTitle: "Título SEO",
  defaultDescription: "Descrição SEO",
  keywords: ["palavra1", "palavra2"],
  robots: "index, follow"
}
```

## 📊 Sistema de Tipos TypeScript

### Tipos Principais
- `PortalConfig`: Configuração completa de um portal
- `MenuItem`: Item do menu de navegação
- `FooterSection`: Seção do rodapé
- `SEOConfig`: Configurações de SEO
- `PortalFeatures`: Funcionalidades habilitadas
- `PortalSettings`: Configurações específicas

### Entidades por Portal
Todas as entidades (Produto, BlogPost, User, etc.) incluem `portalId` para identificar a qual portal pertencem.

## 🛠️ Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor:
   ```bash
   npm run dev
   ```
4. Acesse o portal padrão (3D Brasil):
   - http://localhost:3000

5. Para acessar outros portais (em desenvolvimento):
   - http://localhost:3000/3d-printing (Portal 3D)
   - Switcher disponível no header

## 🔄 Detecção Automática de Portal

### Em Produção
```typescript
export function getCurrentPortal(): PortalConfig {
  // Detecta portal pelo domínio/subdomínio
  const hostname = window.location.hostname
  return getPortalByDomain(hostname) || defaultPortal
}
```

### Em Desenvolvimento
```typescript
export function getCurrentPortal(): PortalConfig {
  // Retorna portal padrão (3D Brasil)
  return defaultPortal
}
```

## 📈 Próximas Etapas

### 1. Roteamento por Domínio
- Configurar NGINX/Apache para rotas por subdomínio
- Middleware Next.js para detecção automática

### 2. Banco de Dados Multi-tenant
- Schema por portal usando Prisma
- Isolamento de dados entre portais

### 3. Sistema de Templates
- Templates de layout por categoria de portal
- Componentes específicos por tipo (3D, eBooks, Saúde)

### 4. Administração Central
- Painel para gerenciar múltiplos portais
- Deploy automatizado de novos portais

### 5. Internacionalização Avançada
- i18n com suporte a múltiplos idiomas
- Conteúdo localizado por país

## 🎨 Design System

### Componentes Adaptativos
- **Header**: Mostra menu específico do portal
- **Footer**: Links configuráveis por portal
- **Button**: Usa cores do portal automaticamente
- **Card**: Adapta-se ao contexto do portal

### Cores Dinâmicas
```css
:root {
  --primary: ${portal.primaryColor};
  --primary-hover: ${adjustColor(portal.primaryColor, -20)};
  --secondary: ${portal.secondaryColor};
}
```

## 📋 Checklist de Novo Portal

- [ ] Configuração básica em `portals.ts`
- [ ] Cores temáticas definidas
- [ ] Menu de navegação configurado
- [ ] Rodapé com links relevantes
- [ ] Configurações de SEO
- [ ] Funcionalidades habilitadas
- [ ] Conteúdo específico (se aplicável)
- [ ] Testes de build e execução

## 🚨 Notas Importantes

1. **Build Bem-sucedido**: Todos os portais compilam no mesmo build
2. **Código Compartilhado**: Componentes reutilizáveis entre portais
3. **Configuração Isolada**: Cada portal tem configurações independentes
4. **SEO Otimizado**: Meta tags específicas por portal
5. **Design Responsivo**: Adapta-se a qualquer dispositivo

## 🤝 Contribuindo

Para adicionar um novo tipo de portal:
1. Analise portais existentes como referência
2. Adicione configuração em `portals.ts`
3. Adapte conteúdo específico nas páginas
4. Teste o build com `npm run build`
5. Execute para verificar funcionamento# portal-de-oferta
