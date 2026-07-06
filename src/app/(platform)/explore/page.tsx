import { ExplorePageClient } from "./ExplorePage.client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Explorar",
  description: "Encuentra podcasts, episodios e invitados. Descubre tu próximo contenido favorito en OMNES PODCAST.",
  openGraph: {
    title: "Explorar | OMNES PODCAST",
    description: "Descubre podcasts, episodios e invitados.",
  },
}

export default function ExplorePage() {
  return <ExplorePageClient />
}
