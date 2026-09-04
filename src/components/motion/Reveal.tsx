"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import { canAnimate } from "@/lib/motion";

type Variant = "up" | "scale" | "left" | "right";

const VARIANT_CLASS: Record<Variant, string> = {
  up: "tf-reveal",
  scale: "tf-reveal-scale",
  left: "tf-reveal-left",
  right: "tf-reveal-right",
};

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span";
}

export function Reveal({
  variant = "up",
  delay = 0,
  as: Tag = "div",
  className,
  style,
  children,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!canAnimate()) {
      node.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-revealed");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -36px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(VARIANT_CLASS[variant], className)}
      style={delay ? { ...style, "--reveal-delay": `${delay}ms` } as React.CSSProperties : style}
      {...props}
    >
      {children}
    </Tag>
  );
}
