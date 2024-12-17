// In Next.js, this file would be called: app/providers.tsx
'use client'

import { createFirebaseApp } from '@/lib/analytics'
import logger from '@/lib/logger'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useEffect } from 'react'
// 导入本地化语言
import 'dayjs/locale/en'

// 通过一个单独的子组件来初始化客户端的配置，因为 useEffect 的执行顺序是子组件先于父组件
export default function ClientInitialization({ locale }: { locale: string }) {
  useEffect(() => {
    logger.info('ClientInitialization useEffect')
    // 客户端动态设置dayjs的时区和国际化语言
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.locale(locale)
    const userTz = dayjs.tz.guess()
    dayjs.tz.setDefault(userTz)
    logger.info({
      msg: 'dayjs locale set to user timezone',
      locale,
      userTz,
    })
  }, [locale])

  useEffect(() => {
    // 初始化firebase
    createFirebaseApp()
  }, [])
  return null
}
