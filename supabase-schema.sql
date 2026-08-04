-- Estrutura do banco de dados para Portal de Ofertas MVP
-- Criar automaticamente no Supabase

-- 1. Configurar RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'super-secret-jwt-token-change-in-production';

-- 2. Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Only admins can insert users" ON users
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update users" ON users
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete users" ON users
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- 3. Tabela de categorias
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

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- 4. Tabela de lojas
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

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active stores" ON stores
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage stores" ON stores
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- 5. Tabela de cupons
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

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND (end_date IS NULL OR end_date >= NOW()));

CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- 6. Tabela de produtos
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

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (status = 'published' AND (country_code = 'PT' OR country_code IS NULL));

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- 7. Tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product images for published products" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id 
      AND products.status = 'published'
    )
  );

CREATE POLICY "Admins can manage product images" ON product_images
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- 8. Tabela de histórico de preços
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view price history for published products" ON price_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = price_history.product_id 
      AND products.status = 'published'
    )
  );

CREATE POLICY "Admins can manage price history" ON price_history
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- 9. Tabela de configurações
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage settings" ON settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 10. Tabela de logs de importação
CREATE TABLE IF NOT EXISTS import_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('url', 'image', 'text')),
  source_data TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  product_id UUID REFERENCES products(id),
  error_message TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view import logs" ON import_logs
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

CREATE POLICY "Admins can manage import logs" ON import_logs
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- 11. Tabela de links de afiliados (simplificada)
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

ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view affiliate links for published products" ON affiliate_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = affiliate_links.product_id 
      AND products.status = 'published'
    ) AND is_active = true
  );

CREATE POLICY "Admins can manage affiliate links" ON affiliate_links
  FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

-- 12. Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_status_country ON products(status, country_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_discount ON products(discount_percentage DESC) WHERE discount_percentage > 0;
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active, country_code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active, end_date);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id, recorded_at DESC);

-- 13. Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas as tabelas que têm updated_at
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'updated_at' 
      AND table_schema = 'public'
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %I;
      CREATE TRIGGER update_%s_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END $$;

-- 14. Inserir configurações padrão
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

-- 15. Inserir categorias padrão
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

-- 16. Inserir lojas padrão
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