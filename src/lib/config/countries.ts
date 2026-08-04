export interface CountryConfig {
  code: string
  name: string
  language: string
  currency: string
  flag: string
  domain: string
  supported: boolean
  default: boolean
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: "br",
    name: "Brasil",
    language: "pt-BR",
    currency: "BRL",
    flag: "🇧🇷",
    domain: "localhost:3000",
    supported: true,
    default: true,
  },
  {
    code: "us",
    name: "United States",
    language: "en-US",
    currency: "USD",
    flag: "🇺🇸",
    domain: "us.localhost:3000",
    supported: true,
    default: false,
  },
  {
    code: "es",
    name: "España",
    language: "es-ES",
    currency: "EUR",
    flag: "🇪🇸",
    domain: "es.localhost:3000",
    supported: true,
    default: false,
  },
  {
    code: "pt",
    name: "Portugal",
    language: "pt-PT",
    currency: "EUR",
    flag: "🇵🇹",
    domain: "pt.localhost:3000",
    supported: true,
    default: false,
  },
]

export const DEFAULT_COUNTRY = COUNTRIES.find((country) => country.default) || COUNTRIES[0]

export function getCountryByDomain(domain: string): CountryConfig {
  return COUNTRIES.find((country) => country.domain === domain) || DEFAULT_COUNTRY
}

export function getCountryByCode(code: string): CountryConfig {
  return COUNTRIES.find((country) => country.code === code) || DEFAULT_COUNTRY
}