"use client"

import { motion } from "framer-motion"
import { ExternalLink, PlayCircle, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react"
import type { TrackData, Variation } from "@/lib/music/types"
import { AnimatedCounter } from "./AnimatedCounter"

const MEDALS = ["🥇", "🥈", "🥉"]

function VariationBadge({ variation }: { variation: Variation }) {
  if (variation === "up") return <TrendingUp className="size-3.5 text-green-400" />
  if (variation === "down") return <TrendingDown className="size-3.5 text-red-400" />
  if (variation === "new") return <Sparkles className="size-3.5 text-yellow-400" />
  return <Minus className="size-3.5 text-white/30" />
}

function VariationLabel({ variation, previousPosition }: { variation: Variation; previousPosition: number | null }) {
  if (variation === "up") return <span className="text-[11px] text-green-400">↑ {previousPosition}</span>
  if (variation === "down") return <span className="text-[11px] text-red-400">↓ {previousPosition}</span>
  if (variation === "new") return <span className="text-[11px] text-yellow-400">NUEVO</span>
  return <span className="text-[11px] text-white/30">→</span>
}

export function TrackCard({ track, index, themeColor }: { track: TrackData; index: number; themeColor?: string }) {
  const cardStyle = themeColor ? {
    "--hover-glow": `${themeColor}12`,
    "--accent-color": themeColor,
  } as React.CSSProperties : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
      style={cardStyle}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-[0_0_40px_var(--hover-glow,oklch(0.6_0.25_270/0.08))]"
    >
      {themeColor && (
        <div 
          style={{ backgroundColor: themeColor }}
          className="absolute inset-y-0 left-0 w-1 scale-y-0 rounded-l-2xl transition-transform duration-500 group-hover:scale-y-100"
        />
      )}
      <div className="flex items-center gap-3 p-3 md:gap-4 md:p-4">
        <div className="flex w-10 shrink-0 items-center justify-center md:w-12">
          {track.position <= 3 ? (
            <span className="text-2xl md:text-3xl">{MEDALS[track.position - 1]}</span>
          ) : (
            <span className="font-mono text-lg font-black text-white/30 transition-colors duration-300 group-hover:text-[var(--accent-color,white)] md:text-xl">
              <AnimatedCounter from={0} to={track.position} />
            </span>
          )}
        </div>
 
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg md:size-14">
          <img
            src={track.albumCover}
            alt={track.album}
            className="size-full object-cover transition-all duration-500 group-hover:scale-110"
            loading={index < 3 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/[0.06]" />
        </div>
 
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-white/90 transition-colors group-hover:text-white md:text-base">
                {track.title}
              </h3>
              <p className="truncate text-xs text-white/40 md:text-sm">{track.artist}</p>
            </div>
          </div>
 
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/30">
            {track.duration && <span>{track.duration}</span>}
            {track.album && <span className="truncate max-w-[120px]">{track.album}</span>}
            {track.releaseDate && <span>{track.releaseDate}</span>}
            <div className="flex items-center gap-1">
              <VariationBadge variation={track.variation} />
              <VariationLabel variation={track.variation} previousPosition={track.previousPosition} />
            </div>
            <span 
              style={{
                backgroundColor: themeColor ? `${themeColor}15` : undefined,
                color: themeColor || undefined,
                borderColor: themeColor ? `${themeColor}25` : undefined,
              }}
              className="rounded border border-green-500/10 bg-green-500/10 px-1.5 py-0.5 text-[10px] text-green-400 transition-colors duration-300"
            >
              {track.platform}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1DB954]/20 px-3 py-1.5 text-[11px] font-medium text-[#1DB954] transition-all hover:bg-[#1DB954]/30"
          >
            <ExternalLink className="size-3" />
            Spotify
          </a>
          <a
            href={track.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1.5 text-[11px] font-medium text-red-400 transition-all hover:bg-red-500/30"
          >
            <PlayCircle className="size-3" />
            YouTube
          </a>
        </div>
      </div>
    </motion.div>
  )
}
