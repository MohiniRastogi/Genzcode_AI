import icon from "@/assets/codemate-icon.png";

export function BrandLogo({
  showSubtitle = true,
  className = "",
}: {
  showSubtitle?: boolean;
  className?: string;
}) {
  return (
    <span className={"flex min-w-0 items-center gap-2 " + className}>
      <img
        src={icon}
        alt="CodeMate AI Tools logo"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-xl shadow-sm"
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-semibold tracking-tight">
          Code<span className="text-primary">Mate</span>
        </span>
        {showSubtitle && (
          <span className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
            AI Tools
          </span>
        )}
      </span>
    </span>
  );
}
