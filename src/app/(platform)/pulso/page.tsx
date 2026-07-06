import { PulsoPageClient } from "./PulsoPage.client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pulso OMNES",
  description: "Lo que está dando de qué hablar. Noticias, tendencias y contenido actualizado automáticamente.",
  openGraph: {
    title: "Pulso OMNES | OMNES PODCAST",
    description: "Centro inteligente de noticias. Todo lo que está dando de qué hablar, en un solo lugar.",
  },
}

export default function PulsoPage() {
  return <PulsoPageClient />
}
