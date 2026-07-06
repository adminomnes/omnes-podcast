import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { PlayerBar } from "@/components/layout/PlayerBar"
import { Footer } from "@/components/layout/Footer"
import { CustomCursor } from "@/components/effects/CustomCursor"
import { AmbientLighting } from "@/components/effects/AmbientLighting"
import { WaveformBackground } from "@/components/effects/WaveformBackground"
import { Particles } from "@/components/effects/Particles"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "OMNES PODCAST",
    template: "%s | OMNES PODCAST",
  },
  description: "Historias que se escuchan. Conversaciones que se viven. Plataforma premium de podcasts y contenido audiovisual.",
  keywords: ["podcast", "videopodcast", "omnes", "streaming", "audio", "digital omnes"],
  authors: [{ name: "OMNES PODCAST" }],
  creator: "OMNES PODCAST",
  publisher: "OMNES PODCAST",
  metadataBase: new URL("https://omnespodcast.com"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "OMNES PODCAST",
    title: "OMNES PODCAST — No solo escuches historias. Vívelas.",
    description: "Plataforma premium de podcasts, videopodcasts y contenido audiovisual. Sumérgete en una experiencia única.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OMNES PODCAST",
    description: "No solo escuches historias. Vívelas.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        <AmbientLighting />
        <WaveformBackground />
        <Particles />
        <div className="noise-overlay" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <PlayerBar />
      </body>
    </html>
  )
}
