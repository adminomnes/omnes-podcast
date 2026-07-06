export interface NewsItem {
  id: string
  title: string
  description: string
  content: string
  image: string
  url: string
  source: string
  category: string
  date: string
  readingTime: string
  aiSummary?: string
  aiKeyPoints?: string[]
  aiPodcastQuestions?: string[]
  suggestedPodcast?: string
}

export interface CategoryGroup {
  category: string
  label: string
  icon: string
  items: NewsItem[]
}

export interface PulsoData {
  featured: NewsItem[]
  categories: CategoryGroup[]
  updatedAt: string
  totalNews: number
}
