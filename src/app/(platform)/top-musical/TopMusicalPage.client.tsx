"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Music, RefreshCw, Clock } from "lucide-react"
import { CHARTS } from "@/lib/music/config"
import { TrackCard } from "@/components/music/TrackCard"
import type { ChartData } from "@/lib/music/types"
import type { ChartKey } from "@/lib/music/types"

export function TopMusicalPageClient() {
  const [activeChart, setActiveChart] = useState<ChartKey>("global")
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

  return (
    <div className="relative min-h-screen pt-20">
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse at 50% 0%, oklch(0.5 0.3 150 / 0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, oklch(0.4 0.2 280 / 0.04) 0%, transparent 50%)",
      }} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-center">
          <span className="inline-block rounded-full bg-green-500/10 px-4 py-1 text-xs font-medium tracking-wider text-green-300 backdrop-blur-sm">
            🎵 TOP 10 MUSICAL
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-1 text-center text-5xl font-black tracking-tight md:text-7xl"
        >
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Top 10
          </span>
          <span className="text-white/90"> Musical</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mx-auto mb-8 max-w-md text-center text-sm text-white/40"
        >
          <Music className="mb-0.5 mr-1 inline-block size-3.5" />
          Lo más escuchado del momento.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5">
            {CHARTS.map((chart) => (
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
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  activeChart === chart.key
                    ? "bg-green-500/15 text-green-300 shadow-[0_0_20px_oklch(0.6_0.25_150/0.1)]"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                }`}
              >
                <span className="mr-1.5">{chart.icon}</span>
                {chart.label}
              </button>
            ))}
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
              <div className="size-12 animate-spin rounded-full border-2 border-green-500/30 border-t-green-500" />
              <p className="text-sm text-white/30">Cargando charts...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {tracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} />
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
