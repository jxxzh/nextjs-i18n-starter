import type { CompileMdxOptions, CompileMDXResult, CustomHeading, StructurizedData } from './type'
import { createProcessor } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { jsxRuntime } from './jsx-runtime.cjs'
import { remarkCustomHeadingId } from './remark-plugins/remark-custom-heading-id'
import { remarkHeadings } from './remark-plugins/remark-headings'
import { remarkStructurize } from './remark-plugins/remark-structurize'

type Processor = ReturnType<typeof createProcessor>

export async function compileMdx(
  options: CompileMdxOptions,
): Promise<CompileMDXResult> {
  const { source, mdxOptions, scope = {}, components } = options

  const compiler = createCompiler()
  const vFile = await compiler.process(source)
  const { structurizedData, toc } = vFile.data as {
    structurizedData: StructurizedData
    toc: CustomHeading[]
  }

  // https://github.com/shuding/nextra/issues/1032
  const compiledSource = String(vFile).replaceAll('__esModule', '_\\_esModule')

  const fullScope = Object.assign(
    {
      opts: jsxRuntime,
    },
    scope,
  )
  const keys = Object.keys(fullScope)
  const values = Object.values(fullScope)

  // now we eval the source code using a function constructor
  // in order for this to work we need to have React, the mdx createElement,
  // and all our components in scope for the function, which is the case here
  // we pass the names (via keys) in as the function's args, and execute the
  // function with the actual values.
  const hydrateFn = Reflect.construct(
    Function,
    keys.concat(`${compiledSource}`),
  )

  const Content: React.ElementType = hydrateFn.apply(hydrateFn, values).default

  return {
    content: <Content components={components} />,
    structurizedData,
    toc,
  }

  function createCompiler(): Processor {
    return createProcessor({
      format: 'mdx',
      remarkPlugins: [
        remarkGfm,
        [remarkHeadings, { isRemoteContent: true }],
        remarkCustomHeadingId,
        remarkStructurize,
      ],
      outputFormat: 'function-body',
      development: process.env.NODE_ENV === 'development',
      ...mdxOptions,
    })
  }
}
