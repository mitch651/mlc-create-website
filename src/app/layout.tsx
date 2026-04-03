import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import { NetlifyClientIntakeRegistration } from "@/components/netlify-client-intake-registration"

import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050508" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
}

export const metadata: Metadata = {
  title: "MLC Create | Web Design & Development — Cerritos, CA",
  description:
    "Custom websites, automation, and digital solutions. Starter through Enterprise packages — mobile responsive, SEO, CMS, e-commerce, and AI-powered options.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-dvh touch-manipulation bg-background font-sans text-foreground antialiased">
        <NetlifyClientIntakeRegistration />
        {children}
      </body>
    </html>
  )
}
