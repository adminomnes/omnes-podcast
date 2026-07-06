"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Music, RefreshCw, Clock } from "lucide-react"
import { CHARTS } from "@/lib/music/config"
import { TrackCard } from "@/components/music/TrackCard"
import type { ChartData } from "@/lib/music/types"
import type { ChartKey } from "@/lib/music/types"

const CHART_THEMES: Record<ChartKey, {
  primary: string
  bgGradient: string
  accentText: string
  badgeStyle: string
  tabActiveStyle: string
  spinnerBorder: string
}> = {
  pedidos: {
    primary: "#f97316", // Amber / Orange
    bgGradient: "radial-gradient(ellipse at 50% -20%, rgba(249, 115, 22, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(239, 68, 68, 0.04) 0%, transparent 50%)",
    accentText: "from-orange-400 via-amber-400 to-rose-400",
    badgeStyle: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    tabActiveStyle: "bg-orange-500/15 text-orange-300 border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.15)]",
    spinnerBorder: "border-t-orange-500 border-orange-500/20"
  },
  global: {
    primary: "#3b82f6", // Blue
    bgGradient: "radial-gradient(ellipse at 50% -20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(99, 102, 241, 0.04) 0%, transparent 50%)",
    accentText: "from-blue-400 via-indigo-400 to-violet-400",
    badgeStyle: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    tabActiveStyle: "bg-blue-500/15 text-blue-300 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    spinnerBorder: "border-t-blue-500 border-blue-500/20"
  },
  chile: {
    primary: "#ef4444", // Red
    bgGradient: "radial-gradient(ellipse at 50% -20%, rgba(239, 68, 68, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 50%)",
    accentText: "from-red-400 via-slate-200 to-blue-400",
    badgeStyle: "bg-red-500/10 text-red-300 border-red-500/20",
    tabActiveStyle: "bg-red-500/15 text-red-300 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.12)]",
    spinnerBorder: "border-t-red-500 border-red-500/20"
  },
  pop: {
    primary: "#ec4899", // Pink
    bgGradient: "radial-gradient(ellipse at 50% -20%, rgba(236, 72, 153, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)",
    accentText: "from-pink-400 via-fuchsia-400 to-purple-400",
    badgeStyle: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    tabActiveStyle: "bg-pink-500/15 text-pink-300 border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)]",
    spinnerBorder: "border-t-pink-500 border-pink-500/20"
  },
  urbano: {
    primary: "#eab308", // Yellow / Gold
    bgGradient: "radial-gradient(ellipse at 50% -20%, rgba(234, 179, 8, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(249, 115, 22, 0.04) 0%, transparent 50%)",
    accentText: "from-yellow-400 via-amber-400 to-orange-400",
    badgeStyle: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    tabActiveStyle: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.12)]",
    spinnerBorder: "border-t-yellow-500 border-yellow-500/20"
  },
  rock: {
    primary: "#b91c1c", // Deep Red
    bgGradient: "radial-gradient(ellipse at 50% -20%, rgba(185, 28, 28, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(39, 39, 42, 0.04) 0%, transparent 50%)",
    accentText: "from-red-500 via-zinc-400 to-zinc-600",
    badgeStyle: "bg-red-500/10 text-red-300 border-red-500/20",
    tabActiveStyle: "bg-red-500/15 text-red-300 border-red-500/20 shadow-[0_0_20px_rgba(185,28,28,0.15)]",
    spinnerBorder: "border-t-red-500 border-red-500/20"
  },
  electronica: {
    primary: "#06b6d4", // Cyan
    bgGradient: "radial-gradient(ellipse at 50% -20%, rgba(6, 182, 212, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 50%)",
    accentText: "from-cyan-400 via-teal-400 to-emerald-400",
    badgeStyle: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    tabActiveStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    spinnerBorder: "border-t-cyan-500 border-cyan-500/20"
  },
  latina: {
    primary: "#f43f5e", // Rose
    bgGradient: "radial-gradient(ellipse at 50% -20%, rgba(244, 63, 94, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(251, 146, 60, 0.04) 0%, transparent 50%)",
    accentText: "from-rose-400 via-orange-400 to-amber-400",
    badgeStyle: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    tabActiveStyle: "bg-rose-500/15 text-rose-300 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]",
    spinnerBorder: "border-t-rose-500 border-rose-500/20"
  }
}

export function TopMusicalPageClient() {
  const [activeChart, setActiveChart] = useState<ChartKey>("pedidos")
  const [charts, setCharts] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState("")

  const fetchCharts = async (chart?: ChartKey) => {
    try {
      const qs = chart ? `?chart=${chart}` : ""
      const res = await fetch(`/api/music${qs}`)
      const data = await res.json()
      setCharts((prev) => {
        const existing = chart ? prev.filter((c) => c.chart !== chart) : []
        return [...existing, ...data.charts]
      })
      setLastUpdate(new Date(data.updatedAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }))
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharts()
  }, [])

  const currentChart = charts.find((c) => c.chart === activeChart)
  const tracks = currentChart?.tracks || []
  const currentTheme = CHART_THEMES[activeChart] || CHART_THEMES.global

  return (
    <div className="relative min-h-screen">
      {/* ── Hero Banner con top.jpeg ── */}
      <div className="relative h-72 w-full overflow-hidden md:h-96">
        <img
          src="/images/top.jpeg"
          alt="Top 10 Musical"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Gradiente de fade hacia abajo */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
        {/* Gradiente dinámico de color temático sobre la imagen */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{ background: currentTheme.bgGradient, mixBlendMode: "color" }}
        />
        {/* Contenido centrado sobre el banner */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className={`inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-wider uppercase border backdrop-blur-sm transition-all duration-500 ${currentTheme.badgeStyle}`}>
              🎵 {currentChart?.label || "Top 10"}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-center text-5xl font-black tracking-tight drop-shadow-2xl md:text-7xl"
          >
            <span className={`bg-gradient-to-r ${currentTheme.accentText} bg-clip-text text-transparent transition-all duration-700`}>
              Top 10
            </span>
            <span className="text-white"> {currentChart?.label || "Musical"}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-sm text-white/60"
          >
            <Music className="mb-0.5 mr-1 inline-block size-3.5 animate-pulse" />
            Lo más escuchado del momento.
          </motion.p>
        </div>
      </div>

      {/* Fondo dinámico debajo del banner */}
      <div
        className="pointer-events-none fixed inset-0 transition-all duration-1000 ease-out"
        style={{ background: currentTheme.bgGradient }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5">
            {CHARTS.map((chart) => {
              const isSelected = activeChart === chart.key;
              const chartTheme = CHART_THEMES[chart.key];
              return (
                <button
                  key={chart.key}
                  onClick={() => {
                    setActiveChart(chart.key)
                    setLoading(true)
                    if (!charts.find((c) => c.chart === chart.key)) {
                      fetchCharts(chart.key)
                    } else {
                      setLoading(false)
                    }
                  }}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 border ${
                    isSelected
                      ? chartTheme.tabActiveStyle
                      : "text-white/40 border-transparent hover:bg-white/[0.04] hover:text-white/70"
                  }`}
                >
                  <span className="mr-1.5">{chart.icon}</span>
                  {chart.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Cargando..." : `Actualizado ${lastUpdate}`}
            <span className="text-white/15">·</span>
            <Clock className="size-3" />
            {currentChart?.updatedAt
              ? new Date(currentChart.updatedAt).toLocaleDateString("es-CL", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "..."
            }
          </div>
          {currentChart && (
            <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] text-white/30">
              {currentChart.source} · Top 10
            </span>
          )}
        </div>

        {loading && tracks.length === 0 ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className={`size-12 animate-spin rounded-full border-2 border-white/10 ${currentTheme.spinnerBorder}`} />
              <p className="text-sm text-white/30">Cargando charts...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {tracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} themeColor={currentTheme.primary} />
            ))}
          </div>
        )}

        {!loading && tracks.length === 0 && (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm text-white/20">
              No pudimos cargar los charts. Intenta de nuevo más tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
