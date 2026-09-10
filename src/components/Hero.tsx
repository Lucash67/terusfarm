"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { IconArrow, IconChart } from "@/components/ui/Icons";
import { COPY, DEMO_COCKPIT, HERO_IMAGE } from "@/data/farm";
import { track } from "@/lib/analytics";
import { useInView, usePointerTilt } from "@/lib/hooks";

export function Hero() {
  const stageRef = usePointerTilt<HTMLDivElement>(4);
  const { ref: sceneRef, inView: sceneOn } = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px",
  });
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  return (
    <section id="topo" className="relative overflow-hidden pb-6 pt-8 md:pt-14">
      <div className="tf-grid-bg pointer-events-none absolute inset-0" />
      <div className="tf-noise" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-brand-primary/10 blur-3xl" />

      <div className="tf-container relative md:grid md:grid-cols-12 md:items-start md:gap-10">
        <div className="md:col-span-5">
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

        <div
          ref={sceneRef}
          className={`hero-visual hero-enter md:col-span-7 md:mt-0 ${sceneOn ? "hero-scene--active" : ""}`}
          style={{ animationDelay: "380ms" }}
        >
          <div ref={stageRef} className="hero-stage">
            <div className="hero-photo">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 56vw"
                className="object-cover object-center saturate-[0.92] contrast-[1.05]"
              />
              <div className="hero-photo__overlay" aria-hidden="true" />
              <svg className="hero-photo__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M27 38 L48 52 L68 34" />
                <path d="M48 52 L58 68" />
              </svg>
              {HERO_IMAGE.markers.map((marker) => (
                <button
                  key={marker.id}
                  type="button"
                  className={`hero-marker${activeMarker === marker.id ? " hero-marker--on" : ""}`}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  aria-label={marker.label}
                  onClick={() => setActiveMarker((id) => (id === marker.id ? null : marker.id))}
                >
                  <span className="hero-marker__core" />
                  {activeMarker === marker.id ? (
                    <span className="hero-marker__tip" role="tooltip">
                      {marker.label}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="relative z-10 mx-auto -mt-20 w-[min(100%,420px)] md:-mt-24 md:ml-7">
              <HeroCockpitPeek />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCockpitPeek() {
  const production = DEMO_COCKPIT.production.value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

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
          ["Produção", `${production} t`],
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
