export interface FeedSource {
  url: string
  category: string
  label: string
  icon: string
}

export const FEEDS: FeedSource[] = [
  { url: "https://www.xataka.com/feed.xml", category: "tecnologia", label: "Xataka", icon: "💻" },
  { url: "https://hipertextual.com/feed", category: "tecnologia", label: "Hipertextual", icon: "📱" },
  { url: "https://www.bbc.com/mundo/index.xml", category: "mundo", label: "BBC Mundo", icon: "🌍" },
  { url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada", category: "mundo", label: "El País", icon: "🌎" },
  { url: "https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml", category: "mundo", label: "El Mundo", icon: "🌏" },
  { url: "https://www.biobiochile.cl/feed", category: "chile", label: "BioBioChile", icon: "🇨🇱" },
  { url: "https://www.emol.com/rss/portada", category: "chile", label: "Emol", icon: "🇨🇱" },
  { url: "https://www.muyinteresante.com/feed/", category: "ciencia", label: "Muy Interesante", icon: "🔬" },
  { url: "https://www.mondosonoro.com/feed/", category: "musica", label: "Mondo Sonoro", icon: "🎵" },
  { url: "https://www.espinof.com/feed.xml", category: "streaming", label: "Espinof", icon: "📺" },
  { url: "https://www.3djuegos.com/feed/", category: "videojuegos", label: "3DJuegos", icon: "🎮" },
  { url: "https://www.xataka.com/feed.xml", category: "ia", label: "Xataka", icon: "🤖" },
  { url: "https://hipertextual.com/feed", category: "internet", label: "Hipertextual", icon: "🌐" },
  { url: "https://www.muyinteresante.com/feed/", category: "curiosidades", label: "Muy Interesante", icon: "✨" },
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
