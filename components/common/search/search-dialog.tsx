'use client'

import type { ReactElement, ReactNode, SyntheticEvent } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { SearchIcon } from 'lucide-react'
import { useCallback, useContext, useEffect, useRef } from 'react'
import { SearchContext } from './search-provider'

export interface SearchResult {
  children: ReactNode
  id: string
  prefix?: ReactNode
  route: string
}

interface SearchProps {
  value: string
  onChange: (newValue: string) => void
  loading?: boolean
  error?: boolean
  results: SearchResult[]
}

const INPUTS = new Set(['input', 'select', 'button', 'textarea'])

function SearchDialog({
  value,
  onChange,
  loading,
  results,
}: SearchProps): ReactElement {
  const { open, setOpen: handleOpen } = useContext(SearchContext)!
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function down(event: globalThis.KeyboardEvent) {
      const input = inputRef.current
      const activeElement = document.activeElement as HTMLElement
      const tagName = activeElement?.tagName.toLowerCase()
      if (
        !input
        || !tagName
        || INPUTS.has(tagName)
        || activeElement?.isContentEditable
      ) {
        return
      }
      if (
        event.key === '/'
        || (event.key === 'k'
          && (event.metaKey /* for Mac */ || /* for non-Mac */ event.ctrlKey))
      ) {
        event.preventDefault()
        handleOpen(true)
      }
    }

    window.addEventListener('keydown', down)
    return () => {
      window.removeEventListener('keydown', down)
    }
  }, [handleOpen])

  const handleChange = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      onChange(value)
    },
    [onChange],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="overflow-hidden p-0 gap-0 rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="hidden">Search</DialogTitle>
          <DialogDescription className="hidden">Search</DialogDescription>
          <div className="flex items-center border-b px-3">
            <SearchIcon className="mr-2 shrink-0 text-primary" size={24} />
            <input
              value={value}
              ref={inputRef}
              spellCheck={false}
              autoComplete="off"
              onInput={handleChange}
              type="search"
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none [&::-webkit-search-cancel-button]:hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 "
            />
          </div>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-4 [&>*+*]:mt-4">
          {results.length > 0
            ? (
                results.map((searchResult, index) => (
                  <div
                    key={searchResult.id}
                    className="flex flex-col"
                    onClick={() => {
                      handleOpen(false)
                    }}
                  >
                    {index !== 0 && searchResult.prefix && <Separator />}
                    {searchResult.prefix}
                    {searchResult.children}
                  </div>
                ))
              )
            : (
                <div className="flex items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : 'No results'}
                  </p>
                </div>
              )}
        </div>

      </DialogContent>
    </Dialog>
  )
}

export { SearchDialog }
