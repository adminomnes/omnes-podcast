import { EpisodePageClient } from "./EpisodePage.client"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Episodio`,
    description: `Reproduce este episodio en OMNES PODCAST.`,
    openGraph: {
      title: `Episodio | OMNES PODCAST`,
    },
  }
}

export default function EpisodePage() {
  return <EpisodePageClient />
}
