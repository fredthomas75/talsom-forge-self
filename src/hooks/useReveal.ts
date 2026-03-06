import { useRef, useEffect } from "react";

// ─── SCROLL REVEAL HOOK ─────────────────────────────

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    // observe stagger children in sibling containers
    const parent = el.parentElement;
    if (parent) {
      parent.querySelectorAll(".reveal").forEach((c) => { if (c !== el) obs.observe(c); });
    }
    return () => obs.disconnect();
  }, []);
  return ref;
}
