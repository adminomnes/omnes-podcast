"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { RefreshCw, TrendingUp, Newspaper, Clock } from "lucide-react"
import { NewsCard } from "@/components/pulso/NewsCard"
import { NewsCarousel } from "@/components/pulso/NewsCarousel"
import type { PulsoData } from "@/lib/pulso/types"

export function PulsoPageClient() {
  const [data, setData] = useState<PulsoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/pulso")
      const json = await res.json()
      setData(json)
      setLastUpdate(new Date(json.updatedAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }))
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    intervalRef.current = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="relative min-h-screen pt-20">
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse at 50% 0%, oklch(0.6 0.25 270 / 0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, oklch(0.5 0.2 320 / 0.04) 0%, transparent 50%)",
      }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-center">
          <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1 text-xs font-medium tracking-wider text-blue-300 backdrop-blur-sm">
            🛰️ PULSO OMNES
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-1 text-center text-5xl font-black tracking-tight md:text-7xl"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Pulso
          </span>
          <span className="text-white/90"> OMNES</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mx-auto mb-8 max-w-md text-center text-sm text-white/40"
        >
          <TrendingUp className="mb-0.5 mr-1 inline-block size-3.5" />
          Lo que está dando de qué hablar.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mx-auto mb-10 max-w-md text-center"
        >
          <div className="glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs text-white/40">
            <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Actualizando..." : `Actualizado ${lastUpdate}`}
            <span className="text-white/20">·</span>
            <Clock className="size-3" />
            {data ? `${data.totalNews} noticias` : "..."}
          </div>
        </motion.div>

        {loading && !data ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="size-12 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
              <p className="text-sm text-white/30">Obteniendo las últimas noticias...</p>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-14">
            {data.featured.length > 0 && (
              <section>
                <div className="mb-5 flex items-center gap-2">
                  <Newspaper className="size-4 text-blue-400" />
                  <h2 className="text-lg font-bold text-white/90">Destacadas</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {data.featured.slice(0, 6).map((item, i) => (
                    <div key={item.id} className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                      <div className={i === 0 ? "h-full" : ""}>
                        <div className={i === 0 ? "h-56 md:h-80" : ""}>
                          <NewsCard item={item} index={i} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.categories.map((cat) => (
              <NewsCarousel key={cat.category} label={cat.label} icon={cat.icon} items={cat.items} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm text-white/20">No pudimos cargar las noticias. Intenta de nuevo más tarde.</p>
          </div>
        )}
      </div>
    </div>
  )
}
