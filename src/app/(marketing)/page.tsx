import { Hero } from "@/components/home/Hero"
import { PodcastCarousel } from "@/components/home/PodcastCarousel"
import { LatestEpisodes } from "@/components/home/LatestEpisodes"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "OMNES PODCAST — No solo escuches historias. Vívelas.",
  description: "Plataforma premium de podcasts, videopodcasts y contenido audiovisual. Sumérgete en una experiencia única con OMNES PODCAST.",
  openGraph: {
    title: "OMNES PODCAST — No solo escuches historias. Vívelas.",
    description: "Plataforma premium de podcasts y contenido audiovisual.",
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <PodcastCarousel />
      <LatestEpisodes />
    </>
  )
}
