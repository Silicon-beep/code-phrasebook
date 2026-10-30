// All page wording lives here: edit freely. The phrases themselves (their English, code and notes) are in
// src/phrases/phrases.tsx. Colors live in tailwind.config.ts, and which color each role uses in src/phrases/roles.ts.
import type { ChapterId, Language, Role } from './phrases/types'

export const brand = {
  name: 'Code Phrasebook',
}

const github = 'https://github.com/Silicon-beep/code-phrasebook'
const reportIssue = `${github}/issues/new`

export const nav = {
  links: [
    { label: 'Phrases', href: '/#phrases' },
    { label: 'Punctuation', href: '/punctuation' },
    { label: 'About', href: '/about' },
  ],
  menu: 'Main menu',
} as const

export const languageNames: Record<Language, string> = { python: 'Python', javascript: 'JavaScript', cpp: 'C++' }

// The four kinds of word in code, like parts of speech. `one` names a single piece in the Piece by piece
// table, and `color` names the color it's shown in (set in src/phrases/roles.ts). `Backticks` show as code.
export const roles: Record<Role, { name: string; one: string; color: string; text: string }> = {
  command: {
    name: 'Command words',
    one: 'Command word',
    color: 'violet',
    text: 'Words the language already knows, like `print` and `if`.',
  },
  name: { name: 'Names you choose', one: 'Name you choose', color: 'blue', text: 'Labels you make up, like `age` or `shopping`.' },
  value: {
    name: 'Values',
    one: 'Value',
    color: 'orange',
    text: 'What the code works with: words in quotes, numbers, and yes or no.',
  },
  punctuation: {
    name: 'Punctuation',
    one: 'Punctuation',
    color: 'green',
    text: 'Symbols that hold the code together, like `;` `( )` `{ }` and `=`.',
  },
}

export const chapters: Record<ChapterId, { title: string; text: string }> = {
  talking: { title: 'Talking', text: 'Put words on the screen, leave notes for people, and see what a whole program looks like.' },
  remembering: { title: 'Remembering', text: 'Keep values in labeled boxes, and do math with them.' },
  deciding: { title: 'Deciding', text: 'Ask yes-or-no questions, and choose what to do.' },
  repeating: { title: 'Repeating', text: 'Do something again and again.' },
  lists: { title: 'Lists', text: 'Keep several values in order, and go through them one by one.' },
  commands: { title: 'Your own commands', text: 'Give a set of steps a name, and use it whenever you like.' },
}

export const home = {
  eyebrow: 'A phrasebook for code',
  title: 'Code is a language too',
  intro:
    'Read an everyday English sentence, then the same idea in Python, JavaScript and C++. Matching numbers and colors show which English words turned into which code.',
  start: { label: 'Start with phrase 1', href: '/say-something' },
  punctuation: { label: 'Code punctuation', href: '/punctuation' },
  perks: ['No experience needed', 'One idea per page', 'Every example really runs'],
  tryTitle: 'Try it: point at a piece',
  tryText: 'Point at a piece of the sentence or the code, or press a number below, and every piece with that number lights up.',
  keyTitle: 'Colors mean the same thing on every page',
  keyText: 'Code has four kinds of word, a bit like nouns and verbs in English.',
  numbersText: 'The numbers match pieces up: a piece of code with the same number as a piece of English means the same thing.',
  phrasesTitle: 'The phrases',
  phrasesIntro: 'Start at the top, or jump to whatever you need. Each phrase is one idea.',
  phraseNumber: (number: number) => `Phrase ${number}`,
  punctuationBand: {
    title: 'Code has punctuation too',
    text: 'Semicolons, brackets, colons and curly braces: what each one means, next to the English punctuation it’s most like.',
    cta: 'See the punctuation guide',
  },
}

export const phraseUi = {
  eyebrow: (chapter: string, number: number, total: number) => `${chapter} · Phrase ${number} of ${total}`,
  term: 'Programmers call this',
  english: 'In English',
  tryIt: 'Change it',
  tryItText: 'Change this, and watch the English, the code and the screen change with it.',
  code: 'In code',
  show: 'Show',
  allLanguages: 'All three',
  wholeProgram: 'Show the whole program',
  wholeProgramWhy: 'Why C++ needs this',
  runs: 'this line runs',
  readAloud: 'Read it aloud',
  output: 'What you’d see on the screen',
  sameOutput: 'All three languages show the same thing:',
  outputNothing: '(nothing)',
  outputEmptyLine: '(an empty line)',
  pieces: 'Piece by piece',
  piecesText: 'Press a number to light up its pieces in the English and the code. Press it again to turn it off.',
  // Read out before the number and role on each Piece by piece button.
  pieceButton: 'Light up piece',
  pieceColumn: 'Piece',
  englishColumn: 'English',
  differences: 'Same idea, different spelling',
  watchOut: 'Watch out',
  example: 'Try it',
  screenSays: 'shows',
  pager: 'Previous and next phrase',
  previous: 'Previous',
  next: 'Next',
  allPhrases: 'All phrases',
  backToStart: 'Back to the list',
  controls: {
    yes: 'Yes',
    no: 'No',
    add: 'Add',
    newItem: 'New item',
    remove: (item: string) => `Remove ${item || 'empty item'}`,
    full: (max: number) => `The list is full: it can hold up to ${max} items here.`,
    empty: 'The list is empty. Add an item.',
  },
}

export const punctuationPage = {
  title: 'Code punctuation',
  intro:
    'Code has punctuation, just like English. Some marks do the same job as in English, and some are new. Here’s what each one means.',
  usedIn: 'Used in',
  english: 'In English',
  examplesLabel: 'Examples',
  back: 'Back to the phrases',
}

export const notFound = {
  title: 'Page not found',
  text: 'There’s no page at this address. It may have moved, or there may be a typo in it.',
  home: 'Go to the phrases',
}

export const footer = {
  links: [
    { label: 'About', href: '/about' },
    { label: 'Punctuation', href: '/punctuation' },
    { label: 'Report a problem', href: reportIssue },
  ],
} as const

// The About page: a title, an intro and a few sections. A section can have paragraphs (`text`), a list of
// points (`list`) and links shown under it (`links`).
export type InfoPageCopy = {
  title: string
  intro: string
  updated?: string
  sections: {
    heading: string
    text?: string[]
    list?: { lead: string; text: string }[]
    links?: { label: string; href: string }[]
  }[]
}

export const about: InfoPageCopy = {
  title: 'About Code Phrasebook',
  intro: 'Code Phrasebook is for people who have never written code. If you can read an English sentence, you can start here.',
  updated: 'Last updated 30 October 2026',
  sections: [
    {
      heading: 'Code is a language',
      text: [
        'A travel phrasebook shows a sentence in your language next to the same sentence in another one. This does the same for code: an everyday English sentence, then the same idea in Python, JavaScript and C++.',
        'Seeing three languages side by side shows what stays the same, the ideas, and what changes: the spelling.',
      ],
    },
    {
      heading: 'How to read a phrase',
      list: [
        {
          lead: 'Numbers match pieces',
          text: 'A piece of code with the same number as a piece of English means the same thing.',
        },
        {
          lead: 'Colors show the kind of word',
          text: 'Violet for command words, blue for names you choose, orange for values and green for punctuation. They mean the same on every page.',
        },
        {
          lead: 'Change it',
          text: 'Most phrases have something you can change. The English, the code and the screen change with it.',
        },
        {
          lead: 'Every example really runs',
          text: 'Before the site is published, a test runs every example in Python, JavaScript and C++, and checks that it shows exactly what the page says.',
        },
      ],
      links: [{ label: 'Start with phrase 1', href: '/say-something' }],
    },
    {
      heading: 'Accessibility',
      text: ['Code Phrasebook aims to meet WCAG 2.2 at level AA.'],
      list: [
        {
          lead: 'Not just color',
          text: 'Every colored piece also has a number, and the Piece by piece table says the same thing in words.',
        },
        {
          lead: 'Keyboard',
          text: 'Everything works with a keyboard, and a clear ring shows where you are. Long code scrolls sideways with the arrow keys.',
        },
        {
          lead: 'Easy to see and tap',
          text: 'Text has a contrast of at least 4.5:1, and every button and link is at least 44 pixels tall.',
        },
        {
          lead: 'No surprises',
          text: 'Nothing moves, plays or pops up by itself. If your device is set to reduce motion, nothing animates at all.',
        },
      ],
    },
    {
      heading: 'Privacy',
      text: [
        'There are no accounts, no ads, no cookies and no tracking. If you choose which languages to show, that choice is saved in your own browser, and nowhere else.',
        'Two outside services see your visit. GitHub Pages hosts the site, and logs every visitor’s IP address for security purposes. Google Fonts supplies the Lexend font, so Google receives your IP address and the font request. Google Fonts doesn’t set cookies.',
      ],
      links: [
        {
          label: 'GitHub’s privacy statement',
          href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
        },
        { label: 'Google Fonts privacy FAQ', href: 'https://developers.google.com/fonts/faq/privacy' },
      ],
    },
    {
      heading: 'Something wrong or confusing?',
      text: [
        'Tell us on GitHub: say which phrase you were on and what happened. You’ll need a free GitHub account, and anything you write there is public.',
      ],
      links: [
        { label: 'Report a problem on GitHub', href: reportIssue },
        { label: 'See the code on GitHub', href: github },
      ],
    },
  ],
}
