/// <reference types="node" />
// Runs every example on the site in real Python, JavaScript and C++, and checks that the screen shows
// exactly what the page says: each phrase with its starting values and with other "Change it" values, and
// every example under "Same idea, different spelling". It needs python3, node and a C++ compiler (c++).
import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { availableParallelism, tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { initialValues, programText } from './code'
import { phrases } from './phrases'
import { LANGUAGES, type Control, type Language, type Output, type Value } from './types'

const run = promisify(execFile)

// Values to try in each "Change it" control, besides the one it starts with.
function samples(control: Control): Value[] {
  switch (control.kind) {
    case 'text':
      return ['Hi there', 'Say "hi"', 'a\\b', 'ends with \\', 'Olá, café', '']
    case 'number':
      return [control.min, control.max]
    case 'yesno':
      return [!control.initial]
    case 'choice':
      return control.options.map((option) => option.value).filter((value) => value !== control.initial)
    case 'list':
      return [[], ['a "quoted" item'], Array.from({ length: control.max }, (_, i) => `item ${i + 1}`)]
  }
}

const linesFor = (output: Output, language: Language) => (Array.isArray(output) ? output : output[language])

type Program = { name: string; language: Language; code: string; expected: string[] }

const programs: Program[] = []
for (const phrase of phrases) {
  const start = initialValues(phrase.controls)
  const cases = [
    { name: 'starting values', values: start },
    ...(phrase.controls ?? []).flatMap((control) =>
      samples(control).map((sample) => ({ name: `${control.id} = ${JSON.stringify(sample)}`, values: { ...start, [control.id]: sample } })),
    ),
  ]
  for (const { name, values } of cases) {
    const version = phrase.build(values)
    for (const language of LANGUAGES) {
      programs.push({
        name: `${phrase.id}, ${name}`,
        language,
        code: programText(version.code[language], language, phrase.cpp),
        expected: linesFor(version.output, language),
      })
    }
  }
  phrase.differences.forEach(({ example }, i) => {
    if (!example) return
    for (const language of LANGUAGES) {
      const code = example.code[language]
      if (code === undefined) continue
      const shape = code.includes('int main(') ? 'functions' : 'statements'
      programs.push({
        name: `${phrase.id}, difference ${i + 1}`,
        language,
        code: programText([code], language, shape),
        expected: example.output[language] ?? [],
      })
    }
  })
}

const EXTENSION: Record<Language, string> = { python: 'py', javascript: 'js', cpp: 'cpp' }
type Result = { output: string[]; problem: string }

async function runProgram(dir: string, program: Program, index: number): Promise<Result> {
  const file = join(dir, `program${index}.${EXTENSION[program.language]}`)
  await writeFile(file, program.code)
  try {
    let stdout: string
    if (program.language === 'cpp') {
      const binary = join(dir, `program${index}`)
      await run('c++', ['-std=c++17', '-Wall', '-Wextra', '-Werror', '-o', binary, file])
      ;({ stdout } = await run(binary, [], { timeout: 10_000 }))
    } else {
      ;({ stdout } = await run(program.language === 'python' ? 'python3' : 'node', [file], { timeout: 10_000 }))
    }
    return { output: stdout === '' ? [] : stdout.replace(/\n$/, '').split('\n'), problem: '' }
  } catch (error) {
    const { message, stderr } = error as { message: string; stderr?: string }
    return { output: [], problem: `${message}\n${stderr ?? ''}`.trim() }
  }
}

let dir = ''
const results: Result[] = []

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'phrasebook-'))
  // Compiling C++ is slow, so run several programs at once.
  let next = 0
  const worker = async () => {
    while (next < programs.length) {
      const index = next++
      results[index] = await runProgram(dir, programs[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.max(2, availableParallelism()) }, worker))
}, 300_000)

afterAll(async () => {
  if (dir) await rm(dir, { recursive: true, force: true })
})

const NAMES: Record<Language, string> = { python: 'Python', javascript: 'JavaScript', cpp: 'C++' }

programs.forEach((program, index) => {
  test(`${program.name}, in ${NAMES[program.language]}`, () => {
    expect(results[index], program.code).toEqual({ output: program.expected, problem: '' })
  })
})
