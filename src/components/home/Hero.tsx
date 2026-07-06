"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Play, TrendingUp, Sparkles, ChevronDown, Zap } from "lucide-react"
import { ParallaxSection } from "@/components/effects/ParallaxSection"
import { RevealSection } from "@/components/effects/RevealSection"

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 2, label: "Podcasts originales", suffix: "", color: "from-blue-400 to-cyan-300" },
  { value: 42, label: "Episodios publicados", suffix: "+", color: "from-purple-400 to-pink-300" },
  { value: 100, label: "Reproducciones totales", suffix: "K+", color: "from-pink-400 to-rose-300" },
  { value: 7, label: "Días nuevo contenido", suffix: "", color: "from-amber-400 to-orange-300" },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
      onUpdate: () => { el.textContent = Math.floor(obj.val) + suffix },
    })
  }, [target, suffix])
  return <span ref={ref}>0</span>
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
    tl.fromTo(".hero-title-line", { y: 200, opacity: 0, rotateX: 25 }, { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15 })
      .fromTo(ctaRef.current?.children || [], { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15 }, "-=0.4")
      .fromTo(statsRef.current?.children || [], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, "-=0.2")
  }, [])

  return (
    <section ref={containerRef} className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Hero image background */}
      <div className="absolute inset-0">
        <img src="/images/hero.jpeg" alt="" className="size-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-black/40 to-purple-950/40" />
      </div>
      <div className="absolute inset-0 opacity-30" style={{
        background: `
          radial-gradient(circle at 15% 20%, oklch(0.7 0.3 250 / 0.15) 0%, transparent 50%),
          radial-gradient(circle at 85% 30%, oklch(0.65 0.3 300 / 0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 80%, oklch(0.6 0.3 340 / 0.1) 0%, transparent 50%),
          radial-gradient(circle at 30% 70%, oklch(0.55 0.3 200 / 0.08) 0%, transparent 40%)
        `
      }} />

      {/* 3D Tilt glow orb que sigue al mouse */}
      <motion.div
        className="pointer-events-none absolute size-[700px] rounded-full blur-[250px]"
        style={{
          background: "radial-gradient(circle, oklch(0.7 0.3 250 / 0.12), oklch(0.65 0.3 320 / 0.08), transparent)",
        }}
        animate={{
          left: `${50 + mousePos.x * 15}%`,
          top: `${50 + mousePos.y * 15}%`,
          x: "-50%", y: "-50%",
        }}
        transition={{ type: "spring", stiffness: 30, damping: 20 }}
      />

      {/* Floating 3D cubes background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-16 rounded-2xl border border-white/50"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 30}%`,
              rotate: `${i * 15}deg`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [i * 15, i * 15 + 10, i * 15],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Colorful bars background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
        <div className="flex items-end gap-[3px]">
          {Array.from({ length: 80 }).map((_, i) => {
            const hue = 250 + i * 1.2
            return (
              <div
                key={i}
                className="waveform-bar w-[2px] rounded-full"
                style={{
                  height: `${15 + Math.random() * 85}px`,
                  background: `linear-gradient(to top, oklch(0.7 0.3 ${hue}), oklch(0.65 0.3 ${hue + 40}))`,
                  animationDelay: `${i * 0.04}s`,
                  animationDuration: `${0.8 + Math.random() * 0.6}s`,
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-xl shadow-[0_0_20px_oklch(0.7_0.3_250/0.1)]">
            <Zap className="size-3 text-blue-400" />
            Plataforma de contenido audiovisual
            <Sparkles className="size-3 text-purple-400" />
          </span>
        </motion.div>

        <div className="flex justify-center" style={{ perspective: "1000px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-[80px]" />
            <img
              src="/images/logo.png"
              alt="OMNES PODCAST"
              className="w-[400px] object-cover sm:w-[500px] md:w-[600px]"
              style={{ clipPath: "inset(15% 10% 15% 10%)" }}
            />
          </motion.div>
        </div>

        <div ref={ctaRef} className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href="#podcasts"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-sm font-medium text-white shadow-[0_0_30px_oklch(0.7_0.3_250/0.3)] transition-all hover:shadow-[0_0_50px_oklch(0.7_0.3_250/0.5)]"
          >
            <Play className="size-4" />
            Explorar Podcasts
          </motion.a>
          <motion.a
            href="#latest"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2.5 rounded-full border border-white/[0.15] bg-white/[0.05] px-8 py-3.5 text-sm font-medium text-white/70 backdrop-blur-xl transition-all hover:border-white/[0.3] hover:bg-white/[0.1] hover:text-white/90"
          >
            <TrendingUp className="size-4 text-pink-400" />
            Último Episodio
          </motion.a>
        </div>

        <div ref={statsRef} className="mx-auto mt-24 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map(({ value, label, suffix, color }) => (
            <div key={label} className="group text-center">
              <p className={`bg-gradient-to-r ${color} bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl`}>
                <AnimatedCounter target={value} suffix={suffix} />
              </p>
              <p className="mt-1.5 text-xs text-white/30 group-hover:text-white/50 transition-colors">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex justify-center">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="size-5 text-white/30" />
        </motion.div>
      </div>
    </section>
  )
}
