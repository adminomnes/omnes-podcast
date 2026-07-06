import { PodcastHero } from "@/components/podcast/PodcastHero"
import { EpisodeList } from "@/components/podcast/EpisodeList"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { RevealSection } from "@/components/effects/RevealSection"
import { ParallaxSection } from "@/components/effects/ParallaxSection"
import type { Podcast, Episode } from "@/types"

const MOCK_PODCASTS: Record<string, { podcast: Podcast; episodes: Episode[] }> = {
  "detras-del-espejo": {
    podcast: {
      id: "1", slug: "detras-del-espejo",
      title: "Detrás del Espejo",
      description: "Donde los reflejos revelan lo que los ojos no ven. Un viaje al corazón del misterio, lo inexplicable y lo oculto.",
      cover_image: "/images/detras-del-espejo.jpg", trailer_url: null,
      color_primary: "#00d4ff", color_secondary: "#0066ff", color_accent: "#7f00ff",
      vibe: "misterio", category: "Misterio · Suspenso",
      hosts: [{ id: "h1", name: "Alex Miranda", bio: "Explorador de lo desconocido", photo: "", social_links: {} }],
      created_at: "2025-01-01",
    },
    episodes: [
      { id: "e1", season_id: "s1", podcast_id: "1", title: "El espejo roto", description: "Exploramos los secretos detrás de los reflejos que cambiaron la historia. Un caso que desafía toda explicación.", audio_url: "", video_url: null, duration: 3600, thumbnail: "", tags: ["misterio", "reflejos", "historia"], category: "Misterio", published_at: "2025-03-15", views: 12500, likes: 890, hosts: [], guests: [] },
      { id: "e2", season_id: "s1", podcast_id: "1", title: "La habitación sellada", description: "Un caso real que desafía toda explicación lógica. Nadie entra, nadie sale.", audio_url: "", video_url: null, duration: 4200, thumbnail: "", tags: ["misterio", "casos reales"], category: "Misterio", published_at: "2025-03-22", views: 9800, likes: 720, hosts: [], guests: [] },
      { id: "e3", season_id: "s1", podcast_id: "1", title: "El susurro en la oscuridad", description: "Historias que no deberías escuchar solo en la noche.", audio_url: "", video_url: null, duration: 3300, thumbnail: "", tags: ["misterio", "nocturno"], category: "Misterio", published_at: "2025-04-05", views: 7200, likes: 540, hosts: [], guests: [] },
    ],
  },
  "me-gusta-que-te-guste": {
    podcast: {
      id: "2", slug: "me-gusta-que-te-guste",
      title: "Me gusta que te guste",
      description: "Caos, humor y conversaciones que no sabías que necesitabas. Cada episodio es una experiencia diferente.",
      cover_image: "/images/me-gusta-que-te-guste.jpg", trailer_url: null,
      color_primary: "#ff6b6b", color_secondary: "#ffd93d", color_accent: "#6bcb77",
      vibe: "divertido", category: "Comedia · Entretenimiento",
      hosts: [{ id: "h2", name: "Carla Ruiz", bio: "Creadora de caos", photo: "", social_links: {} }],
      created_at: "2025-01-15",
    },
    episodes: [
      { id: "e4", season_id: "s2", podcast_id: "2", title: "El caos del primer episodio", description: "Todo lo que podía salir mal, salió mal. Y fue increíble.", audio_url: "", video_url: null, duration: 2800, thumbnail: "", tags: ["caos", "humor"], category: "Comedia", published_at: "2025-04-01", views: 15200, likes: 1200, hosts: [], guests: [] },
      { id: "e5", season_id: "s2", podcast_id: "2", title: "Invitado sorpresa", description: "Nunca sabes quién va a aparecer. Literalmente.", audio_url: "", video_url: null, duration: 3100, thumbnail: "", tags: ["sorpresa", "invitados"], category: "Comedia", published_at: "2025-04-10", views: 11000, likes: 890, hosts: [], guests: [] },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = MOCK_PODCASTS[slug]
  if (!data) return { title: "Podcast no encontrado" }

  return {
    title: data.podcast.title,
    description: data.podcast.description,
    openGraph: {
      title: data.podcast.title,
      description: data.podcast.description,
      images: data.podcast.cover_image ? [{ url: data.podcast.cover_image }] : [],
    },
  }
}

export default async function PodcastPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = MOCK_PODCASTS[slug]

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white/10">404</h1>
          <p className="mt-4 text-white/40">Podcast no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PodcastHero podcast={data.podcast} />
      <div className="max-w-content section-padding">
        <RevealSection>
          <div className="mb-12">
            <span className="inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1 text-xs font-medium tracking-widest text-white/30 uppercase backdrop-blur-xl">
              Episodios
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Todos los episodios
            </h2>
            <p className="mt-1 text-sm text-white/35">{data.episodes.length} episodios disponibles</p>
          </div>
        </RevealSection>
        <RevealSection delay={0.2}>
          <EpisodeList episodes={data.episodes} />
        </RevealSection>
      </div>
    </div>
  )
}
