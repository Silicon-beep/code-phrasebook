import { AppLink } from '../components/AppLink'
import { notFound } from '../content'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFoundPage() {
  usePageTitle(notFound.title)
  return (
    <div className="page-container py-20 sm:py-28">
      <h1 className="text-4xl font-bold tracking-tight">{notFound.title}</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{notFound.text}</p>
      <AppLink href="/#phrases" className="btn btn-dark mt-8">
        {notFound.home}
      </AppLink>
    </div>
  )
}
