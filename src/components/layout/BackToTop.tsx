import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/80 text-foreground shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
