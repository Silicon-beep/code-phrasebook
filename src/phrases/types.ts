import type { ReactNode } from 'react'

export type Language = 'python' | 'javascript' | 'cpp'
export const LANGUAGES: readonly Language[] = ['python', 'javascript', 'cpp']

export type ChapterId = 'talking' | 'remembering' | 'deciding' | 'repeating' | 'lists' | 'commands'

// What a piece of code is, like a part of speech in English. Each role has one color everywhere.
export type Role = 'command' | 'name' | 'value' | 'punctuation'

// Plain text, or a piece with a number. Pieces with the same number mean the same thing in the English
// and in every language. `role` gives one piece a different color from the rest of its part, and `runs`
// marks a line that runs (in an if/else, only one branch does).
export type Piece = string | { text: string; part?: number; role?: Role; runs?: boolean }

// One numbered part of a phrase. `missing` says why the English or a language has no piece for it.
export type Part = {
  role: Role
  note?: string
  missing?: Partial<Record<Language | 'english', string>>
}

export type Value = string | number | boolean | string[]
export type Values = Record<string, Value>

// "Change it" controls. Their values go to the phrase's build().
export type Control =
  | { kind: 'text'; id: string; label: string; initial: string }
  | { kind: 'number'; id: string; label: string; initial: number; min: number; max: number }
  | { kind: 'yesno'; id: string; label: string; initial: boolean }
  | { kind: 'choice'; id: string; label: string; initial: string; options: { value: string; label: string }[] }
  | { kind: 'list'; id: string; label: string; initial: string[]; max: number }

// What the screen shows: the same lines for every language, or different lines for each.
export type Output = string[] | Record<Language, string[]>

export type Version = {
  english: Piece[]
  code: Record<Language, Piece[]>
  output: Output
  // A plain-English reading of each language's code, for code that doesn't read like the sentence.
  readAloud?: Partial<Record<Language, string>>
}

export type Difference = {
  // Which languages this is about. Left out, it's about all three.
  languages?: Language[]
  // `Backticks` show as code.
  text: string
  watchOut?: boolean
  // A tiny program that shows the difference. The snippet test runs it, so these outputs are real.
  example?: { code: Partial<Record<Language, string>>; output: Partial<Record<Language, string[]>> }
}

// How the C++ code fits in a whole program: lines that go inside main(), functions followed by their
// own main(), or a program that's already whole.
export type CppShape = 'statements' | 'functions' | 'whole'

export type Phrase = {
  id: string
  chapter: ChapterId
  title: string
  // One line: what the idea is.
  idea: string
  // What programmers call it.
  term: string
  parts: Part[]
  controls?: Control[]
  build: (values: Values) => Version
  cpp: CppShape
  differences: Difference[]
  picture: (values: Values) => { visual: ReactNode; caption: string }
}
