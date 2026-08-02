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
        "inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border/60 bg-background/60 text-foreground/80 backdrop-blur-sm transition hover:bg-background hover:text-foreground " +
        className
      }
    >
      <Github className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
