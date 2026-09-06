# Add HTML, CSS, and C to the Code Generator language dropdown

## What changes

### 1. Language list (`src/routes/tools.code-generator.tsx`)
Current list: JavaScript, TypeScript, Python, Java, Go, Rust, C++, C#, PHP, Ruby, Swift, Kotlin.

New list — existing entries keep their order, insertions:
- **HTML** and **CSS** at the top (before JavaScript), since they're commonly requested.
- **C** inserted between **C++** and **C#** (with its C-family relatives).

Result: HTML, CSS, JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, C#, PHP, Ruby, Swift, Kotlin.

### 2. Correct code-block language tags (`src/lib/ai.functions.ts`, `generateCode`)
The system prompt already interpolates `data.language.toLowerCase()` into the fenced code block tag. Lowercased "HTML" → `html`, "CSS" → `css`, "C" → `c` — all correct for syntax highlighting, so no special mapping is needed. The prompt will also state the tag explicitly (e.g. "Use the `html` code fence") so the model doesn't drift.

### 3. Markup/stylesheet-friendly prompting (`src/lib/ai.functions.ts`)
For HTML and CSS, adjust the system prompt conditionally:
- Skip programming-language sections that don't apply (Algorithm, Time Complexity, Space Complexity) and instead ask for semantic markup / stylesheet sections (Structure, Styling notes, Responsiveness).
- Instruct the model NOT to wrap output in functions/classes — return valid HTML markup or a plain CSS stylesheet snippet matching the user's description (component, layout, form, etc.).
- C, and all existing languages, keep the current section template unchanged.

### 4. Everything else untouched
- Default selected language stays **TypeScript** (the current default; not changing it to JavaScript — flagging since the request mentioned JavaScript but the tool currently defaults to TypeScript).
- Difficulty dropdown, style, framework, comments toggle, history, examples, related tools — all unchanged.

## Technical details
- Two files edited: `src/routes/tools.code-generator.tsx` (LANGS array) and `src/lib/ai.functions.ts` (conditional system prompt in `generateCode`).
- Validation: typecheck, then run the Code Generator once per new language (HTML, CSS, C) in the preview and confirm the result panel shows correct fenced language tags and markup-appropriate output for HTML/CSS.
