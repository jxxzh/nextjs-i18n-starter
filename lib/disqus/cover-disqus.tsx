'use client'
// 此组件用于遮挡住评论区的logo栏
import type { CSSProperties } from 'react'
import React, { useEffect, useState } from 'react'

export default function CoverDisqus() {
  const [height, setHeight] = useState('55px')
  // 使用媒体查询动态改变cover组件高度
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)')
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setHeight('90px') // 在小屏幕下改变高度
      }
      else {
        setHeight('55px')
      }
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange)

    // 设置初始状态
    if (mediaQuery.matches) {
      setHeight('90px')
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  const coverStyle: CSSProperties = {
    position: 'absolute',
    height,
    bottom: '0px',
    width: '100%',
  }

  return <div style={coverStyle} className="bg-background"></div>
}
