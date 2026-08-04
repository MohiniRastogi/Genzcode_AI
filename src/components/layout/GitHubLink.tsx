import { Github } from "lucide-react";

export const GITHUB_URL = "https://github.com/MohiniRastogi";

export function GitHubLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="CodeMate on GitHub (opens in a new tab)"
      title="GitHub"
      className={
        "inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-border bg-transparent text-foreground/80 transition hover:bg-accent hover:text-foreground " +
        className
      }

    >
      <Github className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
