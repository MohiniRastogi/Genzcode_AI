import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Adds a fast fade/slide-up reveal to each direct <section> child as it
 * enters the viewport. Skipped entirely when the user prefers reduced motion.
 */
export function ScrollReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>(":scope > section"),
    ).slice(1); // keep the hero visible immediately

    sections.forEach((s) => s.setAttribute("data-reveal", ""));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-reveal", "in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
