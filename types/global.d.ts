import type en from '../messages/en.json'

type Messages = typeof en

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages { }

  // 环境变量类型声明
  namespace NodeJS {
    interface ProcessEnv {
      // 自定义环境变量，为了在浏览器环境下访问
      NEXT_PUBLIC_APP_ENV: 'production' | 'development' | 'test'
      NEXT_PUBLIC_SITE_URL: string
      NEXT_PUBLIC_API_BASE_URL: string
    }
  }
}
