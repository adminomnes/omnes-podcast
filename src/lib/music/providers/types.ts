export interface ProviderTrack {
  id: string
  title: string
  artist: string
  album: string
  albumCover: string
  duration: number
  releaseDate: string
  popularity: number
  url: string
  source: string
}

export interface MusicProvider {
  name: string
  fetchTopTracks(chartKey: string, limit?: number): Promise<ProviderTrack[]>
}
