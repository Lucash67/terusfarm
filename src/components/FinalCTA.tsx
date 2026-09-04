"use client";

import { PondMap } from "@/components/backgrounds/PondMap";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { IconCalendar, IconChat } from "@/components/ui/Icons";
import { getDemoHref, whatsappUrl } from "@/config/contact";
import { COPY, SITE } from "@/data/farm";
import { track } from "@/lib/analytics";

export function FinalCTA() {
  const demoHref = getDemoHref();

  return (
    <section id="contato" className="tf-section pb-28">
      <div className="tf-container relative">
        <div className="tf-card relative overflow-hidden p-6 md:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <PondMap />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050a14]/70 via-[#050a14]/85 to-[#050a14]" />
          <div className="relative">
            <Reveal>
              <h2 className="tf-headline max-w-3xl">{COPY.final.headline}</h2>
              <p className="tf-sub mt-4">{COPY.final.subheadline}</p>
            </Reveal>
            <Reveal delay={80} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                href={demoHref}
                target={demoHref.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                magnetic
                onClick={() => track("demo_click")}
              >
                <IconCalendar />
                {COPY.final.primaryCta}
              </Button>
              <Button
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                onClick={() => track("whatsapp_click", { source: "final" })}
              >
                <IconChat />
                {COPY.final.secondaryCta}
              </Button>
            </Reveal>
            <Reveal delay={120} className="mt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-primary">
                {COPY.final.event}
              </p>
              <p className="mt-2 text-sm text-text-secondary">{COPY.final.eventText}</p>
            </Reveal>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
          <div>
            <BrandLogo size="footer" />
            <p className="mt-2 text-sm text-text-tertiary">{SITE.tagline}</p>
          </div>
          <p className="text-sm text-text-tertiary">Terus Tec.</p>
        </footer>
      </div>
    </section>
  );
}
