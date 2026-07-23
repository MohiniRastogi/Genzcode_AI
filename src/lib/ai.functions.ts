import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL_ID = "google/gemini-3.6-flash";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL_ID);
}

async function run(system: string, prompt: string) {
  const model = getModel();
  const { text } = await generateText({ model, system, prompt });
  return { markdown: text };
}

// ---------- Code Generator ----------
const GenerateInput = z.object({
  language: z.string().min(1),
  difficulty: z.string().min(1),
  framework: z.string().default(""),
  style: z.string().default(""),
  comments: z.boolean().default(true),
  prompt: z.string().min(3),
});

export const generateCode = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => GenerateInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are CodeMateAI, a senior software engineer. Return a well-structured Markdown response with these sections in order:
## Code
\`\`\`${data.language.toLowerCase()}
<code here>
\`\`\`
## Explanation
## Algorithm
## Time Complexity
## Space Complexity
## Edge Cases
## Example Input
## Example Output

Be concise but precise. Never omit sections.`;
    const prompt = `Language: ${data.language}
Difficulty: ${data.difficulty}
Framework: ${data.framework || "none"}
Style: ${data.style || "idiomatic"}
Include comments: ${data.comments ? "yes" : "no"}

Task:
${data.prompt}`;
    return run(system, prompt);
  });

// ---------- Code Reviewer ----------
const ReviewInput = z.object({
  code: z.string().min(3),
  language: z.string().default("auto"),
});

export const reviewCode = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => ReviewInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are a rigorous code reviewer. Return Markdown with this EXACT structure:

## Overall Score
**<0-100>/100** — one-line verdict.

## Scores
| Category | Score |
| --- | --- |
| Code Quality | X/10 |
| Readability | X/10 |
| Performance | X/10 |
| Security | X/10 |
| Maintainability | X/10 |
| Naming Convention | X/10 |
| Best Practices | X/10 |

## Potential Bugs
- ...

## Unused / Dead Code
- ...

## Optimization Opportunities
- ...

## Suggestions
- ...

## Corrected Code
\`\`\`
<full improved code>
\`\`\`

## Complexity Comparison
| | Before | After |
| --- | --- | --- |
| Time | | |
| Space | | |
`;
    return run(system, `Language: ${data.language}\n\nCode:\n\`\`\`\n${data.code}\n\`\`\``);
  });

// ---------- Bug Solver ----------
const BugInput = z.object({
  code: z.string().min(3),
  language: z.string().default("auto"),
  errorMessage: z.string().default(""),
});

export const solveBug = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => BugInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are an expert debugger. Return Markdown with these sections:

## Detected Issues
- **Type**: (Syntax / Logic / Runtime / Compilation / Security / Memory / Null / Infinite Loop)
- **Cause**: ...

## Fixed Code
\`\`\`
<complete fixed code>
\`\`\`

## Explanation
Why this fix works.

## Best Practice
How to avoid this class of bug in future.`;
    return run(
      system,
      `Language: ${data.language}\nError message: ${data.errorMessage || "(none)"}\n\nCode:\n\`\`\`\n${data.code}\n\`\`\``,
    );
  });

// ---------- Code Converter ----------
const ConvertInput = z.object({
  code: z.string().min(3),
  from: z.string().min(1),
  to: z.string().min(1),
});

export const convertCode = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => ConvertInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are an expert polyglot programmer. Return Markdown with these sections:

## Converted Code
\`\`\`${data.to.toLowerCase()}
<converted code>
\`\`\`

## Syntax Differences
- ...

## Performance Notes
- ...

## Advantages of ${data.to}
- ...

## Disadvantages / Caveats
- ...`;
    return run(system, `Convert this ${data.from} code to ${data.to}:\n\n\`\`\`${data.from.toLowerCase()}\n${data.code}\n\`\`\``);
  });
