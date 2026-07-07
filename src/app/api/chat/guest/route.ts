import { NextRequest, NextResponse } from "next/server"
import { readFromR2 } from "@/lib/cloudflare"

export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get("roomId")
  if (!roomId) return NextResponse.json({ messages: [] })

  try {
    const key = `chat/${roomId}/guest-messages.json`
    const raw = await readFromR2(key)
    if (!raw) return NextResponse.json({ messages: [] })

    const messages = JSON.parse(raw)
    return NextResponse.json({ messages })
  } catch {
    return NextResponse.json({ messages: [] })
  }
}
