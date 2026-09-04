"use client";

import { PondMap } from "@/components/backgrounds/PondMap";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconChart } from "@/components/ui/Icons";
import { COPY } from "@/data/farm";
import { track } from "@/lib/analytics";
import { usePointerTilt } from "@/lib/hooks";

export function Hero() {
  const stageRef = usePointerTilt<HTMLDivElement>(4);

  return (
    <section id="topo" className="relative overflow-hidden pb-6 pt-8 md:pt-14">
      <div className="tf-grid-bg pointer-events-none absolute inset-0" />
      <div className="tf-noise" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-brand-primary/10 blur-3xl" />

      <div className="tf-container relative">
        <p className="tf-kicker hero-enter">{COPY.hero.eyebrow}</p>

        <h1 className="tf-headline hero-enter mt-5 max-w-3xl" style={{ animationDelay: "90ms" }}>
          {COPY.hero.headlineBefore}
          <br />
          {COPY.hero.headlineAfter}{" "}
          <span className="accent">{COPY.hero.accent}</span>
        </h1>

        <p className="tf-sub hero-enter mt-5" style={{ animationDelay: "180ms" }}>
          {COPY.hero.subheadline}
        </p>

        <div
          className="hero-enter mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: "270ms" }}
        >
          <Button
            href="#produto"
            magnetic
            onClick={() => track("hero_cta_click", { cta: "conhecer" })}
          >
            {COPY.hero.primaryCta}
            <IconArrow />
          </Button>
          <Button
            href="#raio-x"
            variant="secondary"
            onClick={() => track("hero_cta_click", { cta: "raio-x" })}
          >
            <IconChart />
            {COPY.hero.secondaryCta}
          </Button>
        </div>
      </div>

      <div className="hero-visual hero-enter tf-container" style={{ animationDelay: "380ms" }}>
        <div ref={stageRef} className="hero-stage">
          <div className="relative h-[340px] overflow-hidden rounded-[22px] border border-brand-primary/15 shadow-premium md:h-[420px]">
            <PondMap interactive />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050a14]/20 via-[#050a14]/25 to-[#050a14]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050a14] to-transparent" />
            <p className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-primary">
              Mapa operacional · viveiros
            </p>
          </div>

          <div className="relative z-10 mx-auto -mt-24 w-[min(100%,420px)] md:-mt-28">
            <HeroCockpitPeek />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCockpitPeek() {
  return (
    <div className="cockpit tf-card-sweep">
      <div className="cockpit-top">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-text-tertiary">Cockpit</p>
          <p className="font-display text-sm font-semibold">Visão da fazenda</p>
        </div>
        <span className="rounded-full border border-brand-primary/25 bg-brand-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-brand-primary">
          Demo
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 px-3 py-3">
        {[
          ["Produção", "208,7 t"],
          ["FCA", "1,42"],
          ["kg/ha", "2.560"],
        ].map(([label, value]) => (
          <div key={label} className="kpi py-2">
            <p className="kpi-label">{label}</p>
            <p className="kpi-value text-[0.95rem]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
