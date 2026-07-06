import {
  type Sign,
  SIGNS,
  COLORS,
  ANIMALS,
  FOODS,
  SONGS,
  MESSAGES,
  PEOPLE_TO_AVOID,
  OBJECTS,
  PREDICTION_TEMPLATES,
  SITUATIONS,
  SITUACIONES_LOCAS,
  SITUACIONES_URGENTES,
  CONSEQUENCES,
  ADVICE,
  ABSURD_PHRASES,
  EASTER_EGGS,
} from "./data"

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function seedFromDate(dateStr: string, signIndex: number, nonce = 0): number {
  let hash = 0
  const str = `${dateStr}-${signIndex}-${nonce}`
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function pick<T>(arr: readonly T[], seed: number, offset = 0): T {
  const idx = Math.floor(seededRandom(seed + offset) * arr.length)
  return arr[idx]
}

function pickInt(seed: number, offset: number, min: number, max: number): number {
  return min + Math.floor(seededRandom(seed + offset) * (max - min + 1))
}

function pickBool(seed: number, offset: number, probability: number): boolean {
  return seededRandom(seed + offset) < probability
}

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`)
}

export interface Horoscope {
  sign: Sign
  date: string
  prediction: string
  chaos: number
  loveProbability: number
  moneyRisk: number
  coffeeNeed: number
  publicShame: number
  food: string
  color: string
  animal: string
  message: string
  personToAvoid: string
  magicObject: string
  song: string
  finalPhrase: string
  isEasterEgg: boolean
  easterEggTitle?: string
  easterEggMessage?: string
  easterEggEmoji?: string
}

export function generateHoroscope(sign: Sign, dateStr: string, nonce = 0): Horoscope {
  const signIndex = SIGNS.indexOf(sign)
  const baseSeed = seedFromDate(dateStr, signIndex, nonce)

  const isEgg = pickBool(baseSeed, 0, 0.01)

  if (isEgg) {
    const egg = EASTER_EGGS[pickInt(baseSeed, 1, 0, EASTER_EGGS.length - 1)]
    return {
      sign,
      date: dateStr,
      prediction: egg.message,
      chaos: 100,
      loveProbability: pickInt(baseSeed, 2, 0, 100),
      moneyRisk: pickInt(baseSeed, 3, 0, 100),
      coffeeNeed: pickInt(baseSeed, 4, 0, 100),
      publicShame: pickInt(baseSeed, 5, 0, 100),
      food: pick(FOODS, baseSeed, 6),
      color: pick(COLORS, baseSeed, 7),
      animal: pick(ANIMALS, baseSeed, 8),
      message: pick(MESSAGES, baseSeed, 9),
      personToAvoid: pick(PEOPLE_TO_AVOID, baseSeed, 10),
      magicObject: pick(OBJECTS, baseSeed, 11),
      song: pick(SONGS, baseSeed, 12),
      finalPhrase: egg.title,
      isEasterEgg: true,
      easterEggTitle: egg.title,
      easterEggMessage: egg.message,
      easterEggEmoji: egg.emoji,
    }
  }

  const template = pick(PREDICTION_TEMPLATES, baseSeed, 0)
  const situation = pick(SITUATIONS, baseSeed, 1)
  const situacionLoca = pick(SITUACIONES_LOCAS, baseSeed, 2)
  const situacionUrgente = pick(SITUACIONES_URGENTES, baseSeed, 3)
  const consequence = pick(CONSEQUENCES, baseSeed, 4)
  const consejo = pick(ADVICE, baseSeed, 5)

  const prediction = interpolate(template, {
    situacion: situation,
    situacion_loca: situacionLoca,
    situacion_urgente: situacionUrgente,
    consecuencia: consequence,
    consejo,
  })

  const finalPhrase = pick(ABSURD_PHRASES, baseSeed, 6)

  return {
    sign,
    date: dateStr,
    prediction,
    chaos: pickInt(baseSeed, 7, 1, 100),
    loveProbability: pickInt(baseSeed, 8, 0, 100),
    moneyRisk: pickInt(baseSeed, 9, 0, 100),
    coffeeNeed: pickInt(baseSeed, 10, 0, 100),
    publicShame: pickInt(baseSeed, 11, 0, 100),
    food: pick(FOODS, baseSeed, 12),
    color: pick(COLORS, baseSeed, 13),
    animal: pick(ANIMALS, baseSeed, 14),
    message: pick(MESSAGES, baseSeed, 15),
    personToAvoid: pick(PEOPLE_TO_AVOID, baseSeed, 16),
    magicObject: pick(OBJECTS, baseSeed, 17),
    song: pick(SONGS, baseSeed, 18),
    finalPhrase,
    isEasterEgg: false,
  }
}

export function generateAllHoroscopes(dateStr: string): Horoscope[] {
  return SIGNS.map((sign) => generateHoroscope(sign, dateStr))
}

export function generateRandomDestiny(dateStr: string, nonce: number): Horoscope {
  const randomSign = SIGNS[Math.floor(seededRandom(seedFromDate(dateStr, 999, nonce)) * SIGNS.length)]
  return generateHoroscope(randomSign, dateStr, nonce + 1000)
}

export function getTodayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
