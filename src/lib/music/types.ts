export type Variation = "up" | "down" | "same" | "new"

export interface TrackData {
  id: string
  position: number
  title: string
  artist: string
  album: string
  albumCover: string
  duration: string
  releaseDate: string
  popularity: number
  spotifyUrl: string
  youtubeUrl: string
  platform: string
  variation: Variation
  previousPosition: number | null
}

export type ChartKey = "global" | "chile" | "pop" | "urbano" | "rock" | "electronica" | "latina"

export interface ChartConfig {
  key: ChartKey
  label: string
  icon: string
  provider: string
}

export interface ChartData {
  chart: ChartKey
  label: string
  tracks: TrackData[]
  updatedAt: string
  source: string
}

export interface HistoryEntry {
  position: number
  trackId: string
}

export interface ChartHistory {
  [chartKey: string]: {
    timestamp: string
    rankings: HistoryEntry[]
  }
}

export interface MusicResponse {
  charts: ChartData[]
  updatedAt: string
}
