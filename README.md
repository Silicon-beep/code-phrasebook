# Code Phrasebook

A phrasebook for code, for people who have never written any. Each page takes one everyday English sentence and shows the same idea in **Python, JavaScript and C++**. Matching numbers and colors show which English words turned into which code. It's built for visual learners: every idea has a picture, and most have a "Change it" control that updates the English, the code, the picture and the output together.

Live at **https://silicon-beep.github.io/code-phrasebook/**

Built with React, Vite, TypeScript, Tailwind CSS and React Router. The design tokens, focus rings and accessibility checks come from [MindStack](https://github.com/Silicon-beep/mindstack).

## Run it

You need Node.js 22.22 or newer. `npm test` also needs `python3` and a C++ compiler (`c++`), because it runs every example for real. Macs with the Xcode command line tools have both, and so do GitHub's Ubuntu runners.

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm test          # check the phrases, and run every example in Python, JavaScript and C++ (about 30 seconds)
npm run test:a11y # run the accessibility checks in Chrome (about 2 minutes)
npm run build     # type-check, then build to dist/
npm run preview   # serve the built site locally
npm run deploy    # publish to GitHub Pages
```

### Put it online

`npm run deploy` builds the site for the `/code-phrasebook/` address and pushes it to the `gh-pages` branch, which GitHub Pages serves. The new version shows up a minute or two later. If you rename the repo, change `BASE` in `scripts/deploy-pages.sh` and the preview-card addresses in `index.html`.

When someone shares a link, chat apps show a preview card: the tags in `index.html` and the picture `public/og-image.png`. To change the picture, edit `scripts/og-image.html` and run the Chrome command at the top of that file.

## What's in it

| Page | Address | What it does |
| --- | --- | --- |
| Home | `/` | What the site is, a small phrase to try, the color key, and all the phrases in 6 chapters |
| Phrase | `/say-something`, `/make-a-decision`, … | One idea: the English, a picture, "Change it", the code in three languages, what the screen shows, Piece by piece, and Same idea, different spelling |
| Punctuation | `/punctuation` | What `;` `( )` `{ }` `:` `[ ]` `=` `==` and the rest mean, next to the English punctuation they're most like |
| About | `/about` | Who it's for, how to read a phrase, accessibility, privacy and feedback |

The only thing saved is which languages to show (All three, Python, JavaScript or C++), in the browser's local storage.

### The phrases

- **Talking:** Say something, Leave a note, The whole program
- **Remembering:** Remember something, Kinds of values, Do math, Change a value
- **Deciding:** Compare two things, Make a decision, More than two choices, Combine questions
- **Repeating:** Repeat a number of times, Repeat while something is true
- **Lists:** Make a list, Go through a list
- **Your own commands:** Make your own command, Give back an answer

## How a phrase is shown

**Numbers match pieces.** A piece of code with the same number as a piece of English means the same thing. Pointing at a piece lights up every piece with its number, and so does pressing its number in Piece by piece (which works with a keyboard and on touch screens).

**Colors show the kind of word**, the same on every page:

| Color | Role | For example |
| --- | --- | --- |
| Violet | Command words the language already knows | `print`, `if`, `for`, `int` |
| Blue | Names you choose | `age`, `shopping` |
| Orange | Values | `"Hello"`, `12`, `True` |
| Green | Punctuation | `;` `:` `{ }` `=` |

Numbered pieces are drawn as colored pills with their number. The rest of the code is colored the same way, as text, like an editor would (`tokenize` in `src/phrases/code.ts`). Because these four colors carry meaning, don't use them for decoration.

## Change the text

- **Page text** (buttons, headings, the About page) is in **`src/content.ts`**.
- **The phrases** (their English, code, notes and pictures' captions) are in **`src/phrases/phrases.tsx`**, in order.
- **The punctuation guide** is in **`src/phrases/punctuation.ts`**.

## Add or change a phrase

A phrase is an object in `src/phrases/phrases.tsx`. Its `build(values)` returns the English sentence and the code in each language, as lists of pieces, plus what the screen shows:

```tsx
english: [n(1, 'Show'), ' ', n(2, '"Hi"'), ' ', n(1, 'on the screen'), n(3, '.')],
code: {
  python: [n(1, 'print'), '(', n(2, '"Hi"'), ')'],
  javascript: [n(1, 'console.log'), '(', n(2, '"Hi"'), ')', n(3, ';')],
  cpp: [n(1, 'std::cout <<'), ' ', n(2, '"Hi"'), ' << ', n(4, '"\\n"'), n(3, ';')],
},
output: ['Hi'],
```

- `n(part, text)` is a numbered piece. Plain strings are the rest. Number parts in the order they first appear in the English.
- `parts` gives each number its role (its color), an optional `note` in plain English, and `missing`: why the English or a language has nothing for it, such as Python having no semicolon.
- `controls` are the "Change it" controls: `text`, `number`, `yesno`, `choice` or `list`. Their values come into `build`. Put text from a control inside code with `quoted()`, which adds the backslashes quotes need.
- `cpp` says how the C++ fits in a whole program: `statements` (it goes inside `main`), `functions` (it already has its own `main`), or `whole`. "Show the whole program" adds the `#include` lines for the toolboxes the code uses.
- `differences` are the notes under Same idea, different spelling. Give one an `example` (a tiny program per language and what it prints) and the test runs it too.
- `runsIf(yes, [...])` marks the line that runs in an if/else, so it's shaded.

Then run `npm test`. It checks the numbering lines up, then runs the phrase in Python, JavaScript and C++, at its starting values and at other "Change it" values (empty text, quotes, the smallest and biggest numbers, every choice). It fails if any language prints something different from `output`, prints an error, or (for C++) compiles with a warning. If the page states a fact about a language, check it in the official docs and add it to `src/phrases/SOURCES.md`.

The pictures are small React components in `src/phrases/pictures.tsx`. They're hidden from screen readers, so each phrase's `caption` must say the same thing in words.

## Change the colors

Colors, corner radii, shadows, fonts and the page width are design tokens in **`tailwind.config.ts`**. These tokens replace Tailwind's built-in palette, so only these colors exist. Which classes each role uses is in `src/phrases/roles.ts`. Text needs at least 4.5:1 contrast: the bright green `#0A8F65` and orange `#D9480F` only pass at large sizes, so small text uses their `-dark` versions.

## Project layout

```
src/
  content.ts            page text
  App.tsx               routes
  pages/                Home, Phrase, Punctuation, About (InfoPage), Not found
  components/           navbar, footer, logo, the pill-shaped radio buttons
  phrases/
    phrases.tsx         the phrases
    types.ts            what a phrase is made of
    code.ts             pieces to lines and text, coloring, escaping, the whole C++ program
    roles.ts            the four role colors
    pictures.tsx        one picture per phrase
    punctuation.ts      the punctuation guide
    components/         the sentence and code, Change it, Piece by piece, the screen, …
    *.test.ts           the checks, including snippets.test.ts, which runs every example
    SOURCES.md          where each fact on the pages comes from
  lib/                  small helpers
  index.css             base styles, focus rings, buttons, reduced-motion rule
a11y/                   the accessibility checks (Playwright and axe)
```

## Accessibility

- **Not just color:** every colored piece also has a number, and Piece by piece says the same thing in words. The numbers are hidden from screen readers and can't be selected, so copying code doesn't copy them.
- **Keyboard:** everything works with a keyboard, with a visible focus ring. Code that's too wide scrolls sideways with the arrow keys.
- **Reduced motion:** `src/index.css` switches off every transition and animation. Nothing moves by itself anyway.
- **Contrast and targets:** text meets WCAG AA contrast, and every button, link and field is at least 44px.

`npm run test:a11y` builds the site and checks every page, and every phrase in each state a learner can reach (a piece lit up, "Change it" used, one language shown, the whole C++ program shown), at desktop and phone sizes. It runs axe (WCAG 2.2 A and AA plus best practices), checks 44px targets, tabs through every page checking focus rings, checks nothing scrolls sideways at 320px wide, and checks nothing moves or pops up by itself. New phrases are checked automatically. A new page needs adding to `pages` in `a11y/site.ts`. GitHub runs the same checks on every push (`.github/workflows/checks.yml`).

Automated checks can't judge everything. Whether the English is clear, and how a screen reader reads a page, still needs a person to try it.
