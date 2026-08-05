'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Save, Palette, Image, Phone, Mail, MapPin } from 'lucide-react'

interface AppearanceSettings {
  portal_name: string
  slogan: string
  primary_color: string
  secondary_color: string
  contact_email: string
  contact_phone: string
  contact_location: string
  hero_title: string
  hero_subtitle: string
  newsletter_enabled: boolean
}

export default function AppearancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<AppearanceSettings>({
    portal_name: 'Portal de Ofertas Portugal',
    slogan: 'As melhores ofertas em Portugal',
    primary_color: '#0F1117',
    secondary_color: '#FF6A00',
    contact_email: '',
    contact_phone: '',
    contact_location: '',
    hero_title: 'Encontre as melhores ofertas',
    hero_subtitle: 'Produtos com até 70% de desconto',
    newsletter_enabled: true
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Buscar configurações do Supabase
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['portal_config', 'contact_config', 'hero_config'])

      if (error) {
        console.error('Erro ao buscar configurações:', error)
        return
      }

      // Processar configurações
      const portalConfig = data.find(s => s.key === 'portal_config')?.value || {}
      const contactConfig = data.find(s => s.key === 'contact_config')?.value || {}
      const heroConfig = data.find(s => s.key === 'hero_config')?.value || {}

      setSettings({
        portal_name: portalConfig.portal_name || 'Portal de Ofertas Portugal',
        slogan: portalConfig.slogan || 'As melhores ofertas em Portugal',
        primary_color: portalConfig.primary_color || '#0F1117',
        secondary_color: portalConfig.secondary_color || '#FF6A00',
        contact_email: contactConfig.email || '',
        contact_phone: contactConfig.phone || '',
        contact_location: contactConfig.location || '',
        hero_title: heroConfig.title || 'Encontre as melhores ofertas',
        hero_subtitle: heroConfig.subtitle || 'Produtos com até 70% de desconto',
        newsletter_enabled: portalConfig.newsletter_enabled !== false
      })
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Preparar dados para salvar
      const portalConfig = {
        portal_name: settings.portal_name,
        slogan: settings.slogan,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        newsletter_enabled: settings.newsletter_enabled
      }

      const contactConfig = {
        email: settings.contact_email,
        phone: settings.contact_phone,
        location: settings.contact_location
      }

      const heroConfig = {
        title: settings.hero_title,
        subtitle: settings.hero_subtitle
      }

      // Salvar no Supabase
      const updates = [
        supabase.from('settings').upsert({
          key: 'portal_config',
          value: portalConfig,
          description: 'Configurações gerais do portal'
        }),
        supabase.from('settings').upsert({
          key: 'contact_config',
          value: contactConfig,
          description: 'Configurações de contato'
        }),
        supabase.from('settings').upsert({
          key: 'hero_config',
          value: heroConfig,
          description: 'Configurações do hero banner'
        })
      ]

      await Promise.all(updates)

      alert('Configurações salvas com sucesso!')
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof AppearanceSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-300 mt-4">Carregando configurações...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Palette className="mr-3 text-orange-500" />
                Aparência do Portal
              </h1>
              <p className="text-gray-400 mt-2">
                Personalize a aparência do seu portal de ofertas
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg flex items-center transition disabled:opacity-50"
            >
              <Save className="mr-2" size={18} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-secondary rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Pré-visualização</h2>
            <div className="bg-primary rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{settings.portal_name}</h3>
                  <p className="text-gray-400 text-sm">{settings.slogan}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-48 rounded-lg bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center">
                    <h4 className="text-white text-2xl font-bold mb-2">{settings.hero_title}</h4>
                    <p className="text-gray-300">{settings.hero_subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-6">
                    {settings.contact_email && (
                      <div className="flex items-center text-gray-400">
                        <Mail size={16} className="mr-2" />
                        {settings.contact_email}
                      </div>
                    )}
                    {settings.contact_phone && (
                      <div className="flex items-center text-gray-400">
                        <Phone size={16} className="mr-2" />
                        {settings.contact_phone}
                      </div>
                    )}
                    {settings.contact_location && (
                      <div className="flex items-center text-gray-400">
                        <MapPin size={16} className="mr-2" />
                        {settings.contact_location}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-6 rounded" style={{ backgroundColor: settings.primary_color }}></div>
                    <div className="h-6 w-6 rounded" style={{ backgroundColor: settings.secondary_color }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="bg-secondary rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Informações Básicas</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Portal
                  </label>
                  <input
                    type="text"
                    value={settings.portal_name}
                    onChange={(e) => handleChange('portal_name', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={settings.slogan}
                    onChange={(e) => handleChange('slogan', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cor Principal
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => handleChange('primary_color', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primary_color}
                        onChange={(e) => handleChange('primary_color', e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cor de Destaque
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => handleChange('secondary_color', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.secondary_color}
                        onChange={(e) => handleChange('secondary_color', e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Banner */}
            <div className="bg-secondary rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Hero Banner</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={settings.hero_subtitle}
                    onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.newsletter_enabled}
                      onChange={(e) => handleChange('newsletter_enabled', e.target.checked)}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">Ativar Newsletter</span>
                  </label>
                  <p className="text-gray-400 text-sm mt-2">
                    Exibir formulário de newsletter na página inicial
                  </p>
                </div>
              </div>
            </div>

            {/* Contatos */}
            <div className="bg-secondary rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Informações de Contato</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail de Contato
                  </label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="exemplo@portal.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={settings.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="+351 XXX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={settings.contact_location}
                    onChange={(e) => handleChange('contact_location', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Cidade, País"
                  />
                </div>
              </div>
            </div>

            {/* Logotipo e Favicon */}
            <div className="bg-secondary rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Imagens</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Logotipo
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                    <Image className="mx-auto text-gray-500 mb-2" size={32} />
                    <p className="text-gray-400 mb-4">Arraste e solte ou clique para fazer upload</p>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition">
                      Selecionar Arquivo
                    </button>
                    <p className="text-gray-500 text-xs mt-2">PNG, JPG até 2MB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Favicon
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">O</span>
                    </div>
                    <p className="text-gray-400 mb-4">Ícone do navegador (16x16 ou 32x32)</p>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm transition">
                      Selecionar Favicon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="mt-8 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">⚠️ Importante</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• As alterações de cores podem levar alguns minutos para serem aplicadas em todo o site</li>
              <li>• Certifique-se de que as URLs das imagens sejam públicas e acessíveis</li>
              <li>• As configurações de contato serão exibidas no rodapé do site</li>
              <li>• Para alterações mais avançadas, contate o suporte técnico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}