"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, ArrowLeft, Users, Hash, Smile, Reply, Trash2, Flag, X, Plus } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  fetchMessages,
  sendMessage,
  deleteMessage,
  subscribeToMessages,
  subscribeToPresence,
  setTypingStatus,
  fetchReactions,
  toggleReaction,
  groupReactions,
  fetchGuestMessages,
  type ChatMessage,
  type PresenceState,
  type ReactionSummary,
} from "@/lib/supabase/chat"
import type { RealtimeChannel } from "@supabase/supabase-js"

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-500",
  "from-indigo-500 to-violet-500",
]

const QUICK_EMOJIS = ["❤️", "😂", "🔥", "👏", "😮", "🎙️"]

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function getAvatarGradient(userId: string) {
  const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
}

// ─────────────────────────────────────────────────────────
// Emoji Picker (quick)
// ─────────────────────────────────────────────────────────
interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}
function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 6 }}
      className="absolute bottom-8 right-0 z-50 flex gap-1 rounded-2xl border border-white/10 bg-[#141414] p-2 shadow-2xl backdrop-blur-xl"
    >
      {QUICK_EMOJIS.map((e) => (
        <button
          key={e}
          onClick={() => { onSelect(e); onClose() }}
          className="flex size-9 items-center justify-center rounded-xl text-xl transition-all hover:scale-125 hover:bg-white/10"
        >
          {e}
        </button>
      ))}
      <button onClick={onClose} className="flex size-9 items-center justify-center rounded-xl text-white/30 transition-all hover:bg-white/10 hover:text-white/60">
        <X className="size-3.5" />
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
// Reaction Bar
// ─────────────────────────────────────────────────────────
interface ReactionBarProps {
  reactions: ReactionSummary[]
  onToggle: (emoji: string) => void
}
function ReactionBar({ reactions, onToggle }: ReactionBarProps) {
  if (reactions.length === 0) return null
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => onToggle(r.emoji)}
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold transition-all hover:scale-105 ${
            r.reacted
              ? "border-purple-500/50 bg-purple-500/20 text-purple-200"
              : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
          }`}
        >
          <span>{r.emoji}</span>
          <span>{r.count}</span>
        </button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Context Menu (per message)
// ─────────────────────────────────────────────────────────
interface ContextMenuProps {
  isMe: boolean
  onReply: () => void
  onEmojiPick: () => void
  onDelete?: () => void
  onReport: () => void
}
function MessageActions({ isMe, onReply, onEmojiPick, onDelete, onReport }: ContextMenuProps) {
  return (
    <div className="absolute -top-3 right-3 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-[#1a1a1a] px-2 py-1 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200">
      <button onClick={onReply} title="Responder" className="p-1 text-white/40 hover:text-white/80 transition-colors">
        <Reply className="size-3.5" />
      </button>
      <button onClick={onEmojiPick} title="Reaccionar" className="p-1 text-white/40 hover:text-white/80 transition-colors">
        <Smile className="size-3.5" />
      </button>
      {isMe && onDelete && (
        <button onClick={onDelete} title="Eliminar" className="p-1 text-rose-400/60 hover:text-rose-400 transition-colors">
          <Trash2 className="size-3.5" />
        </button>
      )}
      {!isMe && (
        <button onClick={onReport} title="Reportar" className="p-1 text-white/30 hover:text-amber-400 transition-colors">
          <Flag className="size-3.5" />
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────
export default function ChatRoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params?.id as string
  const [supabase] = useState(() => createClient())

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [reactions, setReactions] = useState<Record<string, ReactionSummary[]>>({}) // messageId → summaries
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; avatar_url: string | null } | null>(null)
  const [roomName, setRoomName] = useState("Cargando...")
  const [roomDescription, setRoomDescription] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [activeEmojiMsg, setActiveEmojiMsg] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageChannelRef = useRef<RealtimeChannel | null>(null)
  const presenceChannelRef = useRef<RealtimeChannel | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Load reactions for a set of messages
  const loadReactions = useCallback(async (msgs: ChatMessage[], userId: string) => {
    const ids = msgs.map((m) => m.id)
    const raw = await fetchReactions(ids)
    const grouped: Record<string, ReactionSummary[]> = {}
    for (const id of ids) {
      grouped[id] = groupReactions(raw.filter((r) => r.message_id === id), userId)
    }
    setReactions(grouped)
  }, [])

  // Init
  useEffect(() => {
    let cancelled = false
    async function init() {
      if (!roomId) return

      const { data: { user } } = await supabase.auth.getUser()
      let cu = null
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single()
        if (profile) cu = { id: user.id, username: profile.username, avatar_url: profile.avatar_url }
      } else {
        const guestId = `guest_${Math.random().toString(36).slice(2, 10)}`
        const names = ["Pixel", "Nebula", "Eco", "Luna", "Kaos", "Rayo", "Sombra", "Fénix", "Vórtice", "Nova"]
        cu = { id: guestId, username: `Invitado_${names[Math.floor(Math.random() * names.length)]}`, avatar_url: null }
      }
      if (cancelled) return
      if (!cu) return
      setCurrentUser(cu)

      const { data: room } = await supabase
        .from("rooms")
        .select("name, description")
        .eq("id", roomId)
        .single()

      if (cancelled) return
      if (room) { setRoomName(room.name); setRoomDescription(room.description || "") }

      const [msgs, guestMsgs] = await Promise.all([
        fetchMessages(roomId),
        fetchGuestMessages(roomId),
      ])
      if (cancelled) return
      const all = [...msgs, ...guestMsgs].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      setMessages(all)
      await loadReactions(all, cu.id)
      setLoading(false)
      setTimeout(scrollToBottom, 100)
    }
    init()
    return () => { cancelled = true }
  }, [roomId, supabase, scrollToBottom, loadReactions])

  // Realtime subscriptions
  useEffect(() => {
    if (!currentUser) return

    const msgChannel = subscribeToMessages(
      roomId,
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev
          const updated = [...prev, newMsg]
          loadReactions(updated, currentUser.id)
          return updated
        })
        setTimeout(scrollToBottom, 50)
      },
      (updatedMsg) => {
        setMessages((prev) => prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m)))
      }
    )
    messageChannelRef.current = msgChannel

    const presChannel = subscribeToPresence(
      roomId,
      { user_id: currentUser.id, username: currentUser.username, avatar_url: currentUser.avatar_url },
      (users) => {
        setOnlineUsers(users)
        setTypingUsers(users.filter((u) => u.is_typing && u.user_id !== currentUser.id).map((u) => u.username))
      }
    )
    presenceChannelRef.current = presChannel

    return () => { msgChannel.unsubscribe(); presChannel.unsubscribe() }
  }, [currentUser, roomId, scrollToBottom, loadReactions])

  // Typing
  const handleTyping = () => {
    if (!presenceChannelRef.current || !currentUser) return
    setTypingStatus(presenceChannelRef.current, { user_id: currentUser.id, username: currentUser.username, avatar_url: currentUser.avatar_url, online_at: new Date().toISOString(), is_typing: true }, true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      if (!presenceChannelRef.current || !currentUser) return
      setTypingStatus(presenceChannelRef.current, { user_id: currentUser.id, username: currentUser.username, avatar_url: currentUser.avatar_url, online_at: new Date().toISOString(), is_typing: false }, false)
    }, 2000)
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser) return
    const content = newMessage.trim()
    setNewMessage("")
    setReplyTo(null)
    if (presenceChannelRef.current) {
      setTypingStatus(presenceChannelRef.current, { user_id: currentUser.id, username: currentUser.username, avatar_url: currentUser.avatar_url, online_at: new Date().toISOString(), is_typing: false }, false)
    }
    const sent = await sendMessage(roomId, currentUser.id, content, replyTo?.id, currentUser.username)
    if (sent) {
      setMessages((prev) => [...prev, sent].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()))
      setTimeout(scrollToBottom, 50)
    }
    inputRef.current?.focus()
  }

  const handleDelete = async (msgId: string) => {
    await deleteMessage(msgId)
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, is_deleted: true, content: "" } : m))
  }

  const handleToggleReaction = async (msgId: string, emoji: string) => {
    if (!currentUser) return
    await toggleReaction(msgId, currentUser.id, emoji)
    // Optimistic update
    setReactions((prev) => {
      const existing = prev[msgId] || []
      const emojiEntry = existing.find((r) => r.emoji === emoji)
      let updated: ReactionSummary[]
      if (emojiEntry) {
        updated = existing
          .map((r) => r.emoji === emoji
            ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
            : r
          )
          .filter((r) => r.count > 0)
      } else {
        updated = [...existing, { emoji, count: 1, reacted: true }]
      }
      return { ...prev, [msgId]: updated }
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
          <p className="text-sm font-medium text-white/30">Cargando sala...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0a]">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/10 via-[#0a0a0a] to-purple-950/10" />
      </div>

      {/* ── Header ── */}
      <header className="relative z-20 flex items-center gap-4 border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur-2xl">
        <Link href="/community" className="rounded-xl p-2 text-white/40 transition-all hover:bg-white/5 hover:text-white">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="flex items-center gap-2 truncate text-base font-bold text-white">
            <Hash className="size-4 shrink-0 text-purple-400" />
            {roomName}
          </h1>
          <p className="truncate text-xs text-white/40">{roomDescription}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <Users className="size-3.5 text-white/50" />
          <span className="text-xs font-bold text-white/70">{onlineUsers.length}</span>
        </div>
      </header>

      {/* ── Messages Area ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-0.5" onClick={() => setActiveEmojiMsg(null)}>
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-3 text-5xl">💬</div>
              <p className="text-lg font-bold text-white/20">¡Sé el primero en escribir!</p>
              <p className="mt-1 text-sm text-white/10">Empieza la conversación en esta sala.</p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.user_id === currentUser?.id
            const username = msg.profiles?.display_name || msg.profiles?.username || "Anónimo"
            const prevMsg = messages[i - 1]
            const showHeader = !prevMsg || prevMsg.user_id !== msg.user_id
            const msgReactions = reactions[msg.id] || []

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`group relative flex items-start gap-3 rounded-xl px-3 py-1.5 transition-colors hover:bg-white/[0.025] ${showHeader ? "mt-5" : "mt-0"}`}
              >
                {/* Avatar Column */}
                <div className="w-9 shrink-0">
                  {showHeader ? (
                    <div className={`size-9 rounded-full bg-gradient-to-br ${getAvatarGradient(msg.user_id)} flex items-center justify-center text-sm font-black text-white shadow-lg ring-1 ring-white/10`}>
                      {username[0]?.toUpperCase()}
                    </div>
                  ) : (
                    <span className="block text-right text-[9px] text-white/15 opacity-0 group-hover:opacity-100 transition-opacity select-none pr-0.5">
                      {formatTime(msg.created_at)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {showHeader && (
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className={`text-sm font-bold ${isMe ? "text-purple-300" : "text-white/85"}`}>
                        {username}
                      </span>
                      {msg.profiles?.level && msg.profiles.level > 1 && (
                        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-white/40">
                          Nv.{msg.profiles.level}
                        </span>
                      )}
                      <span className="text-[10px] text-white/20">{formatTime(msg.created_at)}</span>
                    </div>
                  )}

                  {/* Reply reference */}
                  {msg.reply_to_id && (
                    <div className="mb-1.5 flex items-center gap-2 rounded-lg border-l-2 border-purple-500/40 bg-purple-500/5 px-3 py-1.5 text-xs text-white/40 italic">
                      <Reply className="size-3 shrink-0 text-purple-400/60" />
                      Respondiendo a un mensaje...
                    </div>
                  )}

                  {/* Message text */}
                  <p className="break-words text-sm leading-relaxed text-white/75">
                    {msg.is_deleted ? (
                      <span className="italic text-white/20">Mensaje eliminado</span>
                    ) : (
                      msg.content
                    )}
                  </p>
                  {msg.is_edited && !msg.is_deleted && (
                    <span className="text-[9px] text-white/15"> (editado)</span>
                  )}

                  {/* Reactions */}
                  <ReactionBar
                    reactions={msgReactions}
                    onToggle={(emoji) => handleToggleReaction(msg.id, emoji)}
                  />
                </div>

                {/* Hover action bar */}
                {!msg.is_deleted && (
                  <div className="relative shrink-0">
                    <MessageActions
                      isMe={isMe}
                      onReply={() => { setReplyTo(msg); inputRef.current?.focus() }}
                      onEmojiPick={() => setActiveEmojiMsg((prev) => prev === msg.id ? null : msg.id)}
                      onDelete={isMe ? () => handleDelete(msg.id) : undefined}
                      onReport={() => alert("Mensaje reportado. Gracias por mantener la comunidad sana.")}
                    />
                    <AnimatePresence>
                      {activeEmojiMsg === msg.id && (
                        <EmojiPicker
                          onSelect={(emoji) => handleToggleReaction(msg.id, emoji)}
                          onClose={() => setActiveEmojiMsg(null)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* ── Typing Indicator ── */}
      <AnimatePresence>
        {typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 px-6 pb-1"
          >
            <p className="text-xs font-medium text-purple-400/70">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "está escribiendo" : "están escribiendo"}
              <span className="ml-1 inline-flex">
                {["0s", "0.2s", "0.4s"].map((d, idx) => (
                  <span key={idx} className="animate-bounce" style={{ animationDelay: d }}>.</span>
                ))}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reply Bar ── */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 flex items-center gap-3 border-t border-purple-500/20 bg-purple-500/5 px-6 py-2"
          >
            <Reply className="size-4 shrink-0 text-purple-400" />
            <p className="flex-1 truncate text-xs text-white/50">
              Respondiendo a{" "}
              <span className="font-bold text-purple-300">
                {replyTo.profiles?.display_name || replyTo.profiles?.username}
              </span>
              : {replyTo.content}
            </p>
            <button onClick={() => setReplyTo(null)} className="rounded p-1 text-white/30 hover:text-white/70">
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Guest Banner ── */}
      {currentUser?.id?.startsWith("guest_") && (
        <div className="relative z-10 border-t border-blue-500/20 bg-blue-500/5 px-6 py-2">
          <p className="text-center text-xs text-blue-300/70">
            Estás como invitado.{" "}
            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2">
              Inicia sesión
            </Link>{" "}
            para guardar tu nombre y reaccionar.
          </p>
        </div>
      )}

      {/* ── Input Area ── */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          {/* Add reaction quick button */}
          <button className="shrink-0 rounded-xl p-2 text-white/30 transition-all hover:bg-white/5 hover:text-white/60">
            <Plus className="size-4" />
          </button>

          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 transition-all focus-within:border-purple-500/40 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_20px_rgba(168,85,247,0.08)]">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => { setNewMessage(e.target.value); handleTyping() }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder={`Escribe en ${roomName}...`}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
            />
            <button className="text-white/20 transition-colors hover:text-white/50">
              <Smile className="size-5" />
            </button>
          </div>

          <motion.button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            whileTap={{ scale: 0.92 }}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-900/30 transition-all hover:scale-105 hover:shadow-purple-500/40 disabled:opacity-30 disabled:hover:scale-100"
          >
            <Send className="size-4" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
