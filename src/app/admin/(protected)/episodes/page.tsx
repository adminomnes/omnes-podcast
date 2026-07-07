"use client"

import { useEffect, useState } from "react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { Plus, Pencil, Trash2, X, Check, Eye } from "lucide-react"
import { formatDuration, formatViews } from "@/lib/utils"

interface Episode {
  id: string
  title: string
  description: string
  audio_url: string
  video_url: string
  duration: number
  thumbnail: string
  tags: string[]
  category: string
  published_at: string
  views: number
  likes: number
  podcast_id: string
  season_id: string
  podcasts?: { title: string; slug: string }
}

interface Podcast {
  id: string
  title: string
  slug: string
}

type FormData = {
  title: string
  podcast_id: string
  description: string
  audio_url: string
  video_url: string
  duration: number
  thumbnail: string
  tags: string
  category: string
}

const emptyForm: FormData = {
  title: "",
  podcast_id: "",
  description: "",
  audio_url: "",
  video_url: "",
  duration: 0,
  thumbnail: "",
  tags: "",
  category: "",
}

export default function AdminEpisodes() {
  const [items, setItems] = useState<Episode[]>([])
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Episode | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const fetchItems = async () => {
    const [epRes, podRes] = await Promise.all([
      fetch("/api/admin/episodes"),
      fetch("/api/admin/podcasts"),
    ])
    setItems(await epRes.json())
    setPodcasts(await podRes.json())
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const save = async () => {
    const body = {
      ...form,
      tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()) : [],
    }
    if (editing) {
      await fetch("/api/admin/episodes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...body }),
      })
    } else {
      await fetch("/api/admin/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    }
    setShowForm(false); setEditing(null); setForm(emptyForm)
    fetchItems()
  }

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este episodio?")) return
    await fetch("/api/admin/episodes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchItems()
  }

  const edit = (item: Episode) => {
    setForm({
      title: item.title,
      podcast_id: item.podcast_id,
      description: item.description,
      audio_url: item.audio_url,
      video_url: item.video_url || "",
      duration: item.duration,
      thumbnail: item.thumbnail,
      tags: item.tags?.join(", ") || "",
      category: item.category,
    })
    setEditing(item); setShowForm(true)
  }

  return (
    <AnimatedSection>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Episodios</h1>
          <p className="mt-1 text-sm text-white/40">Gestiona los episodios de todos los podcasts</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
          <Plus className="size-4" /> Nuevo Episodio
        </button>
      </div>

      {showForm && (
        <GlassPanel className="mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white/70">{editing ? "Editar episodio" : "Nuevo episodio"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-white/40 hover:text-white/70">
              <X className="size-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-white/40">Título</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Podcast</label>
              <select value={form.podcast_id} onChange={(e) => setForm({ ...form, podcast_id: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400">
                <option value="">Seleccionar...</option>
                {podcasts.map((p) => (
                  <option key={p.id} value={p.id} className="bg-black">{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Categoría</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Duración (segundos)</label>
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Thumbnail URL</label>
              <input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Audio URL</label>
              <input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Video URL</label>
              <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-white/40">Tags (separados por coma)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-white/40">Descripción</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => { setShowForm(false); setEditing(null) }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5">Cancelar</button>
            <button onClick={save} disabled={!form.title.trim() || !form.podcast_id}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50">
              <Check className="size-4" /> {editing ? "Guardar" : "Crear"}
            </button>
          </div>
        </GlassPanel>
      )}

      {loading ? (
        <p className="text-sm text-white/40">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-white/40">No hay episodios aún.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <GlassPanel key={item.id} className="flex items-center gap-4 p-4">
              <div className="size-14 shrink-0 rounded-lg bg-white/[0.05]" />
              <div className="flex-1 min-w-0">
                <h3 className="truncate text-sm font-medium text-white/80">{item.title}</h3>
                <p className="text-xs text-white/40">{item.podcasts?.title || "—"} · {formatDuration(item.duration)}</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-white/30">
                <Eye className="size-3" /> {formatViews(item.views || 0)}
              </span>
              <button onClick={() => edit(item)} className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white/70">
                <Pencil className="size-4" />
              </button>
              <button onClick={() => remove(item.id)} className="rounded-lg p-2 text-white/40 transition hover:bg-red-400/10 hover:text-red-400">
                <Trash2 className="size-4" />
              </button>
            </GlassPanel>
          ))}
        </div>
      )}
    </AnimatedSection>
  )
}
