import type { BlogInfo } from '@/lib/cms/model'
import type { CompileMdxOptions } from '@/lib/mdx/type'
import { CustomLink } from '@/components/common/custom-link'
import { compileMdx } from '@/lib/mdx/compile'
import { updateSearchData } from '@/lib/mdx/search-data'
import { cn } from '@/lib/utils'
import React from 'react'
import { Callout } from './callout'
import DateFormat from './date-format'

function RoundedImage(props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  const { className, ...rest } = props
  return (
    <img // 这里用 next-image 的话不是很好处理宽高预设，所以直接用 img
      style={{ width: '100%', height: 'auto' }}
      className={cn('rounded-lg', className)}
      {...rest}
    />
  )
}

const defaultComponents: CompileMdxOptions['components'] = {
  img: RoundedImage,
  a: CustomLink,
  ALink: CustomLink,
  Link: CustomLink,
  Callout,
  DateFormat,
}

export async function CustomMDX(props: Omit<CompileMdxOptions, 'source'> & { locale: string, blogInfo: BlogInfo }) {
  const { components, mdxOptions, locale, blogInfo } = props
  const { path, title } = blogInfo
  const { content, structurizedData } = await compileMdx({
    source: blogInfo.content,
    components: { ...defaultComponents, ...components },
    mdxOptions,
  })
  // 保存数据
  updateSearchData(locale, { [path]: { title, data: structurizedData } })
  return content
}
