import type { MetadataRoute } from "next"

const PODCASTS = [
  { slug: "detras-del-espejo", updated: "2025-04-05" },
  { slug: "me-gusta-que-te-guste", updated: "2025-04-10" },
]

const EPISODES = [
  { id: "e1", updated: "2025-03-15" },
  { id: "e2", updated: "2025-03-22" },
  { id: "e3", updated: "2025-04-05" },
  { id: "e4", updated: "2025-04-01" },
  { id: "e5", updated: "2025-04-10" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://omnespodcast.com"

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/clips`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/ai`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  ]

  const podcastRoutes = PODCASTS.map((p) => ({
    url: `${baseUrl}/podcasts/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const episodeRoutes = EPISODES.map((e) => ({
    url: `${baseUrl}/episodes/${e.id}`,
    lastModified: new Date(e.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const guestRoutes = [
    { url: `${baseUrl}/guests/g1`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/guests/g2`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ]

  return [...staticRoutes, ...podcastRoutes, ...episodeRoutes, ...guestRoutes]
}
