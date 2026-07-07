"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Settings, Save, Headphones, Sparkles, Image as ImageIcon, Zap, Trophy, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { getLevelForXP, getNextLevel, getXPProgress, BADGES, LEVELS } from "@/lib/community/gamification"
import Link from "next/link"

// ─────────────────────────────────────────────────────────
// XP Progress Bar
// ─────────────────────────────────────────────────────────
function XPBar({ xp }: { xp: number }) {
  const lvl = getLevelForXP(xp)
  const next = getNextLevel(xp)
  const progress = getXPProgress(xp)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{lvl.icon}</span>
          <div>
            <p className="font-black text-white">{lvl.title}</p>
            <p className="text-xs text-white/40">Nivel {lvl.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-white">{xp} <span className="text-xs font-normal text-white/40">XP</span></p>
          {next && <p className="text-[10px] text-white/30">Próximo: {next.xpRequired} XP</p>}
        </div>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress.percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${lvl.color}`}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-white/30">
        <span>{progress.current} XP en este nivel</span>
        <span>{progress.percent}% → {next?.title ?? "Máximo"}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Level Roadmap
// ─────────────────────────────────────────────────────────
function LevelRoadmap({ currentXP }: { currentXP: number }) {
  const currentLvl = getLevelForXP(currentXP)
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
        <Trophy className="size-4 text-amber-400" /> Progresión de Niveles
      </h3>
      <div className="space-y-2">
        {LEVELS.map((lvl) => {
          const unlocked = currentXP >= lvl.xpRequired
          const isCurrent = lvl.level === currentLvl.level
          return (
            <div
              key={lvl.level}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${isCurrent ? "border border-white/20 bg-white/[0.06]" : unlocked ? "opacity-70" : "opacity-25"}`}
            >
              <span className="text-xl">{lvl.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isCurrent ? "text-white" : "text-white/60"}`}>{lvl.title}</span>
                  {isCurrent && <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[9px] font-bold text-purple-300">ACTUAL</span>}
                </div>
                <p className="text-[10px] text-white/30">{lvl.xpRequired.toLocaleString()} XP requeridos</p>
              </div>
              <div className={`size-6 rounded-full flex items-center justify-center text-xs ${unlocked ? `bg-gradient-to-br ${lvl.color} text-white` : "bg-white/5 text-white/20"}`}>
                {unlocked ? "✓" : lvl.level}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Badges Panel
// ─────────────────────────────────────────────────────────
function BadgesPanel({ earnedIds }: { earnedIds: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
        <Star className="size-4 text-yellow-400" /> Badges
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {BADGES.map((badge) => {
          const earned = earnedIds.includes(badge.id)
          return (
            <div
              key={badge.id}
              title={badge.desc}
              className={`rounded-xl border p-3 text-center transition-all ${earned ? "border-white/15 bg-white/[0.04]" : "border-white/5 opacity-35 grayscale"}`}
            >
              <span className="mb-1 block text-2xl">{badge.icon}</span>
              <p className="text-[10px] font-bold text-white/70">{badge.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Profile Page
// ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [xp, setXP] = useState(0)
  const [badges, setBadges] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"edit" | "stats">("edit")

  // Profile state
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [favoritePodcast, setFavoritePodcast] = useState("")
  const [interests, setInterests] = useState("")

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setUserId(user.id)

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setUsername(data.username || "")
        setDisplayName(data.display_name || "")
        setBio(data.bio || "")
        setFavoritePodcast(data.favorite_podcast || "")
        setInterests((data.interests || []).join(", "))
        setXP(data.xp || 0)
        setBadges(data.badges || [])
      }
      setLoading(false)
    }
    loadProfile()
  }, [router, supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    const interestsArray = interests.split(",").map((i) => i.trim()).filter(Boolean)

    await supabase
      .from("profiles")
      .update({ display_name: displayName, bio, favorite_podcast: favoritePodcast, interests: interestsArray })
      .eq("id", userId)

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="size-8 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
      </div>
    )
  }

  const lvl = getLevelForXP(xp)

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-950/20 via-[#0a0a0a] to-blue-950/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/community" className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
          ← Volver a la Comunidad
        </Link>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-2xl"
        >
          <div className={`h-32 bg-gradient-to-r ${lvl.color} opacity-30`} />
          <div className="relative px-8 pb-8">
            <div className="flex items-end justify-between">
              <div className="-mt-12 flex items-end gap-4">
                <div className={`relative size-24 rounded-2xl bg-gradient-to-br ${lvl.color} flex items-center justify-center text-3xl font-black text-white shadow-xl ring-4 ring-[#0a0a0a]`}>
                  {(displayName || username)[0]?.toUpperCase()}
                  <button className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-1.5 shadow-lg hover:bg-blue-400 transition-colors">
                    <ImageIcon className="size-3.5 text-white" />
                  </button>
                </div>
                <div className="mb-1">
                  <h1 className="text-2xl font-black text-white">{displayName || username}</h1>
                  <p className="text-sm text-white/40">@{username}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${lvl.color} px-3 py-2 shadow-lg`}>
                <span className="text-xl">{lvl.icon}</span>
                <div>
                  <p className="text-xs font-black text-white">{lvl.title}</p>
                  <p className="text-[10px] text-white/70">Nivel {lvl.level}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-1">
          {(["edit", "stats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab === "edit" ? <><Settings className="size-4" /> Editar Perfil</> : <><Zap className="size-4" /> Progresión & Stats</>}
            </button>
          ))}
        </div>

        {activeTab === "edit" ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSave}
            className="space-y-5 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-2xl"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Username</label>
                <input value={username} disabled className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white/40" />
                <p className="text-[10px] text-white/25">No se puede cambiar.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Nombre a mostrar</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-blue-500/50 focus:bg-white/10"
                  placeholder="Tu nombre o apodo"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Biografía</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-purple-500/50 focus:bg-white/10"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50">
                <Headphones className="size-3.5" /> Podcast Favorito
              </label>
              <select
                value={favoritePodcast}
                onChange={(e) => setFavoritePodcast(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-pink-500/50 focus:bg-white/10"
              >
                <option value="" className="bg-[#111]">Selecciona tu favorito</option>
                <option value="detras-espejo" className="bg-[#111]">🪞 Detrás del Espejo</option>
                <option value="me-gusta" className="bg-[#111]">😂 Me gusta que te guste</option>
                <option value="general" className="bg-[#111]">🎙 General OMNES</option>
                <option value="otro" className="bg-[#111]">Otro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50">
                <Sparkles className="size-3.5" /> Intereses <span className="normal-case font-normal text-white/30">(separados por coma)</span>
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/10"
                placeholder="ej: música, tecnología, misterio, IA"
              />
              <p className="text-[10px] text-white/25">Usados para el algoritmo de afinidad en "Encuentra Personas".</p>
            </div>

            <div className="flex justify-end border-t border-white/10 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
                {!saving && <Save className="size-4" />}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <XPBar xp={xp} />
            <div className="grid gap-5 lg:grid-cols-2">
              <LevelRoadmap currentXP={xp} />
              <BadgesPanel earnedIds={badges} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
