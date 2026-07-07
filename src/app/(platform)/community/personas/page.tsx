"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Heart, Zap, Star, Search, MessageSquare, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { getLevelForXP, BADGES } from "@/lib/community/gamification"
import Link from "next/link"

interface PeerProfile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  interests: string[]
  favorite_podcast: string | null
  xp: number
  level: number
  badges: string[]
}

const AVATAR_GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-500",
  "from-indigo-500 to-violet-500",
]

function getAvatarGradient(userId: string) {
  const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

/** Score affinity between current user's interests and a peer's interests */
function affinityScore(myInterests: string[], theirInterests: string[], myPodcast: string | null, theirPodcast: string | null): number {
  let score = 0
  const mySet = new Set(myInterests.map((i) => i.toLowerCase().trim()))
  for (const interest of theirInterests) {
    if (mySet.has(interest.toLowerCase().trim())) score += 20
  }
  if (myPodcast && theirPodcast && myPodcast === theirPodcast) score += 30
  return Math.min(score, 100)
}

function AffinityBadge({ score }: { score: number }) {
  const color =
    score >= 70 ? "from-emerald-500 to-teal-400" :
    score >= 40 ? "from-blue-500 to-cyan-400" :
    "from-slate-500 to-zinc-400"
  const label = score >= 70 ? "Alta afinidad" : score >= 40 ? "Compatible" : "Diferente"

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${color} px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm`}>
      <Heart className="size-2.5" />
      {score}% · {label}
    </span>
  )
}

interface ProfileCardProps {
  peer: PeerProfile
  affinityPct: number
  onClose?: () => void
}
function ProfileCard({ peer, affinityPct, onClose }: ProfileCardProps) {
  const lvl = getLevelForXP(peer.xp)
  const name = peer.display_name || peer.username
  const earnedBadges = BADGES.filter((b) => peer.badges?.includes(b.id))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      className="relative rounded-3xl border border-white/10 bg-[#101010] shadow-2xl overflow-hidden"
    >
      {/* Cover gradient */}
      <div className={`h-24 bg-gradient-to-r ${getAvatarGradient(peer.id)} opacity-30`} />

      {onClose && (
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-black/50 p-1.5 text-white/40 hover:text-white transition-colors">
          <X className="size-4" />
        </button>
      )}

      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className={`-mt-10 mb-3 size-20 rounded-2xl bg-gradient-to-br ${getAvatarGradient(peer.id)} flex items-center justify-center text-2xl font-black text-white shadow-lg ring-4 ring-[#101010]`}>
          {name[0]?.toUpperCase()}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white">{name}</h3>
            <p className="text-xs text-white/40">@{peer.username}</p>
          </div>
          <span className={`flex items-center gap-1.5 rounded-xl bg-gradient-to-r ${lvl.color} px-2.5 py-1 text-xs font-bold text-white`}>
            <span>{lvl.icon}</span> Nv.{peer.level}
          </span>
        </div>

        <AffinityBadge score={affinityPct} />

        {peer.bio && (
          <p className="mt-3 text-sm leading-relaxed text-white/50 line-clamp-2">{peer.bio}</p>
        )}

        {/* Interests */}
        {peer.interests?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {peer.interests.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/60">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <div className="mt-3 flex gap-1.5">
            {earnedBadges.map((b) => (
              <span key={b.id} title={b.desc} className="text-lg">{b.icon}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            href="/community"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
          >
            <MessageSquare className="size-4" />
            Hablar en chat
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────
export default function FindPeoplePage() {
  const router = useRouter()
  const supabase = createClient()

  const [me, setMe] = useState<PeerProfile | null>(null)
  const [peers, setPeers] = useState<PeerProfile[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PeerProfile | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const { data: myProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (myProfile) setMe(myProfile as PeerProfile)

      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio, interests, favorite_podcast, xp, level, badges")
        .neq("id", user.id)
        .limit(50)

      if (allProfiles) setPeers(allProfiles as PeerProfile[])
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const filtered = peers
    .filter((p) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        p.username.toLowerCase().includes(q) ||
        (p.display_name?.toLowerCase().includes(q)) ||
        p.interests?.some((i) => i.toLowerCase().includes(q))
      )
    })
    .map((p) => ({
      peer: p,
      affinity: affinityScore(me?.interests || [], p.interests || [], me?.favorite_podcast || null, p.favorite_podcast || null),
    }))
    .sort((a, b) => b.affinity - a.affinity)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="size-8 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-950/15 via-[#0a0a0a] to-indigo-950/15" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/community" className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            ← Volver a la Comunidad
          </Link>
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-pink-300 uppercase">
                <Heart className="size-3.5" /> Encuentra Personas
              </span>
              <h1 className="mt-4 text-4xl font-black text-white">
                Tu Tribu<span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">.</span>
              </h1>
              <p className="mt-2 text-sm text-white/40">
                Personas con intereses similares, ordenadas por afinidad contigo.
              </p>
            </div>
            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex">
              <Users className="size-5 text-purple-400" />
              <div>
                <p className="text-2xl font-black text-white">{peers.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">En la comunidad</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 backdrop-blur-xl transition-all focus-within:border-purple-500/40 focus-within:bg-white/[0.05]">
          <Search className="size-4 shrink-0 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, username o interés..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/60">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Stats bar */}
        {me && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-amber-400" />
              <span className="text-xs font-bold text-white/50">Tu perfil:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(me.interests || []).map((tag) => (
                <span key={tag} className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                  {tag}
                </span>
              ))}
              {!me.interests?.length && (
                <Link href="/community/profile" className="text-xs text-white/30 hover:text-purple-400 underline underline-offset-2 transition-colors">
                  Añade intereses a tu perfil para ver afinidades reales →
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white/30 font-medium">No se encontraron personas con ese criterio.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ peer, affinity }, i) => {
              const lvl = getLevelForXP(peer.xp)
              const name = peer.display_name || peer.username
              return (
                <motion.div
                  key={peer.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(peer)}
                  className="group cursor-pointer rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.05] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-start gap-4">
                    <div className={`size-12 shrink-0 rounded-xl bg-gradient-to-br ${getAvatarGradient(peer.id)} flex items-center justify-center text-lg font-black text-white shadow-lg`}>
                      {name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white truncate">{name}</span>
                        <span className={`shrink-0 flex items-center gap-1 rounded-lg bg-gradient-to-r ${lvl.color} px-1.5 py-0.5 text-[9px] font-bold text-white`}>
                          {lvl.icon} {peer.level}
                        </span>
                      </div>
                      <p className="text-xs text-white/30 truncate">@{peer.username}</p>
                    </div>
                  </div>

                  <AffinityBadge score={affinity} />

                  {peer.bio && (
                    <p className="mt-2.5 text-xs leading-relaxed text-white/40 line-clamp-2">{peer.bio}</p>
                  )}

                  {peer.interests?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {peer.interests.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-white/20 group-hover:text-white/40 transition-colors">
                    <Star className="size-3" /> Ver perfil completo
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Profile detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
              <ProfileCard
                peer={selected}
                affinityPct={affinityScore(me?.interests || [], selected.interests || [], me?.favorite_podcast || null, selected.favorite_podcast || null)}
                onClose={() => setSelected(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
