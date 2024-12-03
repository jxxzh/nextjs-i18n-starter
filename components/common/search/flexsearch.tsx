'use client'

import type { SearchData } from '@/lib/mdx/type'
import type { Document } from 'flexsearch'
import type { ReactElement } from 'react'
import { HighlightMatches } from '@/components/common/highlight-matches'
import { Link } from '@/lib/i18n/routing'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'
import { useCallback, useContext, useEffect, useState } from 'react'
import { SearchDialog, type SearchResult } from './search-dialog'
import { SearchContext } from './search-provider'

type SectionIndex = Document<
  {
    id: string
    url: string
    title: string
    pageId: string
    content: string
    display?: string
  },
  ['title', 'content', 'url', 'display']
>

type PageIndex = Document<
  {
    id: number
    title: string
    content: string
    route: string
  },
  ['title', 'route']
>

type Result = Omit<SearchResult, 'id'> & {
  _page_rk: number
  _section_rk: number
}

// This can be global for better caching.
const indexes: {
  [locale: string]: [PageIndex, SectionIndex]
} = {}

// Caches promises that load the index
const loadIndexesPromises = new Map<string, Promise<void>>()
function loadIndexes(basePath: string, locale: string): Promise<void> {
  const key = `${basePath}@${locale}`
  if (loadIndexesPromises.has(key)) {
    return loadIndexesPromises.get(key)!
  }
  const promise = loadIndexesImpl(basePath, locale)
  loadIndexesPromises.set(key, promise)
  return promise
}

async function loadIndexesImpl(basePath: string, locale: string): Promise<void> {
  const [searchData, Document] = await Promise.all([
    fetch(`/file-cache/search-data-${locale}.json`).then(
      response => response.json() as Promise<SearchData>,
    ),
    import('flexsearch').then(mod => mod.default.Document),
  ])

  const pageIndex: PageIndex = new Document({
    cache: 100,
    tokenize: 'full',
    document: {
      id: 'id',
      index: ['title', 'content'],
      store: ['title', 'route'],
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true,
    },
  })

  const sectionIndex: SectionIndex = new Document({
    cache: 100,
    tokenize: 'full',
    document: {
      id: 'id',
      index: 'content',
      tag: 'pageId',
      store: ['title', 'content', 'url', 'display'],
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true,
    },
  })

  let pageId = 0

  for (const [route, structurizedData] of Object.entries(searchData)) {
    let pageContent = ''
    ++pageId

    for (const [key, content] of Object.entries(structurizedData.data)) {
      const [headingId, headingValue] = key.split('#')
      const url = route + (headingId ? `#${headingId}` : '')
      const title = headingValue || structurizedData.title
      const paragraphs = content.split('\n').filter(Boolean)

      sectionIndex.add({
        id: url,
        url,
        title,
        pageId: `page_${pageId}`,
        content: title,
        ...(paragraphs[0] && { display: paragraphs[0] }),
      })

      for (let i = 0; i < paragraphs.length; i++) {
        sectionIndex.add({
          id: `${url}_${i}`,
          url,
          title,
          pageId: `page_${pageId}`,
          content: paragraphs[i],
        })
      }

      // Add the page itself.
      pageContent += ` ${title} ${content}`
    }

    pageIndex.add({
      id: pageId,
      title: structurizedData.title,
      content: pageContent,
      route,
    })
  }

  indexes[locale] = [pageIndex, sectionIndex]
}

function Flexsearch(): ReactElement {
  const locale = useLocale()
  const basePath = ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [search, setSearch] = useState('')
  const { open } = useContext(SearchContext)

  const doSearch = (search: string) => {
    if (!search || !indexes[locale]) {
      setResults([])
      return
    }
    const [pageIndex, sectionIndex] = indexes[locale]

    // Show the results for the top 5 pages
    const pageResults
      = pageIndex.search<true>(search, 5, {
        enrich: true,
        suggest: true,
      })[0]?.result || []

    const results: Result[] = []
    const pageTitleMatches: Record<number, number> = {}

    for (let i = 0; i < pageResults.length; i++) {
      const result = pageResults[i]
      pageTitleMatches[i] = 0

      // Show the top 5 results for each page
      const sectionResults
        = sectionIndex.search<true>(search, 5, {
          enrich: true,
          suggest: true,
          tag: `page_${result.id}`,
        })[0]?.result || []

      // 当只有标题匹配时，不会走下面的循环，所以需要单独处理
      if (sectionResults.length === 0) {
        results.push({
          _page_rk: i,
          _section_rk: 0,
          route: result.doc.route,
          prefix: (
            <Prefix search={search} title={result.doc.title} route={result.doc.route} />
          ),
          children: null,
        })
        continue
      }

      let isFirstItemOfPage = true
      const occurred: Record<string, boolean> = {}

      for (let j = 0; j < sectionResults.length; j++) {
        const { doc } = sectionResults[j]
        const isMatchingTitle = doc.display !== undefined
        if (isMatchingTitle) {
          pageTitleMatches[i]++
        }
        const { url, title } = doc
        const content = doc.display || doc.content
        if (occurred[`${url}@${content}`])
          continue
        occurred[`${url}@${content}`] = true
        results.push({
          _page_rk: i,
          _section_rk: j,
          route: url,
          prefix: isFirstItemOfPage && (
            <Prefix search={search} title={result.doc.title} route={url} />
          ),
          children: (
            <Link
              href={url}
              className="my-2"
            >
              <div className="text-base font-semibold">
                <HighlightMatches match={search} value={title} />
              </div>
              {content && (
                <div className="mt-1 text-sm">
                  <HighlightMatches match={search} value={content} />
                </div>
              )}
            </Link>
          ),
        })
        isFirstItemOfPage = false
      }
    }

    setResults(
      results
        .sort((a, b) => {
          // Sort by number of matches in the title.
          if (a._page_rk === b._page_rk) {
            return a._section_rk - b._section_rk
          }
          if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
            return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk]
          }
          return a._page_rk - b._page_rk
        })
        .map(res => ({
          id: `${res._page_rk}_${res._section_rk}`,
          route: res.route,
          prefix: res.prefix,
          children: res.children,
        })),
    )
  }

  const preload = useCallback(async () => {
    if (indexes[locale])
      return
    setLoading(true)
    try {
      await loadIndexes(basePath, locale)
    }
    catch {
      setError(true)
    }
    setLoading(false)
  }, [locale, basePath])

  const handleChange = (value: string) => {
    setSearch(value)
    if (loading)
      return
    doSearch(value)
  }

  useEffect(() => {
    if (open) {
      preload()
    }
  }, [preload, open])

  return (
    <SearchDialog
      loading={loading}
      error={error}
      value={search}
      onChange={handleChange}
      results={results}
    />
  )
}

function Prefix({ search, title, route }: { search: string, title: string, route: string }) {
  return (
    <Link
      href={route}
      className={cn(
        'py-3 text-sm select-none font-medium uppercase',
      )}
    >
      <HighlightMatches match={search} value={title} />
    </Link>
  )
}

export { Flexsearch }
