import { NextResponse } from "next/server"

const R2_URL = process.env.R2_PUBLIC_URL!
const BUCKET = process.env.R2_BUCKET_NAME!
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID!
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY!

async function getSubscribers(): Promise<string[]> {
  try {
    const res = await fetch(`${R2_URL}/subscribers.json`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function saveSubscribers(emails: string[]) {
  const url = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}/subscribers.json`
  const credential = `${ACCESS_KEY}:${SECRET_KEY}`
  const auth = "Basic " + Buffer.from(credential).toString("base64")

  await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emails),
  })
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    const subscribers = await getSubscribers()
    if (subscribers.includes(email)) {
      return NextResponse.json({ message: "Ya estás suscrito" })
    }

    subscribers.push(email)
    await saveSubscribers(subscribers)

    return NextResponse.json({ message: "¡Suscrito!" })
  } catch {
    return NextResponse.json({ error: "Error al suscribir" }, { status: 500 })
  }
}
