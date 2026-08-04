import { supabase } from '@/lib/supabase/client'

export interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  original_price: number
  current_price: number
  discount_percentage: number
  category_id: string
  store_id: string
  country_code: string
  currency: string
  original_url: string
  affiliate_url: string
  coupon_id: string | null
  featured_image_url: string
  seo_title: string
  seo_description: string
  meta_keywords: string[]
  status: 'draft' | 'published' | 'expired'
  is_featured: boolean
  is_deal_of_day: boolean
  view_count: number
  click_count: number
  created_by: string
  published_at: string | null
  created_at: string
  updated_at: string
  category?: { name: string; slug: string }
  store?: { name: string; slug: string }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  country_code: string
  created_at: string
  updated_at: string
}

export interface Store {
  id: string
  name: string
  slug: string
  domain: string
  country_code: string
  has_affiliate_program: boolean
  affiliate_commission: string | null
  logo_url: string | null
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  title: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  store_id: string
  min_purchase_value: number | null
  max_discount: number | null
  start_date: string
  end_date: string | null
  usage_limit: number | null
  used_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: 'admin' | 'editor' | 'viewer'
  created_at: string
  updated_at: string
}

// Serviço de produtos
export const productService = {
  async getAll(filters?: {
    status?: string
    country?: string
    category?: string
    featured?: boolean
    limit?: number
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        store:stores(name, slug)
      `)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.country) {
      query = query.eq('country_code', filters.country)
    }

    if (filters?.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters?.featured) {
      query = query.eq('is_featured', true)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data as Product[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        store:stores(*),
        images:product_images(*),
        coupon:coupons(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Product & {
      category: Category
      store: Store
      images: ProductImage[]
      coupon: Coupon | null
    }
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'discount_percentage'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  async getImages(productId: string) {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data as ProductImage[]
  },

  async addImage(productId: string, imageUrl: string, altText?: string) {
    const { data, error } = await supabase
      .from('product_images')
      .insert([{
        product_id: productId,
        image_url: imageUrl,
        alt_text: altText
      }])
      .select()
      .single()

    if (error) throw error
    return data as ProductImage
  },

  async updateImageSortOrder(images: { id: string; sort_order: number }[]) {
    const { error } = await supabase
      .from('product_images')
      .upsert(images)

    if (error) throw error
    return true
  },

  async removeImage(id: string) {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// Serviço de categorias
export const categoryService = {
  async getAll(activeOnly = true) {
    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Category[]
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Category
  },

  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()

    if (error) throw error
    return data as Category
  },

  async update(id: string, updates: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Category
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// Serviço de lojas
export const storeService = {
  async getAll(activeOnly = true) {
    let query = supabase
      .from('stores')
      .select('*')
      .order('name', { ascending: true })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Store[]
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Store
  },

  async create(store: Omit<Store, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('stores')
      .insert([store])
      .select()
      .single()

    if (error) throw error
    return data as Store
  },

  async update(id: string, updates: Partial<Store>) {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Store
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// Serviço de cupons
export const couponService = {
  async getAll(activeOnly = true) {
    let query = supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query
        .eq('is_active', true)
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString().split('T')[0]}`)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Coupon[]
  },

  async create(coupon: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'used_count'>) {
    const { data, error } = await supabase
      .from('coupons')
      .insert([coupon])
      .select()
      .single()

    if (error) throw error
    return data as Coupon
  },

  async update(id: string, updates: Partial<Coupon>) {
    const { data, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Coupon
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// Serviço de autenticação
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async isAuthenticated() {
    const user = await this.getCurrentUser()
    return !!user
  }
}

// Serviço de upload
export const uploadService = {
  async uploadImage(file: File, folder = 'products') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('portal-images')
      .upload(fileName, file)

    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('portal-images')
      .getPublicUrl(fileName)

    return publicUrl
  },

  async deleteImage(url: string) {
    const path = url.split('/').slice(-2).join('/')
    const { error } = await supabase.storage
      .from('portal-images')
      .remove([path])

    if (error) throw error
    return true
  }
}

// Serviço de estatísticas
export const statsService = {
  async getDashboardStats() {
    const [
      productsCount,
      publishedCount,
      categoriesCount,
      storesCount,
      couponsCount
    ] = await Promise.all([
      supabase.from('products').select('count', { count: 'exact', head: true }),
      supabase.from('products').select('count', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('categories').select('count', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('stores').select('count', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('coupons').select('count', { count: 'exact', head: true }).eq('is_active', true)
    ])

    return {
      totalProducts: productsCount.count || 0,
      publishedProducts: publishedCount.count || 0,
      totalCategories: categoriesCount.count || 0,
      totalStores: storesCount.count || 0,
      activeCoupons: couponsCount.count || 0
    }
  }
}