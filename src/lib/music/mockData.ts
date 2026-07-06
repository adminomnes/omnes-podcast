import type { ParsedTrack } from "./spotify"
import type { ChartKey } from "./types"

const MOCK_COVERS = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60", // Concert lights
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60", // DJ controller
  "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=60", // Retro synth
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60", // Retro microphone
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&auto=format&fit=crop&q=60", // Rock guitar
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=60", // Crowd party
  "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=300&auto=format&fit=crop&q=60", // Vinyl record
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=60", // Recording studio
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60", // Neon stage
  "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?w=300&auto=format&fit=crop&q=60", // Headphones
]

interface RawMock {
  title: string
  artist: string
  album: string
  durationMs: number
  popularity: number
}

const MOCK_DATA_BY_CHART: Record<ChartKey, RawMock[]> = {
  pedidos: [
    { title: "El Espejo Roto", artist: "Alex Miranda (Detrás del Espejo)", album: "Detrás del Espejo OST", durationMs: 240000, popularity: 99 },
    { title: "APT.", artist: "ROSÉ, Bruno Mars", album: "APT.", durationMs: 170000, popularity: 98 },
    { title: "Si Antes Te Hubiera Conocido", artist: "Karol G", album: "Si Antes Te Hubiera Conocido", durationMs: 195000, popularity: 97 },
    { title: "Die With A Smile", artist: "Bruno Mars, Lady Gaga", album: "Die With A Smile", durationMs: 251000, popularity: 96 },
    { title: "SOLA", artist: "Jere Klein", album: "SOLA", durationMs: 180000, popularity: 95 },
    { title: "Gata Only", artist: "FloyyMenor, Cris Mj", album: "Gata Only", durationMs: 222000, popularity: 94 },
    { title: "El Caos del Primer Episodio", artist: "Carla Ruiz (Me gusta que te guste)", album: "MGQTG Singles", durationMs: 180000, popularity: 93 },
    { title: "Piel", artist: "Tiago PZK, Ke Personajes", album: "Piel", durationMs: 188000, popularity: 92 },
    { title: "UN PRESTADO", artist: "Lucky Brown, Jere Klein", album: "UN PRESTADO", durationMs: 191000, popularity: 91 },
    { title: "Imán", artist: "Maria Becerra", album: "Imán", durationMs: 162000, popularity: 90 },
  ],
  global: [
    { title: "APT.", artist: "ROSÉ, Bruno Mars", album: "APT.", durationMs: 170000, popularity: 98 },
    { title: "Die With A Smile", artist: "Bruno Mars, Lady Gaga", album: "Die With A Smile", durationMs: 251000, popularity: 97 },
    { title: "Taste", artist: "Sabrina Carpenter", album: "Short n' Sweet", durationMs: 173000, popularity: 96 },
    { title: "Birds of a Feather", artist: "Billie Eilish", album: "HIT ME HARD AND SOFT", durationMs: 210000, popularity: 95 },
    { title: "Espresso", artist: "Sabrina Carpenter", album: "Short n' Sweet", durationMs: 175000, popularity: 94 },
    { title: "Good Luck, Babe!", artist: "Chappell Roan", album: "The Rise and Fall of a Midwest Princess", durationMs: 218000, popularity: 93 },
    { title: "Starboy", artist: "The Weeknd, Daft Punk", album: "Starboy", durationMs: 230000, popularity: 92 },
    { title: "Beautiful Things", artist: "Benson Boone", album: "Fireworks & Rollerblades", durationMs: 180000, popularity: 91 },
    { title: "Please Please Please", artist: "Sabrina Carpenter", album: "Short n' Sweet", durationMs: 186000, popularity: 90 },
    { title: "Too Sweet", artist: "Hozier", album: "Unheard", durationMs: 251000, popularity: 89 },
  ],
  chile: [
    { title: "SOLA", artist: "Jere Klein", album: "SOLA", durationMs: 180000, popularity: 95 },
    { title: "Gata Only", artist: "FloyyMenor, Cris Mj", album: "Gata Only", durationMs: 222000, popularity: 94 },
    { title: "UN PRESTADO", artist: "Lucky Brown, Jere Klein", album: "UN PRESTADO", durationMs: 191000, popularity: 93 },
    { title: "Princesita de...", artist: "Lucky Brown", album: "Princesita de...", durationMs: 175000, popularity: 92 },
    { title: "XQ TAN SOLA", artist: "Nickoog Clk, Jere Klein", album: "XQ TAN SOLA", durationMs: 198000, popularity: 91 },
    { title: "Mami Chula", artist: "Jere Klein", album: "Mami Chula", durationMs: 185000, popularity: 90 },
    { title: "Ando", artist: "Jere Klein", album: "Énfasis", durationMs: 191000, popularity: 89 },
    { title: "De Negro", artist: "FloyyMenor", album: "De Negro", durationMs: 182000, popularity: 88 },
    { title: "Una Alita De Pollo", artist: "Jere Klein, Lucky Brown", album: "Ares Klein", durationMs: 185000, popularity: 87 },
    { title: "Piel", artist: "Tiago PZK, Ke Personajes", album: "Piel", durationMs: 188000, popularity: 86 },
  ],
  pop: [
    { title: "APT.", artist: "ROSÉ, Bruno Mars", album: "APT.", durationMs: 170000, popularity: 98 },
    { title: "Taste", artist: "Sabrina Carpenter", album: "Short n' Sweet", durationMs: 173000, popularity: 97 },
    { title: "Birds of a Feather", artist: "Billie Eilish", album: "HIT ME HARD AND SOFT", durationMs: 210000, popularity: 96 },
    { title: "We Can't Be Friends", artist: "Ariana Grande", album: "Eternal Sunshine", durationMs: 228000, popularity: 95 },
    { title: "Espresso", artist: "Sabrina Carpenter", album: "Short n' Sweet", durationMs: 175000, popularity: 94 },
    { title: "Please Please Please", artist: "Sabrina Carpenter", album: "Short n' Sweet", durationMs: 186000, popularity: 93 },
    { title: "Cruel Summer", artist: "Taylor Swift", album: "Lover", durationMs: 178000, popularity: 92 },
    { title: "Training Season", artist: "Dua Lipa", album: "Radical Optimism", durationMs: 209000, popularity: 91 },
    { title: "Houdini", artist: "Dua Lipa", album: "Radical Optimism", durationMs: 185000, popularity: 90 },
    { title: "Good Luck, Babe!", artist: "Chappell Roan", album: "Good Luck, Babe!", durationMs: 218000, popularity: 89 },
  ],
  urbano: [
    { title: "Si Antes Te Hubiera Conocido", artist: "Karol G", album: "Si Antes Te Hubiera Conocido", durationMs: 195000, popularity: 97 },
    { title: "SOLA", artist: "Jere Klein", album: "SOLA", durationMs: 180000, popularity: 95 },
    { title: "Piel", artist: "Tiago PZK, Ke Personajes", album: "Piel", durationMs: 188000, popularity: 94 },
    { title: "Gata Only", artist: "FloyyMenor, Cris Mj", album: "Gata Only", durationMs: 222000, popularity: 93 },
    { title: "La Ranger", artist: "The Academy, Sech, Justin Quiles", album: "Segunda Misión", durationMs: 242000, popularity: 92 },
    { title: "Offline", artist: "Feid, Young Miko", album: "FERXXOCALIPSIS", durationMs: 198000, popularity: 91 },
    { title: "UN PRESTADO", artist: "Lucky Brown, Jere Klein", album: "UN PRESTADO", durationMs: 191000, popularity: 90 },
    { title: "Doble Personalidad", artist: "Cris Mj", album: "Doble Personalidad", durationMs: 175000, popularity: 89 },
    { title: "Classy 101", artist: "Feid, Young Miko", album: "Classy 101", durationMs: 195000, popularity: 88 },
    { title: "Tussi Code Mariguana", artist: "Cris Mj", album: "MJ", durationMs: 172000, popularity: 87 },
  ],
  rock: [
    { title: "Heavy Is the Crown", artist: "Linkin Park", album: "From Zero", durationMs: 167000, popularity: 94 },
    { title: "The Emptiness Machine", artist: "Linkin Park", album: "From Zero", durationMs: 190000, popularity: 93 },
    { title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", durationMs: 272000, popularity: 90 },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", durationMs: 301000, popularity: 89 },
    { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", durationMs: 354000, popularity: 88 },
    { title: "Hotel California", artist: "Eagles", album: "Hotel California", durationMs: 391000, popularity: 87 },
    { title: "Enter Sandman", artist: "Metallica", album: "Metallica", durationMs: 331000, popularity: 86 },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", durationMs: 356000, popularity: 85 },
    { title: "Creep", artist: "Radiohead", album: "Pablo Honey", durationMs: 238000, popularity: 84 },
    { title: "Back In Black", artist: "AC/DC", album: "Back In Black", durationMs: 255000, popularity: 83 },
  ],
  electronica: [
    { title: "Neverender", artist: "Justice, Tame Impala", album: "Hyperdrama", durationMs: 266000, popularity: 88 },
    { title: "Levels", artist: "Avicii", album: "Levels", durationMs: 199000, popularity: 85 },
    { title: "Animals", artist: "Martin Garrix", album: "Gold Skies EP", durationMs: 304000, popularity: 84 },
    { title: "Titanium", artist: "David Guetta, Sia", album: "Nothing but the Beat", durationMs: 245000, popularity: 83 },
    { title: "Wake Me Up", artist: "Avicii", album: "True", durationMs: 247000, popularity: 82 },
    { title: "Strobe", artist: "deadmau5", album: "For Lack of a Better Name", durationMs: 378000, popularity: 81 },
    { title: "Clarity", artist: "Zedd, Foxes", album: "Clarity", durationMs: 271000, popularity: 80 },
    { title: "Faded", artist: "Alan Walker", album: "Faded", durationMs: 212000, popularity: 79 },
    { title: "One More Time", artist: "Daft Punk", album: "Discovery", durationMs: 320000, popularity: 78 },
    { title: "Sandstorm", artist: "Darude", album: "Before the Storm", durationMs: 225000, popularity: 77 },
  ],
  latina: [
    { title: "Si Antes Te Hubiera Conocido", artist: "Karol G", album: "Si Antes Te Hubiera Conocido", durationMs: 195000, popularity: 97 },
    { title: "Doble Personalidad", artist: "Cris Mj", album: "Doble Personalidad", durationMs: 175000, popularity: 89 },
    { title: "Piel", artist: "Tiago PZK, Ke Personajes", album: "Piel", durationMs: 188000, popularity: 88 },
    { title: "Gata Only", artist: "FloyyMenor, Cris Mj", album: "Gata Only", durationMs: 222000, popularity: 87 },
    { title: "Luna", artist: "Feid, ATL Jacob", album: "FERXXOCALIPSIS", durationMs: 196000, popularity: 86 },
    { title: "Tusa", artist: "Karol G, Nicki Minaj", album: "KG0516", durationMs: 200000, popularity: 85 },
    { title: "Dákiti", artist: "Bad Bunny, Jhayco", album: "EL ÚLTIMO TOUR DEL MUNDO", durationMs: 205000, popularity: 84 },
    { title: "Provenza", artist: "Karol G", album: "MAÑANA SERÁ BONITO", durationMs: 210000, popularity: 83 },
    { title: "Despacito", artist: "Luis Fonsi, Daddy Yankee", album: "VIDA", durationMs: 228000, popularity: 82 },
    { title: "Pepas", artist: "Farruko", album: "La 167", durationMs: 287000, popularity: 81 },
  ],
}

export function getMockTracks(chartKey: ChartKey): ParsedTrack[] {
  const raws = MOCK_DATA_BY_CHART[chartKey] || MOCK_DATA_BY_CHART.global
  return raws.map((raw, i) => ({
    position: i + 1,
    title: raw.title,
    artist: raw.artist,
    album: raw.album,
    albumCover: MOCK_COVERS[i % MOCK_COVERS.length],
    durationMs: raw.durationMs,
    releaseDate: "2026-01-01",
    popularity: raw.popularity,
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(raw.title + " " + raw.artist)}`,
    trackId: `${chartKey}-mock-${i + 1}`,
  }))
}
