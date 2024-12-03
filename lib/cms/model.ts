export interface BlogInfo {
  id: number
  documentId: string
  title: string
  description: string | null
  locale: string
  publishedAt: string | null
  path: string
  keywords?: string
  attributionLink: string
  h1: string
  content: string
  sideBanner: string
  createdAt: string
  updatedAt: string
  cover: BlogCover
  localizations: BlogLocalization[]
}

export interface BlogCover {
  id: number
  documentId: string
  name: string
  url: string
}

export interface BlogLocalization {
  id: number
  documentId: string
  locale: string
}


