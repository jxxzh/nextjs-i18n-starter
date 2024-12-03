'use client'

import { Slot } from '@radix-ui/react-slot'
import { useContext } from 'react'
import { SearchContext } from './search-provider'

interface SearchTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

function SearchTrigger({ children, asChild }: SearchTriggerProps) {
  const { setOpen } = useContext(SearchContext)!

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp onClick={() => setOpen(true)}>
      {children}
    </Comp>
  )
}

export { SearchTrigger }
