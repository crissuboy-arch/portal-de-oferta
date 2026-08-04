"use client"

import { useState, useEffect } from "react"
import { Save, Globe, Palette, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

const countries = [
  { code: "PT", name: "Portugal", currency: "EUR" },
  { code: "BR", name: "Brasil", currency: "BRL" },
  { code: "ES", name: "Espanha", currency: "EUR" },
  { code: "FR", name: "França", currency: "EUR" },
  { code: "IT", name: "Itália", currency: "EUR" },
  { code: "US", name: "Estados Unidos", currency: "USD" }
]

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [settings, setSettings] = useState({
    portal_name: "Portal de Ofertas Portugal",
    slogan: "As melhores ofertas em Portugal",
    default_country: "PT",
    default_language: "pt-PT",
    default_currency: "EUR",
    primary_color: "#FF6A00",
    secondary_color: "#0F1117",
    contact_email: "info@portalofertas.pt",
    enable_affiliate_disclosure: false
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'portal_config')
        .single()

      if (error) throw error
      
      if (data?.value) {
        setSettings(data.value)
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError("")
      setSuccess("")
      
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'portal_config',
          value: settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })

      if (error) throw error
      
      setSuccess("Configurações salvas com sucesso!")
    } catch (error: any) {
      setError("Erro ao salvar configurações: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 mt-2">Personalize o portal conforme suas necessidades</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-green-400">{success}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Portal
              </label>
              <input
                type="text"
                value={settings.portal_name}
                onChange={(e) => setSettings(prev => ({ ...prev, portal_name: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slogan
              </label>
              <input
                type="text"
                value={settings.slogan}
                onChange={(e) => setSettings(prev => ({ ...prev, slogan: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                País Padrão
              </label>
              <select
                value={settings.default_country}
                onChange={(e) => setSettings(prev => ({ ...prev, default_country: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idioma Padrão
              </label>
              <select
                value={settings.default_language}
                onChange={(e) => setSettings(prev => ({ ...prev, default_language: e.target.value }))}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="pt-PT">Português Portugal</option>
                <option value="pt-BR">Português Brasil</option>
                <option value="es-ES">Espanhol</option>
                <option value="fr-FR">Francês</option>
                <option value="it-IT">Italiano</option>
                <option value="en-US">Inglês</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cores */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Cores do Portal
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cor Primária (Laranja)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="h-10 w-20 cursor-pointer rounded border border-gray-700"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cor Secundária (Fundo)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.secondary_color}
                  onChange={(e) => setSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="h-10 w-20 cursor-pointer rounded border border-gray-700"
                />
                <input
                  type="text"
                  value={settings.secondary_color}
                  onChange={(e) => setSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Contato
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-mail de Contato
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
              className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Configurações de Afiliados */}
        <div className="bg-card-dark border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Configurações de Afiliados</h2>
          
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enable_affiliate_disclosure}
                onChange={(e) => setSettings(prev => ({ ...prev, enable_affiliate_disclosure: e.target.checked }))}
                className="h-5 w-5 text-orange-500 rounded focus:ring-orange-500 focus:ring-offset-gray-800"
              />
              <span className="text-gray-300">Exibir aviso de afiliados no site</span>
            </label>
            <p className="text-sm text-gray-400 mt-2">
              Quando ativado, exibe um aviso sobre links de afiliados no rodapé do site.
            </p>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            {saving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}