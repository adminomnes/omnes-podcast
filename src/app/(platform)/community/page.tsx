import { CommunityPageClient } from "./CommunityPage.client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comunidad",
  description: "Rankings, actividad y discusiones en vivo. Conecta con la comunidad de OMNES PODCAST.",
  openGraph: {
    title: "Comunidad | OMNES PODCAST",
    description: "Rankings, actividad y discusiones en vivo.",
  },
}

export default function CommunityPage() {
  return <CommunityPageClient />
}
