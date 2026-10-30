import type { Control, CppShape, Language, Piece, Role, Values } from './types'

export type Segment = { text: string; part?: number; role?: Role; runs?: boolean }

export const segment = (piece: Piece): Segment => (typeof piece === 'string' ? { text: piece } : piece)

export const plainText = (pieces: Piece[]) => pieces.map((piece) => segment(piece).text).join('')

// Splits pieces into lines, so code can be drawn and indented line by line.
export function toLines(pieces: Piece[]): Segment[][] {
  const lines: Segment[][] = [[]]
  for (const piece of pieces) {
    const seg = segment(piece)
    seg.text.split('\n').forEach((text, i) => {
      if (i > 0) lines.push([])
      if (text) lines[lines.length - 1].push({ ...seg, text })
    })
  }
  return lines
}

const fromLines = (lines: Segment[][]): Piece[] => lines.flatMap((line, i) => (i === 0 ? line : ['\n', ...line]))

// C++ examples show only the lines that matter. This puts them in a whole program: an #include for each
// toolbox they use, and main() around them unless they already have one.
export function wholeCpp(pieces: Piece[], shape: CppShape): Piece[] {
  if (shape === 'whole') return pieces
  const code = plainText(pieces)
  const toolboxes = ['iostream', 'string', 'vector'].filter((name) => name === 'iostream' || code.includes(`std::${name}`))
  const head: Segment[][] = [...toolboxes.map((name) => [{ text: `#include <${name}>` }]), []]
  const body = toLines(pieces)
  if (shape === 'functions') return fromLines([...head, ...body])
  const indented = body.map((line) => (line.length ? [{ text: '    ' }, ...line] : line))
  return fromLines([...head, [{ text: 'int main() {' }], ...indented, [{ text: '}' }]])
}

// The whole program as text, for running it.
export const programText = (pieces: Piece[], language: Language, shape: CppShape) =>
  `${plainText(language === 'cpp' ? wholeCpp(pieces, shape) : pieces)}\n`

// Text typed into "Change it" goes inside double quotes in the code. In all three languages, a backslash
// or a double quote there needs a backslash in front of it.
export const MAX_TEXT = 24
export const cleanText = (text: string) => text.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, MAX_TEXT)
export const quoted = (text: string) => `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`

export const initialValues = (controls: Control[] = []): Values =>
  Object.fromEntries(controls.map((control) => [control.id, control.initial]))

// Colors plain code the way an editor would, with the same four roles as the numbered pieces.
const COMMANDS: Record<Language, string[]> = {
  python: ['print', 'if', 'elif', 'else', 'for', 'in', 'range', 'while', 'def', 'return', 'and', 'or', 'not', 'len', 'append'],
  javascript: ['console', 'log', 'let', 'const', 'if', 'else', 'for', 'of', 'in', 'while', 'function', 'return', 'length', 'push'],
  cpp: [
    'std', 'cout', 'string', 'vector', 'int', 'double', 'bool', 'void', 'if', 'else', 'for', 'while', 'return',
    'include', 'iostream', 'main', 'size', 'push_back',
  ],
}
const YES_NO = ['True', 'False', 'true', 'false']

export type Token = { text: string; kind?: Role | 'comment' }

export function tokenize(text: string, language: Language): Token[] {
  const comment = language === 'python' ? '#.*' : '\\/\\/.*'
  const pattern = new RegExp(`(${comment})|("(?:[^"\\\\]|\\\\.)*")|(\\d+(?:\\.\\d+)?)|([A-Za-z_]\\w*)|([^\\sA-Za-z_\\d"]+)`, 'g')
  const tokens: Token[] = []
  let last = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) tokens.push({ text: text.slice(last, index) })
    const [whole, isComment, isText, isNumber, word] = match
    let kind: Token['kind'] = 'punctuation'
    if (isComment) kind = 'comment'
    else if (isText || isNumber) kind = 'value'
    else if (word) kind = YES_NO.includes(word) ? 'value' : COMMANDS[language].includes(word) ? 'command' : 'name'
    tokens.push({ text: whole, kind })
    last = index + whole.length
  }
  if (last < text.length) tokens.push({ text: text.slice(last) })
  return tokens
}
