import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"

// Initialize the Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Sistema de Cotizaciones - AS Laboratorios",
  description: "Sistema de cotizaciones para AS Laboratorios Control Biológico S.A.C.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
