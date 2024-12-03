'use client'

import type { ReactNode } from 'react'
import { createContext, useMemo, useState } from 'react'
import { Flexsearch } from './flexsearch'

interface SearchContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SearchContext = createContext<SearchContextType>({
  open: false,
  setOpen: () => {},
})

function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({
    open,
    setOpen,
  }), [open])

  return (
    <SearchContext.Provider value={value}>
      {children}
      <Flexsearch />
    </SearchContext.Provider>
  )
}

export { SearchContext, SearchProvider }
