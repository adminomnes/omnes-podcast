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
              description: description.substring(0, 200),
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
  const templates = [
    `${title}. ${desc.substring(0, 80)}... Un tema que está dando mucho que hablar.`,
    `En resumen: ${title}. ${desc.substring(0, 60)}... ¿Qué opinas tú?`,
    `Lo que tienes que saber: ${title}. ${desc.substring(0, 70)}... Sigue leyendo para más detalles.`,
    `${title}. Una noticia que no te puedes perder. ${desc.substring(0, 50)}...`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

function generateKeyPoints(desc: string): string[] {
  const points = desc.split(". ").filter(Boolean)
  if (points.length >= 3) {
    return points.slice(0, 3).map((p) => p + ".")
  }
  return [
    "Esta noticia está generando conversación en redes sociales.",
    "Expertos en la materia ya están analizando sus implicancias.",
    "El impacto de esta noticia podría sentirse en los próximos días.",
  ]
}

function generatePodcastQuestions(title: string): string[] {
  return [
    `¿Crees que ${title.toLowerCase()} cambiará la forma en que vemos el mundo?`,
    `¿Qué impacto crees que tendrá esta noticia en Chile?`,
    `¿Estamos preparados como sociedad para lo que viene?`,
    `¿Cómo crees que evolucionará esta historia en los próximos meses?`,
    `Si pudieras preguntarle algo a un experto sobre esto, ¿qué le preguntarías?`,
  ].slice(0, 2 + Math.floor(Math.random() * 2))
}
