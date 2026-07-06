import { NextRequest, NextResponse } from "next/server"
import { fetchPlaylistTracks, parseTrackToTrackData, type ParsedTrack } from "@/lib/music/spotify"
import { CHARTS } from "@/lib/music/config"
import { getMockTracks } from "@/lib/music/mockData"
import { deezerProvider } from "@/lib/music/providers/deezer"
import { readFromR2, uploadToR2 } from "@/lib/cloudflare"
import type { TrackData, Variation, ChartData, ChartHistory } from "@/lib/music/types"
import type { ChartKey } from "@/lib/music/types"
import type { ProviderTrack } from "@/lib/music/providers/types"

// Cache en memoria: 6 horas para Spotify/Deezer, se invalida si cambia de chart
const CACHE_TTL = 6 * 60 * 60 * 1000
let memoryCache: { data: ChartData[]; timestamp: number } | null = null

function computeVariation(current: number, previous: number | null): { variation: Variation; previousPosition: number | null } {
  if (previous === null) return { variation: "new", previousPosition: null }
  if (current < previous) return { variation: "up", previousPosition: previous }
  if (current > previous) return { variation: "down", previousPosition: previous }
  return { variation: "same", previousPosition: previous }
}

async function loadHistory(): Promise<ChartHistory> {
  const raw = await readFromR2("music-history.json")
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function saveHistory(history: ChartHistory) {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" })
  await uploadToR2("music-history.json", blob, "application/json")
}

// Convierte track de Deezer (ProviderTrack) al formato ParsedTrack de Spotify
function providerTrackToParsed(t: ProviderTrack, position: number): ParsedTrack {
  function buildYoutubeUrl(title: string, artist: string): string {
    const q = encodeURIComponent(`${title} ${artist}`)
    return `https://music.youtube.com/search?q=${q}`
  }
  return {
    position,
    title: t.title,
    artist: t.artist,
    album: t.album,
    albumCover: t.albumCover,
    durationMs: t.duration * 1000,
    releaseDate: t.releaseDate,
    popularity: t.popularity,
    spotifyUrl: t.url,
    trackId: t.id,
    // Note: youtubeUrl is generated in parseTrackToTrackData, we provide spotifyUrl as the platform URL here
    _youtubeUrl: buildYoutubeUrl(t.title, t.artist),
  } as ParsedTrack & { _youtubeUrl?: string }
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
      let parsed: ParsedTrack[] = []
      let source = "Spotify"

      // 1) Intentar con Spotify
      try {
        parsed = await fetchPlaylistTracks(chart.playlistId)
      } catch (err) {
        console.error(`Spotify failed for ${chart.key}:`, err)
      }

      // 2) Si Spotify falla o no devuelve datos, intentar con Deezer (datos reales actualizados diariamente)
      if (!parsed || parsed.length === 0) {
        try {
          const deezerTracks = await deezerProvider.fetchTopTracks(chart.key, 10)
          if (deezerTracks && deezerTracks.length > 0) {
            parsed = deezerTracks.map((t, i) => providerTrackToParsed(t, i + 1)) as ParsedTrack[]
            source = "Deezer"
          }
        } catch (err) {
          console.error(`Deezer failed for ${chart.key}:`, err)
        }
      }

      // 3) Si ambos fallan, usar mock como último recurso
      if (!parsed || parsed.length === 0) {
        parsed = getMockTracks(chart.key)
        source = "OMNES"
      }

      const previousRankings = history[chart.key]?.rankings || []

      const tracks: TrackData[] = parsed.slice(0, 10).map((track, i) => {
        const prev = previousRankings.find((r) => r.trackId === track.trackId)
        const { variation, previousPosition } = computeVariation(i + 1, prev?.position ?? null)
        const base = parseTrackToTrackData(track)
        // Si viene de Deezer y el track tiene _youtubeUrl, úsalo
        const extTrack = track as ParsedTrack & { _youtubeUrl?: string }
        return {
          ...base,
          youtubeUrl: extTrack._youtubeUrl || base.youtubeUrl,
          position: i + 1,
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
        source,
      })
    } catch (err) {
      console.error(`Error processing chart ${chart.key}:`, err)
    }
  }

  await saveHistory(history)

  const response = { charts: results, updatedAt: new Date().toISOString() }

  if (!chartParam) {
    memoryCache = { data: results, timestamp: Date.now() }
  }

  return NextResponse.json(response)
}
