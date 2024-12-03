import type { SearchData } from './type'
import { readCacheFile, writeCacheFile } from '@/utils/file/cache'

function getSearchKey(locale: string) {
  return `search-data-${locale}.json`
}

export function getSearchData(locale: string) {
  return readCacheFile(getSearchKey(locale))
}

export async function updateSearchData(locale: string, data: SearchData) {
  const fileName = getSearchKey(locale)
  const oldContent = await getSearchData(locale)
  const oldData = JSON.parse(oldContent || '{}')

  return writeCacheFile(fileName, JSON.stringify({ ...oldData, ...data }))
}

export async function removeSearchData(locale: string, route: string) {
  const fileName = getSearchKey(locale)
  const oldContent = await getSearchData(locale)
  const oldData = JSON.parse(oldContent || '{}')

  delete oldData[route]
  return writeCacheFile(fileName, JSON.stringify(oldData))
}
