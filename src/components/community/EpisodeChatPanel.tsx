"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Clock, MessageSquare, Smile, Reply, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  fetchMessages,
  sendMessage,
  subscribeToMessages,
  type ChatMessage,
} from "@/lib/supabase/chat"
import type { RealtimeChannel } from "@supabase/supabase-js"
import Link from "next/link"

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function formatTs(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

function parseTimestamp(text: string): number | null {
  // Match patterns like [1:23] or [1:23:45]
  const match = text.match(/^\[(\d+):(\d{2})(?::(\d{2}))?\]/)
  if (!match) return null
  if (match[3]) return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3])
  return parseInt(match[1]) * 60 + parseInt(match[2])
}

/** Render message text, turning [mm:ss] tags into clickable badges */
function MessageText({
  content,
  onSeek,
}: {
  content: string
  onSeek: (seconds: number) => void
}) {
  // Split on timestamp patterns like [1:23] or [0:12:34]
  const parts = content.split(/(\[\d+:\d{2}(?::\d{2})?\])/g)
  return (
    <p className="break-words text-sm leading-relaxed text-white/75">
      {parts.map((part, i) => {
        const ts = parseTimestamp(part)
        if (ts !== null) {
          return (
            <button
              key={i}
              onClick={() => onSeek(ts)}
              className="mx-0.5 inline-flex items-center gap-1 rounded-md bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.5 text-[11px] font-bold text-blue-300 hover:bg-blue-500/35 transition-colors"
            >
              <Clock className="size-2.5" />
              {part.slice(1, -1)}
            </button>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </p>
  )
}

// ─────────────────────────────────────────────────────────
// Avatar helper
// ─────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-500",
]

function getAvatarGradient(userId: string) {
  const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────
interface EpisodeChatPanelProps {
  /** Supabase room_id for this episode's chat room. If null, show a "link to room" fallback. */
  roomId: string | null
  /** Current playback position in seconds (from the player). */
  currentTime?: number
  /** Called when user clicks a timestamp badge (to seek the player). */
  onSeek?: (seconds: number) => void
  /** Episode title for display */
  episodeTitle?: string
}

export function EpisodeChatPanel({
  roomId,
  currentTime = 0,
  onSeek,
  episodeTitle,
}: EpisodeChatPanelProps) {
  const [supabase] = useState(() => createClient())

  const [authed, setAuthed] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [tagTime, setTagTime] = useState(false) // whether to prepend current timestamp

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setAuthed(false); setLoading(false); return }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()

      setCurrentUser({ id: user.id, username: profile?.username || "Anónimo" })
      setAuthed(true)

      if (roomId) {
        const msgs = await fetchMessages(roomId, 80)
        setMessages(msgs)
        setLoading(false)
        setTimeout(scrollToBottom, 100)
      } else {
        setLoading(false)
      }
    }
    init()
  }, [roomId, supabase, scrollToBottom])

  // Realtime subscription
  useEffect(() => {
    if (!roomId || !currentUser) return

    const channel = subscribeToMessages(
      roomId,
      (msg) => {
        setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg])
        setTimeout(scrollToBottom, 50)
      },
      (msg) => setMessages((prev) => prev.map((m) => m.id === msg.id ? msg : m))
    )
    channelRef.current = channel
    return () => { channel.unsubscribe() }
  }, [roomId, currentUser, scrollToBottom])

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser || !roomId) return

    const prefix = tagTime ? `[${formatTs(Math.floor(currentTime))}] ` : ""
    const content = prefix + newMessage.trim()

    setNewMessage("")
    setReplyTo(null)
    setTagTime(false)

    await sendMessage(roomId, currentUser.id, content, replyTo?.id)
    inputRef.current?.focus()
  }

  // ─── Not authenticated ───
  if (authed === false) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <MessageSquare className="mx-auto mb-3 size-10 text-white/20" />
        <p className="font-bold text-white/50">Chat de Episodio</p>
        <p className="mt-1 text-sm text-white/30">Inicia sesión para ver y participar en la conversación.</p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  // ─── No room configured ───
  if (!roomId) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center">
        <Clock className="mx-auto mb-3 size-10 text-white/20" />
        <p className="text-sm text-white/30">El chat de este episodio estará disponible próximamente.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl" style={{ height: 500 }}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <MessageSquare className="size-4 text-purple-400" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Chat del Episodio</p>
          {episodeTitle && <p className="truncate text-[10px] text-white/30">{episodeTitle}</p>}
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold text-white/50">En vivo</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {loading && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-5 animate-spin text-white/20" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-2xl mb-2">🎙️</p>
              <p className="text-xs text-white/25">Sé el primero en comentar este episodio.</p>
              <p className="text-[10px] text-white/15 mt-1">Usa el botón <strong className="text-white/25">⏱</strong> para tagear un momento del audio.</p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.user_id === currentUser?.id
            const username = msg.profiles?.display_name || msg.profiles?.username || "Anónimo"
            const prevMsg = messages[i - 1]
            const showHeader = !prevMsg || prevMsg.user_id !== msg.user_id

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`group flex items-start gap-2.5 rounded-xl px-2 py-1 transition-colors hover:bg-white/[0.025] ${showHeader ? "mt-4" : "mt-0"}`}
              >
                <div className="w-7 shrink-0">
                  {showHeader && (
                    <div className={`size-7 rounded-full bg-gradient-to-br ${getAvatarGradient(msg.user_id)} flex items-center justify-center text-[10px] font-black text-white`}>
                      {username[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {showHeader && (
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${isMe ? "text-purple-300" : "text-white/80"}`}>{username}</span>
                      <span className="text-[9px] text-white/20">{formatTime(msg.created_at)}</span>
                    </div>
                  )}

                  {msg.reply_to_id && (
                    <div className="mb-1 flex items-center gap-1.5 rounded-lg border-l-2 border-purple-500/40 bg-purple-500/5 px-2 py-1 text-[10px] text-white/35 italic">
                      <Reply className="size-2.5 shrink-0" />
                      Respondiendo...
                    </div>
                  )}

                  {msg.is_deleted ? (
                    <p className="text-xs italic text-white/20">Mensaje eliminado</p>
                  ) : (
                    <MessageText
                      content={msg.content}
                      onSeek={(s) => onSeek?.(s)}
                    />
                  )}
                </div>

                {/* Actions on hover */}
                {!msg.is_deleted && (
                  <button
                    onClick={() => { setReplyTo(msg); inputRef.current?.focus() }}
                    className="mt-0.5 shrink-0 rounded p-1 text-white/0 group-hover:text-white/30 hover:!text-white/60 transition-colors"
                  >
                    <Reply className="size-3" />
                  </button>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Reply bar */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 border-t border-purple-500/20 bg-purple-500/5 px-4 py-2"
          >
            <Reply className="size-3.5 shrink-0 text-purple-400" />
            <p className="flex-1 truncate text-[10px] text-white/50">
              Respondiendo a <span className="font-bold text-purple-300">{replyTo.profiles?.display_name || replyTo.profiles?.username}</span>
            </p>
            <button onClick={() => setReplyTo(null)} className="text-white/30 hover:text-white/60">
              <X className="size-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="border-t border-white/10 px-3 py-2.5">
        {/* Timestamp tag toggle */}
        <AnimatePresence>
          {tagTime && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 flex items-center gap-2"
            >
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[11px] font-bold text-blue-300">
                <Clock className="size-2.5" />
                [{formatTs(Math.floor(currentTime))}]
              </span>
              <span className="text-[10px] text-white/30">Se añadirá al inicio del mensaje</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {/* Tag current time button */}
          <button
            onClick={() => setTagTime((v) => !v)}
            title="Tagear momento actual del audio"
            className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-bold transition-all ${
              tagTime
                ? "bg-blue-500/25 border border-blue-500/40 text-blue-300"
                : "bg-white/5 border border-white/10 text-white/30 hover:text-white/60 hover:bg-white/10"
            }`}
          >
            <Clock className="size-3" />
            ⏱
          </button>

          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 transition-all focus-within:border-purple-500/40">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Comenta sobre el episodio..."
              className="flex-1 bg-transparent text-xs text-white placeholder-white/25 outline-none"
            />
            <button className="text-white/20 hover:text-white/40">
              <Smile className="size-4" />
            </button>
          </div>

          <motion.button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            whileTap={{ scale: 0.9 }}
            className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
          >
            <Send className="size-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
