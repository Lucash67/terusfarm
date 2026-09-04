"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { canAnimate, isCoarsePointer } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  magnetic?: boolean;
  loading?: boolean;
  target?: string;
  rel?: string;
}

const VARIANTS: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

export function Button({
  variant = "primary",
  size = "lg",
  href,
  magnetic = false,
  loading = false,
  className,
  children,
  target,
  rel,
  onClick,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  const onPointerMove = (event: React.PointerEvent) => {
    if (!magnetic || !canAnimate() || isCoarsePointer()) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    node.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const classes = cn(
    "btn",
    VARIANTS[variant],
    size === "md" && "btn-md",
    className,
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        onPointerMove={onPointerMove}
        onPointerLeave={onLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={classes}
      onPointerMove={onPointerMove}
      onPointerLeave={onLeave}
      data-loading={loading || undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
