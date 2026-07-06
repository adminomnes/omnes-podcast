"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, BookOpen, Share2, ExternalLink, Sparkles, Lightbulb, Mic2 } from "lucide-react"
import Link from "next/link"
import type { PulsoData, NewsItem } from "@/lib/pulso/types"

interface PulsoDetailProps {
  id: string
}

export function PulsoDetailClient({ id }: PulsoDetailProps) {
  const [item, setItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const findItem = async () => {
      try {
        const res = await fetch("/api/pulso")
        const data: PulsoData = await res.json()
        const all = [data.featured, ...data.categories.flatMap((c) => c.items)].flat()
        const found = all.find((n) => n.id === id)
        setItem(found || null)
      } catch {
        /* */
      } finally {
        setLoading(false)
      }
    }
    findItem()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="size-12 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-20">
        <p className="text-white/40">Noticia no encontrada</p>
        <Link href="/pulso" className="text-sm text-blue-400 hover:text-blue-300">Volver a Pulso OMNES</Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pt-24">
      <div className="pointer-events-none fixed inset-0" style={{
        background: "radial-gradient(ellipse at 50% 0%, oklch(0.6 0.25 270 / 0.06) 0%, transparent 60%)",
      }} />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
        <Link href="/pulso" className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70">
          <ArrowLeft className="size-4" />
          Volver a Pulso OMNES
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative mb-8 overflow-hidden rounded-3xl">
            <img src={item.image} alt={item.title} className="h-64 w-full object-cover md:h-96" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                {item.source}
              </span>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <h1 className="text-2xl font-black leading-tight text-white/90 md:text-4xl">{item.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {new Date(item.date).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-3.5" />
                {item.readingTime}
              </span>
              <span className="rounded-full bg-white/[0.04] px-2.5 py-1">{item.source}</span>
            </div>
          </div>

          <p className="mb-8 text-base leading-relaxed text-white/60 md:text-lg">
            {item.description}
          </p>

          {item.aiSummary && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-strong mb-6 rounded-2xl border border-blue-500/10 p-5"
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-300">
                <Sparkles className="size-4" />
                Resumen en 30 segundos
              </div>
              <p className="text-sm leading-relaxed text-white/60">{item.aiSummary}</p>
            </motion.div>
          )}

          {item.aiKeyPoints && item.aiKeyPoints.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass-strong mb-6 rounded-2xl border border-yellow-500/10 p-5"
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-yellow-300">
                <Lightbulb className="size-4" />
                Puntos clave
              </div>
              <ul className="space-y-2">
                {item.aiKeyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-yellow-500/50" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {item.aiPodcastQuestions && item.aiPodcastQuestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="glass-strong mb-6 rounded-2xl border border-pink-500/10 p-5"
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-pink-300">
                <Mic2 className="size-4" />
                Para debatir en el podcast
              </div>
              <ul className="space-y-2">
                {item.aiPodcastQuestions.map((q, i) => (
                  <li key={i} className="text-sm italic text-white/50">
                    &ldquo;{q}&rdquo;
                  </li>
                ))}
              </ul>
              {item.suggestedPodcast && (
                <div className="mt-3 rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-white/30">
                  Perfecto para: <span className="text-white/60 font-medium">{item.suggestedPodcast}</span>
                </div>
              )}
            </motion.div>
          )}

          <div className="flex flex-wrap gap-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-[0_0_30px_oklch(0.6_0.3_260/0.2)] transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-[0_0_40px_oklch(0.6_0.3_260/0.3)]"
            >
              <ExternalLink className="size-4" />
              Leer noticia original
            </a>
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: item.title, url: item.url }) }}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.06] hover:text-white/90"
            >
              <Share2 className="size-4" />
              Compartir
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
