import type { Role } from './types'

// One color family per role, on every page. Full class names (never built by string interpolation) so
// Tailwind can find them. Text uses the -dark shades, which pass 4.5:1 on white and on the tints.
//   pill      a numbered piece
//   lit       a numbered piece whose number is lit up: solid, with white text
//   badge     the number on a piece (white text)
//   badgeLit  the number on a lit piece
//   text      plain code of this role, colored like an editor would
//   swatch    the color key's sample
export const roleStyles: Record<Role, { pill: string; lit: string; badge: string; badgeLit: string; text: string; swatch: string }> = {
  command: {
    pill: 'bg-violet-tint border-violet',
    lit: 'bg-violet-dark border-violet-dark text-white',
    badge: 'bg-violet-dark text-white',
    badgeLit: 'bg-white text-violet-dark',
    text: 'text-violet-dark',
    swatch: 'bg-violet',
  },
  name: {
    pill: 'bg-blue-tint border-blue',
    lit: 'bg-blue border-blue text-white',
    badge: 'bg-blue text-white',
    badgeLit: 'bg-white text-blue',
    text: 'text-blue',
    swatch: 'bg-blue',
  },
  value: {
    pill: 'bg-orange-tint border-orange',
    lit: 'bg-orange-dark border-orange-dark text-white',
    badge: 'bg-orange-dark text-white',
    badgeLit: 'bg-white text-orange-dark',
    text: 'text-orange-dark',
    swatch: 'bg-orange',
  },
  punctuation: {
    pill: 'bg-green-tint border-green',
    lit: 'bg-green-dark border-green-dark text-white',
    badge: 'bg-green-dark text-white',
    badgeLit: 'bg-white text-green-dark',
    text: 'text-green-dark',
    swatch: 'bg-green',
  },
}

export const ROLES: readonly Role[] = ['command', 'name', 'value', 'punctuation']
