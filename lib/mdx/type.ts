import type { ProcessorOptions } from '@mdx-js/mdx'
import type { MDXProvider } from '@mdx-js/react'
import type { Heading as MDASTHeading } from 'mdast'
import type { z } from 'zod'
import type { searchSchema } from './schema'

export interface CompileMdxOptions<TScope = Record<string, unknown>> {
  source: string
  components?: React.ComponentProps<typeof MDXProvider>['components']
  mdxOptions?: ProcessorOptions
  scope?: TScope
}

export interface CompileMDXResult {
  content: React.ReactElement
  structurizedData: StructurizedData
  toc: CustomHeading[]
}

export interface CustomHeading {
  depth: Exclude<MDASTHeading['depth'], 1>
  value: string
  id: string
}

export type Search = z.infer<typeof searchSchema>

export type StructurizedData = Record<string, string>

export interface SearchData {
  [route: string]: {
    title: string
    data: StructurizedData
  }
}
