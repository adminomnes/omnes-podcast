import { HoroscopePageClient } from "./HoroscopePage.client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "El Horóscopo del Caos",
  description: "Tu destino en modo caos. Cada día predicciones únicas, absurdas y altamente compartibles. Descubre qué locura te espera.",
  openGraph: {
    title: "El Horóscopo del Caos | OMNES PODCAST",
    description: "Predicciones únicas y absurdas para cada signo. Nuevo contenido cada día.",
  },
}

export default function HoroscopePage() {
  return <HoroscopePageClient />
}
