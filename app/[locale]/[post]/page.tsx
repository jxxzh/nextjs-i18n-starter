/* eslint-disable react-dom/no-dangerously-set-innerhtml */

import type { Metadata } from 'next'
import appConfig from '@/app-config'
import Comments from '@/components/common/comments'
import { CustomMDX } from '@/components/common/mdx'
import { getBlogItem } from '@/lib/cms'
import { localesConfig } from '@/lib/i18n/routing'
import { removeSearchData } from '@/lib/mdx/search-data'
import defaultAvatar from '@/public/images/default-avatar.png'
import dayjs from 'dayjs'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import './mdx.css'

// 设置页面重新验证时间为1800秒(30分钟)
export const revalidate = 1800

// 强制使用静态生成模式
export const dynamic = 'force-static'

// 由于使用了动态路由[locale]和[post],为实现SSG渲染，需要实现此方法
// 这里返回空数组,表示不预生成任何静态路径
// 详见：https://nextjs.org/docs/app/api-reference/functions/generate-static-params#all-paths-at-runtime
export async function generateStaticParams() {
  return []
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string, post: string }> },
): Promise<Metadata | null> {
  const { locale, post } = await params

  const article = await getBlogItem(post, { locale })

  if (!article) {
    return null
  }

  const {
    title,
  } = article

  const description = article.description ?? undefined
  const publishedTime = article.publishedAt ?? undefined
  const modifiedTime = article.updatedAt ?? undefined

  return {
    title,
    description,
    applicationName: appConfig.appName,
    metadataBase: new URL(appConfig.siteUrl),
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${appConfig.siteUrl}/${article.path}`,
      publishedTime,
      modifiedTime,
      // images: [
      //   {
      //     url: ogImage,
      //   },
      // ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // images: [ogImage],
    },
    alternates: {
      canonical: `${appConfig.siteUrl}/${article.path}`,
    },
  }
}

export default async function Blog({ params }: { params: Promise<{ locale: string, post: string }> }) {
  const { post, locale } = await params
  if (!localesConfig.some(item => item.code === locale)) {
    return notFound()
  }

  const blogInfo = await getBlogItem(post, { locale })

  if (!blogInfo) {
    // 删除搜索数据
    removeSearchData(locale, post)
    return notFound()
  }

  setRequestLocale(locale)

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': blogInfo.title,
            'datePublished': blogInfo.publishedAt,
            'dateModified': blogInfo.publishedAt,
            'description': blogInfo.description,
            'image': blogInfo.cover.url,
            'url': `${appConfig.siteUrl}/${blogInfo.path}`,
            // 'author': {
            //   '@type': 'Person',
            //   'name': 'My Portfolio',
            // },
          }),
        }}
      />
      <main className="flex-col max-w-4xl mx-auto px-6 mb-5 mt-20">
        <h1 className="font-bold text-5xl tracking-tighter">
          {blogInfo.title}
        </h1>
        <div className="mt-3 flex items-center text-xs">
          <Image src={defaultAvatar} alt="author" width={32} height={32} className="mr-3" />
          {appConfig.author}
          <span className="ml-3 opacity-60">
            {blogInfo.publishedAt ? dayjs(blogInfo.publishedAt).format('MMM DD, YYYY') : ''}
          </span>
        </div>
        <br />
        <figure className="w-full flex-center">
          <img src={blogInfo.cover.url} alt={blogInfo.cover.name} className="w-full max-w-[500px]" />
        </figure>
        <br />
        <br />
        <article className="w-full max-w-none prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
          <CustomMDX locale={locale} blogInfo={blogInfo} />
        </article>
        <Comments blogInfo={blogInfo} locale={locale} className="mt-10" />
      </main>
    </>
  )
}
