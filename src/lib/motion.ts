/**
 * Motion system Terus Farm.
 * Prefira CSS + IntersectionObserver. Sem WebGL.
 *
 * Dev: NEXT_PUBLIC_ENABLE_MOTION=false desliga animações.
 */
export const ENABLE_MOTION = process.env.NEXT_PUBLIC_ENABLE_MOTION !== "false";

export const motion = {
  duration: {
    fast: 180,
    normal: 380,
    slow: 720,
  },
  easing: {
    premium: "cubic-bezier(0.22, 1, 0.36, 1)",
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    spring: "cubic-bezier(0.34, 1.2, 0.64, 1)",
  },
  stagger: 70,
} as const;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canAnimate() {
  return ENABLE_MOTION && !prefersReducedMotion();
}

export function isCoarsePointer() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(pointer: coarse)").matches;
}
