import { Reveal } from "@/components/motion/Reveal";
import { IconWarning, PROBLEM_ICONS } from "@/components/ui/Icons";
import { COPY } from "@/data/farm";

export function Problem() {
  return (
    <section className="tf-section" id="problema">
      <div className="tf-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="tf-container relative">
        <Reveal>
          <h2 className="tf-headline max-w-3xl">
            Quantos lugares você precisa consultar para{" "}
            <span className="accent">entender sua fazenda hoje?</span>
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {COPY.problem.sources.map((source, index) => {
            const Icon = PROBLEM_ICONS[source.id];
            return (
              <Reveal key={source.id} delay={index * 70} className="h-full">
                <article className="tf-card h-full p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold">{source.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{source.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={160} className="mt-6">
          <div className="tf-card tf-card-sweep flex items-start gap-3 p-4 md:p-5">
            <IconWarning className="mt-0.5 h-5 w-5 shrink-0 text-text-tertiary" />
            <p className="text-base leading-relaxed text-text-secondary">
              {COPY.problem.closeLead}
              <br />
              <strong className="font-display text-text-primary">{COPY.problem.closeAccent}</strong>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
