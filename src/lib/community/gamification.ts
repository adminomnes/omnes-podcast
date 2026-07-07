// Gamification utilities for the Sala del Caos
// XP thresholds, level calculation, badge logic

export const XP_PER_MESSAGE = 5
export const XP_PER_REACTION_RECEIVED = 2
export const XP_PER_REPLY = 3

export const LEVELS = [
  { level: 1, xpRequired: 0,    title: "Novato",        color: "from-slate-500 to-zinc-500",   glow: "shadow-slate-500/30",   icon: "🌱" },
  { level: 2, xpRequired: 100,  title: "Curioso",       color: "from-blue-500 to-cyan-500",    glow: "shadow-blue-500/30",    icon: "👀" },
  { level: 3, xpRequired: 300,  title: "Activo",        color: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/30", icon: "⚡" },
  { level: 4, xpRequired: 700,  title: "Influyente",    color: "from-purple-500 to-pink-500",  glow: "shadow-purple-500/30",  icon: "🔥" },
  { level: 5, xpRequired: 1500, title: "Élite",         color: "from-amber-500 to-orange-500", glow: "shadow-amber-500/30",   icon: "👑" },
  { level: 6, xpRequired: 3000, title: "Leyenda",       color: "from-rose-500 to-red-500",     glow: "shadow-rose-500/30",    icon: "💎" },
  { level: 7, xpRequired: 6000, title: "Omnipresente",  color: "from-fuchsia-500 to-purple-600", glow: "shadow-fuchsia-500/30", icon: "🌌" },
]

export const BADGES = [
  { id: "first_message",  label: "Primer Mensaje",   icon: "💬", desc: "Enviaste tu primer mensaje en la comunidad." },
  { id: "week_streak",    label: "Racha de 7 días",  icon: "🔥", desc: "Participaste 7 días seguidos." },
  { id: "popular",        label: "Popular",          icon: "⭐", desc: "Recibiste 50 reacciones en total." },
  { id: "early_adopter", label: "Early Adopter",    icon: "🚀", desc: "Te uniste durante el primer mes." },
  { id: "reply_master",  label: "Maestro del Reply", icon: "↩️", desc: "Respondiste 100 mensajes." },
  { id: "omnes_fan",     label: "Fan de OMNES",      icon: "🎙️", desc: "Completaste tu perfil con podcast favorito." },
]

export function getLevelForXP(xp: number) {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl
    else break
  }
  return current
}

export function getNextLevel(xp: number) {
  const currentLevel = getLevelForXP(xp)
  return LEVELS.find((l) => l.level === currentLevel.level + 1) || null
}

export function getXPProgress(xp: number): { current: number; needed: number; percent: number } {
  const current = getLevelForXP(xp)
  const next = getNextLevel(xp)
  if (!next) return { current: xp, needed: xp, percent: 100 }
  const xpInLevel = xp - current.xpRequired
  const xpNeeded = next.xpRequired - current.xpRequired
  return {
    current: xpInLevel,
    needed: xpNeeded,
    percent: Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)),
  }
}

/** Add XP to a user's profile via supabase RPC or direct update */
export async function awardXP(supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>, userId: string, xpAmount: number) {
  const { data } = await supabase
    .from("profiles")
    .select("xp, level")
    .eq("id", userId)
    .single()

  if (!data) return

  const newXP = (data.xp || 0) + xpAmount
  const newLevel = getLevelForXP(newXP).level

  await supabase
    .from("profiles")
    .update({ xp: newXP, level: newLevel })
    .eq("id", userId)

  return { newXP, newLevel, leveledUp: newLevel > (data.level || 1) }
}
