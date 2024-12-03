import type { BlogInfo } from '@/lib/cms/model'
import CoverDisqus from '@/lib/disqus/cover-disqus'
import DiscussionEmbed from '@/lib/disqus/discussion-embed'

export default function Comments({ blogInfo, locale }: { blogInfo: BlogInfo, locale: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <DiscussionEmbed
        shortname={process.env.DISQUS_PRODUCT_SHOT_NAME}
        config={
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${blogInfo.path}`,
            identifier: `${process.env.NEXT_PUBLIC_SITE_URL}/${blogInfo.path}`,
            title: blogInfo.title,
            language: locale, // e.g. for Traditional Chinese (Taiwan)
          }
        }
      />
      <CoverDisqus />
    </div>
  )
}
