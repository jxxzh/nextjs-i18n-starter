import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('Config.title'),
    description: t('Config.description'),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  return (
    <>
      <h1>{t('Config.title')}</h1>
      <p>{t('Config.description')}</p>
      <Button>Click me</Button>
    </>
  )
}
