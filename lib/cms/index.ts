import type { BlogInfo } from './model'
import qs from 'qs'
import { strapiRequest } from './strapi'

const simpleFields = ['title', 'description', 'locale', 'publishedAt', 'path'] as const
const status = process.env.NODE_ENV === 'production' ? 'published' : 'draft'
const cover = {
  fields: ['name', 'url'],
}

interface BlogQuery {
  locale: string
}

export type BlogSimpleInfo = Pick<BlogInfo, 'id' | 'documentId' | 'cover' | (typeof simpleFields)[number]>

export async function getBlogPosts<T extends BlogQuery>(queryObject?: T): Promise<BlogSimpleInfo[]> {
  const query = qs.stringify({
    fields: simpleFields,
    filters: {
      content: {
        $notNull: true,
      },
    },
    populate: {
      cover,
    },
    status,
    ...queryObject,
  })
  return strapiRequest(`/wikis?${query}`)
}

export type BlogSiteMapInfo = Pick<BlogInfo, 'id' | 'localizations' | 'path'>

export async function getSiteMapPosts(): Promise<BlogSiteMapInfo[]> {
  const query = qs.stringify({
    fields: ['path'],
    filters: {
      content: {
        $notNull: true,
      },
    },
    populate: {
      localizations: {
        fields: ['locale'],
      },
    },
    status,
  })
  return strapiRequest(`/wikis?${query}`)
}

export async function getBlogItem<T extends BlogQuery>(path: string, queryObject: T) {
  const query = qs.stringify({
    filters: {
      path: {
        $eq: path,
      },
    },
    populate: {
      cover,
    },
    status,
    ...queryObject,
  })
  const res = await strapiRequest<BlogInfo[]>(`/wikis?${query}`)
  return res.length > 0 ? res[0] : null
}

export type BlogSearchInfo = Pick<BlogInfo, 'id' | 'content' | (typeof simpleFields)[number]>

export async function getSearchInfo(queryObject: BlogQuery): Promise<BlogSearchInfo[]> {
  const query = qs.stringify({
    fields: [...simpleFields, 'content'],
    status,
    ...queryObject,
  })
  return strapiRequest(`/wikis?${query}`)
}
