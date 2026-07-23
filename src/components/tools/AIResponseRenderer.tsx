import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  className?: string;
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative my-4 overflow-hidden rounded-2xl border border-border/60 bg-[oklch(0.985_0.005_260)]">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-xs text-muted-foreground">
        <span className="font-mono">{language || "code"}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 opacity-0 transition group-hover:opacity-100 hover:bg-muted"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.85rem",
        }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export function AIResponseRenderer({ content, className }: Props) {
  return (
    <div
      className={cn(
        "prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-lg prose-h2:mt-6 prose-p:text-sm prose-li:text-sm prose-table:text-sm",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className, children, ...rest } = props as {
              className?: string;
              children?: React.ReactNode;
            };
            const match = /language-(\w+)/.exec(className || "");
            const value = String(children ?? "").replace(/\n$/, "");
            const isBlock = value.includes("\n") || !!match;
            if (isBlock) {
              return <CodeBlock language={match?.[1] ?? ""} value={value} />;
            }
            return (
              <code
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
                {...rest}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
