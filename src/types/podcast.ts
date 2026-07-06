export interface Podcast {
  id: string
  slug: string
  title: string
  description: string
  cover_image: string
  trailer_url: string | null
  color_primary: string
  color_secondary: string
  color_accent: string
  vibe: string
  category: string
  hosts: Host[]
  created_at: string
}

export interface Season {
  id: string
  podcast_id: string
  number: number
  title: string
  description: string
  episodes: Episode[]
}

export interface Episode {
  id: string
  season_id: string
  podcast_id: string
  title: string
  description: string
  audio_url: string
  video_url: string | null
  duration: number
  thumbnail: string
  tags: string[]
  category: string
  published_at: string
  views: number
  likes: number
  hosts: Host[]
  guests: Guest[]
}

export interface Host {
  id: string
  name: string
  bio: string
  photo: string
  social_links: SocialLinks
}

export interface Guest {
  id: string
  name: string
  bio: string
  photo: string
  social_links: SocialLinks
  episodes: Episode[]
}

export interface SocialLinks {
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  website?: string
}

export interface Clip {
  id: string
  episode_id: string
  title: string
  video_url: string
  duration: number
  thumbnail: string
  views: number
}

export interface Comment {
  id: string
  episode_id: string
  user_id: string
  user_name: string
  user_avatar: string
  content: string
  likes: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string
  role: "user" | "admin"
}

export interface PodcastTheme {
  primary: string
  secondary: string
  accent: string
  glow: string
  gradientFrom: string
  gradientTo: string
  glassBg: string
  glassBorder: string
}
