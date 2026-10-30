// The phrases, in order. Each one builds its English sentence and its code in all three languages from
// the "Change it" values, so everything on the page changes together.
//
// n(part, text) is a numbered piece: the same number means the same thing in the English and in every
// language. Plain strings are the rest of the code, colored automatically. Number the pieces in the order
// they first appear in the English; parts the English doesn't have go last. `npm test` runs every example
// in Python, JavaScript and C++, and checks that it shows exactly what `output` says.
import { cleanText, quoted, segment } from './code'
import {
  BoxPicture,
  ChangePicture,
  ComparePicture,
  ForkPicture,
  GlassPicture,
  KindsPicture,
  ListPicture,
  LoopPicture,
  MachinePicture,
  MathPicture,
  NotePicture,
  ProgramPicture,
  SayPicture,
  SwitchesPicture,
  TrafficPicture,
} from './pictures'
import type { Part, Phrase, Piece, Role, Values } from './types'

const n = (part: number, text: string, role?: Role): Piece => (role ? { text, part, role } : { text, part })

// Marks a line as the one that runs, when it does.
const runsIf = (runs: boolean, pieces: Piece[]): Piece[] => (runs ? pieces.map((piece) => ({ ...segment(piece), runs: true })) : pieces)

const text = (values: Values, id: string) => cleanText(String(values[id] ?? ''))
const number = (values: Values, id: string) => Number(values[id])
const yes = (values: Values, id: string) => values[id] === true
const list = (values: Values, id: string) => (Array.isArray(values[id]) ? (values[id] as string[]) : []).map(cleanText)

const python = (yes: boolean) => (yes ? 'True' : 'False')
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
const counting = (count: number) => {
  const numbers = Array.from({ length: count }, (_, i) => String(i))
  return numbers.length === 1 ? 'just 0' : `${numbers.slice(0, -1).join(', ')} and ${numbers[numbers.length - 1]}`
}

// Parts that come up again and again.
const NEW_BOX: Part = { role: 'command', note: 'make a new box', missing: { python: 'Nothing. The first = makes the box.' } }
const PUT_IN: Part = { role: 'punctuation', note: 'put into the box' }
const FULL_STOP: Part = { role: 'punctuation', note: 'a full stop', missing: { python: 'Nothing. The line just ends.' } }

const saySomething: Phrase = {
  id: 'say-something',
  chapter: 'talking',
  title: 'Say something',
  idea: 'Code can put words on the screen.',
  term: 'printing',
  parts: [
    { role: 'command' },
    { role: 'value', note: 'the exact words, in quotes' },
    FULL_STOP,
    {
      role: 'value',
      note: 'a new line',
      missing: {
        english: 'Not said. You expect it.',
        python: 'Nothing. print starts a new line by itself.',
        javascript: 'Nothing. console.log starts a new line by itself.',
      },
    },
  ],
  controls: [{ kind: 'text', id: 'words', label: 'Words to show', initial: 'Hello, world!' }],
  cpp: 'statements',
  build: (v) => {
    const words = text(v, 'words')
    return {
      english: [n(1, 'Show'), ' ', n(2, `"${words}"`), ' ', n(1, 'on the screen'), n(3, '.')],
      code: {
        python: [n(1, 'print'), '(', n(2, quoted(words)), ')'],
        javascript: [n(1, 'console.log'), '(', n(2, quoted(words)), ')', n(3, ';')],
        cpp: [n(1, 'std::cout <<'), ' ', n(2, quoted(words)), ' << ', n(4, '"\\n"'), n(3, ';')],
      },
      output: [words],
    }
  },
  differences: [
    {
      languages: ['javascript', 'cpp'],
      text: 'C++ ends each instruction with a semicolon, `;`, like a full stop. JavaScript can usually manage without one, but writing it is good practice. Python ends an instruction at the end of the line.',
    },
    {
      languages: ['cpp'],
      text: 'C++ doesn’t start a new line by itself. Sending `"\\n"`, which means “new line”, does that.',
      example: {
        code: {
          python: 'print("A")\nprint("B")',
          javascript: 'console.log("A");\nconsole.log("B");',
          cpp: 'std::cout << "A";\nstd::cout << "B" << "\\n";',
        },
        output: { python: ['A', 'B'], javascript: ['A', 'B'], cpp: ['AB'] },
      },
    },
    { text: 'The quotes don’t show on the screen. They mark where the exact words start and stop.' },
    { watchOut: true, text: 'Capital letters matter. Python knows `print`, but not `Print`.' },
  ],
  picture: (v) => ({
    visual: <SayPicture words={text(v, 'words')} />,
    caption: 'The command puts the words on the screen, without the quotes.',
  }),
}

const leaveANote: Phrase = {
  id: 'leave-a-note',
  chapter: 'talking',
  title: 'Leave a note',
  idea: 'Notes help people understand the code. The computer skips them.',
  term: 'a comment',
  parts: [{ role: 'punctuation', note: 'a note starts here' }, { role: 'value', note: 'the note' }, { role: 'command' }],
  controls: [{ kind: 'text', id: 'note', label: 'Your note', initial: 'This says hello' }],
  cpp: 'statements',
  build: (v) => {
    // In C++, a backslash at the very end of a note carries the note on to the next line, so it's dropped.
    const note = text(v, 'note').replace(/\\+$/, '')
    return {
      english: [n(1, 'Note for people:'), ' ', n(2, note), '. ', n(3, 'Show'), ' "Hi" ', n(3, 'on the screen'), '.'],
      code: {
        python: [n(1, '#'), ' ', n(2, note), '\n', n(3, 'print'), '("Hi")'],
        javascript: [n(1, '//'), ' ', n(2, note), '\n', n(3, 'console.log'), '("Hi");'],
        cpp: [n(1, '//'), ' ', n(2, note), '\n', n(3, 'std::cout <<'), ' "Hi" << "\\n";'],
      },
      output: ['Hi'],
    }
  },
  differences: [
    { languages: ['python'], text: 'Python starts a note with `#`.' },
    { languages: ['javascript', 'cpp'], text: 'JavaScript and C++ start a note with `//`.' },
    { text: 'A note lasts until the end of its line. The next line is code again.' },
    {
      languages: ['javascript', 'cpp'],
      text: 'JavaScript and C++ can also wrap a longer note in `/*` and `*/`, even over several lines.',
      example: {
        code: {
          javascript: '/* A note that goes\n   over two lines */\nconsole.log("Hi");',
          cpp: '/* A note that goes\n   over two lines */\nstd::cout << "Hi" << "\\n";',
        },
        output: { javascript: ['Hi'], cpp: ['Hi'] },
      },
    },
  ],
  picture: (v) => ({
    visual: <NotePicture note={text(v, 'note')} />,
    caption: 'Notes are for people reading the code. The computer skips them, so they never show on the screen.',
  }),
}

const theWholeProgram: Phrase = {
  id: 'the-whole-program',
  chapter: 'talking',
  title: 'The whole program',
  idea: 'C++ needs a wrapper around its lines. Python and JavaScript don’t.',
  term: 'the main function',
  parts: [
    {
      role: 'command',
      note: 'bring in a toolbox',
      missing: { python: 'Nothing. print is always there.', javascript: 'Nothing. console.log is always there.' },
    },
    {
      role: 'command',
      note: 'where the program starts',
      missing: { python: 'Nothing. Python starts at the top.', javascript: 'Nothing. JavaScript starts at the top.' },
    },
    { role: 'command' },
    {
      role: 'punctuation',
      note: 'where the program ends',
      missing: { python: 'Nothing. Python stops after the last line.', javascript: 'Nothing. JavaScript stops after the last line.' },
    },
  ],
  cpp: 'whole',
  build: () => ({
    english: [
      n(1, 'Get the screen toolbox.'),
      ' ',
      n(2, 'My program starts here:'),
      ' ',
      n(3, 'show'),
      ' "Hi" ',
      n(3, 'on the screen'),
      '. ',
      n(4, 'The end.'),
    ],
    code: {
      python: [n(3, 'print'), '("Hi")'],
      javascript: [n(3, 'console.log'), '("Hi");'],
      cpp: [n(1, '#include <iostream>'), '\n\n', n(2, 'int main() {'), '\n    ', n(3, 'std::cout <<'), ' "Hi" << "\\n";\n', n(4, '}')],
    },
    output: ['Hi'],
  }),
  differences: [
    { languages: ['cpp'], text: 'A C++ program starts running at `int main()`. The lines that belong to it go between `{` and `}`.' },
    { languages: ['cpp'], text: '`#include <iostream>` brings in the toolbox for the screen and the keyboard. `std::cout` comes from it.' },
    { languages: ['python', 'javascript'], text: 'Python and JavaScript just run the lines from top to bottom, with nothing around them.' },
    {
      languages: ['cpp'],
      text: 'From here on, the C++ examples show just the lines inside `main`. Switch on “Show the whole program” to see the rest.',
    },
    {
      languages: ['cpp'],
      text: '`main` can end with `return 0;`, which means “finished fine”. If you leave it out, C++ does it for you.',
      example: { code: { cpp: 'std::cout << "Hi" << "\\n";\nreturn 0;' }, output: { cpp: ['Hi'] } },
    },
  ],
  picture: () => ({
    visual: <ProgramPicture />,
    caption: 'Python and JavaScript run the lines just as they are. C++ puts them inside main(), like a letter in an envelope.',
  }),
}

const rememberSomething: Phrase = {
  id: 'remember-something',
  chapter: 'remembering',
  title: 'Remember something',
  idea: 'Code can keep a value in a labeled box, to use later.',
  term: 'a variable',
  parts: [NEW_BOX, { role: 'name', note: 'the label on the box' }, PUT_IN, { role: 'value' }, FULL_STOP, { role: 'command' }],
  controls: [{ kind: 'number', id: 'age', label: 'The age', initial: 12, min: 0, max: 120 }],
  cpp: 'statements',
  build: (v) => {
    const age = String(number(v, 'age'))
    return {
      english: [
        n(1, 'Remember that'), ' ', n(2, 'my age'), ' ', n(3, 'is'), ' ', n(4, age), n(5, '.'), ' ',
        n(6, 'Show'), ' ', n(2, 'my age'), n(5, '.'),
      ],
      code: {
        python: [n(2, 'age'), ' ', n(3, '='), ' ', n(4, age), '\n', n(6, 'print'), '(', n(2, 'age'), ')'],
        javascript: [
          n(1, 'let'), ' ', n(2, 'age'), ' ', n(3, '='), ' ', n(4, age), n(5, ';'), '\n',
          n(6, 'console.log'), '(', n(2, 'age'), ')', n(5, ';'),
        ],
        cpp: [
          n(1, 'int'), ' ', n(2, 'age'), ' ', n(3, '='), ' ', n(4, age), n(5, ';'), '\n',
          n(6, 'std::cout <<'), ' ', n(2, 'age'), ' << "\\n"', n(5, ';'),
        ],
      },
      output: [age],
    }
  },
  differences: [
    { text: '`=` doesn’t mean “equals” here. It means “put this value into the box”.' },
    { languages: ['javascript'], text: 'JavaScript writes `let` to make a new box. After that, it just uses the name.' },
    { languages: ['cpp'], text: 'C++ says what kind of value the box holds. `int` means a whole number.' },
    { languages: ['python'], text: 'Python just writes the name. The first `=` makes the box.' },
    {
      text: 'Without quotes, `age` means “what’s in the box”. With quotes, `"age"` is just the word.',
      example: {
        code: {
          python: 'age = 12\nprint(age)\nprint("age")',
          javascript: 'let age = 12;\nconsole.log(age);\nconsole.log("age");',
          cpp: 'int age = 12;\nstd::cout << age << "\\n";\nstd::cout << "age" << "\\n";',
        },
        output: { python: ['12', 'age'], javascript: ['12', 'age'], cpp: ['12', 'age'] },
      },
    },
  ],
  picture: (v) => ({
    visual: <BoxPicture name="age" value={number(v, 'age')} />,
    caption: `A variable is a labeled box. This one is labeled age, and it holds ${number(v, 'age')}.`,
  }),
}

const kindsOfValues: Phrase = {
  id: 'kinds-of-values',
  chapter: 'remembering',
  title: 'Kinds of values',
  idea: 'Values come in kinds: text, whole numbers, decimals, and yes or no.',
  term: 'data types',
  parts: [
    {
      role: 'command',
      note: 'text',
      missing: { python: 'Nothing. The quotes show it’s text.', javascript: 'Nothing. The quotes show it’s text.' },
    },
    { role: 'value', note: 'the values' },
    {
      role: 'command',
      note: 'a whole number',
      missing: {
        python: 'Nothing. A number without a dot is whole.',
        javascript: 'Nothing. A number without a dot is whole.',
      },
    },
    {
      role: 'command',
      note: 'a decimal',
      missing: { python: 'Nothing. The dot shows it’s a decimal.', javascript: 'Nothing. The dot shows it’s a decimal.' },
    },
    {
      role: 'command',
      note: 'yes or no',
      missing: {
        python: 'Nothing. True and False are yes-or-no values.',
        javascript: 'Nothing. true and false are yes-or-no values.',
      },
    },
    { role: 'command' },
  ],
  controls: [{ kind: 'yesno', id: 'pizza', label: 'Do I like pizza?', initial: true }],
  cpp: 'statements',
  build: (v) => {
    const likes = yes(v, 'pizza')
    const names = { python: ['name', 'age', 'height', 'likes_pizza'], other: ['name', 'age', 'height', 'likesPizza'] }
    return {
      english: [
        n(1, 'Text:'), ' my name is ', n(2, '"Sam"'), '. ',
        n(3, 'Whole number:'), ' my age is ', n(2, '12'), '. ',
        n(4, 'Decimal:'), ' my height is ', n(2, '1.5'), '. ',
        n(5, 'Yes or no:'), ' I like pizza, ', n(2, likes ? 'yes' : 'no'), '. ',
        n(6, 'Show'), ' each one.',
      ],
      code: {
        python: [
          'name = ', n(2, '"Sam"'), '\nage = ', n(2, '12'), '\nheight = ', n(2, '1.5'), '\nlikes_pizza = ', n(2, python(likes)),
          ...names.python.flatMap((name) => ['\n', n(6, 'print'), `(${name})`]),
        ],
        javascript: [
          'let name = ', n(2, '"Sam"'), ';\nlet age = ', n(2, '12'), ';\nlet height = ', n(2, '1.5'), ';\nlet likesPizza = ',
          n(2, String(likes)), ';',
          ...names.other.flatMap((name) => ['\n', n(6, 'console.log'), `(${name});`]),
        ],
        cpp: [
          n(1, 'std::string'), ' name = ', n(2, '"Sam"'), ';\n', n(3, 'int'), ' age = ', n(2, '12'), ';\n',
          n(4, 'double'), ' height = ', n(2, '1.5'), ';\n', n(5, 'bool'), ' likesPizza = ', n(2, String(likes)), ';',
          ...names.other.flatMap((name) => ['\n', n(6, 'std::cout <<'), ` ${name} << "\\n";`]),
        ],
      },
      output: {
        python: ['Sam', '12', '1.5', python(likes)],
        javascript: ['Sam', '12', '1.5', String(likes)],
        cpp: ['Sam', '12', '1.5', likes ? '1' : '0'],
      },
    }
  },
  differences: [
    {
      languages: ['cpp'],
      text: 'C++ makes you say what kind of value each box holds: `std::string` for text, `int` for a whole number, `double` for a decimal and `bool` for yes or no.',
    },
    {
      languages: ['python', 'javascript'],
      text: 'Python and JavaScript work out the kind from the value itself: quotes mean text, and a dot means a decimal.',
    },
    {
      languages: ['python'],
      text: 'Python writes yes and no as `True` and `False`, with capital letters. JavaScript and C++ write `true` and `false`.',
    },
    { languages: ['cpp'], watchOut: true, text: 'C++ shows `true` on the screen as `1`, and `false` as `0`.' },
    {
      text: 'Names can’t have spaces. Python joins words with underscores, like `likes_pizza`. JavaScript joins them with a capital letter, like `likesPizza`. C++ code uses both styles.',
    },
  ],
  picture: (v) => ({
    visual: <KindsPicture likesPizza={yes(v, 'pizza')} />,
    caption: 'Four kinds of value: text, a whole number, a decimal, and yes or no.',
  }),
}

const OPERATIONS: Record<string, { symbol: string; word: string; apply: (a: number, b: number) => number }> = {
  plus: { symbol: '+', word: 'plus', apply: (a, b) => a + b },
  minus: { symbol: '-', word: 'minus', apply: (a, b) => a - b },
  times: { symbol: '*', word: 'times', apply: (a, b) => a * b },
}

const doMath: Phrase = {
  id: 'do-math',
  chapter: 'remembering',
  title: 'Do math',
  idea: 'Code can work out sums and remember the answer.',
  term: 'arithmetic operators',
  parts: [NEW_BOX, { role: 'name' }, PUT_IN, { role: 'value', note: 'the numbers' }, { role: 'punctuation', note: 'the sum' }, { role: 'command' }],
  controls: [
    { kind: 'number', id: 'a', label: 'First number', initial: 3, min: 0, max: 20 },
    {
      kind: 'choice',
      id: 'op',
      label: 'Plus, minus or times',
      initial: 'plus',
      options: [
        { value: 'plus', label: 'plus (+)' },
        { value: 'minus', label: 'minus (-)' },
        { value: 'times', label: 'times (*)' },
      ],
    },
    { kind: 'number', id: 'b', label: 'Second number', initial: 4, min: 0, max: 20 },
  ],
  cpp: 'statements',
  build: (v) => {
    const op = OPERATIONS[String(v.op)] ?? OPERATIONS.plus
    const [a, b] = [String(number(v, 'a')), String(number(v, 'b'))]
    const sum = [n(4, a), ' ', n(5, op.symbol), ' ', n(4, b)]
    return {
      english: [n(1, 'Let'), ' ', n(2, 'the total'), ' ', n(3, 'be'), ' ', n(4, a), ' ', n(5, op.word), ' ', n(4, b), '. ', n(6, 'Show'), ' ', n(2, 'the total'), '.'],
      code: {
        python: [n(2, 'total'), ' ', n(3, '='), ' ', ...sum, '\n', n(6, 'print'), '(', n(2, 'total'), ')'],
        javascript: [n(1, 'let'), ' ', n(2, 'total'), ' ', n(3, '='), ' ', ...sum, ';\n', n(6, 'console.log'), '(', n(2, 'total'), ');'],
        cpp: [n(1, 'int'), ' ', n(2, 'total'), ' ', n(3, '='), ' ', ...sum, ';\n', n(6, 'std::cout <<'), ' ', n(2, 'total'), ' << "\\n";'],
      },
      output: [String(op.apply(Number(a), Number(b)))],
    }
  },
  differences: [
    { text: 'Code uses `*` for times and `/` for divided by, because × and ÷ aren’t on most keyboards.' },
    {
      languages: ['cpp'],
      watchOut: true,
      text: 'In C++, dividing a whole number by a whole number drops the remainder, so `7 / 2` is 3. Python and JavaScript give 3.5.',
      example: {
        code: { python: 'print(7 / 2)', javascript: 'console.log(7 / 2);', cpp: 'std::cout << 7 / 2 << "\\n";' },
        output: { python: ['3.5'], javascript: ['3.5'], cpp: ['3'] },
      },
    },
    {
      languages: ['python'],
      text: 'Python has `//` to divide and drop the remainder: `7 // 2` is 3.',
      example: { code: { python: 'print(7 // 2)' }, output: { python: ['3'] } },
    },
    {
      text: 'Round brackets work like in math: what’s inside them is worked out first.',
      example: {
        code: {
          python: 'print((3 + 4) * 2)',
          javascript: 'console.log((3 + 4) * 2);',
          cpp: 'std::cout << (3 + 4) * 2 << "\\n";',
        },
        output: { python: ['14'], javascript: ['14'], cpp: ['14'] },
      },
    },
  ],
  picture: (v) => {
    const op = OPERATIONS[String(v.op)] ?? OPERATIONS.plus
    const [a, b] = [number(v, 'a'), number(v, 'b')]
    const total = op.apply(a, b)
    return {
      visual: <MathPicture a={a} symbol={op.symbol} b={b} total={total} />,
      caption: `The computer works out ${a} ${op.word} ${b}, and puts ${total} in the box called total.`,
    }
  },
}

const changeAValue: Phrase = {
  id: 'change-a-value',
  chapter: 'remembering',
  title: 'Change a value',
  idea: 'A box can get a new value. The old one is replaced.',
  term: 'updating a variable',
  parts: [NEW_BOX, { role: 'name' }, PUT_IN, { role: 'value' }, { role: 'punctuation', note: 'add to what’s in the box' }, { role: 'command' }],
  controls: [{ kind: 'number', id: 'add', label: 'How much to add', initial: 1, min: 1, max: 10 }],
  cpp: 'statements',
  build: (v) => {
    const add = String(number(v, 'add'))
    return {
      english: [
        n(1, 'Let'), ' ', n(2, 'my score'), ' ', n(3, 'be'), ' ', n(4, '0'), '. ',
        n(5, 'Add'), ' ', n(4, add), ' ', n(5, 'to'), ' ', n(2, 'my score'), '. ',
        n(6, 'Show'), ' ', n(2, 'my score'), '.',
      ],
      code: {
        python: [
          n(2, 'score'), ' ', n(3, '='), ' ', n(4, '0'), '\n',
          n(2, 'score'), ' ', n(5, '+='), ' ', n(4, add), '\n',
          n(6, 'print'), '(', n(2, 'score'), ')',
        ],
        javascript: [
          n(1, 'let'), ' ', n(2, 'score'), ' ', n(3, '='), ' ', n(4, '0'), ';\n',
          n(2, 'score'), ' ', n(5, '+='), ' ', n(4, add), ';\n',
          n(6, 'console.log'), '(', n(2, 'score'), ');',
        ],
        cpp: [
          n(1, 'int'), ' ', n(2, 'score'), ' ', n(3, '='), ' ', n(4, '0'), ';\n',
          n(2, 'score'), ' ', n(5, '+='), ' ', n(4, add), ';\n',
          n(6, 'std::cout <<'), ' ', n(2, 'score'), ' << "\\n";',
        ],
      },
      output: [add],
    }
  },
  differences: [
    {
      text: '`score += 1` is short for `score = score + 1`: work out score plus 1, then put the answer back in the box.',
      example: {
        code: {
          python: 'score = 0\nscore = score + 1\nprint(score)',
          javascript: 'let score = 0;\nscore = score + 1;\nconsole.log(score);',
          cpp: 'int score = 0;\nscore = score + 1;\nstd::cout << score << "\\n";',
        },
        output: { python: ['1'], javascript: ['1'], cpp: ['1'] },
      },
    },
    {
      languages: ['javascript', 'cpp'],
      text: 'JavaScript and C++ also have `score++`, which adds exactly 1.',
      example: {
        code: { javascript: 'let score = 0;\nscore++;\nconsole.log(score);', cpp: 'int score = 0;\nscore++;\nstd::cout << score << "\\n";' },
        output: { javascript: ['1'], cpp: ['1'] },
      },
    },
    { languages: ['python'], watchOut: true, text: 'Python has no `++`. Write `score += 1` instead.' },
    { languages: ['javascript'], text: 'In JavaScript, a box made with `let` can change. A box made with `const` can’t.' },
  ],
  picture: (v) => ({
    visual: <ChangePicture add={number(v, 'add')} />,
    caption: `A box holds one value at a time. Adding ${number(v, 'add')} replaces the 0 with ${number(v, 'add')}.`,
  }),
}

const compareThings: Phrase = {
  id: 'compare-things',
  chapter: 'deciding',
  title: 'Compare two things',
  idea: 'Code can ask a yes-or-no question about two values. The answer is true or false.',
  term: 'a comparison',
  parts: [NEW_BOX, { role: 'name' }, PUT_IN, { role: 'value' }, { role: 'punctuation', note: 'is it at least?' }, { role: 'command' }],
  controls: [{ kind: 'number', id: 'age', label: 'The age', initial: 12, min: 0, max: 20 }],
  cpp: 'statements',
  build: (v) => {
    const age = String(number(v, 'age'))
    const answer = number(v, 'age') >= 13
    const question = [n(2, 'age'), ' ', n(5, '>='), ' ', n(4, '13')]
    return {
      english: [
        n(1, 'Let'), ' ', n(2, 'my age'), ' ', n(3, 'be'), ' ', n(4, age), '. ',
        n(5, 'Is'), ' ', n(2, 'my age'), ' ', n(5, 'at least'), ' ', n(4, '13'), '? ',
        n(6, 'Show'), ' the answer.',
      ],
      code: {
        python: [n(2, 'age'), ' ', n(3, '='), ' ', n(4, age), '\n', n(6, 'print'), '(', ...question, ')'],
        javascript: [n(1, 'let'), ' ', n(2, 'age'), ' ', n(3, '='), ' ', n(4, age), ';\n', n(6, 'console.log'), '(', ...question, ');'],
        cpp: [n(1, 'int'), ' ', n(2, 'age'), ' ', n(3, '='), ' ', n(4, age), ';\n', n(6, 'std::cout <<'), ' (', ...question, ') << "\\n";'],
      },
      output: { python: [python(answer)], javascript: [String(answer)], cpp: [answer ? '1' : '0'] },
    }
  },
  differences: [
    {
      text: 'There are six ways to compare: `==` the same as, `!=` not the same as, `<` less than, `>` more than, `<=` at most, and `>=` at least.',
      example: {
        code: {
          python: 'print(3 < 5)\nprint(3 == 5)\nprint(3 != 5)',
          javascript: 'console.log(3 < 5);\nconsole.log(3 === 5);\nconsole.log(3 !== 5);',
          cpp: 'std::cout << (3 < 5) << "\\n";\nstd::cout << (3 == 5) << "\\n";\nstd::cout << (3 != 5) << "\\n";',
        },
        output: { python: ['True', 'False', 'True'], javascript: ['true', 'false', 'true'], cpp: ['1', '0', '1'] },
      },
    },
    { watchOut: true, text: '`=` and `==` are different. `=` puts a value in a box. `==` asks whether two values are the same.' },
    {
      languages: ['javascript'],
      text: 'JavaScript also has `===`, which checks the kind of value too, so the number 12 and the text "12" aren’t the same. Use `===` and `!==` in JavaScript.',
      example: { code: { javascript: 'console.log(12 == "12");\nconsole.log(12 === "12");' }, output: { javascript: ['true', 'false'] } },
    },
    { languages: ['cpp'], text: 'C++ needs round brackets around a question to show its answer: `std::cout << (age >= 13)`.' },
    { languages: ['cpp'], text: 'C++ shows true as `1` and false as `0`.' },
  ],
  picture: (v) => {
    const age = number(v, 'age')
    return {
      visual: <ComparePicture age={age} />,
      caption: `Is ${age} at least 13? ${age >= 13 ? 'Yes, so the answer is true.' : 'No, so the answer is false.'}`,
    }
  },
}

const makeADecision: Phrase = {
  id: 'make-a-decision',
  chapter: 'deciding',
  title: 'Make a decision',
  idea: 'Code can choose what to do, depending on the answer to a yes-or-no question.',
  term: 'an if statement',
  parts: [
    { role: 'name', note: 'the yes-or-no box' },
    { role: 'value', note: 'yes or no' },
    { role: 'command' },
    { role: 'punctuation', note: 'then do this' },
    { role: 'command' },
  ],
  controls: [{ kind: 'yesno', id: 'raining', label: 'Is it raining?', initial: true }],
  cpp: 'statements',
  build: (v) => {
    const raining = yes(v, 'raining')
    return {
      english: [
        n(1, 'Raining'), '? ', n(2, raining ? 'Yes' : 'No'), '. ',
        n(3, 'If'), ' ', n(1, 'it’s raining'), n(4, ','), ' show "Take an umbrella". ',
        n(5, 'Otherwise'), n(4, ','), ' show "Wear sunglasses".',
      ],
      code: {
        python: [
          n(1, 'raining'), ' = ', n(2, python(raining)), '\n',
          n(3, 'if'), ' ', n(1, 'raining'), n(4, ':'), '\n',
          ...runsIf(raining, ['    print("Take an umbrella")']), '\n',
          n(5, 'else'), n(4, ':'), '\n',
          ...runsIf(!raining, ['    print("Wear sunglasses")']),
        ],
        javascript: [
          'let ', n(1, 'raining'), ' = ', n(2, String(raining)), ';\n',
          n(3, 'if'), ' (', n(1, 'raining'), ') ', n(4, '{'), '\n',
          ...runsIf(raining, ['  console.log("Take an umbrella");']), '\n',
          '} ', n(5, 'else'), ' ', n(4, '{'), '\n',
          ...runsIf(!raining, ['  console.log("Wear sunglasses");']), '\n}',
        ],
        cpp: [
          'bool ', n(1, 'raining'), ' = ', n(2, String(raining)), ';\n',
          n(3, 'if'), ' (', n(1, 'raining'), ') ', n(4, '{'), '\n',
          ...runsIf(raining, ['    std::cout << "Take an umbrella" << "\\n";']), '\n',
          '} ', n(5, 'else'), ' ', n(4, '{'), '\n',
          ...runsIf(!raining, ['    std::cout << "Wear sunglasses" << "\\n";']), '\n}',
        ],
      },
      output: [raining ? 'Take an umbrella' : 'Wear sunglasses'],
    }
  },
  differences: [
    {
      languages: ['python'],
      text: 'Python ends the question with a colon, `:`, and indents the lines that belong to it. The indent is part of the code: if the lines don’t line up, Python stops with an error.',
    },
    {
      languages: ['javascript', 'cpp'],
      text: 'JavaScript and C++ put the question in round brackets, `( )`, and the lines that belong to it in curly braces, `{ }`. The indent is only there to help people read it.',
    },
    {
      text: '`else` is optional. Without it, the code does nothing when the answer is no.',
      example: {
        code: {
          python: 'raining = False\nif raining:\n    print("Take an umbrella")\nprint("Done")',
          javascript: 'let raining = false;\nif (raining) {\n  console.log("Take an umbrella");\n}\nconsole.log("Done");',
          cpp: 'bool raining = false;\nif (raining) {\n    std::cout << "Take an umbrella" << "\\n";\n}\nstd::cout << "Done" << "\\n";',
        },
        output: { python: ['Done'], javascript: ['Done'], cpp: ['Done'] },
      },
    },
  ],
  picture: (v) => {
    const raining = yes(v, 'raining')
    return {
      visual: <ForkPicture raining={raining} />,
      caption: raining
        ? 'It’s raining, so the code takes the umbrella path.'
        : 'It’s not raining, so the code takes the sunglasses path.',
    }
  },
}

const LIGHTS = { green: 'Go', yellow: 'Slow down', red: 'Stop' } as const
type Light = keyof typeof LIGHTS
const lightOf = (v: Values): Light => (String(v.light) in LIGHTS ? (String(v.light) as Light) : 'green')

const moreChoices: Phrase = {
  id: 'more-choices',
  chapter: 'deciding',
  title: 'More than two choices',
  idea: 'Code can ask one question after another, until one of the answers is yes.',
  term: 'else if',
  parts: [
    { role: 'name', note: 'the box holding the color' },
    PUT_IN,
    { role: 'command' },
    { role: 'punctuation', note: 'is the same as' },
    { role: 'command' },
    { role: 'command' },
  ],
  controls: [
    {
      kind: 'choice',
      id: 'light',
      label: 'The light',
      initial: 'green',
      options: [
        { value: 'green', label: 'Green' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'red', label: 'Red' },
      ],
    },
  ],
  cpp: 'statements',
  build: (v) => {
    const light = lightOf(v)
    return {
      english: [
        n(1, 'The light'), ' ', n(2, 'is'), ` "${light}". `,
        n(3, 'If'), ' ', n(1, 'the light'), ' ', n(4, 'is'), ' "green", show "Go". ',
        n(5, 'Otherwise, if'), ' ', n(1, 'it'), ' ', n(4, 'is'), ' "yellow", show "Slow down". ',
        n(6, 'Otherwise'), ', show "Stop".',
      ],
      code: {
        python: [
          n(1, 'light'), ' ', n(2, '='), ` "${light}"\n`,
          n(3, 'if'), ' ', n(1, 'light'), ' ', n(4, '=='), ' "green":\n',
          ...runsIf(light === 'green', ['    print("Go")']), '\n',
          n(5, 'elif'), ' ', n(1, 'light'), ' ', n(4, '=='), ' "yellow":\n',
          ...runsIf(light === 'yellow', ['    print("Slow down")']), '\n',
          n(6, 'else'), ':\n',
          ...runsIf(light === 'red', ['    print("Stop")']),
        ],
        javascript: [
          'let ', n(1, 'light'), ' ', n(2, '='), ` "${light}";\n`,
          n(3, 'if'), ' (', n(1, 'light'), ' ', n(4, '==='), ' "green") {\n',
          ...runsIf(light === 'green', ['  console.log("Go");']), '\n',
          '} ', n(5, 'else if'), ' (', n(1, 'light'), ' ', n(4, '==='), ' "yellow") {\n',
          ...runsIf(light === 'yellow', ['  console.log("Slow down");']), '\n',
          '} ', n(6, 'else'), ' {\n',
          ...runsIf(light === 'red', ['  console.log("Stop");']), '\n}',
        ],
        cpp: [
          'std::string ', n(1, 'light'), ' ', n(2, '='), ` "${light}";\n`,
          n(3, 'if'), ' (', n(1, 'light'), ' ', n(4, '=='), ' "green") {\n',
          ...runsIf(light === 'green', ['    std::cout << "Go" << "\\n";']), '\n',
          '} ', n(5, 'else if'), ' (', n(1, 'light'), ' ', n(4, '=='), ' "yellow") {\n',
          ...runsIf(light === 'yellow', ['    std::cout << "Slow down" << "\\n";']), '\n',
          '} ', n(6, 'else'), ' {\n',
          ...runsIf(light === 'red', ['    std::cout << "Stop" << "\\n";']), '\n}',
        ],
      },
      output: [LIGHTS[light]],
    }
  },
  differences: [
    { languages: ['python'], text: 'Python shortens “else if” to `elif`.' },
    { languages: ['javascript', 'cpp'], text: 'JavaScript and C++ write it as two words: `else if`.' },
    { text: 'The questions are asked from the top down. The first one with a yes answer wins, and the rest are skipped.' },
    {
      text: 'English uses “is” for two different jobs, and code splits them: `=` puts a value in a box, and `==` asks if two values are the same.',
    },
    { languages: ['javascript'], text: 'JavaScript checks “is the same as” with `===`, three equals signs.' },
  ],
  picture: (v) => {
    const light = lightOf(v)
    return {
      visual: <TrafficPicture light={light} action={LIGHTS[light]} />,
      caption: `The light is ${light}, so the code shows “${LIGHTS[light]}”.`,
    }
  },
}

const combineQuestions: Phrase = {
  id: 'combine-questions',
  chapter: 'deciding',
  title: 'Combine questions',
  idea: 'Code can join yes-or-no questions with and, or and not.',
  term: 'logical operators',
  parts: [
    { role: 'name' },
    { role: 'value', note: 'yes or no' },
    { role: 'name' },
    { role: 'command' },
    { role: 'command', note: 'both must be yes' },
    { role: 'command' },
  ],
  controls: [
    { kind: 'yesno', id: 'sunny', label: 'Is it sunny?', initial: true },
    { kind: 'yesno', id: 'weekend', label: 'Is it the weekend?', initial: true },
  ],
  cpp: 'statements',
  build: (v) => {
    const sunny = yes(v, 'sunny')
    const weekend = yes(v, 'weekend')
    const both = sunny && weekend
    const question = (and: Piece) => [n(4, 'if'), ' (', n(1, 'sunny'), ' ', and, ' ', n(3, 'weekend'), ') {\n']
    return {
      english: [
        n(1, 'Sunny'), '? ', n(2, sunny ? 'Yes' : 'No'), '. ', n(3, 'Weekend'), '? ', n(2, weekend ? 'Yes' : 'No'), '. ',
        n(4, 'If'), ' ', n(1, 'it’s sunny'), ' ', n(5, 'and'), ' ', n(3, 'it’s the weekend'), ', show "Go to the park". ',
        n(6, 'Otherwise'), ', show "Read a book".',
      ],
      code: {
        python: [
          n(1, 'sunny'), ' = ', n(2, python(sunny)), '\n',
          n(3, 'weekend'), ' = ', n(2, python(weekend)), '\n',
          n(4, 'if'), ' ', n(1, 'sunny'), ' ', n(5, 'and'), ' ', n(3, 'weekend'), ':\n',
          ...runsIf(both, ['    print("Go to the park")']), '\n',
          n(6, 'else'), ':\n',
          ...runsIf(!both, ['    print("Read a book")']),
        ],
        javascript: [
          'let ', n(1, 'sunny'), ' = ', n(2, String(sunny)), ';\n',
          'let ', n(3, 'weekend'), ' = ', n(2, String(weekend)), ';\n',
          ...question(n(5, '&&', 'punctuation')),
          ...runsIf(both, ['  console.log("Go to the park");']), '\n',
          '} ', n(6, 'else'), ' {\n',
          ...runsIf(!both, ['  console.log("Read a book");']), '\n}',
        ],
        cpp: [
          'bool ', n(1, 'sunny'), ' = ', n(2, String(sunny)), ';\n',
          'bool ', n(3, 'weekend'), ' = ', n(2, String(weekend)), ';\n',
          ...question(n(5, '&&', 'punctuation')),
          ...runsIf(both, ['    std::cout << "Go to the park" << "\\n";']), '\n',
          '} ', n(6, 'else'), ' {\n',
          ...runsIf(!both, ['    std::cout << "Read a book" << "\\n";']), '\n}',
        ],
      },
      output: [both ? 'Go to the park' : 'Read a book'],
    }
  },
  differences: [
    { languages: ['python'], text: 'Python writes `and`, `or` and `not` as words.' },
    { languages: ['javascript', 'cpp'], text: 'JavaScript and C++ use symbols: `&&` for and, `||` for or, and `!` for not.' },
    {
      text: '`and` needs both answers to be yes. `or` needs just one.',
      example: {
        code: {
          python: 'print(True and False)\nprint(True or False)',
          javascript: 'console.log(true && false);\nconsole.log(true || false);',
          cpp: 'std::cout << (true && false) << "\\n";\nstd::cout << (true || false) << "\\n";',
        },
        output: { python: ['False', 'True'], javascript: ['false', 'true'], cpp: ['0', '1'] },
      },
    },
    {
      text: '`not` flips an answer: not yes is no.',
      example: {
        code: { python: 'print(not True)', javascript: 'console.log(!true);', cpp: 'std::cout << !true << "\\n";' },
        output: { python: ['False'], javascript: ['false'], cpp: ['0'] },
      },
    },
  ],
  picture: (v) => {
    const [sunny, weekend] = [yes(v, 'sunny'), yes(v, 'weekend')]
    return {
      visual: <SwitchesPicture sunny={sunny} weekend={weekend} />,
      caption:
        sunny && weekend
          ? 'Both answers are yes, so the code goes to the park.'
          : 'and needs both answers to be yes. One of them is no, so the code reads a book.',
    }
  },
}

const repeatTimes: Phrase = {
  id: 'repeat-times',
  chapter: 'repeating',
  title: 'Repeat a number of times',
  idea: 'Code can do the same thing again and again, without writing it out each time.',
  term: 'a for loop',
  parts: [{ role: 'command', note: 'repeat' }, { role: 'value', note: 'how many times' }, { role: 'punctuation', note: 'do these lines' }, { role: 'command' }],
  controls: [{ kind: 'number', id: 'times', label: 'How many times', initial: 3, min: 1, max: 6 }],
  cpp: 'statements',
  build: (v) => {
    const times = number(v, 'times')
    const t = String(times)
    return {
      english: [n(1, 'Do this'), ' ', n(2, t), times === 1 ? ' time' : ' times', n(3, ':'), ' ', n(4, 'show'), ' "Hip hip hooray!".'],
      code: {
        python: [n(1, 'for'), ' i in range(', n(2, t), ')', n(3, ':'), '\n    ', n(4, 'print'), '("Hip hip hooray!")'],
        javascript: [n(1, 'for'), ' (let i = 0; i < ', n(2, t), '; i++) ', n(3, '{'), '\n  ', n(4, 'console.log'), '("Hip hip hooray!");\n}'],
        cpp: [n(1, 'for'), ' (int i = 0; i < ', n(2, t), '; i++) ', n(3, '{'), '\n    ', n(4, 'std::cout <<'), ' "Hip hip hooray!" << "\\n";\n}'],
      },
      output: Array.from({ length: times }, () => 'Hip hip hooray!'),
      readAloud: {
        python: `For each number i in range(${t}), which counts ${counting(times)}, show "Hip hip hooray!".`,
        javascript: `Start i at 0. While i is less than ${t}, show "Hip hip hooray!", then add 1 to i (that’s i++).`,
        cpp: `Start a whole number i at 0. While i is less than ${t}, show "Hip hip hooray!", then add 1 to i (that’s i++).`,
      },
    }
  },
  differences: [
    {
      text: 'Programmers count from 0, so a loop that runs 3 times counts 0, 1, 2.',
      example: {
        code: {
          python: 'for i in range(3):\n    print(i)',
          javascript: 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}',
          cpp: 'for (int i = 0; i < 3; i++) {\n    std::cout << i << "\\n";\n}',
        },
        output: { python: ['0', '1', '2'], javascript: ['0', '1', '2'], cpp: ['0', '1', '2'] },
      },
    },
    { languages: ['python'], text: 'Python counts with `range`: `range(3)` gives 0, 1 and 2.' },
    {
      languages: ['javascript', 'cpp'],
      text: 'JavaScript and C++ spell the counting out in three steps: where to start (`i = 0`), when to keep going (`i < 3`) and how to step (`i++`).',
    },
    { text: '`i` is just a name. Any name works, but `i` is the usual one.' },
  ],
  picture: (v) => {
    const times = number(v, 'times')
    return {
      visual: <LoopPicture times={times} />,
      caption: `The loop runs ${plural(times, 'time')}, and i counts ${counting(times)}.`,
    }
  },
}

const repeatWhile: Phrase = {
  id: 'repeat-while',
  chapter: 'repeating',
  title: 'Repeat while something is true',
  idea: 'Code can keep going until the answer to a question changes.',
  term: 'a while loop',
  parts: [
    NEW_BOX,
    { role: 'name' },
    { role: 'command' },
    { role: 'punctuation', note: 'less than' },
    { role: 'punctuation', note: 'add to what’s in the box' },
    { role: 'punctuation', note: 'the loop ends here', missing: { python: 'Nothing. The next line just isn’t indented.' } },
  ],
  controls: [{ kind: 'number', id: 'size', label: 'How many cups fill the glass', initial: 3, min: 1, max: 5 }],
  cpp: 'statements',
  build: (v) => {
    const size = number(v, 'size')
    const s = String(size)
    return {
      english: [
        n(1, 'Start with'), ' 0 ', n(2, 'cups'), '. ', n(3, 'While'), ' there are ', n(4, 'fewer than'), ` ${s} `,
        n(2, size === 1 ? 'cup' : 'cups'), ', ', n(5, 'add'), ' 1 ', n(2, 'cup'), ' and show "Pour". ', n(6, 'Then'), ' show "Full!".',
      ],
      code: {
        python: [
          n(2, 'cups'), ' = 0\n', n(3, 'while'), ' ', n(2, 'cups'), ' ', n(4, '<'), ` ${s}:\n    `,
          n(2, 'cups'), ' ', n(5, '+='), ' 1\n    print("Pour")\nprint("Full!")',
        ],
        javascript: [
          n(1, 'let'), ' ', n(2, 'cups'), ' = 0;\n', n(3, 'while'), ' (', n(2, 'cups'), ' ', n(4, '<'), ` ${s}) {\n  `,
          n(2, 'cups'), ' ', n(5, '+='), ' 1;\n  console.log("Pour");\n', n(6, '}'), '\nconsole.log("Full!");',
        ],
        cpp: [
          n(1, 'int'), ' ', n(2, 'cups'), ' = 0;\n', n(3, 'while'), ' (', n(2, 'cups'), ' ', n(4, '<'), ` ${s}) {\n    `,
          n(2, 'cups'), ' ', n(5, '+='), ' 1;\n    std::cout << "Pour" << "\\n";\n', n(6, '}'), '\nstd::cout << "Full!" << "\\n";',
        ],
      },
      output: [...Array.from({ length: size }, () => 'Pour'), 'Full!'],
    }
  },
  differences: [
    { text: 'A while loop asks its question before every round. As soon as the answer is no, it stops and moves on.' },
    { watchOut: true, text: 'If the answer never changes, the loop never stops. Here, `cups += 1` makes sure it does.' },
    { text: 'Use `for` when you know how many rounds you need, and `while` when you don’t.' },
    { languages: ['python'], text: 'In Python, the lines that belong to the loop are indented. The first line that isn’t runs after the loop.' },
  ],
  picture: (v) => ({
    visual: <GlassPicture size={number(v, 'size')} />,
    caption: `The loop pours one cup at a time until the glass holds ${plural(number(v, 'size'), 'cup')}, then stops.`,
  }),
}

const SHOPPING = ['eggs', 'milk', 'bread']
const ORDINALS = ['first', 'second', 'third']

const makeAList: Phrase = {
  id: 'make-a-list',
  chapter: 'lists',
  title: 'Make a list',
  idea: 'Code can keep several values in order, in one list.',
  term: 'a list (Python), an array (JavaScript) or a vector (C++)',
  parts: [
    { role: 'name' },
    PUT_IN,
    { role: 'value', note: 'the position: the first is 0' },
    { role: 'punctuation', note: 'make a list', missing: { english: 'Not said. English just lists the items.' } },
  ],
  controls: [
    {
      kind: 'choice',
      id: 'position',
      label: 'Which item to show',
      initial: '0',
      options: [
        { value: '0', label: 'First' },
        { value: '1', label: 'Second' },
        { value: '2', label: 'Third' },
      ],
    },
  ],
  cpp: 'statements',
  build: (v) => {
    const position = Math.min(2, Math.max(0, number(v, 'position') || 0))
    const p = String(position)
    const items = '"eggs", "milk", "bread"'
    return {
      english: [n(1, 'My shopping list'), ' ', n(2, 'is'), ` ${items}. Show the `, n(3, ORDINALS[position]), ' item.'],
      code: {
        python: [n(1, 'shopping'), ' ', n(2, '='), ' ', n(4, '['), items, n(4, ']'), '\nprint(', n(1, 'shopping'), '[', n(3, p), '])'],
        javascript: ['let ', n(1, 'shopping'), ' ', n(2, '='), ' ', n(4, '['), items, n(4, ']'), ';\nconsole.log(', n(1, 'shopping'), '[', n(3, p), ']);'],
        cpp: [
          n(4, 'std::vector<std::string>', 'command'), ' ', n(1, 'shopping'), ' ', n(2, '='), ' ', n(4, '{'), items, n(4, '}'),
          ';\nstd::cout << ', n(1, 'shopping'), '[', n(3, p), '] << "\\n";',
        ],
      },
      output: [SHOPPING[position]],
    }
  },
  differences: [
    { text: 'Positions start at 0. The first item is at position 0, the second at 1, and the third at 2.' },
    { languages: ['python', 'javascript'], text: 'Python and JavaScript make a list with square brackets: `["eggs", "milk", "bread"]`.' },
    {
      languages: ['cpp'],
      text: 'C++ makes a `std::vector`, says what kind of values it holds, `<std::string>`, and lists them in curly braces.',
    },
    { text: 'All three pick an item with square brackets: `shopping[0]`.' },
    { text: 'The commas between the items work just like commas in English.' },
    {
      text: 'To add an item at the end, Python says `shopping.append("tea")`, JavaScript says `shopping.push("tea")`, and C++ says `shopping.push_back("tea")`. To count the items: `len(shopping)`, `shopping.length` and `shopping.size()`.',
      example: {
        code: {
          python: 'shopping = ["eggs", "milk", "bread"]\nshopping.append("tea")\nprint(len(shopping))',
          javascript: 'let shopping = ["eggs", "milk", "bread"];\nshopping.push("tea");\nconsole.log(shopping.length);',
          cpp: 'std::vector<std::string> shopping = {"eggs", "milk", "bread"};\nshopping.push_back("tea");\nstd::cout << shopping.size() << "\\n";',
        },
        output: { python: ['4'], javascript: ['4'], cpp: ['4'] },
      },
    },
  ],
  picture: (v) => {
    const position = Math.min(2, Math.max(0, number(v, 'position') || 0))
    return {
      visual: <ListPicture items={SHOPPING} chosen={position} />,
      caption: `A list keeps its items in order. Positions start at 0, so the ${ORDINALS[position]} item is at position ${position}.`,
    }
  },
}

const goThroughAList: Phrase = {
  id: 'go-through-a-list',
  chapter: 'lists',
  title: 'Go through a list',
  idea: 'Code can do something with each item in a list, one at a time.',
  term: 'a for-each loop',
  parts: [
    { role: 'name' },
    { role: 'command', note: 'for each' },
    { role: 'name', note: 'the item, one at a time' },
    { role: 'command', note: 'from the list' },
    { role: 'punctuation', note: 'do these lines' },
  ],
  controls: [{ kind: 'list', id: 'items', label: 'Your shopping list', initial: SHOPPING, max: 5 }],
  cpp: 'statements',
  build: (v) => {
    const items = list(v, 'items')
    const code = items.map(quoted).join(', ')
    return {
      english: [
        n(1, 'My shopping list'), items.length ? ` is ${items.map((item) => `"${item}"`).join(', ')}. ` : ' is empty. ',
        n(2, 'For each'), ' ', n(3, 'item'), ' ', n(4, 'on'), ' ', n(1, 'my shopping list'), n(5, ','), ' show the ', n(3, 'item'), '.',
      ],
      code: {
        python: [
          n(1, 'shopping'), ` = [${code}]\n`,
          n(2, 'for'), ' ', n(3, 'item'), ' ', n(4, 'in'), ' ', n(1, 'shopping'), n(5, ':'), '\n    print(', n(3, 'item'), ')',
        ],
        javascript: [
          'let ', n(1, 'shopping'), ` = [${code}];\n`,
          n(2, 'for'), ' (const ', n(3, 'item'), ' ', n(4, 'of'), ' ', n(1, 'shopping'), ') ', n(5, '{'), '\n  console.log(', n(3, 'item'), ');\n}',
        ],
        cpp: [
          'std::vector<std::string> ', n(1, 'shopping'), ` = {${code}};\n`,
          n(2, 'for'), ' (std::string ', n(3, 'item'), ' ', n(4, ':', 'punctuation'), ' ', n(1, 'shopping'), ') ', n(5, '{'),
          '\n    std::cout << ', n(3, 'item'), ' << "\\n";\n}',
        ],
      },
      output: items,
    }
  },
  differences: [
    { text: 'Each round, `item` holds the next thing on the list, from the first to the last.' },
    { languages: ['javascript'], text: 'JavaScript writes `const` before `item`. Each round gets a fresh box that doesn’t change during the round.' },
    {
      languages: ['javascript'],
      watchOut: true,
      text: 'Use `of`, not `in`. In JavaScript, `for…in` gives you the positions (0, 1, 2), not the items.',
      example: {
        code: { javascript: 'let shopping = ["eggs", "milk"];\nfor (const i in shopping) {\n  console.log(i);\n}' },
        output: { javascript: ['0', '1'] },
      },
    },
    { languages: ['cpp'], text: 'C++ says what kind of value each item is, `std::string`, and uses a colon where English says “on”.' },
    { text: '`item` is a name you choose. `food` would work just as well.' },
  ],
  picture: (v) => {
    const items = list(v, 'items')
    return {
      visual: <ListPicture items={items} rounds />,
      caption: items.length
        ? `The loop visits each item in turn: ${plural(items.length, 'item')}, so ${plural(items.length, 'round')}.`
        : 'The list is empty, so the loop has nothing to do.',
    }
  },
}

const makeACommand: Phrase = {
  id: 'make-a-command',
  chapter: 'commands',
  title: 'Make your own command',
  idea: 'You can give a set of steps a name, then use it whenever you like.',
  term: 'a function',
  parts: [
    { role: 'command', note: 'make a new command' },
    { role: 'name', note: 'the new command’s name' },
    { role: 'name', note: 'a box for who to greet' },
    { role: 'punctuation', note: 'its steps are' },
    { role: 'punctuation', note: 'joined with' },
    {
      role: 'command',
      note: 'the program starts here',
      missing: {
        python: 'Nothing. The lines that aren’t indented run, from the top.',
        javascript: 'Nothing. The lines outside the function run, from the top.',
      },
    },
  ],
  controls: [{ kind: 'text', id: 'who', label: 'Who to greet', initial: 'Sam' }],
  cpp: 'functions',
  build: (v) => {
    const who = text(v, 'who')
    return {
      english: [
        n(1, 'To'), ' ', n(2, 'greet'), ' ', n(3, 'someone'), n(4, ':'), ' show "Hello, " ', n(5, 'and'), ' ', n(3, 'their name'), '. ',
        n(6, 'Now'), ' ', n(2, 'greet'), ` "${who}".`,
      ],
      code: {
        python: [
          n(1, 'def'), ' ', n(2, 'greet'), '(', n(3, 'name'), ')', n(4, ':'), '\n    print("Hello, " ', n(5, '+'), ' ', n(3, 'name'), ')\n\n',
          n(2, 'greet'), `(${quoted(who)})`,
        ],
        javascript: [
          n(1, 'function'), ' ', n(2, 'greet'), '(', n(3, 'name'), ') ', n(4, '{'), '\n  console.log("Hello, " ', n(5, '+'), ' ', n(3, 'name'),
          ');\n}\n\n', n(2, 'greet'), `(${quoted(who)});`,
        ],
        cpp: [
          n(1, 'void'), ' ', n(2, 'greet'), '(std::string ', n(3, 'name'), ') ', n(4, '{'), '\n    std::cout << "Hello, " ', n(5, '<<'), ' ',
          n(3, 'name'), ' << "\\n";\n}\n\n', n(6, 'int main() {'), '\n    ', n(2, 'greet'), `(${quoted(who)});\n}`,
        ],
      },
      output: [`Hello, ${who}`],
    }
  },
  differences: [
    { languages: ['python'], text: 'Python makes a new command with `def`, which starts its definition: the name, then the steps.' },
    { languages: ['javascript'], text: 'JavaScript makes one with `function`.' },
    {
      languages: ['cpp'],
      text: 'C++ starts with the kind of answer the command gives back. `void` means it gives nothing back: it just does something.',
    },
    { text: '`name` is a box that gets filled each time the command is used. `greet("Sam")` puts "Sam" in it.' },
    {
      text: 'Making a command doesn’t run it. Its steps run each time you use it.',
      example: {
        code: {
          python: 'def greet(name):\n    print("Hello, " + name)\n\ngreet("Sam")\ngreet("Ana")',
          javascript: 'function greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("Sam");\ngreet("Ana");',
          cpp: 'void greet(std::string name) {\n    std::cout << "Hello, " << name << "\\n";\n}\n\nint main() {\n    greet("Sam");\n    greet("Ana");\n}',
        },
        output: { python: ['Hello, Sam', 'Hello, Ana'], javascript: ['Hello, Sam', 'Hello, Ana'], cpp: ['Hello, Sam', 'Hello, Ana'] },
      },
    },
    { languages: ['cpp'], text: 'In C++, the command goes above `main`, and you use it inside `main`.' },
  ],
  picture: (v) => {
    const who = text(v, 'who')
    return {
      visual: <MachinePicture name="greet" input={`"${who}"`} output={`Hello, ${who}`} />,
      caption: 'greet is a command you made. Give it a name, and it says hello.',
    }
  },
}

const giveBackAnAnswer: Phrase = {
  id: 'give-back-an-answer',
  chapter: 'commands',
  title: 'Give back an answer',
  idea: 'A command can work something out and hand the answer back.',
  term: 'a return value',
  parts: [
    { role: 'command', note: 'make a new command' },
    { role: 'name' },
    { role: 'name', note: 'the number it’s given' },
    { role: 'punctuation', note: 'its steps are' },
    { role: 'command', note: 'hand the answer back' },
    { role: 'punctuation', note: 'times' },
  ],
  controls: [{ kind: 'number', id: 'number', label: 'The number', initial: 5, min: 0, max: 50 }],
  cpp: 'functions',
  build: (v) => {
    const x = number(v, 'number')
    const s = String(x)
    return {
      english: [
        n(1, 'To work out'), ' ', n(2, 'twice'), ' ', n(3, 'a number'), n(4, ':'), ' ', n(5, 'give back'), ' ', n(3, 'the number'), ' ',
        n(6, 'times'), ' 2. Show ', n(2, 'twice'), ` ${s}.`,
      ],
      code: {
        python: [
          n(1, 'def'), ' ', n(2, 'twice'), '(', n(3, 'number'), ')', n(4, ':'), '\n    ', n(5, 'return'), ' ', n(3, 'number'), ' ', n(6, '*'),
          ' 2\n\nprint(', n(2, 'twice'), `(${s}))`,
        ],
        javascript: [
          n(1, 'function'), ' ', n(2, 'twice'), '(', n(3, 'number'), ') ', n(4, '{'), '\n  ', n(5, 'return'), ' ', n(3, 'number'), ' ', n(6, '*'),
          ' 2;\n}\n\nconsole.log(', n(2, 'twice'), `(${s}));`,
        ],
        cpp: [
          n(1, 'int'), ' ', n(2, 'twice'), '(int ', n(3, 'number'), ') ', n(4, '{'), '\n    ', n(5, 'return'), ' ', n(3, 'number'), ' ', n(6, '*'),
          ' 2;\n}\n\nint main() {\n    std::cout << ', n(2, 'twice'), `(${s}) << "\\n";\n}`,
        ],
      },
      output: [String(x * 2)],
    }
  },
  differences: [
    { text: '`return` hands the answer back to wherever the command was used, so `twice(5)` becomes 10.' },
    {
      languages: ['cpp'],
      text: 'C++ says the kind of answer first: `int twice(int number)` takes a whole number and gives back a whole number.',
    },
    { languages: ['cpp'], text: 'It’s called `twice`, not `double`, because `double` already means “decimal” in C++.' },
    {
      text: 'You can use the answer like any other value, even in a sum.',
      example: {
        code: {
          python: 'def twice(number):\n    return number * 2\n\nprint(twice(5) + 1)',
          javascript: 'function twice(number) {\n  return number * 2;\n}\n\nconsole.log(twice(5) + 1);',
          cpp: 'int twice(int number) {\n    return number * 2;\n}\n\nint main() {\n    std::cout << twice(5) + 1 << "\\n";\n}',
        },
        output: { python: ['11'], javascript: ['11'], cpp: ['11'] },
      },
    },
  ],
  picture: (v) => {
    const x = number(v, 'number')
    return {
      visual: <MachinePicture name="twice" input={String(x)} output={String(x * 2)} />,
      caption: `twice takes ${x}, works out ${x} × 2, and gives back ${x * 2}.`,
    }
  },
}

export const phrases: Phrase[] = [
  saySomething,
  leaveANote,
  theWholeProgram,
  rememberSomething,
  kindsOfValues,
  doMath,
  changeAValue,
  compareThings,
  makeADecision,
  moreChoices,
  combineQuestions,
  repeatTimes,
  repeatWhile,
  makeAList,
  goThroughAList,
  makeACommand,
  giveBackAnAnswer,
]

export const getPhrase = (id?: string) => phrases.find((phrase) => phrase.id === id)
