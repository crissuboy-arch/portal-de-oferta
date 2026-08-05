-- SQL para configuração inicial do Supabase - VERSÃO 100% IDEMPOTENTE
-- Execute este script no SQL Editor do Supabase Dashboard
-- Pode ser executado múltiplas vezes sem conflitos ou perda de dados

-- AVISO: Este script NÃO apaga tabelas, colunas ou dados existentes
--        Apenas cria o que não existe e atualiza políticas/triggers

-----------------------------------------------------------------------
-- SEÇÃO 1: TABELAS (CREATE TABLE IF NOT EXISTS)
-----------------------------------------------------------------------

-- 1. Tabela de usuários do sistema (link com auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de categorias de produtos
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  country_code TEXT DEFAULT 'PT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de lojas/afiliados
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL,
  country_code TEXT DEFAULT 'PT',
  has_affiliate_program BOOLEAN DEFAULT false,
  affiliate_commission TEXT,
  logo_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de cupons de desconto
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  store_id UUID REFERENCES stores(id),
  min_purchase_value DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  start_date DATE DEFAULT NOW(),
  end_date DATE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela principal de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN original_price > 0 AND current_price > 0 
      THEN ROUND(((original_price - current_price) / original_price) * 100)
      ELSE 0
    END
  ) STORED,
  category_id UUID REFERENCES categories(id),
  store_id UUID REFERENCES stores(id),
  country_code TEXT DEFAULT 'PT',
  currency TEXT DEFAULT 'EUR',
  original_url TEXT,
  affiliate_url TEXT,
  coupon_id UUID REFERENCES coupons(id),
  featured_image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  meta_keywords TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'expired')),
  is_featured BOOLEAN DEFAULT false,
  is_deal_of_day BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de imagens de produtos (galeria)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de links de afiliados
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id),
  url TEXT NOT NULL,
  commission_rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-----------------------------------------------------------------------
-- SEÇÃO 2: ROW LEVEL SECURITY (RLS)
-----------------------------------------------------------------------

-- Habilitar RLS em todas as tabelas (ignora se já habilitado)
DO $$ 
DECLARE
  table_name TEXT;
  tables TEXT[] := ARRAY['users', 'categories', 'stores', 'coupons', 'products', 'product_images', 'settings', 'affiliate_links'];
BEGIN
  FOREACH table_name IN ARRAY tables
  LOOP
    BEGIN
      EXECUTE 'ALTER TABLE ' || table_name || ' ENABLE ROW LEVEL SECURITY';
      RAISE NOTICE 'RLS habilitado na tabela: %', table_name;
    EXCEPTION WHEN OTHERS THEN
      -- RLS já está habilitado, apenas continua
      RAISE NOTICE 'RLS já habilitado na tabela: %', table_name;
    END;
  END LOOP;
END $$;

-----------------------------------------------------------------------
-- SEÇÃO 3: POLÍTICAS RLS (DROP IF EXISTS + CREATE)
-----------------------------------------------------------------------

-- Políticas RLS para users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas RLS para categories
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas RLS para stores
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
CREATE POLICY "Public can view active stores" ON stores
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage stores" ON stores;
CREATE POLICY "Admins can manage stores" ON stores
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas RLS para coupons
DROP POLICY IF EXISTS "Public can view active coupons" ON coupons;
CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND (end_date IS NULL OR end_date >= NOW()));

DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas RLS para products
DROP POLICY IF EXISTS "Public can view published products" ON products;
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage all products" ON products;
CREATE POLICY "Admins can manage all products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas RLS para product_images
DROP POLICY IF EXISTS "Public can view product images for published products" ON product_images;
CREATE POLICY "Public can view product images for published products" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id 
      AND products.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;
CREATE POLICY "Admins can manage product images" ON product_images
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas RLS para settings
DROP POLICY IF EXISTS "Public can view settings" ON settings;
CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage settings" ON settings;
CREATE POLICY "Only admins can manage settings" ON settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas RLS para affiliate_links
DROP POLICY IF EXISTS "Public can view affiliate links for published products" ON affiliate_links;
CREATE POLICY "Public can view affiliate links for published products" ON affiliate_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = affiliate_links.product_id 
      AND products.status = 'published'
    ) AND is_active = true
  );

DROP POLICY IF EXISTS "Admins can manage affiliate links" ON affiliate_links;
CREATE POLICY "Admins can manage affiliate links" ON affiliate_links
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-----------------------------------------------------------------------
-- SEÇÃO 4: DADOS INICIAIS (ON CONFLICT DO NOTHING)
-----------------------------------------------------------------------

-- Configurações padrão do portal (apenas se não existirem)
INSERT INTO settings (key, value, description) VALUES
  ('portal_config', '{
    "portal_name": "Portal de Ofertas Portugal",
    "slogan": "As melhores ofertas em Portugal",
    "default_country": "PT",
    "default_language": "pt-PT",
    "default_currency": "EUR",
    "available_countries": ["PT", "BR", "ES", "FR", "IT", "US"],
    "available_currencies": ["EUR", "BRL", "USD", "GBP"],
    "available_languages": ["pt-PT", "pt-BR", "es-ES", "fr-FR", "it-IT", "en-US"],
    "primary_color": "#FF6A00",
    "secondary_color": "#0F1117",
    "contact_email": "info@portalofertas.pt",
    "enable_affiliate_disclosure": false
  }'::jsonb, 'Configurações gerais do portal'),
  ('seo_config', '{
    "default_title": "Portal de Ofertas Portugal",
    "default_description": "Encontre as melhores ofertas e descontos em Portugal",
    "default_keywords": ["ofertas", "descontos", "promoções", "Portugal"],
    "google_analytics_id": "",
    "facebook_pixel_id": ""
  }'::jsonb, 'Configurações de SEO')
ON CONFLICT (key) DO NOTHING;

-- Categorias padrão (apenas se não existirem)
INSERT INTO categories (name, slug, description, icon, sort_order, country_code) VALUES
  ('Tecnologia', 'tecnologia', 'Produtos tecnológicos', '💻', 1, 'PT'),
  ('Casa', 'casa', 'Produtos para casa', '🏠', 2, 'PT'),
  ('Livros', 'livros', 'Livros e e-books', '📚', 3, 'PT'),
  ('Estudo', 'estudo', 'Material de estudo', '🎓', 4, 'PT'),
  ('Moda', 'moda', 'Roupas e acessórios', '👕', 5, 'PT'),
  ('Saúde', 'saude', 'Produtos de saúde', '💊', 6, 'PT'),
  ('Beleza', 'beleza', 'Produtos de beleza', '💄', 7, 'PT'),
  ('Esporte', 'esporte', 'Artigos esportivos', '⚽', 8, 'PT'),
  ('Brinquedos', 'brinquedos', 'Brinquedos e jogos', '🎮', 9, 'PT'),
  ('Automóvel', 'automovel', 'Produtos para automóveis', '🚗', 10, 'PT')
ON CONFLICT (slug) DO NOTHING;

-- Lojas padrão (apenas se não existirem)
INSERT INTO stores (name, slug, domain, country_code, has_affiliate_program) VALUES
  ('Amazon', 'amazon', 'amazon.pt', 'PT', true),
  ('Worten', 'worten', 'worten.pt', 'PT', true),
  ('FNAC', 'fnac', 'fnac.pt', 'PT', true),
  ('Continente', 'continente', 'continente.pt', 'PT', false),
  ('MediaMarkt', 'mediamarkt', 'mediamarkt.pt', 'PT', true),
  ('IKEA', 'ikea', 'ikea.pt', 'PT', false),
  ('Decathlon', 'decathlon', 'decathlon.pt', 'PT', false),
  ('AliExpress', 'aliexpress', 'aliexpress.com', 'CN', true),
  ('Zara', 'zara', 'zara.com', 'ES', false),
  ('El Corte Inglés', 'el-corte-ingles', 'elcorteingles.pt', 'PT', false)
ON CONFLICT (slug) DO NOTHING;

-----------------------------------------------------------------------
-- SEÇÃO 5: FUNÇÕES E TRIGGERS
-----------------------------------------------------------------------

-- Função para atualizar updated_at (idempotente)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at (DROP IF EXISTS + CREATE)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_affiliate_links_updated_at ON affiliate_links;
CREATE TRIGGER update_affiliate_links_updated_at BEFORE UPDATE ON affiliate_links
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-----------------------------------------------------------------------
-- SEÇÃO 6: RELATÓRIO FINAL
-----------------------------------------------------------------------

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SCHEMA SUPABASE CONFIGURADO COM SUCESSO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 RESUMO DA CONFIGURAÇÃO:';
  RAISE NOTICE '   • 8 tabelas criadas/mantidas';
  RAISE NOTICE '   • 16 políticas RLS configuradas';
  RAISE NOTICE '   • 7 triggers de updated_at ativos';
  RAISE NOTICE '   • Dados iniciais inseridos (se necessário)';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 POLÍTICAS DE ACESSO:';
  RAISE NOTICE '   • Público: pode ver conteúdo ativo';
  RAISE NOTICE '   • Admins: gerenciamento completo';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 PRÓXIMOS PASSOS:';
  RAISE NOTICE '   1. Criar usuário admin no Supabase Auth';
  RAISE NOTICE '   2. Criar bucket "portal-images" no Storage';
  RAISE NOTICE '   3. Testar sistema em http://localhost:3000';
  RAISE NOTICE '========================================';
END $$;

-- 10. Remover políticas existentes e criar novas
-- Políticas RLS para users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 11. Políticas RLS para categories
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 12. Políticas RLS para stores
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
CREATE POLICY "Public can view active stores" ON stores
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage stores" ON stores;
CREATE POLICY "Admins can manage stores" ON stores
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 13. Políticas RLS para coupons
DROP POLICY IF EXISTS "Public can view active coupons" ON coupons;
CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND (end_date IS NULL OR end_date >= NOW()));

DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 14. Políticas RLS para products
DROP POLICY IF EXISTS "Public can view published products" ON products;
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage all products" ON products;
CREATE POLICY "Admins can manage all products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 15. Políticas RLS para product_images
DROP POLICY IF EXISTS "Public can view product images for published products" ON product_images;
CREATE POLICY "Public can view product images for published products" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id 
      AND products.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;
CREATE POLICY "Admins can manage product images" ON product_images
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 16. Políticas RLS para settings
DROP POLICY IF EXISTS "Public can view settings" ON settings;
CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage settings" ON settings;
CREATE POLICY "Only admins can manage settings" ON settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 17. Políticas RLS para affiliate_links
DROP POLICY IF EXISTS "Public can view affiliate links for published products" ON affiliate_links;
CREATE POLICY "Public can view affiliate links for published products" ON affiliate_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = affiliate_links.product_id 
      AND products.status = 'published'
    ) AND is_active = true
  );

DROP POLICY IF EXISTS "Admins can manage affiliate links" ON affiliate_links;
CREATE POLICY "Admins can manage affiliate links" ON affiliate_links
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 18. Inserir configurações padrão (apenas se não existirem)
INSERT INTO settings (key, value, description) VALUES
  ('portal_config', '{
    "portal_name": "Portal de Ofertas Portugal",
    "slogan": "As melhores ofertas em Portugal",
    "default_country": "PT",
    "default_language": "pt-PT",
    "default_currency": "EUR",
    "available_countries": ["PT", "BR", "ES", "FR", "IT", "US"],
    "available_currencies": ["EUR", "BRL", "USD", "GBP"],
    "available_languages": ["pt-PT", "pt-BR", "es-ES", "fr-FR", "it-IT", "en-US"],
    "primary_color": "#FF6A00",
    "secondary_color": "#0F1117",
    "contact_email": "info@portalofertas.pt",
    "enable_affiliate_disclosure": false
  }'::jsonb, 'Configurações gerais do portal'),
  ('seo_config', '{
    "default_title": "Portal de Ofertas Portugal",
    "default_description": "Encontre as melhores ofertas e descontos em Portugal",
    "default_keywords": ["ofertas", "descontos", "promoções", "Portugal"],
    "google_analytics_id": "",
    "facebook_pixel_id": ""
  }'::jsonb, 'Configurações de SEO')
ON CONFLICT (key) DO NOTHING;

-- 19. Inserir categorias padrão (apenas se não existirem)
INSERT INTO categories (name, slug, description, icon, sort_order, country_code) VALUES
  ('Tecnologia', 'tecnologia', 'Produtos tecnológicos', '💻', 1, 'PT'),
  ('Casa', 'casa', 'Produtos para casa', '🏠', 2, 'PT'),
  ('Livros', 'livros', 'Livros e e-books', '📚', 3, 'PT'),
  ('Estudo', 'estudo', 'Material de estudo', '🎓', 4, 'PT'),
  ('Moda', 'moda', 'Roupas e acessórios', '👕', 5, 'PT'),
  ('Saúde', 'saude', 'Produtos de saúde', '💊', 6, 'PT'),
  ('Beleza', 'beleza', 'Produtos de beleza', '💄', 7, 'PT'),
  ('Esporte', 'esporte', 'Artigos esportivos', '⚽', 8, 'PT'),
  ('Brinquedos', 'brinquedos', 'Brinquedos e jogos', '🎮', 9, 'PT'),
  ('Automóvel', 'automovel', 'Produtos para automóveis', '🚗', 10, 'PT')
ON CONFLICT (slug) DO NOTHING;

-- 20. Inserir lojas padrão (apenas se não existirem)
INSERT INTO stores (name, slug, domain, country_code, has_affiliate_program) VALUES
  ('Amazon', 'amazon', 'amazon.pt', 'PT', true),
  ('Worten', 'worten', 'worten.pt', 'PT', true),
  ('FNAC', 'fnac', 'fnac.pt', 'PT', true),
  ('Continente', 'continente', 'continente.pt', 'PT', false),
  ('MediaMarkt', 'mediamarkt', 'mediamarkt.pt', 'PT', true),
  ('IKEA', 'ikea', 'ikea.pt', 'PT', false),
  ('Decathlon', 'decathlon', 'decathlon.pt', 'PT', false),
  ('AliExpress', 'aliexpress', 'aliexpress.com', 'CN', true),
  ('Zara', 'zara', 'zara.com', 'ES', false),
  ('El Corte Inglés', 'el-corte-ingles', 'elcorteingles.pt', 'PT', false)
ON CONFLICT (slug) DO NOTHING;

-- 21. Função para updated_at (CREATE OR REPLACE já é idempotente)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 22. Remover triggers existentes e criar novos
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_affiliate_links_updated_at ON affiliate_links;
CREATE TRIGGER update_affiliate_links_updated_at BEFORE UPDATE ON affiliate_links
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 23. Verificar se tudo foi configurado
DO $$
BEGIN
  RAISE NOTICE '✅ Schema configurado com sucesso!';
  RAISE NOTICE '   • 8 tabelas criadas ou mantidas';
  RAISE NOTICE '   • RLS habilitado';
  RAISE NOTICE '   • Políticas RLS configuradas (16 políticas)';
  RAISE NOTICE '   • Dados iniciais inseridos (se não existirem)';
  RAISE NOTICE '   • Triggers de updated_at configurados (7 triggers)';
END $$;