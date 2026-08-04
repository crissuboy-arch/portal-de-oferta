import { PortalConfig } from "@/types"
import { getCurrentPortal } from "./portals"

// Exporta a configuração do portal atual
export const appConfig: PortalConfig = getCurrentPortal()

// Funções utilitárias específicas do portal atual
export function getSiteName(): string {
  return appConfig.name
}

export function getSiteDescription(): string {
  return appConfig.description
}

export function getPrimaryColor(): string {
  return appConfig.primaryColor
}

export function getSecondaryColor(): string {
  return appConfig.secondaryColor
}

export function getMenuItems() {
  return appConfig.menuItems
}

export function getSocialLinks() {
  return appConfig.socialLinks
}

export function getSEOConfig() {
  return appConfig.seo
}

export function getFeatures() {
  return appConfig.features
}

export function getSettings() {
  return appConfig.settings
}