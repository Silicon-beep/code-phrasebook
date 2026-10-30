# Sources

Every code example on the site is run by `npm test` in Python, JavaScript and C++ (`src/phrases/snippets.test.ts`), and must show exactly what the page says. That covers each phrase at its starting values and with other "Change it" values, and every example under "Same idea, different spelling". So what the code *does* is checked on every test run.

This file is for what the pages *say* about the languages. Each claim below was checked against the official documentation on 30 October 2026. When you add a claim, add its source here.

## Official documentation used

- Python tutorial: [An Informal Introduction](https://docs.python.org/3/tutorial/introduction.html) and [More Control Flow Tools](https://docs.python.org/3/tutorial/controlflow.html)
- [PEP 8, the Python style guide](https://peps.python.org/pep-0008/)
- MDN: [Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types), [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness), [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in), [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
- cppreference: [Main function](https://en.cppreference.com/w/cpp/language/main_function), [Operator precedence](https://en.cppreference.com/w/cpp/language/operator_precedence), [Arithmetic operators](https://en.cppreference.com/w/cpp/language/operator_arithmetic), [std::boolalpha](https://en.cppreference.com/w/cpp/io/manip/boolalpha)

## Claims

| Phrase | Claim | Source |
| --- | --- | --- |
| Say something | C++ needs `;`. JavaScript can usually do without it, but writing it is good practice. Python ends an instruction at the end of the line. | MDN Grammar and types: “A semicolon is not necessary after a statement if it is written on its own line … It is considered best practice, however, to always write a semicolon after a statement” |
| Say something | Capital letters matter (`Print` isn’t `print`). | MDN Grammar and types: “JavaScript is case-sensitive”. Running `Print("Hi")` in Python gives `NameError: name 'Print' is not defined` |
| Leave a note | Python notes start with `#` and last to the end of the line. | Python tutorial, Introduction: “Comments in Python start with the hash character, #, and extend to the end of the physical line” |
| Leave a note | JavaScript and C++ use `//`, and `/* */` for longer notes. | MDN Grammar and types: “The syntax of comments is the same as in C++” (examples of `//` and `/* */`). Both run in the snippet test |
| The whole program | A C++ program starts at `main`. Leaving out `return 0;` is the same as writing it. | cppreference, Main function: “the designated start of the program”; “if control reaches the end of main without encountering a return statement, the effect is that of executing return 0;” |
| Remember something | `=` puts a value in a box (a variable). | Python tutorial, Introduction: “The equal sign (=) is used to assign a value to a variable” |
| Kinds of values | Python writes `True`/`False`; C++ shows `true` as `1` and `false` as `0`. | cppreference, std::boolalpha: the example prints `default true: 1`, `default false: 0`. Also shown by the snippet test |
| Kinds of values | Python names join words with underscores. | PEP 8: “Function names should be lowercase, with words separated by underscores … Variable names follow the same convention” |
| Do math | In C++, dividing two whole numbers drops the remainder: `7 / 2` is 3. | cppreference, Arithmetic operators: “If both operands have an integral type … the quotient is truncated towards zero (fractional part is discarded)” |
| Do math | Python’s `/` gives 3.5, and `//` drops the remainder. | Python tutorial, Introduction: “Division (/) always returns a float. To do floor division and get an integer result you can use the // operator” |
| Change a value | Python has no `++`. | Running `score++` in Python gives `SyntaxError: invalid syntax` |
| Compare two things | Use `===` in JavaScript: `12 == "12"` is true, `12 === "12"` is false. | MDN, Equality comparisons and sameness: “Strict equality is almost always the correct comparison operation to use.” The example runs in the snippet test |
| Compare two things | C++ needs brackets in `std::cout << (age >= 13)`. | cppreference, Operator precedence: `<<` is level 7 and `>=` is level 9, so without brackets `<<` goes first |
| Make a decision | Python indents the lines that belong to an `if`; lines that don’t line up stop Python with an error. | Python tutorial, Control flow: the body “must be indented”. Mis-indented lines give `IndentationError: unindent does not match any outer indentation level` |
| More than two choices | `elif` is Python’s “else if”. | Python tutorial, Control flow: “The keyword ‘elif’ is short for ‘else if’” |
| Repeat a number of times | `range(3)` counts 0, 1, 2. | Python tutorial, Control flow: “The given end point is never part of the generated sequence” (the `range(5)` example prints 0 to 4). Also run by the snippet test |
| Go through a list | In JavaScript, `for…in` gives the positions, not the items. | MDN, for...in: the variable “receives a string property name on each iteration”; “It is better to use a for loop with a numeric index, Array.prototype.forEach(), or the for...of loop” |
| Go through a list | `const` works in `for…of`: each round gets a new box. | MDN, for...of: “You can use const to declare the variable as long as it’s not reassigned within the loop body”; “Each iteration creates a new variable” |
| Make your own command | `def` starts a function’s definition. | Python tutorial, Control flow: “The keyword def introduces a function definition” |
| Give back an answer | `return` hands back a value. | Python tutorial, Control flow: “The return statement returns with a value from a function” |
| Give back an answer | A C++ function can’t be called `double`. | Compiling `int double(int number)` with clang gives `error: cannot combine with previous 'int' declaration specifier` |

## The About page

| Claim | Source |
| --- | --- |
| GitHub Pages logs visitors’ IP addresses for security. | [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages): “the visitor’s IP address is logged and stored for security purposes” |
| Google Fonts receives your IP address, and doesn’t set cookies. | [Google Fonts privacy FAQ](https://developers.google.com/fonts/faq/privacy) |
