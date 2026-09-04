"use client";

import { Reveal } from "@/components/motion/Reveal";
import { IconGrid, IconSignal, IconSpark, IconDatabase } from "@/components/ui/Icons";
import { COPY } from "@/data/farm";
import { useInView } from "@/lib/hooks";

const ICONS = [IconDatabase, IconGrid, IconSpark, IconSignal];

export function HowItWorks() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="como-funciona" className="tf-section">
      <div className="tf-grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="tf-container relative">
        <Reveal>
          <p className="tf-kicker">Como funciona</p>
          <h2 className="tf-headline mt-4 max-w-3xl">
            Dados da fazenda viram <span className="accent">decisão.</span>
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-10">
          <div
            className="flow-line absolute bottom-6 left-[21px] top-6 md:hidden"
            data-active={inView}
          />

          <ol className="grid gap-4 md:grid-cols-4">
            {COPY.how.steps.map((step, index) => {
              const Icon = ICONS[index];
              return (
                <Reveal key={step.id} delay={index * 80} as="li">
                  <article className="tf-card relative p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-primary/25 bg-brand-primary/10 text-brand-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-tertiary">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </ol>
        </div>

        <Reveal className="mt-6">
          <p className="tf-card px-4 py-4 text-center font-display text-lg">
            {COPY.how.close}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
