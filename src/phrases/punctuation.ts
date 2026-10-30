// The punctuation guide. Every example is copied exactly from a phrase (or one of its examples), and
// `npm test` checks that it still is, so each one has really been run.
import type { Language } from './types'

export type Mark = {
  symbol: string
  name: string
  // The English punctuation (or word) it's most like.
  english: string
  // `Backticks` show as code.
  meaning: string
  languages: Language[]
  examples: Partial<Record<Language, string>>
}

const ALL: Language[] = ['python', 'javascript', 'cpp']

export const marks: Mark[] = [
  {
    symbol: ';',
    name: 'Semicolon',
    english: 'a full stop',
    meaning:
      'Ends an instruction, the way a full stop ends a sentence. C++ insists on it. JavaScript can usually manage without it, but it’s good practice to write it. Python doesn’t need it: the end of the line does the same job.',
    languages: ['javascript', 'cpp'],
    examples: { javascript: 'console.log("Hi");', cpp: 'int age = 12;' },
  },
  {
    symbol: '" "',
    name: 'Double quotes',
    english: 'quotation marks',
    meaning: 'Exact words. What’s inside them is shown just as it is, and isn’t treated as code.',
    languages: ALL,
    examples: { python: 'print("Hi")', javascript: 'console.log("Hi");', cpp: 'std::cout << "Hi"' },
  },
  {
    symbol: '( )',
    name: 'Round brackets',
    english: 'brackets',
    meaning: 'Hand this over: what’s inside goes to the command in front of them. In a sum, they mean “work this out first”.',
    languages: ALL,
    examples: { python: 'print(age)', javascript: 'greet("Sam");', cpp: 'twice(5)' },
  },
  {
    symbol: ':',
    name: 'Colon and indent',
    english: 'a colon before a list',
    meaning: 'These lines belong to this. The colon ends the question, and the indented lines under it say what to do.',
    languages: ['python'],
    examples: { python: 'if raining:\n    print("Take an umbrella")' },
  },
  {
    symbol: '{ }',
    name: 'Curly braces',
    english: 'a fence around a group',
    meaning: 'A fence around lines that belong together. JavaScript and C++ use them where Python uses a colon and an indent.',
    languages: ['javascript', 'cpp'],
    examples: {
      javascript: 'if (raining) {\n  console.log("Take an umbrella");\n}',
      cpp: 'if (raining) {\n    std::cout << "Take an umbrella" << "\\n";\n}',
    },
  },
  {
    symbol: '[ ]',
    name: 'Square brackets',
    english: 'a numbered list',
    meaning: 'A list, or one position in a list. Positions start at 0.',
    languages: ALL,
    examples: { python: '["eggs", "milk", "bread"]', javascript: 'shopping[0]', cpp: 'shopping[0]' },
  },
  {
    symbol: '=',
    name: 'Equals sign',
    english: '“is”, as in “my age is 12”',
    meaning: 'Put into the box. It doesn’t ask anything: it puts the value on the right into the box named on the left.',
    languages: ALL,
    examples: { python: 'age = 12', javascript: 'let age = 12;', cpp: 'int age = 12;' },
  },
  {
    symbol: '==',
    name: 'Double equals',
    english: '“is”, as in “is the light green?”',
    meaning: 'Are these the same? It asks a question, and the answer is true or false. JavaScript uses three: `===`.',
    languages: ALL,
    examples: { python: 'light == "green"', javascript: 'light === "green"', cpp: 'light == "green"' },
  },
  {
    symbol: '.',
    name: 'Dot',
    english: '’s, as in “the list’s length”',
    meaning: 'Belongs to. `console.log` is the console’s log command, and `shopping.append` is the shopping list’s own append command.',
    languages: ALL,
    examples: { python: 'shopping.append("tea")', javascript: 'shopping.push("tea");', cpp: 'shopping.push_back("tea");' },
  },
  {
    symbol: ',',
    name: 'Comma',
    english: 'a comma',
    meaning: 'Separates the items in a list, just like in English.',
    languages: ALL,
    examples: { python: '"eggs", "milk", "bread"', javascript: '"eggs", "milk", "bread"', cpp: '"eggs", "milk", "bread"' },
  },
  {
    symbol: '# //',
    name: 'Note marks',
    english: 'a note in the margin',
    meaning: 'Starts a note for people. The computer skips everything after it, to the end of the line.',
    languages: ALL,
    examples: { python: '# This says hello', javascript: '// This says hello', cpp: '// This says hello' },
  },
  {
    symbol: '<<',
    name: 'Double arrows',
    english: '“send to”',
    meaning: 'Sends what’s on the right to the screen: `std::cout << "Hi"` sends “Hi”.',
    languages: ['cpp'],
    examples: { cpp: 'std::cout << "Hi"' },
  },
  {
    symbol: '::',
    name: 'Double colon',
    english: '“from”',
    meaning: 'From this toolbox: `std::cout` is cout from std, the standard toolbox that comes with C++.',
    languages: ['cpp'],
    examples: { cpp: 'std::cout' },
  },
  {
    symbol: '+ - * /',
    name: 'Math signs',
    english: 'plus, minus, times, divided by',
    meaning: 'Work out a sum. `*` means times and `/` means divided by, because × and ÷ aren’t on most keyboards.',
    languages: ALL,
    examples: { python: 'total = 3 + 4', javascript: 'let total = 3 + 4;', cpp: 'int total = 3 + 4;' },
  },
  {
    symbol: 'Aa',
    name: 'Capital letters',
    english: 'capital letters',
    meaning: 'Matter in code. `print` and `Print` are two different words to the computer.',
    languages: ALL,
    examples: {},
  },
]
