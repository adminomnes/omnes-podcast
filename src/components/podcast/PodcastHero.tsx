"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { Play, Music2, Video, Camera, Globe, Apple, ChevronDown, Headphones, Sparkles } from "lucide-react"
import type { Podcast } from "@/types"
import { PODCAST_THEMES } from "@/lib/constants"

interface PodcastHeroProps { podcast: Podcast }

export function PodcastHero({ podcast }: PodcastHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const theme = PODCAST_THEMES[podcast.slug] || PODCAST_THEMES["detras-del-espejo"]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current?.children || [], { y: 80, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.12, ease: "power4.out", delay: 0.2 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative flex min-h-[85vh] items-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${theme.gradientFrom}, ${theme.gradientTo})` }} />
      <div className="absolute inset-0 opacity-50" style={{
        background: `radial-gradient(circle at 20% 25%, ${theme.primary}55, transparent 50%),
                     radial-gradient(circle at 80% 75%, ${theme.accent}44, transparent 50%)`
      }} />

      {/* Waveform de fondo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <div className="flex items-end gap-[2px]">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="waveform-bar w-[2px] rounded-full" style={{
              height: `${15 + Math.random() * 100}px`,
              background: podcast.slug === "detras-del-espejo"
                ? "linear-gradient(to top, #00d4ff, #0066ff)"
                : "linear-gradient(to top, #ff6b6b, #ffd93d)",
              animationDelay: `${i * 0.03}s`,
              animationDuration: `${0.6 + Math.random() * 0.8}s`,
            }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div ref={contentRef} className="max-w-3xl space-y-6">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase backdrop-blur-xl shadow-[0_0_30px_var(--glow)]"
            style={{
              background: `${theme.primary}22`,
              color: theme.primary,
              border: `1px solid ${theme.primary}44`,
              "--glow": `${theme.primary}33`,
            } as React.CSSProperties}
          >
            <Sparkles className="size-3" />
            {podcast.category}
          </span>

          <h1
            className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ color: theme.primary, textShadow: `0 0 60px ${theme.primary}33` }}
          >
            {podcast.title}
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            {podcast.description}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 60px ${theme.primary}55` }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white transition-all shadow-[0_0_30px_var(--glow)]"
              style={{ background: theme.primary, "--glow": `${theme.primary}44` } as React.CSSProperties}
            >
              <Play className="size-4" />
              Escuchar ahora
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.05] px-8 py-3.5 text-sm font-medium text-white/70 backdrop-blur-xl transition-all hover:border-white/[0.3] hover:bg-white/[0.1] hover:text-white/90"
            >
              <Headphones className="size-4" />
              Ver trailer
            </motion.button>
          </div>

          <div className="flex items-center gap-3 pt-6">
            {[
              { icon: Music2, href: "#", label: "Spotify" },
              { icon: Video, href: "#", label: "YouTube" },
              { icon: Camera, href: "#", label: "Instagram" },
              { icon: Globe, href: "#", label: "TikTok" },
              { icon: Apple, href: "#", label: "Apple Podcasts" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] p-2.5 text-white/30 backdrop-blur-xl transition-all hover:border-white/[0.2] hover:bg-white/[0.1] hover:text-white/70"
                title={label}
              >
                <Icon className="size-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex justify-center">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="opacity-40">
          <ChevronDown className="size-5" />
        </motion.div>
      </div>
    </section>
  )
}
