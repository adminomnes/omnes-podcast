"use client"

import { useEffect, useState } from "react"
import { GlassPanel } from "@/components/shared/GlassPanel"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"

interface Room {
  id: string
  name: string
  description: string
  type: "permanent" | "temporary" | "episode" | "live"
  is_active: boolean
  created_at: string
}

type RoomForm = { name: string; description: string; type: Room["type"]; is_active: boolean }

const emptyForm: RoomForm = { name: "", description: "", type: "permanent", is_active: true }

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Room | null>(null)
  const [form, setForm] = useState<RoomForm>(emptyForm)

  const fetchRooms = async () => {
    const res = await fetch("/api/admin/rooms")
    const data = await res.json()
    setRooms(data)
    setLoading(false)
  }

  useEffect(() => { fetchRooms() }, [])

  const save = async () => {
    if (editing) {
      await fetch("/api/admin/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...form }),
      })
    } else {
      await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
    fetchRooms()
  }

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta sala?")) return
    await fetch("/api/admin/rooms", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchRooms()
  }

  const edit = (room: Room) => {
    setForm({ name: room.name, description: room.description, type: room.type, is_active: room.is_active })
    setEditing(room)
    setShowForm(true)
  }

  const toggle = async (id: string, is_active: boolean) => {
    await fetch("/api/admin/rooms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active }),
    })
    fetchRooms()
  }

  return (
    <AnimatedSection>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Salas de Chat</h1>
          <p className="mt-1 text-sm text-white/40">Gestiona los temas de las salas de la comunidad</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          <Plus className="size-4" /> Nueva Sala
        </button>
      </div>

      {showForm && (
        <GlassPanel className="mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-white/70">{editing ? "Editar sala" : "Nueva sala"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-white/40 hover:text-white/70">
              <X className="size-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-white/40">Nombre</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Room["type"] })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
              >
                <option value="permanent">Permanente</option>
                <option value="temporary">Temporal</option>
                <option value="episode">Episodio</option>
                <option value="live">En vivo</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-white/40">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded border-white/20 bg-white/10"
              />
              Activa
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={!form.name.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              <Check className="size-4" /> {editing ? "Guardar" : "Crear"}
            </button>
          </div>
        </GlassPanel>
      )}

      {loading ? (
        <p className="text-sm text-white/40">Cargando...</p>
      ) : rooms.length === 0 ? (
        <p className="text-sm text-white/40">No hay salas aún.</p>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <GlassPanel key={room.id} className="flex items-center justify-between p-5">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`size-2 rounded-full ${room.is_active ? "bg-green-400" : "bg-red-400"}`} />
                  <span className="font-medium text-white/80">{room.name}</span>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-white/30">{room.type}</span>
                </div>
                {room.description && (
                  <p className="mt-1 text-sm text-white/40">{room.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(room.id, !room.is_active)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                    room.is_active
                      ? "border-green-400/30 text-green-400 hover:bg-green-400/10"
                      : "border-red-400/30 text-red-400 hover:bg-red-400/10"
                  }`}
                >
                  {room.is_active ? "Activa" : "Inactiva"}
                </button>
                <button onClick={() => edit(room)} className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white/70">
                  <Pencil className="size-4" />
                </button>
                <button onClick={() => remove(room.id)} className="rounded-lg p-2 text-white/40 transition hover:bg-red-400/10 hover:text-red-400">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </AnimatedSection>
  )
}
