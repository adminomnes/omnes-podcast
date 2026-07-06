import { AIPageClient } from "./AIPage.client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pregúntale al Podcast",
  description: "IA que busca en cada episodio. Encuentra el momento exacto donde se habla de cualquier tema.",
  openGraph: {
    title: "Pregúntale al Podcast | OMNES PODCAST",
    description: "Búsqueda semántica con IA en todos los episodios.",
  },
}

export default function AIPage() {
  return <AIPageClient />
}
