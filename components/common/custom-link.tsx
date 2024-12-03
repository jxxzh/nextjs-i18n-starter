import { reportEvent } from '@/lib/analytics'
import { Link } from '@/lib/i18n/routing'

interface CustomLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventKey?: string
}

export function CustomLink(props: CustomLinkProps) {
  const { href = '', children, eventKey } = props

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (eventKey) {
      reportEvent(eventKey)
    }
  }

  if (href.startsWith('/')) {
    return (
      <Link {...props} href={href} onClick={handleClick}>
        {children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} onClick={handleClick} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} onClick={handleClick} />
}
