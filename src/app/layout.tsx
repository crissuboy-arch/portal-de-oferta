import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getCurrentPortal } from "@/lib/config/portals"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const portal = getCurrentPortal()

export const metadata: Metadata = {
  metadataBase: new URL(`https://${portal.domain}`),
  title: {
    default: portal.seo.defaultTitle,
    template: `%s | ${portal.name}`,
  },
  description: portal.seo.defaultDescription,
  keywords: portal.seo.keywords,
  robots: portal.seo.robots,
  openGraph: {
    type: "website",
    locale: portal.language,
    url: `/`,
    siteName: portal.name,
    title: portal.seo.defaultTitle,
    description: portal.seo.defaultDescription,
    images: portal.seo.openGraphImage
      ? [
          {
            url: portal.seo.openGraphImage,
            width: 1200,
            height: 630,
            alt: portal.name,
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: portal.name,
    description: portal.seo.defaultDescription,
    images: portal.seo.twitterCardImage
      ? [portal.seo.twitterCardImage]
      : undefined,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={portal.language} className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Injetar cores CSS customizadas do portal */}
        <style>
          {`
            :root {
              --primary: ${portal.primaryColor};
              --secondary: ${portal.secondaryColor};
              --accent: ${portal.accentColor || "#f59e0b"};
              --background: ${portal.backgroundColor || "#ffffff"};
            }
            .primary-bg { background-color: ${portal.primaryColor} !important; }
            .primary-text { color: ${portal.primaryColor} !important; }
            .primary-border { border-color: ${portal.primaryColor} !important; }
          `}
        </style>
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {portal.showAffiliateDisclaimer && portal.affiliateDisclaimer && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-2 text-sm text-center z-50">
            {portal.affiliateDisclaimer}
          </div>
        )}
      </body>
    </html>
  )
}
