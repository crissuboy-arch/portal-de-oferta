import Link from "next/link"
import { MessageSquare, Share2, Heart, Mail, MapPin, Phone, Globe, Shield, Award } from "lucide-react"
import { getCurrentPortal } from "@/lib/config/portals"

export function Footer() {
  const portal = getCurrentPortal()
  const currentYear = 2026

  const getCountryText = () => {
    switch(portal.country) {
      case "PT": return "Portugal"
      case "BR": return "Brasil"
      case "US": return "Estados Unidos"
      case "ES": return "Espanha"
      default: return portal.country
    }
  }

  const getCurrencySymbol = () => {
    switch(portal.currency) {
      case "EUR": return "€"
      case "BRL": return "R$"
      case "USD": return "$"
      default: return portal.currency
    }
  }

  return (
    <footer className="mt-auto border-t border-gray-800 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="py-12">
          {/* Main Footer */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{portal.name}</h3>
                  <p className="text-sm text-gray-400">
                    {portal.country === "PT" ? "As melhores ofertas em Portugal" : 
                     portal.country === "BR" ? "As melhores ofertas no Brasil" :
                     portal.country === "ES" ? "Las mejores ofertas en España" :
                     "The best deals and discounts"}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                {portal.description}
              </p>
              <div className="flex space-x-4">
                {portal.socialLinks.facebook && (
                  <a
                    href={portal.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </a>
                )}
                {portal.socialLinks.instagram && (
                  <a
                    href={portal.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </a>
                )}
                {portal.socialLinks.twitter && (
                  <a
                    href={portal.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                {portal.country === "ES" ? "Sobre" : "Sobre"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/sobre" className="text-gray-300 hover:text-orange-400 transition-colors">
                    {portal.country === "ES" ? "Quiénes Somos" : "Quem Somos"}
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-gray-300 hover:text-orange-400 transition-colors">
                    {portal.country === "ES" ? "Contacto" : "Contacto"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                {portal.country === "ES" ? "Legal" : "Legal"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href={portal.settings.privacyPolicyUrl || "/privacidade"} className="text-gray-300 hover:text-orange-400 transition-colors">
                    {portal.country === "ES" ? "Política de Privacidad" : "Política de Privacidade"}
                  </Link>
                </li>
                <li>
                  <Link href={portal.settings.termsOfServiceUrl || "/termos"} className="text-gray-300 hover:text-orange-400 transition-colors">
                    {portal.country === "ES" ? "Términos de Uso" : "Termos de Uso"}
                  </Link>
                </li>
                <li>
                  <Link href={portal.settings.cookiePolicyUrl || "/cookies"} className="text-gray-300 hover:text-orange-400 transition-colors">
                    {portal.country === "ES" ? "Política de Cookies" : "Política de Cookies"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                {portal.country === "ES" ? "Contacto" : "Contacto"}
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-2 text-orange-400" />
                  {portal.settings.contactEmail || "contacto@ofertas.pt"}
                </li>
                {portal.settings.supportPhone && (
                  <li className="flex items-center text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-orange-400" />
                    {portal.settings.supportPhone}
                  </li>
                )}
                {portal.settings.address && (
                  <li className="flex items-start text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 text-orange-400 mt-1" />
                    <span>{portal.settings.address}</span>
                  </li>
                )}
              </ul>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-bold mb-2">Newsletter</h4>
                <p className="text-sm text-gray-300 mb-3">
                  {portal.country === "PT" ? "Receba as melhores ofertas primeiro!" :
                   portal.country === "BR" ? "Receba as melhores ofertas primeiro!" :
                   portal.country === "ES" ? "¡Recibe las mejores ofertas primero!" :
                   "Get the best deals first!"}
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-r-lg font-medium">
                    {portal.country === "ES" ? "Suscribirse" : "Inscrever"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>Países: Portugal • Brasil • EUA • Espanha</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Site Seguro • SSL</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>Portal Premiado 2026</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-400">
                  © {currentYear} {portal.name} • {getCountryText()} • {getCurrencySymbol()} • Todos os direitos reservados.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {portal.affiliateDisclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}