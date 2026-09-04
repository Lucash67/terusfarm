"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  IconArrow,
  IconChat,
  IconCheck,
  IconDownload,
  IconShare,
  IconSpark,
} from "@/components/ui/Icons";
import { useCountUp, useInView } from "@/lib/hooks";
import { canAnimate } from "@/lib/motion";
import type { DiagnosticReport } from "@/lib/raiox";
import { downloadBlob, renderRaioxShareCard, shareOrDownloadRaiox } from "@/lib/raioxShare";

type ShareStatus = "idle" | "working" | "shared" | "saved" | "error";

export function DiagnosticResult({
  report,
  onReset,
  onViewed,
  onActionPlanView,
  onDemo,
  onSend,
  onTalk,
  onShareResult,
}: {
  report: DiagnosticReport;
  onReset: () => void;
  onViewed: () => void;
  onActionPlanView: () => void;
  onDemo: () => void;
  onSend: () => void;
  onTalk: () => void;
  onShareResult: (mode: "shared" | "downloaded") => void;
}) {
  const { ref: planRef, inView: planInView } = useInView<HTMLElement>({ threshold: 0.25 });
  const { ref: ctaRef, inView: ctaInView } = useInView<HTMLElement>({ threshold: 0.2 });
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    onViewed();
  }, [onViewed]);

  useEffect(() => {
    if (planInView) onActionPlanView();
  }, [planInView, onActionPlanView]);

  const exportCard = async (mode: "share" | "download") => {
    setShareStatus("working");
    setShareMessage("");
    try {
      const blob = await renderRaioxShareCard({
        farmName: report.farmName,
        profileTitle: report.archetype.title,
        maturityScore: report.maturity.score,
        maturityLabel: report.maturity.label,
        axes: {
          capture: report.maturity.axes.capture.score,
          connection: report.maturity.axes.connection.score,
          decision: report.maturity.axes.decision.score,
        },
        priorities: report.actionPlan.map((item) => item.title),
        diagnosticId: report.diagnosticId,
        siteUrl: report.shareUrl,
      });
      const filename = `${report.diagnosticId}.png`;
      const title = `Raio-X Terus Farm · ${report.farmName}`;
      if (mode === "download") {
        downloadBlob(blob, filename);
        setShareStatus("saved");
        setShareMessage("Raio-X salvo na imagem.");
        onShareResult("downloaded");
        return;
      }
      const result = await shareOrDownloadRaiox(blob, filename, title);
      if (result === "aborted") {
        setShareStatus("idle");
        return;
      }
      if (result === "shared") {
        setShareStatus("shared");
        setShareMessage("Raio-X compartilhado.");
        onShareResult("shared");
        return;
      }
      setShareStatus("saved");
      setShareMessage("Compartilhar indisponível neste aparelho — a imagem foi baixada.");
      onShareResult("downloaded");
    } catch {
      setShareStatus("error");
      setShareMessage("Não foi possível gerar a imagem agora.");
    }
  };

  return (
    <div className="raiox-result">
      <header className="tf-card raiox-block p-4 md:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-primary">
          {report.profileCode}
          {report.localNote ? ` · ${report.localNote}` : null}
        </p>
        <p className="mt-2 font-mono text-xs text-text-tertiary">{report.diagnosticId}</p>
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
        <div className="mt-6 flex justify-center">
          <MaturityRing score={report.maturity.score} label={report.maturity.label} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-text-tertiary">
          Este índice avalia apenas como a informação da operação é organizada e utilizada na tomada de
          decisão. Não representa produtividade, desempenho zootécnico ou resultado financeiro.
        </p>
      </header>

      <article className="tf-card raiox-block p-4 md:p-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Leitura operacional</p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{report.reading}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-primary">{report.pressure}</p>
      </article>

      <article className="tf-card raiox-block p-4 md:p-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Três eixos da informação</p>
        <div className="mt-4 grid gap-3">
          <Axis label="Captura de dados" axis={report.maturity.axes.capture} />
          <Axis label="Conexão da fazenda" axis={report.maturity.axes.connection} />
          <Axis label="Velocidade de decisão" axis={report.maturity.axes.decision} />
        </div>
      </article>

      <article className="tf-card raiox-block p-4 md:p-5">
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
      </article>

      <div className="grid gap-3">
        {report.blindSpots.map((spot) => (
          <article key={spot.title} className="raiox-block rounded-xl border border-white/5 bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Ponto cego</p>
            <h4 className="mt-1 font-display text-base font-semibold">{spot.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{spot.text}</p>
          </article>
        ))}
      </div>

      <section>
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">O que o Farm destrava neste perfil</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {report.unlock.map((item) => (
            <article key={item.module} className="tf-card raiox-block p-4">
              <p className="font-display text-sm font-semibold text-brand-primary">{item.module}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section ref={planRef}>
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Seu plano de evolução</p>
        <h4 className="mt-2 font-display text-xl font-semibold">Três prioridades para {report.farmName}</h4>
        <div className="raiox-stagger mt-4 grid gap-3">
          {report.actionPlan.map((item) => (
            <article key={item.rank} className="tf-card raiox-block p-4 md:p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-primary">
                Prioridade {item.rank}
              </p>
              <h5 className="mt-2 font-display text-lg font-semibold">{item.title}</h5>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.explanation}</p>
              <p className="mt-3 text-sm leading-relaxed text-text-primary">
                <span className="text-text-tertiary">Por que isso importa. </span>
                {item.whyItMatters}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-primary">
                <span className="text-text-tertiary">Como o Terus Farm ajuda. </span>
                {item.howFarmHelps}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.modules.map((module) => (
                  <span key={module} className="chip min-h-8 px-3 py-1 text-xs" data-active="true">
                    {module}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tf-card raiox-block p-4 md:p-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
          Como o Terus Farm entra na sua operação
        </p>
        <div className="raiox-flow mt-4 grid gap-4">
          {report.farmEntry.map((line) => (
            <div key={`${line.from}-${line.through}`} className="raiox-flow-row">
              <span>{line.from}</span>
              <span aria-hidden="true">↓</span>
              <span data-farm="true">{line.through}</span>
              <span aria-hidden="true">↓</span>
              <span>{line.to}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="tf-card tf-card-sweep raiox-block p-4 md:p-5">
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
      </section>

      <section
        ref={ctaRef}
        className="tf-card raiox-cta p-4 md:p-6"
        data-revealed={ctaInView || !canAnimate() ? "true" : "false"}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-primary">
          {report.nextStep.headline}
        </p>
        <h4 className="mt-2 font-display text-2xl font-semibold">Seu próximo passo</h4>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{report.nextStep.text}</p>
        <div className="mt-5 flex flex-col gap-3">
          <Button href={report.whatsappDemoUrl} target="_blank" rel="noreferrer" magnetic onClick={onDemo}>
            Quero uma demonstração com meu diagnóstico
            <IconArrow />
          </Button>
          <Button href={report.whatsappSendUrl} variant="secondary" target="_blank" rel="noreferrer" onClick={onSend}>
            Enviar meu Raio-X para a Terus
          </Button>
          <Button href={report.whatsappTalkUrl} variant="ghost" target="_blank" rel="noreferrer" onClick={onTalk}>
            <IconChat />
            Falar agora no WhatsApp
          </Button>
        </div>
      </section>

      <section className="tf-card raiox-block p-4 md:p-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Leve o diagnóstico com você</p>
        <p className="mt-2 text-sm text-text-secondary">
          Salve uma imagem do Raio-X de {report.farmName} — sem dados de contato.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary" onClick={() => exportCard("download")} disabled={shareStatus === "working"}>
            <IconDownload />
            Salvar meu Raio-X
          </Button>
          <Button type="button" variant="ghost" onClick={() => exportCard("share")} disabled={shareStatus === "working"}>
            <IconShare />
            Compartilhar Raio-X
          </Button>
        </div>
        {shareMessage ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-brand-primary" role="status">
            {shareStatus === "shared" || shareStatus === "saved" ? <IconCheck className="h-4 w-4" /> : null}
            {shareMessage}
          </p>
        ) : null}
      </section>

      <button type="button" className="btn btn-ghost" onClick={onReset}>
        Fazer outro Raio-X
      </button>
    </div>
  );
}

function MaturityRing({ score, label }: { score: number; label: string }) {
  const shown = useCountUp(score, true, { duration: 1100 });
  const offset = 88 - (88 * shown) / 100;

  return (
    <div className="relative mx-auto h-[148px] w-[148px]">
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
          className="raiox-ring"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-4xl font-bold tabular-nums">{Math.round(shown)}</p>
          <p className="mt-1 max-w-[8rem] text-[10px] uppercase leading-tight tracking-[0.12em] text-text-tertiary">
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
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const width = inView || !canAnimate() ? axis.score : 0;

  return (
    <div ref={ref}>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-tertiary">
          {axis.label} · {axis.score}
        </span>
      </div>
      <div className="progress-rail raiox-axis">
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
