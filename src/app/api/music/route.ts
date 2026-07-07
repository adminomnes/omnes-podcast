import { NextRequest, NextResponse } from "next/server"
import { CHARTS } from "@/lib/music/config"
import { deezerProvider } from "@/lib/music/providers/deezer"
import { readFromR2, uploadToR2 } from "@/lib/cloudflare"
import type { TrackData, Variation, ChartData, ChartHistory } from "@/lib/music/types"
import type { ChartKey } from "@/lib/music/types"
import type { ProviderTrack } from "@/lib/music/providers/types"

const CACHE_TTL = 6 * 60 * 60 * 1000
let memoryCache: { data: ChartData[]; timestamp: number } | null = null

const providers: Record<string, typeof deezerProvider> = {
  deezer: deezerProvider,
}

function formatDuration(s: number): string {
  if (!s) return ""
  const min = Math.floor(s / 60)
  const sec = s % 60
  return `${min}:${sec.toString().padStart(2, "0")}`
}

function buildYoutubeUrl(title: string, artist: string): string {
  return `https://music.youtube.com/search?q=${encodeURIComponent(`${title} ${artist}`)}`
}

function computeVariation(current: number, previous: number | null): { variation: Variation; previousPosition: number | null } {
  if (previous === null) return { variation: "new", previousPosition: null }
  if (current < previous) return { variation: "up", previousPosition: previous }
  if (current > previous) return { variation: "down", previousPosition: previous }
  return { variation: "same", previousPosition: previous }
}

async function loadHistory(): Promise<ChartHistory> {
  const raw = await readFromR2("music-history.json")
  if (!raw) return {}
  try { return JSON.parse(raw) } catch { return {} }
}

async function saveHistory(history: ChartHistory) {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" })
  await uploadToR2("music-history.json", blob, "application/json")
}

export async function GET(request: NextRequest) {
  const chartParam = request.nextUrl.searchParams.get("chart") as ChartKey | null

  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL && !chartParam) {
    return NextResponse.json({ charts: memoryCache.data, updatedAt: new Date(memoryCache.timestamp).toISOString() })
  }

  const targets = chartParam ? CHARTS.filter((c) => c.key === chartParam) : CHARTS
  if (targets.length === 0) {
    return NextResponse.json({ error: "Chart not found" }, { status: 404 })
  }

  const history = await loadHistory()
  const results: ChartData[] = []

  for (const chart of targets) {
    try {
      const provider = providers[chart.provider]
      if (!provider) continue

      const raw: ProviderTrack[] = await provider.fetchTopTracks(chart.key, 10)
      const previousRankings = history[chart.key]?.rankings || []

      const tracks: TrackData[] = raw.slice(0, 10).map((track, i) => {
        const prev = previousRankings.find((r) => r.trackId === track.id || r.trackId === `${chart.key}-${i}`)
        const { variation, previousPosition } = computeVariation(i + 1, prev?.position ?? null)
        return {
          id: track.id,
          position: i + 1,
          title: track.title,
          artist: track.artist,
          album: track.album,
          albumCover: track.albumCover,
          duration: formatDuration(track.duration),
          releaseDate: track.releaseDate,
          popularity: track.popularity,
          spotifyUrl: track.url,
          youtubeUrl: buildYoutubeUrl(track.title, track.artist),
          platform: track.source,
          variation,
          previousPosition,
        }
      })

      history[chart.key] = {
        timestamp: new Date().toISOString(),
        rankings: tracks.map((t) => ({ position: t.position, trackId: t.id })),
      }

      results.push({
        chart: chart.key,
        label: chart.label,
        tracks,
        updatedAt: new Date().toISOString(),
        source: "Deezer",
      })
    } catch {
      /* skip failed charts */
    }
  }

  await saveHistory(history)

  const response = { charts: results, updatedAt: new Date().toISOString() }

  if (!chartParam) {
    memoryCache = { data: results, timestamp: Date.now() }
  }

  return NextResponse.json(response)
}
