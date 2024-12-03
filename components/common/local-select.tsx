'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMobile } from '@/hooks/use-breakpoint'
import { localesConfig, usePathname, useRouter } from '@/lib/i18n/routing'
import { cn } from '@/lib/utils'
import { SelectTrigger as SelectPrimitiveTrigger } from '@radix-ui/react-select'
import { Globe } from 'lucide-react'
import { useLocale } from 'next-intl'

export function LocaleSelect({
  classname,
}: { classname?: string }) {
  const currLocale = useLocale()

  const items = localesConfig.map(item => (
    <SelectItem key={item.code} value={item.code}>
      {item.desc}
    </SelectItem>
  ))

  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()

  const setLocale = (locale: string) => {
    // 跳转到对应 locale 的路由下
    router.replace(pathname, { locale })
  }

  return (
    <Select value={currLocale} onValueChange={setLocale}>
      {isMobile
        ? (
            <SelectPrimitiveTrigger className={cn(
              'inline-flex',
              classname,
            )}
            >
              <Globe size={24} />
            </SelectPrimitiveTrigger>
          )
        : (
            <SelectTrigger className={cn(
              'inline-flex w-[110px] border-none shadow-none focus:ring-0 text-sm dt:text-base',
              classname,
            )}
            >
              <SelectValue />
            </SelectTrigger>
          )}

      <SelectContent className="z-[100]">
        {items}
      </SelectContent>
    </Select>
  )
}
