"use client";

import Image from "next/image";
import { useEffect } from "react";

import { PondMap } from "@/components/backgrounds/PondMap";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/Icons";
import { AQUAFARM_ASSETS, AQUAFARM_STATS, COPY } from "@/data/farm";
import { track } from "@/lib/analytics";
import { useInView, usePointerTilt } from "@/lib/hooks";

export function AquafarmCase() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.35 });
  const tiltRef = usePointerTilt<HTMLDivElement>(3);

  useEffect(() => {
    if (inView) track("aquafarm_case_view");
  }, [inView]);

  return (
    <section id="aquafarm" ref={ref} className="tf-section">
      <div className="tf-container relative">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <p className="tf-kicker">{COPY.aquafarm.eyebrow}</p>
            <span className="rounded-full border border-white/10 bg-white/95 px-2.5 py-1">
              <Image src={AQUAFARM_ASSETS.logo} alt="Aquafarm" width={92} height={16} />
            </span>
          </div>
          <h2 className="tf-headline mt-4 max-w-3xl">{COPY.aquafarm.headline}</h2>
          <p className="tf-sub mt-4">{COPY.aquafarm.text}</p>
          <p className="mt-3 text-sm font-medium text-brand-primary">{COPY.aquafarm.identity}</p>
        </Reveal>

        <div ref={tiltRef} className="mt-8 grid gap-3 md:grid-cols-3">
          <Reveal className="md:col-span-3">
            <PhotoFrame label="Operação real · vista aérea" tall tone="wide" />
          </Reveal>
          <Reveal delay={80}>
            <PhotoFrame label="Viveiros em operação" tone="day" />
          </Reveal>
          <Reveal delay={140} className="md:col-span-2">
            <PhotoFrame label="Monitoramento noturno" tone="night" />
          </Reveal>
        </div>

        {AQUAFARM_STATS.showOperationStats ? (
          <Reveal delay={80} className="mt-5">
            <div className="tf-card grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
              {AQUAFARM_STATS.items.map((item) => (
                <div key={item.label}>
                  <p className="font-display text-xl font-bold tracking-tight">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-text-tertiary">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}

        <Reveal className="mt-6">
          <Button href="#raio-x" variant="secondary">
            {COPY.aquafarm.cta}
            <IconArrow />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function PhotoFrame({
  label,
  tall = false,
  tone = "wide",
}: {
  label: string;
  tall?: boolean;
  tone?: "wide" | "day" | "night";
}) {
  const overlay =
    tone === "night"
      ? "from-[#050a14] via-[#071820]/70 to-[#041018]/20"
      : tone === "day"
        ? "from-[#050a14] via-[#0a2233]/45 to-transparent"
        : "from-[#050a14] via-[#050a14]/30 to-transparent";

  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-white/10 ${tall ? "h-56 md:h-72" : "h-40 md:h-48"}`}
    >
      <PondMap className={tone === "night" ? "scale-125 opacity-80" : tone === "day" ? "scale-110" : ""} />
      <div className={`absolute inset-0 bg-gradient-to-t ${overlay}`} />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]" />
      <figcaption className="absolute bottom-3 left-3 text-xs text-text-secondary">{label}</figcaption>
    </figure>
  );
}
