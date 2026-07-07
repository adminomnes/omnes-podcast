import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  content: string
  media_url: string | null
  reply_to_id: string | null
  is_edited: boolean
  is_deleted: boolean
  created_at: string
  reactions?: MessageReaction[]
  // Joined from profiles
  profiles?: {
    username: string
    display_name: string | null
    avatar_url: string | null
    level: number
    badges: string[]
  }
}

export interface MessageReaction {
  id: string
  message_id: string
  user_id: string
  emoji: string
  created_at: string
}

export interface ReactionSummary {
  emoji: string
  count: number
  reacted: boolean // did current user react with this emoji?
}

export interface PresenceState {
  user_id: string
  username: string
  avatar_url: string | null
  online_at: string
  is_typing: boolean
}

// ─────────────────────────────────────────────────────────
// Messages
// ─────────────────────────────────────────────────────────

export async function fetchMessages(roomId: string, limit = 50): Promise<ChatMessage[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      profiles:user_id (
        username,
        display_name,
        avatar_url,
        level,
        badges
      )
    `)
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }
  return data as ChatMessage[]
}

export async function sendMessage(
  roomId: string,
  userId: string,
  content: string,
  replyToId?: string,
  guestName?: string
) {
  const isGuest = userId?.startsWith("guest_")

  if (isGuest) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId, content, guestName }),
      })
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from("messages")
    .insert({
      room_id: roomId,
      user_id: userId,
      content,
      reply_to_id: replyToId || null,
    })
    .select()
    .single()

  if (error) {
    console.error("Error sending message:", error)
    return null
  }
  return data
}

export async function fetchGuestMessages(roomId: string): Promise<any[]> {
  try {
    const raw = await fetch(`/api/chat/guest?roomId=${roomId}`)
    if (!raw.ok) return []
    const data = await raw.json()
    return data.messages || []
  } catch {
    return []
  }
}

export async function deleteMessage(messageId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("messages")
    .update({ is_deleted: true, content: "" })
    .eq("id", messageId)

  if (error) {
    console.error("Error deleting message:", error)
    return false
  }
  return true
}

// ─────────────────────────────────────────────────────────
// Reactions
// ─────────────────────────────────────────────────────────

export async function fetchReactions(messageIds: string[]): Promise<MessageReaction[]> {
  if (messageIds.length === 0) return []
  const supabase = createClient()
  const { data, error } = await supabase
    .from("message_reactions")
    .select("*")
    .in("message_id", messageIds)

  if (error) {
    console.error("Error fetching reactions:", error)
    return []
  }
  return data as MessageReaction[]
}

export async function toggleReaction(messageId: string, userId: string, emoji: string) {
  const supabase = createClient()

  // Check if reaction already exists
  const { data: existing } = await supabase
    .from("message_reactions")
    .select("id")
    .eq("message_id", messageId)
    .eq("user_id", userId)
    .eq("emoji", emoji)
    .single()

  if (existing) {
    // Remove it
    await supabase.from("message_reactions").delete().eq("id", existing.id)
    return { action: "removed" }
  } else {
    // Add it
    await supabase.from("message_reactions").insert({ message_id: messageId, user_id: userId, emoji })
    return { action: "added" }
  }
}

/** Group raw reactions into summary per emoji */
export function groupReactions(reactions: MessageReaction[], currentUserId: string): ReactionSummary[] {
  const map = new Map<string, ReactionSummary>()
  for (const r of reactions) {
    const existing = map.get(r.emoji)
    if (existing) {
      existing.count++
      if (r.user_id === currentUserId) existing.reacted = true
    } else {
      map.set(r.emoji, { emoji: r.emoji, count: 1, reacted: r.user_id === currentUserId })
    }
  }
  return Array.from(map.values())
}

// ─────────────────────────────────────────────────────────
// Realtime Subscriptions
// ─────────────────────────────────────────────────────────

export function subscribeToMessages(
  roomId: string,
  onNewMessage: (message: ChatMessage) => void,
  onUpdatedMessage: (message: ChatMessage) => void
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        const { data } = await supabase
          .from("messages")
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url,
              level,
              badges
            )
          `)
          .eq("id", payload.new.id)
          .single()

        if (data) onNewMessage(data as ChatMessage)
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        const { data } = await supabase
          .from("messages")
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url,
              level,
              badges
            )
          `)
          .eq("id", payload.new.id)
          .single()

        if (data) onUpdatedMessage(data as ChatMessage)
      }
    )
    .subscribe()

  return channel
}

export function subscribeToPresence(
  roomId: string,
  currentUser: { user_id: string; username: string; avatar_url: string | null },
  onPresenceSync: (users: PresenceState[]) => void
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase.channel(`presence:${roomId}`, {
    config: { presence: { key: currentUser.user_id } },
  })

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<PresenceState>()
      const users: PresenceState[] = []
      Object.values(state).forEach((presences) => {
        presences.forEach((p) => users.push(p as unknown as PresenceState))
      })
      onPresenceSync(users)
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: currentUser.user_id,
          username: currentUser.username,
          avatar_url: currentUser.avatar_url,
          online_at: new Date().toISOString(),
          is_typing: false,
        })
      }
    })

  return channel
}

export async function setTypingStatus(channel: RealtimeChannel, user: PresenceState, isTyping: boolean) {
  await channel.track({ ...user, is_typing: isTyping })
}
