export interface FeedSource {
  url: string
  category: string
  label: string
  icon: string
}

export const FEEDS: FeedSource[] = [
  { url: "https://hnrss.org/frontpage?count=10", category: "tecnologia", label: "Tecnología", icon: "💻" },
  { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", category: "ia", label: "Inteligencia Artificial", icon: "🤖" },
  { url: "https://www.technologyreview.com/feed/", category: "ia", label: "Inteligencia Artificial", icon: "🧠" },
  { url: "https://feeds.bbci.co.uk/news/rss.xml", category: "mundo", label: "Mundo", icon: "🌍" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", category: "mundo", label: "Mundo", icon: "🌎" },
  { url: "https://www.biobiochile.cl/feed", category: "chile", label: "Chile", icon: "🇨🇱" },
  { url: "https://www.sciencedaily.com/rss/all.xml", category: "ciencia", label: "Ciencia", icon: "🔬" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", category: "tecnologia", label: "Tecnología", icon: "📱" },
  { url: "https://pitchfork.com/feed/feed-news.xml", category: "musica", label: "Música", icon: "🎵" },
  { url: "https://variety.com/feed/", category: "streaming", label: "Streaming", icon: "📺" },
  { url: "https://www.theverge.com/rss/index.xml", category: "internet", label: "Internet", icon: "🌐" },
  { url: "https://feeds.npr.org/1001/rss.xml", category: "curiosidades", label: "Curiosidades", icon: "✨" },
  { url: "https://www.polygon.com/rss/index.xml", category: "videojuegos", label: "Videojuegos", icon: "🎮" },
]

export const CATEGORIES = [
  { key: "destacadas", label: "Destacadas", icon: "⭐" },
  { key: "tecnologia", label: "Tecnología", icon: "💻" },
  { key: "ia", label: "Inteligencia Artificial", icon: "🤖" },
  { key: "chile", label: "Chile", icon: "🇨🇱" },
  { key: "mundo", label: "Mundo", icon: "🌍" },
  { key: "ciencia", label: "Ciencia", icon: "🔬" },
  { key: "musica", label: "Música", icon: "🎵" },
  { key: "streaming", label: "Streaming", icon: "📺" },
  { key: "videojuegos", label: "Videojuegos", icon: "🎮" },
  { key: "internet", label: "Internet", icon: "🌐" },
  { key: "curiosidades", label: "Curiosidades", icon: "✨" },
]
