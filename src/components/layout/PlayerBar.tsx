"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, List, Disc3,
} from "lucide-react"
import { usePlayerStore } from "@/hooks/usePlayer"
import { cn, formatDuration } from "@/lib/utils"

export function PlayerBar() {
  const {
    currentEpisode, isPlaying, isMuted, volume, speed, currentTime, duration,
    togglePlay, next, previous, setVolume, toggleMute, setSpeed,
    isPlayerVisible, setCurrentTime, setDuration,
  } = usePlayerStore()

  const waveformRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isPlayerVisible || !waveformRef.current || !currentEpisode?.audio_url) return

    let wavesurfer: any = null
    let unsub: (() => void) | null = null

    import("wavesurfer.js").then((WaveSurfer) => {
      if (!waveformRef.current) return

      wavesurfer = WaveSurfer.default.create({
        container: waveformRef.current,
        waveColor: "rgba(255,255,255,0.08)",
        progressColor: "rgba(59,130,246,0.5)",
        cursorColor: "rgba(255,255,255,0.2)",
        barWidth: 2,
        barGap: 1.5,
        barRadius: 3,
        height: 40,
        normalize: true,
        interact: false,
        cursorWidth: 0,
      })

      wavesurfer.on("ready", () => {
        setDuration(wavesurfer.getDuration())
        if (isPlaying) wavesurfer.play()
      })

      wavesurfer.on("audioprocess", () => {
        setCurrentTime(wavesurfer.getCurrentTime())
      })

      wavesurfer.on("finish", () => {
        usePlayerStore.getState().pause()
      })

      if (currentEpisode.audio_url) {
        wavesurfer.load(currentEpisode.audio_url)
      }

      unsub = usePlayerStore.subscribe((state) => {
        if (!wavesurfer) return
        if (state.isPlaying && wavesurfer.isPaused()) wavesurfer.play()
        else if (!state.isPlaying && !wavesurfer.isPaused()) wavesurfer.pause()
      })
    })

    return () => {
      unsub?.()
      if (wavesurfer) wavesurfer.destroy()
    }
  }, [isPlayerVisible, currentEpisode?.id, currentEpisode?.audio_url])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <AnimatePresence>
      {isPlayerVisible && currentEpisode && (
        <motion.div
          ref={containerRef}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.08] bg-black/80 backdrop-blur-2xl"
        >
          {/* Waveform background */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.15] pointer-events-none">
            <div ref={waveformRef} className="h-full w-full" />
          </div>

          <div className="relative mx-auto flex h-20 max-w-7xl items-center gap-4 px-6">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="size-12 shrink-0 rounded-lg bg-white/10 overflow-hidden flex items-center justify-center">
                {currentEpisode.thumbnail ? (
                  <img src={currentEpisode.thumbnail} alt={currentEpisode.title} className="size-full object-cover" />
                ) : (
                  <Disc3 className="size-6 text-white/30" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/90">{currentEpisode.title}</p>
                <p className="truncate text-xs text-white/40">
                  {formatDuration(Math.floor(currentTime))} / {formatDuration(duration)}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <button onClick={previous} className="text-white/60 hover:text-white/90 transition-colors">
                <SkipBack className="size-4" />
              </button>
              <button
                onClick={togglePlay}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white/90 transition-colors hover:bg-white/20"
              >
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
              </button>
              <button onClick={next} className="text-white/60 hover:text-white/90 transition-colors">
                <SkipForward className="size-4" />
              </button>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <button onClick={toggleMute} className="text-white/60 hover:text-white/90 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
              <input
                type="range" min={0} max={1} step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-blue-500"
              />
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={() => setSpeed(speed === 2 ? 0.5 : speed === 1.5 ? 2 : speed === 1 ? 1.5 : 1)}
                className="rounded-md px-2 py-1 text-xs font-medium text-white/60 transition-colors hover:text-white/90"
              >
                {speed}x
              </button>
            </div>

            <button className="text-white/60 hover:text-white/90 transition-colors">
              <List className="size-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-white/[0.06]">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
