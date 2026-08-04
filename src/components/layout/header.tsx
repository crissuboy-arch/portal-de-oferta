"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Sun, Moon, Heart, ShoppingBag, User, Menu, X, Bell } from "lucide-react"
import { getCurrentPortal } from "@/lib/config/portals"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const portal = getCurrentPortal()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-primary text-white">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-12 items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-4 text-sm">
            <span className="hidden md:inline">🎁 Oferta do dia: MacBook Air M2 por € 899</span>
            <span className="hidden lg:inline">🔥 156 novas ofertas hoje</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm hover:text-orange-400">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alertas</span>
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center space-x-1 text-sm hover:text-orange-400"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">Tema</span>
            </button>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{portal.name}</h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {portal.country === "PT" ? "As melhores ofertas em Portugal" : 
                   portal.country === "BR" ? "As melhores ofertas no Brasil" :
                   portal.country === "ES" ? "Las mejores ofertas en España" :
                   "The best deals and discounts"}
                </p>
              </div>
            </Link>
          </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {portal.menuItems.map((item: any) => (
            <Link
              key={item.id}
              href={item.href}
              className="px-3 py-2 text-sm font-medium hover:bg-gray-800 hover:text-orange-400 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:flex relative">
              <input
                type="text"
                placeholder={portal.country === "PT" ? "Buscar produtos, ofertas, descontos..." :
                          portal.country === "BR" ? "Buscar produtos, ofertas, descontos..." :
                          portal.country === "ES" ? "Buscar productos, ofertas, descuentos..." :
                          "Search products, deals, discounts..."}
                className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Mobile Search */}
            <button className="md:hidden p-2">
              <Search className="h-5 w-5" />
            </button>

            {/* Favorites */}
            <button className="relative p-2 hover:text-orange-400">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs">
                12
              </span>
            </button>

            {/* Optional Cart */}
            <button className="relative p-2 hover:text-orange-400">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs">
                3
              </span>
            </button>

            {/* Auth Button */}
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900 py-4">
            <div className="space-y-2 px-4">
{portal.menuItems.map((item: any) => (
              <Link
                key={item.id}
                href={item.href}
                className="block py-2 px-4 hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}