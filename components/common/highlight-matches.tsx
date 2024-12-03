import type { ReactElement, ReactNode } from 'react'
import escapeStringRegexp from 'escape-string-regexp'
import { memo } from 'react'

interface MatchArgs {
  value?: string
  match: string
}

export const HighlightMatches = memo<MatchArgs>(({
  value,
  match,
}: MatchArgs): ReactElement | null => {
  if (!value) {
    return null
  }
  const splitText = value.split('')
  const escapedSearch = escapeStringRegexp(match.trim())
  const regexp = new RegExp(escapedSearch.replaceAll(/\s+/g, '|'), 'gi')
  let result
  let index = 0
  const content: (string | ReactNode)[] = []

  // eslint-disable-next-line no-cond-assign
  while ((result = regexp.exec(value))) {
    if (result.index === regexp.lastIndex) {
      regexp.lastIndex++
    }
    else {
      const before = splitText.splice(0, result.index - index).join('')
      const after = splitText
        .splice(0, regexp.lastIndex - result.index)
        .join('')
      content.push(
        before,
        <span key={result.index} className="text-primary">
          {after}
        </span>,
      )
      index = regexp.lastIndex
    }
  }

  return (
    <>
      {content}
      {splitText.join('')}
    </>
  )
})
