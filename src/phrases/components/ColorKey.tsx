import { roles } from '../../content'
import { withCode } from '../../lib/withCode'
import { ROLES, roleStyles } from '../roles'

// The four colors and what they mean.
export function ColorKey() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {ROLES.map((role) => (
        <li key={role} className="flex gap-4 rounded-card border border-line bg-white p-5 shadow-soft">
          <span aria-hidden="true" className={`mt-0.5 h-6 w-6 shrink-0 rounded-lg ${roleStyles[role].swatch}`} />
          <div>
            <p className="font-semibold">
              {roles[role].name} <span className="font-normal text-muted">· {roles[role].color}</span>
            </p>
            <p className="mt-1 leading-relaxed text-muted">{withCode(roles[role].text)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
