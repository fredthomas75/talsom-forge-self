import { useRef, useEffect } from "react";

// ─── SCROLL REVEAL HOOK ─────────────────────────────
// Observes the ref element + all sibling .reveal elements within the same
// parent container.  A delayed re-scan catches children that mount after
// the initial useEffect (e.g. components inside <Suspense>).

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );

    const scan = () => {
      // observe the anchor element itself
      if (!el.classList.contains("visible")) obs.observe(el);
      // observe all .reveal siblings inside the same parent
      const parent = el.parentElement;
      if (parent) {
        parent.querySelectorAll(".reveal").forEach((c) => {
          if (c !== el && !c.classList.contains("visible")) obs.observe(c);
        });
      }
    };

    // Initial scan
    scan();
    // Re-scan after a short delay to catch late-mounted / Suspense children
    const t1 = setTimeout(scan, 300);
    const t2 = setTimeout(scan, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      obs.disconnect();
    };
  }, []);
  return ref;
}
