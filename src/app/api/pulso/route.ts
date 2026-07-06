import { NextResponse } from "next/server"
import Parser from "rss-parser"
import { FEEDS, CATEGORIES } from "@/lib/pulso/feeds"
import type { NewsItem, PulsoData } from "@/lib/pulso/types"

const parser = new Parser()
let cache: { data: PulsoData; timestamp: number } | null = null
const CACHE_TTL = 30 * 60 * 1000

function extractImage(item: any): string {
  if (item.enclosure?.url) return item.enclosure.url
  if (item["media:content"]?.$.url) return item["media:content"].$.url
  if (item["media:thumbnail"]?.$.url) return item["media:thumbnail"].$.url
  const match = item["content:encoded"]?.match(/<img[^>]+src=["']([^"']+)["']/)
  if (match) return match[1]
  const contentMatch = item.content?.match(/<img[^>]+src=["']([^"']+)["']/)
  if (contentMatch) return contentMatch[1]
  return `https://picsum.photos/seed/${encodeURIComponent(item.title || "")}/800/400`
}

function cleanHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || ""
}

function estimateReadingTime(text: string): string {
  const words = text.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min`
}

function generateId(title: string, source: string): string {
  const str = `${title}-${source}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isSpanish(text: string): boolean {
  const spanishWords = /\b(que|de|la|el|en|los|las|por|con|una|para|del|sus|como|más|pero|este|esta|entre|tiene|sobre|tras|durante|donde|quien|nuestro|país|año|dijo|sido|según|cada|parte|puede|tienen|todo|tanto|mundo|hace|gobierno|país|forma|caso|tiempo|luego|tres|ser|han|era|son|había|nueva|nuevo|video|foto|dijo|señaló|agregó|informó|afirmó|indica|explica|presentó|llegó|realizó|podría|debe|debería|tras|así|tan|allí|aquel|aquella|estos|esas|esos|gran|mayor|menor|través|embargo|decir|hacer|ver|saber|haber|tener|nacional|internacional|local|social|política|economía|cultura|deporte|salud|educación|investigación|desarrollo|tecnología|empresa|mercado|industria|proyecto|sistema|proceso|resultado|investigadores|científicos|expertos|análisis|estudio|datos|información|noticia|reportaje|entrevista|crónica|opinión|editorial|columna|artículo|imagen|audio|podcast)/i
  return spanishWords.test(text)
}

const translationCache = new Map<string, string>()
const OPENAI_KEY = process.env.OPENAI_API_KEY

async function translateToSpanish(text: string): Promise<string> {
  if (!text) return text
  if (isSpanish(text)) return text

  const cached = translationCache.get(text)
  if (cached) return cached

  if (OPENAI_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Traduce al español. Responde solo con la traducción, sin explicaciones. Si ya está en español, devuélvelo igual." },
            { role: "user", content: text },
          ],
          max_tokens: text.length + 100,
          temperature: 0.1,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const translated = data.choices?.[0]?.message?.content?.trim() || text
        translationCache.set(text, translated)
        return translated
      }
    } catch {
      /* fallback to original */
    }
  }

  return text
}

async function translateItem(item: NewsItem): Promise<NewsItem> {
  const [title, description, content] = await Promise.all([
    translateToSpanish(item.title),
    translateToSpanish(item.description),
    translateToSpanish(item.content),
  ])
  return { ...item, title, description, content }
}

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  try {
    const results: NewsItem[] = []

    await Promise.allSettled(
      FEEDS.map(async (feed) => {
        try {
          const parsed = await parser.parseURL(feed.url)
          parsed.items?.slice(0, 8).forEach((item) => {
            const title = item.title || "Sin título"
            const description = cleanHtml(item.contentSnippet || item.content || "")
            const content = cleanHtml(item["content:encoded"] || item.content || "")
            const date = item.pubDate || item.isoDate || new Date().toISOString()

            results.push({
              id: generateId(title, feed.label),
              title,
              description: description.substring(0, 300),
              content: content.substring(0, 500),
              image: extractImage(item),
              url: item.link || "",
              source: feed.label,
              category: feed.category,
              date: new Date(date).toISOString(),
              readingTime: estimateReadingTime(title + " " + description),
            })
          })
        } catch {
          /* skip failed feeds */
        }
      })
    )

    const toTranslate = results.filter((item) => !isSpanish(item.title))
    if (toTranslate.length > 0) {
      const translated = await Promise.allSettled(
        toTranslate.map((item) => translateItem(item))
      )
      translated.forEach((result, i) => {
        if (result.status === "fulfilled") {
          const idx = results.indexOf(toTranslate[i])
          if (idx !== -1) results[idx] = result.value
        }
      })
    }

    const now = Date.now()
    results.forEach((item) => {
      if (Math.random() < 0.3) {
        item.aiSummary = generateAiSummary(item.title, item.description)
        item.aiKeyPoints = generateKeyPoints(item.description)
        item.aiPodcastQuestions = generatePodcastQuestions(item.title)
        item.suggestedPodcast = Math.random() < 0.5 ? "Detrás del Espejo" : "Me gusta que te guste"
      }
    })

    const deduped = Object.values(
      results.reduce(
        (acc, item) => {
          if (!acc[item.id] || new Date(item.date) > new Date(acc[item.id].date)) {
            acc[item.id] = item
          }
          return acc
        },
        {} as Record<string, NewsItem>
      )
    )

    const sorted = deduped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const featured = shuffleArray(sorted).slice(0, 6)

    const categories = CATEGORIES.filter((c) => c.key !== "destacadas")
      .map((cat) => ({
        category: cat.key,
        label: cat.label,
        icon: cat.icon,
        items: sorted.filter((n) => n.category === cat.key).slice(0, 8),
      }))
      .filter((g) => g.items.length > 0)

    const data: PulsoData = {
      featured,
      categories,
      updatedAt: new Date().toISOString(),
      totalNews: sorted.length,
    }

    cache = { data, timestamp: Date.now() }

    return NextResponse.json(data)
  } catch {
    if (cache) {
      return NextResponse.json(cache.data)
    }
    return NextResponse.json({ featured: [], categories: [], updatedAt: new Date().toISOString(), totalNews: 0 })
  }
}

function generateAiSummary(title: string, desc: string): string {
  return `${title}. ${desc.substring(0, 80)}...`
}

function generateKeyPoints(desc: string): string[] {
  const points = desc.split(". ").filter(Boolean)
  if (points.length >= 3) {
    return points.slice(0, 3).map((p) => p + ".")
  }
  return [
    "Esta noticia ya está generando conversación.",
    "Expertos analizan sus implicancias.",
    "El impacto se sentirá en los próximos días.",
  ]
}

function generatePodcastQuestions(title: string): string[] {
  return [
    `¿Cómo crees que ${title.toLowerCase()} nos afecta directamente?`,
    `¿Qué opinas sobre esto? ¿Estamos preparados?`,
    `Si pudieras preguntarle algo a un experto, ¿qué sería?`,
  ].slice(0, 2 + Math.floor(Math.random() * 2))
}
