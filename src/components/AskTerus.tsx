"use client";

import { useEffect, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconSpark } from "@/components/ui/Icons";
import { COPY } from "@/data/farm";
import { track } from "@/lib/analytics";
import { useInView } from "@/lib/hooks";
import { canAnimate } from "@/lib/motion";

type Phase = "idle" | "processing" | "answer";

export function AskTerus() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [question, setQuestion] = useState<string>(COPY.ask.questions[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) {
      setPhase("idle");
      setTyped("");
      return;
    }
  }, [inView]);

  useEffect(() => {
    if (phase !== "processing") return;
    const wait = canAnimate() ? 720 : 0;
    const timer = window.setTimeout(() => setPhase("answer"), wait);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "answer") return;
    const full = COPY.ask.response;
    if (!canAnimate()) {
      setTyped(full);
      return;
    }

    let index = 0;
    setTyped("");
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(full.slice(0, index));
      if (index >= full.length) window.clearInterval(timer);
    }, 12);
    return () => window.clearInterval(timer);
  }, [phase, question]);

  const ask = (next: string) => {
    setQuestion(next);
    setTyped("");
    setPhase("processing");
  };

  return (
    <section id="ask-terus" className="tf-section">
      <div className="tf-grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="tf-container relative">
        <Reveal>
          <h2 className="tf-headline max-w-3xl">{COPY.ask.headline}</h2>
          <p className="tf-sub mt-4">{COPY.ask.subheadline}</p>
        </Reveal>

        <Reveal variant="scale" delay={90} className="mt-8">
          <div ref={ref} className="tf-card tf-card-sweep overflow-hidden p-4 md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="ask-core" data-paused={!inView || undefined}>
                <IconSpark className="relative z-10 h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold">Ask Terus</p>
                <p className="text-xs text-text-tertiary">Consultor de inteligência da operação</p>
              </div>
            </div>

            <div className="grid gap-2">
              {COPY.ask.questions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="chip w-full justify-between text-left"
                  data-active={question === item && phase !== "idle"}
                  onClick={() => ask(item)}
                >
                  <span>{item}</span>
                  <IconArrow className="h-4 w-4 shrink-0" />
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-4">
              {phase === "idle" ? (
                <p className="text-sm text-text-tertiary">
                  Escolha uma pergunta para ver o Ask Terus interpretar os sinais da fazenda.
                </p>
              ) : null}

              {phase === "processing" ? (
                <div className="flex items-center gap-3 text-sm text-brand-primary" role="status">
                  <span className="flex gap-1">
                    <i className="alert-dot" />
                    <i className="alert-dot" style={{ animationDelay: "0.2s" }} />
                    <i className="alert-dot" style={{ animationDelay: "0.4s" }} />
                  </span>
                  Analisando indicadores disponíveis…
                </div>
              ) : null}

              {phase === "answer" ? (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                    Sobre: {question}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-primary">
                    {highlightResponse(typed)}
                    {typed.length < COPY.ask.response.length ? (
                      <span className="ml-0.5 inline-block h-3 w-px bg-brand-primary align-middle" />
                    ) : null}
                  </p>
                  {typed.length >= COPY.ask.response.length ? (
                    <p className="mt-3 text-xs text-text-tertiary">Fonte: sinais do cockpit · confiança operacional</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="mt-5">
              <Button
                href="#raio-x"
                onClick={() => track("ask_terus_cta_click")}
              >
                {COPY.ask.cta}
                <IconArrow />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function highlightResponse(text: string) {
  const parts = text.split(/(FCA|viveiro)/gi);
  return parts.map((part, index) =>
    /^(FCA|viveiro)$/i.test(part) ? (
      <mark key={index} className="rounded-sm bg-brand-primary/10 px-1 text-brand-primary">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}
