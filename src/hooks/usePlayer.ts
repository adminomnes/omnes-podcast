"use client"

import { create } from "zustand"
import type { Episode } from "@/types"

interface PlayerState {
  currentEpisode: Episode | null
  isPlaying: boolean
  isMuted: boolean
  volume: number
  speed: number
  currentTime: number
  duration: number
  queue: Episode[]
  isPlayerVisible: boolean
  play: (episode: Episode) => void
  pause: () => void
  resume: () => void
  togglePlay: () => void
  setVolume: (vol: number) => void
  toggleMute: () => void
  setSpeed: (speed: number) => void
  seekTo: (time: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (dur: number) => void
  next: () => void
  previous: () => void
  addToQueue: (episode: Episode) => void
  removeFromQueue: (id: string) => void
  clearQueue: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentEpisode: null,
  isPlaying: false,
  isMuted: false,
  volume: 0.8,
  speed: 1,
  currentTime: 0,
  duration: 0,
  queue: [],
  isPlayerVisible: false,

  play: (episode) => {
    set({
      currentEpisode: episode,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      isPlayerVisible: true,
    })
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  togglePlay: () => {
    const state = get()
    state.isPlaying ? set({ isPlaying: false }) : set({ isPlaying: true })
  },

  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setSpeed: (speed) => set({ speed }),
  seekTo: (time) => set({ currentTime: time }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (dur) => set({ duration: dur }),

  next: () => {
    const { queue, currentEpisode } = get()
    if (queue.length === 0) return
    const currentIndex = queue.findIndex((e) => e.id === currentEpisode?.id)
    const nextEpisode = queue[currentIndex + 1] || queue[0]
    set({ currentEpisode: nextEpisode, currentTime: 0, duration: 0 })
  },

  previous: () => {
    const { queue, currentEpisode } = get()
    if (queue.length === 0) return
    const currentIndex = queue.findIndex((e) => e.id === currentEpisode?.id)
    const prevEpisode = queue[currentIndex - 1] || queue[queue.length - 1]
    set({ currentEpisode: prevEpisode, currentTime: 0, duration: 0 })
  },

  addToQueue: (episode) => set((s) => ({ queue: [...s.queue, episode] })),
  removeFromQueue: (id) => set((s) => ({ queue: s.queue.filter((e) => e.id !== id) })),
  clearQueue: () => set({ queue: [] }),
}))
