import type { ISitemapField } from 'next-sitemap'
import { getSiteMapPosts } from '@/lib/cms'
import logger from '@/lib/logger'
import { getServerSideSitemap } from 'next-sitemap'

export async function GET(_: Request) {
  try {
    const posts = await getSiteMapPosts()
    const dynamicUrls = posts.map((post) => {
      const alternateRefs = post.localizations.map(({ locale }: { locale: string }) => ({
        href: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${post.path}`,
        hreflang: locale,
      }))
      return {
        loc: `${process.env.NEXT_PUBLIC_SITE_URL}/${post.path}`,
        alternateRefs: alternateRefs.length > 0 ? alternateRefs : undefined,
      } as ISitemapField
    })
    logger.info({
      module: 'server-sitemap.xml',
      dynamicUrls,
    })
    return getServerSideSitemap(dynamicUrls)
  }
  catch (error) {
    console.error('Sitemap generation error:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
