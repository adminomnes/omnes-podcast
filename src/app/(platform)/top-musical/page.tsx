import type { Metadata } from "next"
import { TopMusicalPageClient } from "./TopMusicalPage.client"

export const metadata: Metadata = {
  title: "Top 10 Musical | OMNES Podcast",
  description: "Las canciones más populares del momento. Charts globales, Chile, Pop, Urbano, Rock, Electrónica y Latina.",
  openGraph: {
    title: "Top 10 Musical | OMNES Podcast",
    description: "Las canciones más populares del momento en un solo lugar.",
    type: "website",
  },
}

export default function TopMusicalPage() {
  return <TopMusicalPageClient />
}
