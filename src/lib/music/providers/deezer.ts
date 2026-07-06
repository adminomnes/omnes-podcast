import type { ProviderTrack } from "./types"

const API = "https://api.deezer.com"

const GENRE_MAP: Record<string, number> = {
  global: 0,
  chile: 197,
  pop: 132,
  urbano: 116,
  rock: 152,
  electronica: 106,
  latina: 197,
}

function formatDuration(s: number): string {
  const min = Math.floor(s / 60)
  const sec = s % 60
  return `${min}:${sec.toString().padStart(2, "0")}`
}

function formatDate(raw: string): string {
  if (!raw) return ""
  try {
    return new Date(raw).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })
  } catch {
    return raw
  }
}

export const deezerProvider = {
  name: "Deezer",

  async fetchTopTracks(chartKey: string, limit = 10): Promise<ProviderTrack[]> {
    const genreId = GENRE_MAP[chartKey]
    if (genreId === undefined) return []

    try {
      const url = genreId === 0
        ? `${API}/chart/0/tracks?limit=${limit}`
        : `${API}/chart/${genreId}/tracks?limit=${limit}`

      const res = await fetch(url)
      if (!res.ok) return []

      const data = await res.json()
      if (!data.data?.length) return []

      return data.data.slice(0, limit).map((t: any) => ({
        id: String(t.id),
        title: t.title || "Unknown",
        artist: t.artist?.name || "Unknown",
        album: t.album?.title || "Unknown",
        albumCover: t.album?.cover_medium?.replace("https://", "https://") || "",
        duration: t.duration || 0,
        releaseDate: formatDate(t.release_date),
        popularity: t.rank || 0,
        url: t.link || "",
        source: "Deezer",
      }))
    } catch {
      return []
    }
  },
}
