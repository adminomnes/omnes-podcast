import type { ProviderTrack } from "./types"

const API = "https://ws.audioscrobbler.com/2.0"
const API_KEY = process.env.LASTFM_API_KEY

function formatDuration(s: number): string {
  if (!s) return ""
  const min = Math.floor(s / 60)
  const sec = s % 60
  return `${min}:${sec.toString().padStart(2, "0")}`
}

function getLargestImage(images: { size: string; "#text": string }[]): string {
  const priority = ["mega", "extralarge", "large", "medium", "small"]
  for (const size of priority) {
    const found = images.find((i) => i.size === size && i["#text"])
    if (found) return found["#text"]
  }
  return ""
}

const TAG_MAP: Record<string, string> = {
  global: "",
  chile: "",
  pop: "pop",
  urbano: "rap",
  rock: "rock",
  electronica: "electronic",
  latina: "latin",
}

export const lastfmProvider = {
  name: "Last.fm",

  async fetchTopTracks(chartKey: string, limit = 10): Promise<ProviderTrack[]> {
    if (!API_KEY) return []

    try {
      let method: string
      let params: Record<string, string> = { api_key: API_KEY, format: "json", limit: String(limit) }

      if (chartKey === "global") {
        method = "chart.gettoptracks"
      } else if (chartKey === "chile") {
        method = "geo.gettoptracks"
        params.country = "Chile"
      } else {
        const tag = TAG_MAP[chartKey]
        if (!tag) return []
        method = "tag.gettoptracks"
        params.tag = tag
      }

      const qs = new URLSearchParams({ ...params, method }).toString()
      const res = await fetch(`${API}/?${qs}`)
      if (!res.ok) return []

      const data = await res.json()
      const tracks = data?.tracks?.track || data?.topalbums?.album || []
      if (!Array.isArray(tracks)) return []

      return tracks.slice(0, limit).map((t: any, i: number) => ({
        id: t.mbid || `${chartKey}-${i}`,
        title: t.name || "Unknown",
        artist: t.artist?.name || t.artist || "Unknown",
        album: t.album?.["#text"] || "",
        albumCover: getLargestImage(t.image || []),
        duration: parseInt(t.duration) || 0,
        releaseDate: "",
        popularity: parseInt(t.playcount || t.listeners || "0") || 0,
        url: t.url || "",
        source: "Last.fm",
      }))
    } catch {
      return []
    }
  },
}
