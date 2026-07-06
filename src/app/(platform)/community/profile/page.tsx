"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Settings, Save, Headphones, Sparkles, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Profile state
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [favoritePodcast, setFavoritePodcast] = useState("")
  const [interests, setInterests] = useState<string>("") // comma separated for now
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }
      
      setUserId(user.id)

      const { data, error } = await supabase
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
      }
      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setSaving(true)
    const interestsArray = interests.split(",").map(i => i.trim()).filter(i => i)

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio,
        favorite_podcast: favoritePodcast,
        interests: interestsArray
      })
      .eq("id", userId)

    setSaving(false)
    if (!error) {
      alert("Perfil actualizado correctamente")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-950/20 via-[#0a0a0a] to-blue-950/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-2xl overflow-hidden"
        >
          {/* Header Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600/30 to-purple-600/30 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="relative size-24 rounded-full bg-[#111] border-4 border-[#0a0a0a] flex items-center justify-center shadow-xl">
                <User className="size-10 text-white/30" />
                <button className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-1.5 shadow-lg hover:bg-blue-400 transition-colors">
                  <ImageIcon className="size-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-8 pt-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Settings className="size-5 text-purple-400" />
                  Configurar Perfil
                </h1>
                <p className="text-sm text-white/50 mt-1">
                  Personaliza tu identidad en la Sala del Caos.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full rounded-xl border border-white/5 bg-white/5 py-2.5 px-4 text-sm text-white/40 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-white/30">El username no se puede cambiar.</p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Nombre a mostrar</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-blue-500/50 focus:bg-white/10"
                    placeholder="Tu nombre real o apodo"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Biografía</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-purple-500/50 focus:bg-white/10 resize-none"
                  placeholder="Cuéntanos un poco sobre ti..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                  <Headphones className="size-3.5" /> Podcast Favorito
                </label>
                <select
                  value={favoritePodcast}
                  onChange={(e) => setFavoritePodcast(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white outline-none transition-all focus:border-pink-500/50 focus:bg-white/10 appearance-none"
                >
                  <option value="" className="bg-[#111]">Selecciona tu favorito</option>
                  <option value="detras-espejo" className="bg-[#111]">Detrás del Espejo</option>
                  <option value="me-gusta" className="bg-[#111]">Me gusta que te guste</option>
                  <option value="otro" className="bg-[#111]">Otro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Intereses (separados por coma)
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/10"
                  placeholder="ej: música, tecnología, misterio"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
                {!saving && <Save className="size-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
