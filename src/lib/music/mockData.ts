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
    { title: "Gata Only", artist: "FloyyMenor, Cris Mj", album: "Gata Only", durationMs: 222000, popularity: 95 },
    { title: "Luna", artist: "Feid, ATL Jacob", album: "FERXXOCALIPSIS", durationMs: 196000, popularity: 93 },
    { title: "La Diabla", artist: "Xavi", album: "La Diabla", durationMs: 172000, popularity: 91 },
    { title: "El Espejo Roto", artist: "Alex Miranda (Detrás del Espejo)", album: "Detrás del Espejo OST", durationMs: 240000, popularity: 89 },
    { title: "Bellakeo", artist: "Peso Pluma, Anitta", album: "Bellakeo", durationMs: 205000, popularity: 88 },
    { title: "Harley Quinn", artist: "Fuerza Regida, Marshmello", album: "Pa Las Baby's Y Belikeada", durationMs: 183000, popularity: 87 },
    { title: "Qlona", artist: "Karol G, Peso Pluma", album: "MAÑANA SERÁ BONITO", durationMs: 172000, popularity: 86 },
    { title: "LALA", artist: "Myke Towers", album: "LA VIDA ES UNA", durationMs: 197000, popularity: 85 },
    { title: "El Caos del Primer Episodio", artist: "Carla Ruiz (Me gusta que te guste)", album: "MGQTG Singles", durationMs: 180000, popularity: 84 },
    { title: "Hola Perdida", artist: "Luck Ra, KHEA", album: "Que se mejoren", durationMs: 185000, popularity: 83 },
  ],
  global: [
    { title: "Espresso", artist: "Sabrina Carpenter", album: "Short n' Sweet", durationMs: 175000, popularity: 98 },
    { title: "Birds of a Feather", artist: "Billie Eilish", album: "HIT ME HARD AND SOFT", durationMs: 210000, popularity: 97 },
    { title: "Not Like Us", artist: "Kendrick Lamar", album: "Not Like Us", durationMs: 274000, popularity: 96 },
    { title: "Too Sweet", artist: "Hozier", album: "Unheard", durationMs: 251000, popularity: 95 },
    { title: "Million Dollar Baby", artist: "Tommy Richman", album: "Million Dollar Baby", durationMs: 155000, popularity: 94 },
    { title: "I Like The Way You Kiss Me", artist: "Artemas", album: "I Like The Way You Kiss Me", durationMs: 142000, popularity: 93 },
    { title: "Fortnight", artist: "Taylor Swift, Post Malone", album: "THE TORTURED POETS DEPARTMENT", durationMs: 228000, popularity: 92 },
    { title: "Good Luck, Babe!", artist: "Chappell Roan", album: "Good Luck, Babe!", durationMs: 218000, popularity: 91 },
    { title: "Lunch", artist: "Billie Eilish", album: "HIT ME HARD AND SOFT", durationMs: 180000, popularity: 90 },
    { title: "Austin", artist: "Dasha", album: "What Happens Now?", durationMs: 171000, popularity: 89 },
  ],
  chile: [
    { title: "Gata Only", artist: "FloyyMenor, Cris Mj", album: "Gata Only", durationMs: 222000, popularity: 95 },
    { title: "Una Alita De Pollo", artist: "Jere Klein, Lucky Brown", album: "Ares Klein", durationMs: 185000, popularity: 88 },
    { title: "XQ TAN SOLA", artist: "Nickoog Clk, Jere Klein", album: "XQ TAN SOLA", durationMs: 198000, popularity: 87 },
    { title: "Diabólica", artist: "Cris Mj", album: "Diabólica", durationMs: 168000, popularity: 86 },
    { title: "Ando", artist: "Jere Klein", album: "Énfasis", durationMs: 191000, popularity: 85 },
    { title: "Princesita de...", artist: "Lucky Brown", album: "Princesita de...", durationMs: 175000, popularity: 84 },
    { title: "Loca Farandulera", artist: "Cris Mj, Jere Klein", album: "Loca Farandulera", durationMs: 182000, popularity: 83 },
    { title: "Cochinae", artist: "Julianno Sosa, King Savagge", album: "El Rey del Ocho", durationMs: 201000, popularity: 82 },
    { title: "Venganza", artist: "Jere Klein", album: "Ares Klein", durationMs: 190000, popularity: 81 },
    { title: "Dámelo", artist: "Cris Mj", album: "Dámelo", durationMs: 174000, popularity: 80 },
  ],
  pop: [
    { title: "Cruel Summer", artist: "Taylor Swift", album: "Lover", durationMs: 178000, popularity: 94 },
    { title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer Vacation", durationMs: 200000, popularity: 92 },
    { title: "Greedy", artist: "Tate McRae", album: "THINK LATER", durationMs: 131000, popularity: 91 },
    { title: "As It Was", artist: "Harry Styles", album: "Harry's House", durationMs: 167000, popularity: 90 },
    { title: "Water", artist: "Tyla", album: "TYLA", durationMs: 200000, popularity: 89 },
    { title: "Houdini", artist: "Dua Lipa", album: "Radical Optimism", durationMs: 185000, popularity: 88 },
    { title: "Vampire", artist: "Olivia Rodrigo", album: "GUTS", durationMs: 219000, popularity: 87 },
    { title: "Paint The Town Red", artist: "Doja Cat", album: "Scarlet", durationMs: 231000, popularity: 86 },
    { title: "Feather", artist: "Sabrina Carpenter", album: "Emails I Can't Send", durationMs: 185000, popularity: 85 },
    { title: "Training Season", artist: "Dua Lipa", album: "Radical Optimism", durationMs: 209000, popularity: 84 },
  ],
  urbano: [
    { title: "La Ranger", artist: "The Academy, Sech, Justin Quiles", album: "Segunda Misión", durationMs: 242000, popularity: 90 },
    { title: "Offline", artist: "Feid, Young Miko", album: "FERXXOCALIPSIS", durationMs: 198000, popularity: 89 },
    { title: "Classy 101", artist: "Feid, Young Miko", album: "Classy 101", durationMs: 195000, popularity: 88 },
    { title: "Yankee 150", artist: "Yandel, Feid", album: "Resistencia", durationMs: 210000, popularity: 87 },
    { title: "Perro Negro", artist: "Bad Bunny, Feid", album: "Nadie Sabe Lo Que Va A Pasar Mañana", durationMs: 162000, popularity: 86 },
    { title: "Tú con él", artist: "Cris Mj", album: "Tú con él", durationMs: 180000, popularity: 85 },
    { title: "Chulo pt.2", artist: "Bad Gyal, Tokischa, Young Miko", album: "Chulo pt.2", durationMs: 219000, popularity: 84 },
    { title: "Mi Show", artist: "Jere Klein", album: "Ares Klein", durationMs: 178000, popularity: 83 },
    { title: "No me dejes solo", artist: "Lucky Brown, Gino Mella", album: "No me dejes solo", durationMs: 190000, popularity: 82 },
    { title: "Tussi Code Mariguana", artist: "Cris Mj", album: "MJ", durationMs: 172000, popularity: 81 },
  ],
  rock: [
    { title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", durationMs: 272000, popularity: 89 },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", durationMs: 301000, popularity: 88 },
    { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", durationMs: 354000, popularity: 87 },
    { title: "Hotel California", artist: "Eagles", album: "Hotel California", durationMs: 391000, popularity: 86 },
    { title: "Back In Black", artist: "AC/DC", album: "Back In Black", durationMs: 255000, popularity: 85 },
    { title: "Enter Sandman", artist: "Metallica", album: "Metallica", durationMs: 331000, popularity: 84 },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", durationMs: 356000, popularity: 83 },
    { title: "Another One Bites The Dust", artist: "Queen", album: "The Game", durationMs: 215000, popularity: 82 },
    { title: "In The End", artist: "Linkin Park", album: "Hybrid Theory", durationMs: 216000, popularity: 81 },
    { title: "Creep", artist: "Radiohead", album: "Pablo Honey", durationMs: 238000, popularity: 80 },
  ],
  electronica: [
    { title: "Levels", artist: "Avicii", album: "Levels", durationMs: 199000, popularity: 85 },
    { title: "Animals", artist: "Martin Garrix", album: "Gold Skies EP", durationMs: 304000, popularity: 84 },
    { title: "Titanium", artist: "David Guetta, Sia", album: "Nothing but the Beat", durationMs: 245000, popularity: 83 },
    { title: "Wake Me Up", artist: "Avicii", album: "True", durationMs: 247000, popularity: 82 },
    { title: "Strobe", artist: "deadmau5", album: "For Lack of a Better Name", durationMs: 378000, popularity: 81 },
    { title: "Clarity", artist: "Zedd, Foxes", album: "Clarity", durationMs: 271000, popularity: 80 },
    { title: "Faded", artist: "Alan Walker", album: "Faded", durationMs: 212000, popularity: 79 },
    { title: "One More Time", artist: "Daft Punk", album: "Discovery", durationMs: 320000, popularity: 78 },
    { title: "Don't You Worry Child", artist: "Swedish House Mafia", album: "Until Now", durationMs: 213000, popularity: 77 },
    { title: "Sandstorm", artist: "Darude", album: "Before the Storm", durationMs: 225000, popularity: 76 },
  ],
  latina: [
    { title: "Tusa", artist: "Karol G, Nicki Minaj", album: "KG0516", durationMs: 200000, popularity: 87 },
    { title: "Dákiti", artist: "Bad Bunny, Jhayco", album: "EL ÚLTIMO TOUR DEL MUNDO", durationMs: 205000, popularity: 86 },
    { title: "Despacito", artist: "Luis Fonsi, Daddy Yankee", album: "VIDA", durationMs: 228000, popularity: 85 },
    { title: "Provenza", artist: "Karol G", album: "MAÑANA SERÁ BONITO", durationMs: 210000, popularity: 84 },
    { title: "Mi Gente", artist: "J Balvin, Willy William", album: "Vibras", durationMs: 189000, popularity: 83 },
    { title: "Pepas", artist: "Farruko", album: "La 167", durationMs: 287000, popularity: 82 },
    { title: "Todo De Ti", artist: "Rauw Alejandro", album: "VICE VERSA", durationMs: 199000, popularity: 81 },
    { title: "Telepatía", artist: "Kali Uchis", album: "Sin Miedo (del Amor y Otros Demonios)", durationMs: 160000, popularity: 80 },
    { title: "Danza Kuduro", artist: "Don Omar, Lucenzo", album: "Meet The Orphans", durationMs: 198000, popularity: 79 },
    { title: "Hawái", artist: "Maluma", album: "Papi Juancho", durationMs: 199000, popularity: 78 },
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
    releaseDate: "2024-01-01",
    popularity: raw.popularity,
    spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(raw.title + " " + raw.artist)}`,
    trackId: `${chartKey}-mock-${i + 1}`,
  }))
}
