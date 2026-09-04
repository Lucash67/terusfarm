"use client";

import { Button } from "@/components/ui/Button";
import { IconArrow, IconChat, IconSpark } from "@/components/ui/Icons";
import { getDemoHref } from "@/config/contact";
import { track } from "@/lib/analytics";
import type { DiagnosticReport } from "@/lib/raiox";

export function DiagnosticResult({
  report,
  onReset,
}: {
  report: DiagnosticReport;
  onReset: () => void;
}) {
  const demoHref = getDemoHref();

  return (
    <div className="raiox-result">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-primary">
        {report.id}
        {report.localNote ? ` · ${report.localNote}` : null}
      </p>
      <p className="mt-3 text-sm text-text-tertiary">
        {report.firstName}, este é o Raio-X de <span className="text-text-primary">{report.farmName}</span>
      </p>
      <h3 className="tf-headline mt-2 text-[1.7rem] md:text-[2rem]">{report.archetype.title}</h3>
      <p className="mt-3 text-base leading-relaxed text-text-secondary">{report.archetype.headline}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="chip min-h-9 px-3 py-1.5 text-xs">{report.ponds} viveiros</span>
        <span className="chip min-h-9 px-3 py-1.5 text-xs">{report.cycleTracking}</span>
        <span className="chip min-h-9 px-3 py-1.5 text-xs" data-active="true">
          {report.difficulty}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[140px_1fr] md:items-center">
        <MaturityRing score={report.maturity.score} label={report.maturity.label} />
        <div className="grid gap-3">
          <Axis label="Captura de dados" axis={report.maturity.axes.capture} />
          <Axis label="Conexão da fazenda" axis={report.maturity.axes.connection} />
          <Axis label="Velocidade de decisão" axis={report.maturity.axes.decision} />
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-text-tertiary">
        Índice de maturidade de gestão da informação — não é nota de produtividade nem benchmark de mercado.
      </p>

      <article className="tf-card mt-6 p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Leitura operacional</p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{report.reading}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-primary">{report.pressure}</p>
      </article>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Onde a fazenda mora hoje</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {report.hops.map((hop, index) => (
            <span key={hop} className="contents">
              <span className="chip min-h-10 px-3 py-2 text-sm">{hop}</span>
              {index < report.hops.length - 1 ? (
                <span className="text-brand-primary/70" aria-hidden="true">
                  →
                </span>
              ) : null}
            </span>
          ))}
          <span className="text-brand-primary/70" aria-hidden="true">
            →
          </span>
          <span className="chip min-h-10 px-3 py-2 text-sm" data-active="true">
            Terus Farm
          </span>
        </div>
        <p className="mt-3 text-sm text-text-secondary">{report.hopClose}</p>
      </div>

      <div className="mt-6 grid gap-3">
        {report.blindSpots.map((spot) => (
          <article key={spot.title} className="rounded-xl border border-white/5 bg-black/20 p-4">
            <h4 className="font-display text-base font-semibold">{spot.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{spot.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">O que o Farm destrava neste perfil</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {report.unlock.map((item) => (
            <article key={item.module} className="tf-card p-4">
              <p className="font-display text-sm font-semibold text-brand-primary">{item.module}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.value}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="tf-card tf-card-sweep mt-6 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="ask-core">
            <IconSpark className="relative z-10 h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold">Primeira pergunta do Ask Terus</p>
            <p className="text-xs text-text-tertiary">Feita para o recorte de {report.farmName}</p>
          </div>
        </div>
        <p className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3 text-sm text-text-primary">
          “{report.askQuestion}”
        </p>
        {report.thisWeek ? (
          <>
            <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Nesta semana</p>
            <p className="mt-2 text-sm leading-relaxed text-text-primary">{report.thisWeek}</p>
          </>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{report.nextMove}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          href={report.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          magnetic
          onClick={() => track("whatsapp_click", { source: "raiox", id: report.id })}
        >
          <IconChat />
          Continuar no WhatsApp
        </Button>
        <Button
          href={demoHref}
          variant="secondary"
          target={demoHref.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          onClick={() => track("demo_click", { source: "raiox", id: report.id })}
        >
          Agendar demonstração
          <IconArrow />
        </Button>
      </div>
      <button type="button" className="btn btn-ghost mt-2" onClick={onReset}>
        Fazer outro Raio-X
      </button>
    </div>
  );
}

function MaturityRing({ score, label }: { score: number; label: string }) {
  const offset = 88 - (88 * score) / 100;

  return (
    <div className="relative mx-auto h-[132px] w-[132px]">
      <svg viewBox="0 0 36 36" className="h-full w-full" aria-hidden="true">
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.6" />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="rgb(0 194 255)"
          strokeWidth="2.6"
          strokeDasharray="88"
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-3xl font-bold tabular-nums">{score}</p>
          <p className="mt-1 max-w-[7.5rem] text-[10px] uppercase leading-tight tracking-[0.12em] text-text-tertiary">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function Axis({
  label,
  axis,
}: {
  label: string;
  axis: { score: number; label: string };
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-tertiary">
          {axis.label} · {axis.score}
        </span>
      </div>
      <div className="progress-rail">
        <span style={{ width: `${axis.score}%` }} />
      </div>
    </div>
  );
}
