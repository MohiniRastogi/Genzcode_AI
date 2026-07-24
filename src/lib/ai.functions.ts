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

// ---------- Regex Generator ----------
const RegexInput = z.object({
  prompt: z.string().min(2),
  flavor: z.string().default("JavaScript"),
});

export const generateRegex = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => RegexInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are a regex expert. Return Markdown with these EXACT sections:

## Regex
\`\`\`regex
<the pattern only, no delimiters>
\`\`\`

## Flags
\`<flags like gi>\`

## Explanation
Token-by-token breakdown.

## Sample Matches
- \`match 1\`
- \`match 2\`

## Sample Non-Matches
- \`non 1\`

## ${data.flavor} Usage
\`\`\`${data.flavor.toLowerCase()}
<a runnable example>
\`\`\`

## Cheat Sheet
| Token | Meaning |
| --- | --- |
| ^ | start |
| $ | end |
`;
    return run(system, `Regex flavor: ${data.flavor}\nDescribe: ${data.prompt}`);
  });

// ---------- SQL Generator ----------
const SqlInput = z.object({
  prompt: z.string().min(2),
  dialect: z.string().default("PostgreSQL"),
  operation: z.string().default("Auto"),
});

export const generateSql = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => SqlInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are a senior database engineer. Target dialect: ${data.dialect}.
Return Markdown with these sections:

## Query
\`\`\`sql
<the query>
\`\`\`

## Explanation
Plain-English walk-through.

## Assumed Schema
\`\`\`sql
<CREATE TABLE statements you assumed>
\`\`\`

## Optimization Notes
- Indexes, joins, plan hints.

## Example Result
| col | col |
| --- | --- |
`;
    return run(
      system,
      `Preferred operation: ${data.operation}\nRequest: ${data.prompt}`,
    );
  });

// ---------- API Generator ----------
const ApiInput = z.object({
  prompt: z.string().min(2),
  framework: z.string().default("Express"),
  auth: z.string().default("None"),
  features: z.string().default(""),
});

export const generateApi = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => ApiInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are a senior backend engineer. Generate a complete REST API in ${data.framework}.
Return Markdown with these sections:

## Folder Structure
\`\`\`
<tree>
\`\`\`

## Code
One fenced block per file, each preceded by \`### path/to/file\`.
Include routes, controllers, models, validation, middleware, error handling.

## Authentication
How ${data.auth} is wired in.

## Endpoints
| Method | Path | Description |
| --- | --- | --- |

## Postman Collection
\`\`\`json
<a valid Postman v2.1 collection JSON>
\`\`\`

## Run Instructions
Setup, install, run commands.`;
    return run(
      system,
      `Framework: ${data.framework}\nAuth: ${data.auth}\nExtra features: ${data.features || "CRUD, pagination, validation, error handling, Swagger"}\n\nResource / description:\n${data.prompt}`,
    );
  });

// ---------- README Generator ----------
const ReadmeInput = z.object({
  prompt: z.string().min(2),
  projectName: z.string().default(""),
  tech: z.string().default(""),
  license: z.string().default("MIT"),
});

export const generateReadme = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => ReadmeInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are a technical writer. Produce a complete, production-grade README.md.
Return ONLY valid Markdown (no wrapper prose). Include:

# <Project Name>
Shields.io badges row (build, license, version, PRs welcome).

## ✨ Features
## 📸 Screenshots
(use placeholder image links)
## 🛠 Technologies
## 🚀 Installation
## 💻 Usage
## 📁 Project Structure
## 🧪 Testing
## 🤝 Contributing
## 📄 License
## 👤 Author`;
    return run(
      system,
      `Project name: ${data.projectName || "(infer)"}\nTech: ${data.tech || "(infer)"}\nLicense: ${data.license}\n\nDescription:\n${data.prompt}`,
    );
  });

// ---------- Documentation Generator ----------
const DocInput = z.object({
  code: z.string().min(3),
  docType: z.string().default("API Docs"),
  format: z.string().default("Markdown"),
  language: z.string().default("auto"),
});

export const generateDocs = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => DocInput.parse(v))
  .handler(async ({ data }) => {
    const system = `You are a documentation generator. Produce ${data.docType} in ${data.format} format for the given ${data.language} code.

Return Markdown with:

## Overview
## Public API
For each function/class/endpoint: signature, parameters table, return, throws, example.

## Inline Documentation
\`\`\`${data.language === "auto" ? "" : data.language.toLowerCase()}
<the original code annotated with ${
      data.format === "JSDoc"
        ? "JSDoc"
        : data.format === "Python Docstrings"
          ? "Google-style docstrings"
          : data.format === "Java Docs"
            ? "Javadoc"
            : "doc comments"
    }>
\`\`\`

## Usage Examples
## Notes & Gotchas`;
    return run(system, `Code:\n\`\`\`\n${data.code}\n\`\`\``);
  });

