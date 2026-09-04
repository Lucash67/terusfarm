"use client";

import { Reveal } from "@/components/motion/Reveal";
import { COPY, DEMO_COCKPIT } from "@/data/farm";
import { useCountUp, useInView } from "@/lib/hooks";
import { canAnimate } from "@/lib/motion";

export function FarmCockpit() {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.08,
    rootMargin: "80px 0px -10% 0px",
  });

  return (
    <section id="produto" className="tf-section">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px tf-horizon" />
      <div className="tf-container relative">
        <Reveal>
          <p className="tf-kicker">{COPY.cockpit.tag}</p>
          <h2 className="tf-headline mt-4 max-w-3xl">{COPY.cockpit.headline}</h2>
          <p className="tf-sub mt-4">{COPY.cockpit.subheadline}</p>
        </Reveal>

        <Reveal variant="scale" delay={80} className="mt-8">
          <div ref={ref} className="cockpit relative mx-auto max-w-3xl [transform-style:preserve-3d]">
            <div className="pointer-events-none absolute -inset-px rounded-[20px] bg-gradient-to-br from-brand-primary/25 via-transparent to-brand-secondary/20 opacity-70" />
            <div className="relative overflow-hidden rounded-[20px]">
              <div className="cockpit-top">
                <div>
                  <p className="font-display text-sm font-semibold">Cockpit</p>
                  <p className="text-xs text-text-tertiary">Sinais da operação · dados ilustrativos</p>
                </div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
                  Demo data
                </span>
              </div>

              <div className="kpi-grid">
                <Kpi
                  label={DEMO_COCKPIT.production.label}
                  value={DEMO_COCKPIT.production.value}
                  decimals={1}
                  suffix={DEMO_COCKPIT.production.suffix}
                  delta={DEMO_COCKPIT.production.delta}
                  active={inView}
                  chart={<Sparkline active={inView} />}
                />
                <Kpi
                  label={DEMO_COCKPIT.ponds.label}
                  value={DEMO_COCKPIT.ponds.value}
                  detail={DEMO_COCKPIT.ponds.detail}
                  active={inView}
                  chart={<PondDots />}
                />
                <Kpi
                  label={DEMO_COCKPIT.cycles.label}
                  value={DEMO_COCKPIT.cycles.value}
                  detail={DEMO_COCKPIT.cycles.detail}
                  active={inView}
                  chart={<CycleArc active={inView} />}
                />
                <Kpi
                  label={DEMO_COCKPIT.fca.label}
                  value={DEMO_COCKPIT.fca.value}
                  decimals={2}
                  delta={DEMO_COCKPIT.fca.delta}
                  active={inView}
                />
                <Kpi
                  label={DEMO_COCKPIT.kgHa.label}
                  value={DEMO_COCKPIT.kgHa.value}
                  delta={DEMO_COCKPIT.kgHa.delta}
                  active={inView}
                />
                <Kpi
                  label={DEMO_COCKPIT.survival.label}
                  value={DEMO_COCKPIT.survival.value}
                  suffix={DEMO_COCKPIT.survival.suffix}
                  delta={DEMO_COCKPIT.survival.delta}
                  active={inView}
                />
                <Kpi
                  label={DEMO_COCKPIT.cost.label}
                  value={DEMO_COCKPIT.cost.value}
                  decimals={2}
                  prefix={DEMO_COCKPIT.cost.prefix}
                  active={inView}
                  chart={<MiniBars active={inView} />}
                />
                <Kpi
                  label={DEMO_COCKPIT.clients.label}
                  value={DEMO_COCKPIT.clients.value}
                  detail={DEMO_COCKPIT.clients.detail}
                  active={inView}
                />
                <Kpi
                  label={DEMO_COCKPIT.commercial.label}
                  value={DEMO_COCKPIT.commercial.value}
                  decimals={1}
                  suffix={DEMO_COCKPIT.commercial.suffix}
                  detail={DEMO_COCKPIT.commercial.detail}
                  active={inView}
                />
              </div>

              <div className="alert-bar">
                <span className="alert-dot" />
                Alertas: {DEMO_COCKPIT.alerts.critical} críticos · {DEMO_COCKPIT.alerts.text}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  delta,
  detail,
  active,
  chart,
}: {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delta?: string;
  detail?: string;
  active: boolean;
  chart?: React.ReactNode;
}) {
  const counted = useCountUp(value, active, { decimals, duration: 980 });
  const formatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(counted);

  return (
    <article className="kpi">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">
        {prefix}
        {formatted}
        {suffix}
      </p>
      {delta ? <p className="kpi-delta">{delta}</p> : null}
      {detail ? <p className="mt-1 text-[11px] text-text-tertiary">{detail}</p> : null}
      {chart}
    </article>
  );
}

function Sparkline({ active }: { active: boolean }) {
  const points = DEMO_COCKPIT.sparkline;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 26 - ((point - min) / (max - min)) * 22;
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 28" className="spark" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="rgb(0 194 255)"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{
          strokeDasharray: 180,
          strokeDashoffset: active && canAnimate() ? 0 : 180,
          transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </svg>
  );
}

function PondDots() {
  return (
    <div className="mt-3 grid grid-cols-8 gap-1" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          className="h-1.5 rounded-[2px] bg-brand-primary/70"
          style={{ opacity: index < 19 ? 0.9 : 0.25 }}
        />
      ))}
    </div>
  );
}

function CycleArc({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 36 36" className="mt-2 h-8 w-8" aria-hidden="true">
      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke="rgb(0 194 255)"
        strokeWidth="3"
        strokeDasharray="88"
        strokeDashoffset={active ? 38 : 88}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </svg>
  );
}

function MiniBars({ active }: { active: boolean }) {
  return (
    <div className="mt-3 flex h-7 items-end gap-1" aria-hidden="true">
      {DEMO_COCKPIT.costBars.map((height, index) => (
        <span
          key={index}
          className="flex-1 rounded-sm bg-brand-primary/70"
          style={{
            height: active ? `${height}%` : "8%",
            transition: `height 700ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}
