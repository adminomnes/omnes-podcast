import type { TrackData } from "./types"

const TOKEN_URL = "https://accounts.spotify.com/api/token"
const API_BASE = "https://api.spotify.com/v1"
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

let accessToken: string | null = null
let tokenExpiry = 0

async function getToken(): Promise<string | null> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken
  if (!CLIENT_ID || !CLIENT_SECRET) return null

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    })

    if (!res.ok) return null

    const data = await res.json()
    accessToken = data.access_token
    tokenExpiry = Date.now() + data.expires_in * 1000 - 60000
    return accessToken
  } catch {
    return null
  }
}

function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, "0")}`
}

function formatDate(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })
}

function buildYoutubeUrl(title: string, artist: string): string {
  const q = encodeURIComponent(`${title} ${artist}`)
  return `https://music.youtube.com/search?q=${q}`
}

export interface ParsedTrack {
  position: number
  title: string
  artist: string
  album: string
  albumCover: string
  durationMs: number
  releaseDate: string
  popularity: number
  spotifyUrl: string
  trackId: string
}

export async function fetchPlaylistTracks(playlistId: string): Promise<ParsedTrack[]> {
  const token = await getToken()
  if (!token) return []

  const tracks: ParsedTrack[] = []
  let url = `${API_BASE}/playlists/${playlistId}/tracks?limit=50`

  try {
    while (url) {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) break

      const data = await res.json()

      data.items?.forEach((item: any, i: number) => {
        const track = item.track
        if (!track) return

        tracks.push({
          position: tracks.length + 1,
          title: track.name || "Unknown",
          artist: track.artists?.map((a: any) => a.name).join(", ") || "Unknown",
          album: track.album?.name || "Unknown",
          albumCover: track.album?.images?.[0]?.url || "",
          durationMs: track.duration_ms || 0,
          releaseDate: track.album?.release_date || "",
          popularity: track.popularity || 0,
          spotifyUrl: track.external_urls?.spotify || "",
          trackId: track.id || "",
        })
      })

      url = data.next || null
    }
  } catch {
    /* fail silently */
  }

  return tracks
}

export function parseTrackToTrackData(track: ParsedTrack): Omit<TrackData, "variation" | "previousPosition"> {
  return {
    id: track.trackId,
    position: track.position,
    title: track.title,
    artist: track.artist,
    album: track.album,
    albumCover: track.albumCover,
    duration: formatDuration(track.durationMs),
    releaseDate: formatDate(track.releaseDate),
    popularity: track.popularity,
    spotifyUrl: track.spotifyUrl,
    youtubeUrl: buildYoutubeUrl(track.title, track.artist),
    platform: "Spotify",
  }
}
