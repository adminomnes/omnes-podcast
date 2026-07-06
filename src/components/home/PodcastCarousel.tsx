"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Play, Clock, Headphones, ChevronRight, Star, Sparkles } from "lucide-react"
import { PODCAST_THEMES } from "@/lib/constants"
import { formatDuration } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

const FEATURED = [
  {
    slug: "detras-del-espejo",
    title: "Detrás del Espejo",
    subtitle: "Misterio · Suspenso",
    tag: "Nueva temporada",
    description: "Donde los reflejos revelan lo que los ojos no ven. Un viaje al corazón del misterio, lo inexplicable y lo oculto.",
    episodes: 24,
    duration: 4500,
    listeners: "12.5K",
    theme: PODCAST_THEMES["detras-del-espejo"],
    gradient: "from-blue-900 via-indigo-950 to-black",
    accentGradient: "from-blue-400 via-cyan-300 to-blue-600",
  },
  {
    slug: "me-gusta-que-te-guste",
    title: "Me gusta que te guste",
    subtitle: "Comedia · Entretenimiento",
    tag: "Trending",
    description: "Caos, humor y conversaciones que no sabías que necesitabas. Cada episodio es una experiencia única e irrepetible.",
    episodes: 18,
    duration: 3600,
    listeners: "8.3K",
    theme: PODCAST_THEMES["me-gusta-que-te-guste"],
    gradient: "from-orange-900 via-pink-950 to-purple-950",
    accentGradient: "from-pink-400 via-amber-300 to-purple-400",
  },
]

export function PodcastCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".podcast-poster")
    if (!cards) return
    gsap.fromTo(cards, { opacity: 0, y: 100, scale: 0.9, filter: "blur(10px)" }, {
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.3, ease: "power4.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
    })
  }, [])

  return (
    <section id="podcasts" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-purple-950/20 to-transparent" />
      <div className="absolute inset-0 opacity-20" style={{
        background: "radial-gradient(circle at 20% 50%, oklch(0.7 0.3 250 / 0.08), transparent 50%), radial-gradient(circle at 80% 50%, oklch(0.65 0.3 320 / 0.06), transparent 50%)"
      }} />

      <div className="max-w-content relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-1 text-xs font-medium tracking-widest text-pink-300/80 uppercase backdrop-blur-xl shadow-[0_0_15px_oklch(0.65_0.3_330/0.1)]">
            <Sparkles className="size-3" />
            Originales
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Explora nuestros
            <br />
            <span className="text-gradient">podcasts originales</span>
          </h2>
          <p className="mt-4 text-sm text-white/35">Cada programa, un universo visual y sonoro distinto</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {FEATURED.map((podcast, i) => {
            const isHovered = hoveredIdx === i
            return (
              <Link
                key={podcast.slug}
                href={`/podcasts/${podcast.slug}`}
                className="podcast-poster group relative block h-[520px] overflow-hidden rounded-3xl sm:h-[620px]"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${podcast.gradient} transition-all duration-1000`} />
                <div className="absolute inset-0 opacity-0 transition-all duration-700 group-hover:opacity-100" style={{
                  background: `radial-gradient(circle at 30% 30%, ${podcast.theme.primary}33, transparent 60%),
                               radial-gradient(circle at 70% 70%, ${podcast.theme.accent}22, transparent 50%)`
                }} />

                {/* Glowing orbs */}
                <div className="absolute -top-20 -right-20 size-96 rounded-full opacity-30 blur-[150px] transition-all duration-1000 group-hover:opacity-60 group-hover:scale-110" style={{ background: podcast.theme.primary }} />
                <div className="absolute -bottom-20 -left-20 size-72 rounded-full opacity-20 blur-[120px] transition-all duration-1000 group-hover:opacity-40 group-hover:scale-110" style={{ background: podcast.theme.accent }} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Tag flotante */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                  className="absolute top-6 left-6 z-20"
                >
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/30 to-pink-500/30 px-3 py-1.5 text-[10px] font-semibold text-amber-300/90 backdrop-blur-xl border border-amber-500/20 shadow-[0_0_20px_oklch(0.7_0.3_50/0.15)]">
                    <Star className="size-3 fill-amber-400" />
                    {podcast.tag}
                  </span>
                </motion.div>

                <div className="absolute top-6 right-6 z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-xl" style={{
                    background: `${podcast.theme.primary}22`,
                    color: podcast.theme.primary,
                    border: `1px solid ${podcast.theme.primary}44`,
                    boxShadow: `0 0 20px ${podcast.theme.primary}22`,
                  }}>
                    {podcast.subtitle}
                  </span>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-6 right-6 z-10 flex size-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-2xl transition-all hover:bg-white/20 shadow-[0_0_30px_oklch(0_0_0/0.3)]"
                  style={{ right: isHovered ? 180 : 24 }}
                >
                  <Play className="size-6 ml-0.5" />
                </motion.div>

                <div className="absolute bottom-0 inset-x-0 p-8 sm:p-12">
                  <motion.div
                    initial={false}
                    animate={{ y: isHovered ? -12 : 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    <h3 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl" style={{ color: podcast.theme.primary, textShadow: `0 0 40px ${podcast.theme.primary}44` }}>
                      {podcast.title}
                    </h3>

                    <motion.p
                      initial={false}
                      animate={{ opacity: isHovered ? 1 : 0.5, y: isHovered ? 0 : 4 }}
                      className="max-w-lg text-sm leading-relaxed text-white/55 sm:text-base"
                    >
                      {podcast.description}
                    </motion.p>

                    <div className="flex flex-wrap items-center gap-5 text-xs">
                      <span className="flex items-center gap-1.5 text-white/40">
                        <Headphones className="size-3.5" />
                        <span className="text-white/60 font-medium">{podcast.listeners}</span> oyentes
                      </span>
                      <span className="flex items-center gap-1.5 text-white/40">
                        <Play className="size-3.5" />
                        <span className="text-white/60 font-medium">{podcast.episodes}</span> episodios
                      </span>
                      <span className="flex items-center gap-1.5 text-white/40">
                        <Clock className="size-3.5" />
                        {formatDuration(podcast.duration)}
                      </span>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -30 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all shadow-[0_0_30px_var(--glow-color)]"
                        style={{
                          background: `linear-gradient(135deg, ${podcast.theme.primary}33, ${podcast.theme.accent}22)`,
                          color: podcast.theme.primary,
                          border: `1px solid ${podcast.theme.primary}55`,
                          "--glow-color": `${podcast.theme.primary}33`,
                        } as React.CSSProperties}
                      >
                        Explorar programa
                        <ChevronRight className="size-4" />
                      </span>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Animated bottom bar */}
                <div className="absolute inset-x-0 bottom-0 h-1.5 origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100" style={{
                  background: `linear-gradient(90deg, ${podcast.theme.primary}, ${podcast.theme.accent}, ${podcast.theme.primary})`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }} />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
