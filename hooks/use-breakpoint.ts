import { useSyncExternalStore } from 'react'

const breakpoints = {
  'zero': 0,
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
}

type Breakpoint = keyof typeof breakpoints

// 创建一个订阅函数
function subscribe(callback: () => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }
  return () => {}
}

// 创建一个获取当前断点的函数
function getSnapshot(initialValue: Breakpoint): () => Breakpoint {
  return () => {
    if (typeof window === 'undefined') {
      return initialValue // 默认值，用于服务端渲染
    }

    const width = window.innerWidth
    const breakpointEntries = Object.entries(breakpoints).reverse()

    for (const [breakpoint, minWidth] of breakpointEntries) {
      if (width >= minWidth) {
        return breakpoint as Breakpoint
      }
    }

    return initialValue // 如果没有匹配的断点，返回最小的断点
  }
}

// 使用 useSyncExternalStore 创建自定义 hook
function useBreakpoint(initialValue: Breakpoint = 'zero'): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot(initialValue), () => initialValue)
}

// 当屏幕宽度小于等于 sm 时，返回 true
function useMobile(initialValue: Breakpoint = 'zero') {
  const breakpoint = useBreakpoint(initialValue)
  return breakpoint === 'zero' || breakpoint === 'sm'
}

export { useBreakpoint, useMobile }
