# Code Phrasebook: working rules for Claude

Read README.md first for the project layout, where text and colors live, and how phrases work.

## Use live sources, not memory

- **Library code:** before writing or changing code that uses React, React Router, Vite, Tailwind, Vitest, Playwright, axe or lucide-react, look up the current docs with the Context7 MCP tools for the version in `package.json`. If Context7 isn't connected or is down, use web search and the library's official docs instead. Don't write library APIs from memory.
- **Language facts:** before a page says something about Python, JavaScript or C++, check it against the official docs (docs.python.org, MDN, cppreference) and add the source to `src/phrases/SOURCES.md`.
- **Dependencies:** when adding or upgrading one, check its latest release and use a version that's been out for at least 2 weeks.

## Project rules

- **Text:** page wording goes in `src/content.ts`. Phrases go in `src/phrases/phrases.tsx`.
- **Every example must really run:** `npm test` runs every phrase and every example in Python, JavaScript and C++, and checks the page shows exactly what they print. Never change an expected output to make a test pass without running the code yourself.
- **Colors:** use only the tokens in `tailwind.config.ts`. The four role colors (violet, blue, orange, green) mean command word, name, value and punctuation everywhere, so don't use them for decoration. Small text uses the `-dark` shades.
- **Accessibility:** 4.5:1 contrast, 44px targets, visible focus rings, reduced motion turns animation off, no popups, autoplay or flashing, and color is never the only way something is shown.
- **No quizzes:** this teaches by showing and letting people change things.
- **Checks:** run `npm test`, `npm run build` and `npm run test:a11y` before committing. When an accessibility check fails, fix the site, not the check. New pages go in `pages` in `a11y/site.ts`.
- **Publishing:** `npm run deploy` publishes to https://silicon-beep.github.io/code-phrasebook/
