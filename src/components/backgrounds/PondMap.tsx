"use client";

import { useId, useState } from "react";

import { HERO_PONDS } from "@/data/farm";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/hooks";

interface PondMapProps {
  interactive?: boolean;
  className?: string;
}

export function PondMap({ interactive = false, className }: PondMapProps) {
  const [active, setActive] = useState<string | null>(null);
  const waterId = useId().replace(/:/g, "");
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05, rootMargin: "80px" });

  return (
    <div
      ref={ref}
      className={cn("pond-map", !inView && "pond-map--paused", className)}
      aria-hidden={!interactive}
    >
      <svg viewBox="0 0 100 80" className="pond-map__svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={waterId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a3a52" />
            <stop offset="55%" stopColor="#062536" />
            <stop offset="100%" stopColor="#041820" />
          </linearGradient>
        </defs>

        <rect width="100" height="80" fill="#071018" />

        {[
          [6, 8, 16, 11],
          [24, 7, 18, 12],
          [44, 9, 15, 10],
          [62, 8, 17, 11],
          [81, 10, 13, 9],
          [7, 22, 15, 12],
          [25, 23, 16, 11],
          [44, 22, 17, 13],
          [64, 23, 14, 11],
          [80, 24, 14, 10],
          [8, 38, 17, 12],
          [28, 38, 15, 11],
          [46, 39, 16, 12],
          [65, 38, 15, 11],
          [82, 39, 12, 10],
          [7, 54, 16, 11],
          [26, 53, 17, 12],
          [46, 55, 15, 10],
          [64, 54, 16, 11],
          [82, 53, 12, 11],
        ].map(([x, y, w, h], index) => (
          <rect
            key={index}
            x={x}
            y={y}
            width={w}
            height={h}
            rx="1.1"
            fill={`url(#${waterId})`}
            stroke="rgba(0,194,255,0.12)"
            strokeWidth="0.18"
          />
        ))}

        <g stroke="rgba(0,194,255,0.28)" strokeWidth="0.18" fill="none">
          <path d="M18 28 L38 42 L58 33 L74 52 L46 68" />
          <path d="M38 42 L46 68" />
        </g>

        {HERO_PONDS.map((pond) => (
          <g key={pond.id}>
            <circle cx={pond.x} cy={pond.y} r="1.35" className="pond-node__core" />
            <circle cx={pond.x} cy={pond.y} r="2.4" className="pond-node__ring" />
          </g>
        ))}
      </svg>

      {interactive
        ? HERO_PONDS.map((pond) => (
            <button
              key={pond.id}
              type="button"
              className="pond-hit"
              style={{ left: `${pond.x}%`, top: `${(pond.y / 80) * 100}%` }}
              aria-label={pond.label}
              onClick={() => setActive((current) => (current === pond.id ? null : pond.id))}
            />
          ))
        : null}

      {interactive && active ? (
        <div className="pond-tooltip" role="status">
          {HERO_PONDS.find((pond) => pond.id === active)?.label}
        </div>
      ) : null}
    </div>
  );
}
