"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/Icons";
import { AQUAFARM_ASSETS, AQUAFARM_STATS, COPY } from "@/data/farm";
import { track } from "@/lib/analytics";
import { useCountUp, useInView } from "@/lib/hooks";
import { canAnimate, isCoarsePointer } from "@/lib/motion";

const MARKERS = [
  { x: 28, y: 38, label: "Viveiro" },
  { x: 62, y: 48, label: "Produção" },
  { x: 44, y: 72, label: "Ciclo" },
] as const;

export function AquafarmCase() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.28 });
  const visible = inView || !canAnimate();

  useEffect(() => {
    if (inView) track("aquafarm_case_view");
  }, [inView]);

  return (
    <section id="aquafarm" ref={ref} className="tf-section">
      <div className="tf-container relative">
        <div className="md:grid md:grid-cols-12 md:items-start md:gap-12">
          <Reveal className="md:col-span-5">
            <p className="tf-kicker">{COPY.aquafarm.eyebrow}</p>
            <h2 className="tf-headline mt-4">{COPY.aquafarm.headline}</h2>
            <p className="tf-sub mt-4">{COPY.aquafarm.text}</p>
            <ClientLockup />
          </Reveal>

          <div className="case-compose mt-8 md:col-span-7 md:mt-0" data-visible={visible ? "true" : "false"}>
            <MainShot />
            <div className="case-thumbs mt-2.5 grid grid-cols-2 gap-2.5">
              <CasePhoto
                src={AQUAFARM_ASSETS.caseDetail1}
                fallbackTone="day"
                alt="Viveiros da Aquafarm em outro ângulo da operação"
                sizes="(max-width: 768px) 50vw, 28vw"
                className="case-thumb aspect-[4/3]"
              />
              <CasePhoto
                src={AQUAFARM_ASSETS.caseDetail2}
                fallbackTone="dusk"
                alt="Operação da Aquafarm vista dos viveiros"
                sizes="(max-width: 768px) 50vw, 28vw"
                className="case-thumb case-thumb--late aspect-[4/3]"
              />
            </div>
          </div>
        </div>

        {AQUAFARM_STATS.showOperationStats ? (
          <div className="case-stats mt-6" data-visible={visible ? "true" : "false"}>
            {AQUAFARM_STATS.items.map((item) => (
              <Stat key={item.label} value={item.value} label={item.label} active={visible} />
            ))}
          </div>
        ) : null}

        <Reveal delay={80} className="mt-6">
          <p className="text-sm italic text-text-secondary">{COPY.aquafarm.signature}</p>
          <Button href="#raio-x" variant="ghost" size="md" className="case-cta mt-4">
            {COPY.aquafarm.cta}
            <IconArrow />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function ClientLockup() {
  const markReady = useImageReady(AQUAFARM_ASSETS.mark);

  return (
    <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/40 py-1 pl-1 pr-3">
      {markReady ? (
        <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-black">
          <Image
            src={AQUAFARM_ASSETS.mark}
            alt=""
            width={20}
            height={20}
            className="h-4 w-4 object-contain"
          />
        </span>
      ) : null}
      <p className="text-[13px] font-medium leading-none text-text-primary">{COPY.aquafarm.identity}</p>
    </div>
  );
}

function MainShot() {
  const frameRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = mediaRef.current;
    const frame = frameRef.current;
    if (!media || !frame || !canAnimate() || isCoarsePointer()) return;

    const onScroll = () => {
      const rect = frame.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const offset = (rect.top + rect.height / 2 - mid) / mid;
      const shift = Math.max(-6, Math.min(6, offset * 6));
      media.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(1.03)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <figure ref={frameRef} className="case-main case-shot">
      <div ref={mediaRef} className="case-main__media">
        <CasePhoto
          src={AQUAFARM_ASSETS.heroAerial}
          fallbackSrc={AQUAFARM_ASSETS.caseWide}
          fallbackTone="aerial"
          alt="Vista aérea dos viveiros da Aquafarm"
          sizes="(max-width: 768px) 100vw, 56vw"
          className="h-full w-full"
        />
      </div>
      <div className="case-main__wash" />
      <div className="case-main__vignette" />
      <div className="case-overlay" aria-hidden="true">
        <svg className="case-fiducials" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M8 18h10M8 18v10" />
          <path d="M92 18h-10M92 18v10" />
          <path d="M18 78 38 62" />
        </svg>
        {MARKERS.map((marker) => (
          <span
            key={marker.label}
            className="case-marker"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            <i />
            {marker.label}
          </span>
        ))}
      </div>
    </figure>
  );
}

function CasePhoto({
  src,
  fallbackSrc,
  fallbackTone,
  alt,
  sizes,
  className,
}: {
  src: string;
  fallbackSrc?: string;
  fallbackTone: "aerial" | "day" | "dusk";
  alt: string;
  sizes: string;
  className?: string;
}) {
  const primary = useImageReady(src);
  const secondary = useImageReady(fallbackSrc || "");
  const resolved = primary === true ? src : secondary === true ? fallbackSrc : null;
  const probing = primary === null || (primary === false && Boolean(fallbackSrc) && secondary === null);

  return (
    <div className={`case-photo ${className || ""}`}>
      {resolved ? (
        <Image src={resolved} alt={alt} fill sizes={sizes} className="object-cover object-[center_42%]" />
      ) : probing ? (
        <div className="h-full w-full bg-[#0a1620]" />
      ) : (
        <PondStill tone={fallbackTone} />
      )}
    </div>
  );
}

function PondStill({ tone }: { tone: "aerial" | "day" | "dusk" }) {
  const sky = tone === "dusk" ? "#1c1612" : tone === "day" ? "#7a96a8" : "#2c261c";
  const earth = tone === "dusk" ? "#3d2c1c" : tone === "day" ? "#6a5340" : "#4d3c28";
  const dike = tone === "dusk" ? "#2c2014" : "#3a2c1c";
  const water = tone === "dusk" ? "#2a4538" : tone === "day" ? "#3f7058" : "#2a5648";
  const waterDeep = tone === "dusk" ? "#1e332a" : tone === "day" ? "#2f5846" : "#1f4438";
  const shift = tone === "day" ? -8 : tone === "dusk" ? 6 : 0;

  const ponds = [
    { x: 8, y: 22, w: 42, h: 28, deep: false },
    { x: 56, y: 20, w: 46, h: 30, deep: true },
    { x: 108, y: 24, w: 44, h: 26, deep: false },
    { x: 10, y: 56, w: 40, h: 26, deep: true },
    { x: 56, y: 56, w: 48, h: 28, deep: false },
    { x: 110, y: 56, w: 40, h: 24, deep: true },
  ];

  return (
    <svg viewBox={`${shift} 0 160 100`} className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x={shift} width="160" height="100" fill={sky} />
      <rect x={shift} y="16" width="160" height="84" fill={earth} />
      <path d={`M${4 + shift} 16 H${156 + shift} V96 H${4 + shift} Z`} fill={dike} opacity="0.35" />
      {ponds.map((pond) => (
        <rect
          key={`${pond.x}-${pond.y}`}
          x={pond.x}
          y={pond.y}
          width={pond.w}
          height={pond.h}
          rx="1.6"
          fill={pond.deep ? waterDeep : water}
        />
      ))}
      <rect x={50 + shift} y="16" width="5" height="80" fill={earth} />
      <rect x={102 + shift} y="16" width="5" height="80" fill={earth} />
      <rect x={shift} y="50" width="160" height="5" fill={earth} />
      <rect width="160" height="100" x={shift} fill={`url(#case-still-${tone})`} />
      <defs>
        <linearGradient id={`case-still-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050a14" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#050a14" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#050a14" stopOpacity="0.28" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Stat({ value, label, active }: { value: string; label: string; active: boolean }) {
  const parsed = value.match(/^(\d+)(.*)$/);
  const number = parsed ? Number(parsed[1]) : 0;
  const suffix = parsed ? parsed[2] : value;
  const shown = useCountUp(number, active, { duration: 900 });

  return (
    <div>
      <p className="font-display text-lg font-semibold tracking-tight tabular-nums">
        {parsed ? `${shown}${suffix}` : value}
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-text-tertiary">{label}</p>
    </div>
  );
}

function useImageReady(src: string) {
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    if (!src) {
      setReady(false);
      return;
    }
    const image = new window.Image();
    image.onload = () => setReady(true);
    image.onerror = () => setReady(false);
    image.src = src;
  }, [src]);

  return ready;
}
