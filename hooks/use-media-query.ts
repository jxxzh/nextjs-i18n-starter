import { useSyncExternalStore } from 'react'

function createSubscribe(query: string) {
  return (callback: () => void) => {
    const mediaQueryList = window.matchMedia(query)
    mediaQueryList.addEventListener('change', callback)
    return () => mediaQueryList.removeEventListener('change', callback)
  }
}

function createGetSnapshot(query: string) {
  return () => {
    return window.matchMedia(query).matches
  }
}

const getServerSnapshot = (initialValue: boolean) => () => initialValue

function useMediaQuery(query: string, initialValue: boolean = false): boolean {
  // 使用 useSyncExternalStore，并传入特定于该查询的 subscribe 和 getSnapshot 函数
  return useSyncExternalStore(
    createSubscribe(query),
    createGetSnapshot(query),
    getServerSnapshot(initialValue),
  )
}

export default useMediaQuery
