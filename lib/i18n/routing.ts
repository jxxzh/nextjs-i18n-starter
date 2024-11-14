import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

interface LocaleConfig {
  code: string
  desc: string
}

export const localesConfig: LocaleConfig[] = [
  // 英语
  { code: 'en', desc: 'English' },
  // 简体中文
  { code: 'zh-CN', desc: '简体中文' },
]

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: localesConfig.map(({ code }) => code),
  // Used when no locale matches
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, permanentRedirect, usePathname, useRouter }
  = createNavigation(routing)
