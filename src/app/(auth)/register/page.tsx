"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, User, UserPlus, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Primero verificamos que el username no esté en uso
    // En un entorno real se haría con una función RPC o backend seguro
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single()

    if (existingUser) {
      setError("El nombre de usuario ya está en uso.")
      setLoading(false)
      return
    }

    // Si no está en uso, creamos la cuenta en Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (data.user) {
        // Guardamos el perfil en la tabla profiles
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              username,
              display_name: username,
            }
          ])
          
        if (profileError) {
          console.error(profileError)
          // No es ideal detener el flujo si el insert falla pero la cuenta se creó
        }
      }
      setSuccess(true)
      setLoading(false)
      
      // Auto redireccionar luego de 2 segundos
      setTimeout(() => {
        router.push("/community")
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-[#0a0a0a] to-blue-950/20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        <div className="absolute -left-10 -top-10 size-40 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 text-center mb-8">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
            <Sparkles className="size-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Únete a la Comunidad</h1>
          <p className="text-sm text-white/50">Crea tu cuenta para participar en los debates.</p>
        </div>

        {error && (
          <div className="relative z-10 mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="relative z-10 mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-400">
            ¡Cuenta creada con éxito! Entrando a la sala...
          </div>
        )}

        <form onSubmit={handleRegister} className="relative z-10 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Nombre de Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                required
                maxLength={20}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-purple-500/50 focus:bg-white/10"
                placeholder="usuario_cool"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-purple-500/50 focus:bg-white/10"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-blue-500/50 focus:bg-white/10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/25 disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Crear mi cuenta"}
            {!loading && <UserPlus className="size-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="relative z-10 mt-8 text-center text-sm text-white/50">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-bold text-purple-400 hover:text-purple-300">
            Inicia sesión
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
