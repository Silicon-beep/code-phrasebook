// One small picture per phrase, so the idea can be seen before it's read. They're hidden from screen
// readers because each phrase's caption says the same thing in words. Where a picture uses the role
// colors, it means the same as in the code: a box's label is a name (blue), what's inside is a value (orange).
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  Cog,
  FileText,
  Hash,
  Mail,
  Megaphone,
  Repeat,
  Ruler,
  StickyNote,
  Sun,
  ToggleLeft,
  ToggleRight,
  Trees,
  Type,
  Umbrella,
  Glasses,
  X,
} from 'lucide-react'

const Arrow = () => <ArrowRight className="h-6 w-6 shrink-0 text-muted" />

function Circle({ icon: Icon, active = true }: { icon: LucideIcon; active?: boolean }) {
  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
        active ? 'bg-violet-tint text-violet-dark' : 'border-2 border-dashed border-subtle bg-white text-muted'
      }`}
    >
      <Icon className="h-7 w-7" />
    </span>
  )
}

// A value on its own: words in quotes or a number.
const Tile = ({ children }: { children: ReactNode }) => (
  <span className="rounded-xl bg-orange-tint px-4 py-3 font-mono text-2xl font-bold text-orange-dark">{children}</span>
)

// A variable: a box with a name on its label and a value inside.
function Box({ name, children }: { name: string; children: ReactNode }) {
  return (
    <span className="flex flex-col items-center">
      <span className="relative z-10 -mb-3 rounded-full bg-blue px-3 py-1 font-mono text-sm font-bold text-white">{name}</span>
      <span className="flex h-24 min-w-[7rem] items-center justify-center rounded-2xl border-4 border-blue bg-white px-4 font-mono text-3xl font-bold text-orange-dark">
        {children}
      </span>
    </span>
  )
}

export function Screen({ lines }: { lines: string[] }) {
  return (
    <div className="min-w-0 flex-1 rounded-2xl bg-ink p-4 font-mono text-[15px] leading-7 text-white shadow-soft">
      <div className="mb-2 flex gap-1.5">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-2.5 w-2.5 rounded-full bg-white/40" />
        ))}
      </div>
      {lines.map((line, i) => (
        <p key={i} className="break-words">
          {line || ' '}
        </p>
      ))}
    </div>
  )
}

export const SayPicture = ({ words }: { words: string }) => (
  <div className="flex w-full items-center gap-3">
    <Circle icon={Megaphone} />
    <Arrow />
    <Screen lines={[words]} />
  </div>
)

export const NotePicture = ({ note }: { note: string }) => (
  <div className="flex w-full flex-wrap items-center justify-center gap-6">
    <div className="w-44 -rotate-2 rounded-lg bg-orange-tint p-4 shadow-soft">
      <StickyNote className="h-6 w-6 text-orange-dark" />
      <p className="mt-2 break-words font-medium">{note || ' '}</p>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Circle icon={Bot} />
      <span className="text-sm font-semibold text-muted">skips the note</span>
    </div>
  </div>
)

export const ProgramPicture = () => (
  <div className="grid w-full grid-cols-2 gap-3">
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-soft">
      <FileText className="h-10 w-10 text-muted" />
      <p className="text-sm font-semibold">Python, JavaScript</p>
      <p className="text-sm text-muted">just the lines</p>
    </div>
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-soft">
      <Mail className="h-10 w-10 text-violet-dark" />
      <p className="text-sm font-semibold">C++</p>
      <p className="text-sm text-muted">
        lines inside <span className="font-mono">main()</span>
      </p>
    </div>
  </div>
)

export const BoxPicture = ({ name, value }: { name: string; value: ReactNode }) => (
  <div className="flex w-full justify-center">
    <Box name={name}>{value}</Box>
  </div>
)

export function KindsPicture({ likesPizza }: { likesPizza: boolean }) {
  const kinds = [
    { label: 'text', value: '"Sam"', icon: Type },
    { label: 'whole number', value: '12', icon: Hash },
    { label: 'decimal', value: '1.5', icon: Ruler },
    { label: 'yes or no', value: likesPizza ? 'yes' : 'no', icon: likesPizza ? ToggleRight : ToggleLeft },
  ]
  return (
    <ul className="grid w-full grid-cols-2 gap-3">
      {kinds.map(({ label, value, icon: Icon }) => (
        <li key={label} className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center shadow-soft">
          <Icon className="h-6 w-6 text-orange-dark" />
          <span className="font-mono text-xl font-bold text-orange-dark">{value}</span>
          <span className="text-sm text-muted">{label}</span>
        </li>
      ))}
    </ul>
  )
}

export const MathPicture = ({ a, symbol, b, total }: { a: number; symbol: string; b: number; total: number }) => (
  <div className="flex w-full flex-wrap items-center justify-center gap-2">
    <Tile>{a}</Tile>
    <span className="font-mono text-3xl font-bold text-green-dark">{symbol}</span>
    <Tile>{b}</Tile>
    <Arrow />
    <Box name="total">{total}</Box>
  </div>
)

export const ChangePicture = ({ add }: { add: number }) => (
  <div className="flex w-full flex-wrap items-center justify-center gap-3">
    <Box name="score">
      <span className="text-muted line-through decoration-4">0</span>
    </Box>
    <span className="flex flex-col items-center font-mono text-lg font-bold text-green-dark">
      += {add}
      <Arrow />
    </span>
    <Box name="score">{add}</Box>
  </div>
)

export function ComparePicture({ age }: { age: number }) {
  const yes = age >= 13
  const Icon = yes ? Check : X
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Box name="age">{age}</Box>
        <span className="font-mono text-3xl font-bold text-green-dark">&gt;=</span>
        <Tile>13</Tile>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full bg-orange-tint px-4 py-2 font-semibold text-orange-dark">
        <Icon className="h-5 w-5" />
        {yes ? 'Yes: true' : 'No: false'}
      </span>
    </div>
  )
}

// A fork in the road. The path the code takes is solid; the other is dashed.
export function ForkPicture({ raining }: { raining: boolean }) {
  const path = (taken: boolean) =>
    taken ? { className: 'stroke-violet', strokeWidth: 10 } : { className: 'stroke-subtle', strokeWidth: 4, strokeDasharray: '8 10' }
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <svg viewBox="0 0 320 210" className="block w-full" fill="none" strokeLinecap="round">
        <path d="M160 204V130" className="stroke-violet" strokeWidth={10} />
        <path d="M160 130C160 100 70 112 66 92" {...path(raining)} />
        <path d="M160 130C160 100 250 112 254 92" {...path(!raining)} />
      </svg>
      {[
        { icon: Umbrella, label: 'umbrella', taken: raining, place: 'left-[20.6%]' },
        { icon: Glasses, label: 'sunglasses', taken: !raining, place: 'left-[79.4%]' },
      ].map(({ icon, label, taken, place }) => (
        <span key={label} className={`absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1 ${place}`}>
          <Circle icon={icon} active={taken} />
          <span className={`text-sm font-semibold ${taken ? 'text-ink' : 'text-muted'}`}>{label}</span>
        </span>
      ))}
      <span className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 font-mono text-sm text-blue shadow-soft">
        raining?
      </span>
    </div>
  )
}

const LAMPS = { red: 'bg-red', yellow: 'bg-yellow', green: 'bg-green' } as const

export const TrafficPicture = ({ light, action }: { light: string; action: string }) => (
  <div className="flex w-full items-center justify-center gap-6">
    <div className="flex flex-col gap-3 rounded-[28px] bg-ink p-3">
      {(Object.keys(LAMPS) as (keyof typeof LAMPS)[]).map((color) => (
        <span key={color} className={`h-14 w-14 rounded-full ${color === light ? LAMPS[color] : 'bg-white/15'}`} />
      ))}
    </div>
    <p className="text-3xl font-bold">{action}</p>
  </div>
)

function Question({ icon: Icon, label, yes }: { icon: LucideIcon; label: string; yes: boolean }) {
  return (
    <span className="flex flex-col items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-soft">
      <Icon className="h-7 w-7 text-blue" />
      <span className="font-mono text-sm text-blue">{label}</span>
      <span className="rounded-full bg-orange-tint px-3 text-sm font-semibold text-orange-dark">{yes ? 'yes' : 'no'}</span>
    </span>
  )
}

export function SwitchesPicture({ sunny, weekend }: { sunny: boolean; weekend: boolean }) {
  const both = sunny && weekend
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Question icon={Sun} label="sunny" yes={sunny} />
        <span className="font-mono text-xl font-bold text-violet-dark">and</span>
        <Question icon={CalendarDays} label="weekend" yes={weekend} />
      </div>
      <ArrowDown className="h-6 w-6 text-muted" />
      <span className="flex flex-col items-center gap-1">
        <Circle icon={both ? Trees : BookOpen} />
        <span className="text-sm font-semibold">{both ? 'park' : 'book'}</span>
      </span>
    </div>
  )
}

export const LoopPicture = ({ times }: { times: number }) => (
  <div className="flex w-full flex-col items-center gap-4">
    <Circle icon={Repeat} />
    <ol className="flex flex-wrap justify-center gap-2">
      {Array.from({ length: times }, (_, i) => (
        <li key={i} className="rounded-full bg-white px-3 py-1.5 font-mono text-sm shadow-soft">
          <span className="text-blue">i</span> = <span className="font-bold text-orange-dark">{i}</span>
        </li>
      ))}
    </ol>
  </div>
)

// The glass is the box called cups, so it's drawn in the names' blue.
export const GlassPicture = ({ size }: { size: number }) => (
  <div className="flex w-full items-end justify-center gap-6">
    <div className="flex w-28 flex-col-reverse gap-1 rounded-b-3xl border-x-4 border-b-4 border-blue p-1.5 pt-8">
      {Array.from({ length: size }, (_, i) => (
        <span key={i} className="flex h-8 items-center justify-center rounded-lg bg-blue-tint text-sm font-semibold text-blue">
          cup {i + 1}
        </span>
      ))}
    </div>
    <p className="text-2xl font-bold">Full!</p>
  </div>
)

// A list as a row of boxes, with each box's position above it. `chosen` marks the item shown, and
// `rounds` numbers the loop's rounds underneath.
export function ListPicture({ items, chosen, rounds = false }: { items: string[]; chosen?: number; rounds?: boolean }) {
  if (items.length === 0) {
    return (
      <div className="flex w-full justify-center">
        <span className="flex h-16 items-center rounded-xl border-2 border-dashed border-subtle px-6 text-muted">empty list</span>
      </div>
    )
  }
  return (
    <ol className="flex w-full flex-wrap justify-center gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex flex-col items-center gap-1">
          <span className="font-mono text-sm font-bold text-orange-dark">{i}</span>
          <span
            className={`flex h-16 min-w-[4.5rem] max-w-[10rem] items-center justify-center break-all rounded-xl border-2 bg-white px-3 text-center font-medium ${
              i === chosen ? 'border-ink shadow-lift' : 'border-blue'
            }`}
          >
            {item}
          </span>
          {i === chosen && <span className="text-sm font-semibold">shown</span>}
          {rounds && <span className="text-sm text-muted">round {i + 1}</span>}
        </li>
      ))}
    </ol>
  )
}

// A function as a machine: something goes in, the named machine works on it, and something comes out.
export const MachinePicture = ({ name, input, output }: { name: string; input: string; output: string }) => (
  <div className="flex w-full flex-wrap items-center justify-center gap-2">
    <Tile>{input}</Tile>
    <Arrow />
    <span className="flex flex-col items-center rounded-2xl bg-violet-tint px-4 py-3">
      <Cog className="h-8 w-8 text-violet-dark" />
      <span className="font-mono font-bold text-blue">{name}</span>
    </span>
    <Arrow />
    <span className="max-w-full break-words rounded-xl bg-white px-4 py-3 text-lg font-semibold shadow-soft">{output}</span>
  </div>
)
