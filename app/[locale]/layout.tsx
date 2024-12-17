import { routing } from '@/lib/i18n/routing'
import { cn } from '@/lib/utils'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
// 导入字体文件
import { Poppins } from 'next/font/google'
import { notFound } from 'next/navigation'
import ClientInitialization from './client-initialization'
import Providers from './providers'
// 导入全局css
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // 根据需要的字重选择
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}) {
  const { locale } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={cn(
        poppins.className,
      )}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers locale={locale}>
            <ClientInitialization locale={locale} />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
