import { useRef, useEffect } from "react";

// ─── SCROLL REVEAL HOOK ─────────────────────────────
// Tracks revealed elements in a WeakSet so the ".visible" class survives
// React re-renders (React replaces the entire className string, which
// strips manually-added classes like "visible").

const revealedElements = new WeakSet<Element>();

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  // 1. Set up IntersectionObserver once on mount
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            revealedElements.add(e.target);
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );

    const scan = () => {
      if (!revealedElements.has(el)) obs.observe(el);
      const parent = el.parentElement;
      if (parent) {
        parent.querySelectorAll(".reveal").forEach((c) => {
          if (c !== el && !revealedElements.has(c)) obs.observe(c);
        });
      }
    };

    scan();
    // Re-scan for late-mounted / Suspense children
    const t1 = setTimeout(scan, 300);
    const t2 = setTimeout(scan, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      obs.disconnect();
    };
  }, []);

  // 2. After every render, re-apply "visible" to previously-revealed elements
  //    (React className reconciliation strips manually-added classes)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (revealedElements.has(el) && !el.classList.contains("visible")) {
      el.classList.add("visible");
    }

    const parent = el.parentElement;
    if (parent) {
      parent.querySelectorAll(".reveal").forEach((c) => {
        if (revealedElements.has(c) && !c.classList.contains("visible")) {
          c.classList.add("visible");
        }
      });
    }
  });

  return ref;
}
