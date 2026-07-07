import type { ChartConfig } from "./types"

export const CHARTS: ChartConfig[] = [
  { key: "global", label: "Top Global", icon: "🌍", provider: "deezer" },
  { key: "chile", label: "Top Chile", icon: "🇨🇱", provider: "deezer" },
  { key: "pop", label: "Top Pop", icon: "🎤", provider: "deezer" },
  { key: "urbano", label: "Top Urbano", icon: "🏙️", provider: "deezer" },
  { key: "rock", label: "Top Rock", icon: "🎸", provider: "deezer" },
  { key: "electronica", label: "Top Electrónica", icon: "⚡", provider: "deezer" },
  { key: "latina", label: "Top Latina", icon: "💃", provider: "deezer" },
]
