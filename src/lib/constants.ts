import type { PodcastTheme } from "@/types"

export const SITE_NAME = "OMNES PODCAST"
export const SITE_TAGLINE = "No solo escuches historias. Vívelas."
export const SITE_DESCRIPTION = "Plataforma premium de podcasts, videopodcasts y contenido audiovisual"

export const PODCAST_THEMES: Record<string, PodcastTheme> = {
  "detras-del-espejo": {
    primary: "#00d4ff",
    secondary: "#0066ff",
    accent: "#7f00ff",
    glow: "0 0 30px #00d4ff55, 0 0 60px #0066ff33",
    gradientFrom: "#000428",
    gradientTo: "#004e92",
    glassBg: "rgba(0, 100, 255, 0.08)",
    glassBorder: "rgba(0, 212, 255, 0.2)",
  },
  "me-gusta-que-te-guste": {
    primary: "#ff6b6b",
    secondary: "#ffd93d",
    accent: "#6bcb77",
    glow: "0 0 30px #ff6b6b55, 0 0 60px #ffd93d33",
    gradientFrom: "#1a0a2e",
    gradientTo: "#16213e",
    glassBg: "rgba(255, 107, 107, 0.08)",
    glassBorder: "rgba(255, 107, 107, 0.2)",
  },
}

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Explorar", href: "/explore" },
  { label: "Clips", href: "/clips" },
  { label: "Comunidad", href: "/community" },
  { label: "IA", href: "/ai" },
] as const

export const SOCIAL_LINKS = {
  spotify: "https://spotify.com",
  youtube: "https://youtube.com",
  tiktok: "https://tiktok.com",
  instagram: "https://instagram.com",
  apple: "https://apple.com",
} as const
