"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Star, Dices, Share2, Clock, ChevronRight } from "lucide-react"
import { ZodiacWheel } from "@/components/horoscope/ZodiacWheel"
import { GalaxyBackground } from "@/components/horoscope/GalaxyBackground"
import { SIGNS } from "@/lib/horoscope/data"
import {
  type Horoscope,
  generateHoroscope,
  generateRandomDestiny,
  getTodayString,
} from "@/lib/horoscope/generator"

function StatItem({ label, value, icon }: { label: string; value: number; icon: string }) {
  const barColor =
    value > 75 ? "from-red-500 to-orange-500" :
    value > 50 ? "from-orange-500 to-yellow-500" :
    value > 25 ? "from-yellow-500 to-lime-500" :
    "from-green-500 to-emerald-500"

  return (
    <div className="group">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-white/50">
          <span>{icon}</span>
          {label}
        </span>
        <span className="font-bold text-white/70">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
        />
      </div>
    </div>
  )
}

function PredictionCard({ horoscope, onShare }: { horoscope: Horoscope; onShare: () => void }) {
  if (horoscope.isEasterEgg) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-lg"
      >
        <div className="glass-strong relative overflow-hidden rounded-3xl border border-yellow-500/20 p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-red-500/5" />
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-4 text-5xl"
          >
            {horoscope.easterEggEmoji}
          </motion.div>
          <h3 className="mb-3 text-xl font-bold text-yellow-300">{horoscope.easterEggTitle}</h3>
          <p className="text-lg leading-relaxed text-white/60">{horoscope.easterEggMessage}</p>
          <button
            onClick={onShare}
            className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-white/5 px-5 py-2 text-sm text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
          >
            <Share2 className="size-4" />
            Compartir este caos
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-2xl"
    >
      <div className="glass-strong relative overflow-hidden rounded-3xl border border-white/[0.08] p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-purple-500/[0.02] to-pink-500/[0.03]" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6 text-lg leading-relaxed text-white/80 md:text-xl"
        >
          {horoscope.prediction}
        </motion.p>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          <StatItem label="Nivel de Caos" value={horoscope.chaos} icon="🤣" />
          <StatItem label="Enamorarte" value={horoscope.loveProbability} icon="❤️" />
          <StatItem label="Gastar Plata" value={horoscope.moneyRisk} icon="💸" />
          <StatItem label="Necesidad de Café" value={horoscope.coffeeNeed} icon="☕" />
          <StatItem label="Vergüenza Pública" value={horoscope.publicShame} icon="🤡" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-2.5 border-t border-white/[0.06] pt-5 text-sm"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-3">
            <InfoRow icon="🍕" label="Comida" value={horoscope.food} />
            <InfoRow icon="🎨" label="Color" value={horoscope.color} />
            <InfoRow icon="🐸" label="Animal espiritual" value={horoscope.animal} />
            <InfoRow icon="📱" label="Mensaje" value={horoscope.message} />
            <InfoRow icon="🚨" label="Evita a" value={horoscope.personToAvoid} />
            <InfoRow icon="🎁" label="Objeto mágico" value={horoscope.magicObject} />
            <InfoRow icon="🎵" label="Canción" value={horoscope.song} className="col-span-2 md:col-span-3" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 p-4 text-center"
        >
          <p className="text-sm font-medium italic leading-relaxed text-white/60">
            ⭐ {horoscope.finalPhrase}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={onShare}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/50 to-purple-600/50 px-6 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:from-blue-600 hover:to-purple-600 hover:text-white hover:shadow-[0_0_30px_oklch(0.6_0.3_260/0.3)]"
          >
            <Share2 className="size-4" />
            Compartir mi destino
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

function InfoRow({ icon, label, value, className = "" }: { icon: string; label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <span className="text-white/30">{label}: </span>
        <span className="text-white/70">{value}</span>
      </div>
    </div>
  )
}

const ZODIAC_EMOJIS: Record<string, string> = {
  Aries: "\u2648", Tauro: "\u2649", G\u00e9minis: "\u264a", C\u00e1ncer: "\u264b",
  Leo: "\u264c", Virgo: "\u264d", Libra: "\u264e", Escorpio: "\u264f",
  Sagitario: "\u2650", Capricornio: "\u2651", Acuario: "\u2652", Piscis: "\u2653",
}

export function HoroscopePageClient() {
  const today = useMemo(() => getTodayString(), [])
  const [selectedSign, setSelectedSign] = useState<string | null>(null)
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null)
  const [randomNonce, setRandomNonce] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [wheelSelected, setWheelSelected] = useState<string | null>(null)
  const predictionsRef = useRef<HTMLDivElement>(null)

  const handleSelectSign = useCallback(
    (sign: string) => {
      setWheelSelected(sign)
      setSelectedSign(sign)
      setTimeout(() => {
        const h = generateHoroscope(sign as any, today, 0)
        setHoroscope(h)
        setTimeout(() => {
          predictionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 100)
      }, 800)
    },
    [today]
  )

  const handleRandomDestiny = useCallback(() => {
    const newNonce = randomNonce + 1 + Math.floor(Math.random() * 10000)
    setRandomNonce(newNonce)
    setWheelSelected(null)
    setSelectedSign("\u{1F3B2}")
    setTimeout(() => {
      const h = generateRandomDestiny(today, newNonce)
      setHoroscope(h)
      setTimeout(() => {
        predictionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }, 800)
  }, [today, randomNonce])

  const allHoroscopes = useMemo(() => {
    if (!showAll) return null
    return SIGNS.map((sign) => generateHoroscope(sign, today, 0))
  }, [showAll, today])

  return (
    <div className="relative min-h-screen pt-20">
      <GalaxyBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center"
        >
          <span className="inline-block rounded-full bg-purple-500/10 px-4 py-1 text-xs font-medium tracking-wider text-purple-300 backdrop-blur-sm">
            🔮 EL HORÓSCOPO DEL CAOS™
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-1 text-center text-4xl font-black tracking-tight md:text-6xl"
        >
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Tu destino
          </span>
          <br />
          <span className="text-white/90">en modo caos</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-6 max-w-lg text-center text-sm text-white/40"
        >
          <Clock className="mb-0.5 mr-1 inline-block size-3.5" />
          Cada d\u00eda un nuevo destino para cada signo. Sin repeticiones. Sin piedad.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <ZodiacWheel onSelect={handleSelectSign} selectedSign={wheelSelected} />
        </motion.div>

        <div className="mt-8 flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRandomDestiny}
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_oklch(0.6_0.3_320/0.2)] backdrop-blur-sm transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-[0_0_60px_oklch(0.6_0.3_320/0.4)]"
          >
            <Dices className="size-5 transition-transform duration-300 group-hover:rotate-12" />
            Dame otro destino
            <Sparkles className="size-4 text-yellow-300" />
          </motion.button>
        </div>

        <div ref={predictionsRef} className="mt-10">
          <AnimatePresence mode="wait">
            {horoscope && (
              <PredictionCard
                key={`${selectedSign}-${randomNonce}`}
                horoscope={horoscope}
                onShare={() => {
                  /* TODO */
                }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
          >
            <Star className="size-4" />
            {showAll ? "Ocultar todos los signos" : "Ver todos los signos"}
            <ChevronRight className={`size-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
          </motion.button>
        </div>

        <AnimatePresence>
          {showAll && allHoroscopes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4 overflow-hidden"
            >
              {allHoroscopes.map((h, i) => (
                <motion.div
                  key={h.sign}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl border border-white/[0.04] p-4"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-lg">{ZODIAC_EMOJIS[h.sign]}</span>
                    <span className="font-bold text-white/70">{h.sign}</span>
                    <span className="ml-auto text-xs text-white/30">Caos: {h.chaos}%</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/50">{h.prediction}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
