"use client";

import { useEffect, useMemo, useState } from "react";

import { DiagnosticResult } from "@/components/DiagnosticResult";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import {
  IconArrow,
  IconFarm,
  IconMail,
  IconPhone,
  IconPin,
  IconUser,
} from "@/components/ui/Icons";
import { COPY } from "@/data/farm";
import { track } from "@/lib/analytics";
import {
  cycleOptions,
  diagnosticSchema,
  difficultyOptions,
  pondOptions,
  submitFarmDiagnostic,
  type DiagnosticPayload,
} from "@/lib/diagnostic";
import { canAnimate } from "@/lib/motion";
import { buildRaioxReport, type DiagnosticReport } from "@/lib/raiox";

type Step = 0 | 1 | 2 | 3;
type Status = "idle" | "submitting" | "analyzing" | "success" | "error";

const STORAGE_KEY = "terus-farm-raiox-v2";

const INITIAL: DiagnosticPayload = {
  ponds: "6–20",
  cycleTracking: "Planilha",
  difficulty: "Dados espalhados",
  name: "",
  farm: "",
  whatsapp: "",
  city: "",
  email: "",
};

export function FarmDiagnostic() {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as DiagnosticReport;
      if (saved?.id && saved.farmName) {
        setReport(saved);
        setStatus("success");
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (status !== "analyzing" && status !== "success") return;
    document.getElementById("raio-x")?.scrollIntoView({
      behavior: canAnimate() ? "smooth" : "auto",
      block: "start",
    });
  }, [status]);

  const progress = useMemo(() => ((step + 1) / 4) * 100, [step]);

  const nextFromChoice = (patch: Partial<DiagnosticPayload>, next: Step) => {
    if (step === 0) track("raiox_start");
    setForm((current) => ({ ...current, ...patch }));
    setStep(next);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = diagnosticSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Revise os campos.");
      return;
    }

    const nextReport = buildRaioxReport(parsed.data);
    setError("");
    setStatus("analyzing");
    setReport(nextReport);

    const wait = canAnimate() ? 1600 : 0;
    const [, result] = await Promise.all([
      new Promise((resolve) => setTimeout(resolve, wait)),
      submitFarmDiagnostic(parsed.data, nextReport),
    ]);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextReport));
    setStatus("success");
    track("raiox_complete", {
      ponds: parsed.data.ponds,
      cycleTracking: parsed.data.cycleTracking,
      difficulty: parsed.data.difficulty,
      id: nextReport.id,
      score: nextReport.maturity.score,
    });

    if (!result.ok) {
      setError(result.error);
    }
  };

  const reset = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setReport(null);
    setStatus("idle");
    setStep(0);
    setError("");
    setForm(INITIAL);
  };

  return (
    <section id="raio-x" className="tf-section">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px tf-horizon" />
      <div className="tf-container relative max-w-3xl">
        <Reveal>
          <h2 className="tf-headline">{COPY.diagnostic.headline}</h2>
          <p className="tf-sub mt-4">{COPY.diagnostic.subheadline}</p>
          <p className="mt-3 text-sm text-text-tertiary">{COPY.diagnostic.promise}</p>
        </Reveal>

        <Reveal variant="scale" className="mt-7">
          <div className="tf-card p-4 md:p-6">
            {status === "analyzing" && report ? <AnalyzingState report={report} /> : null}
            {status === "success" && report ? (
              <>
                {error ? (
                  <p className="mb-4 text-sm text-status-warning">
                    Diagnóstico pronto. Não foi possível registrar agora — siga pelo WhatsApp.
                  </p>
                ) : null}
                <DiagnosticResult report={report} onReset={reset} />
              </>
            ) : null}

            {status === "idle" || status === "submitting" || status === "error" ? (
              <>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-text-tertiary">
                    Etapa {step + 1} de 4
                  </p>
                  <p className="text-xs text-text-tertiary">{COPY.diagnostic.microcopy}</p>
                </div>
                <div className="progress-rail mb-6">
                  <span style={{ width: `${progress}%` }} />
                </div>

                {step === 0 ? (
                  <ChoiceStep
                    title="Quantos viveiros?"
                    options={[...pondOptions]}
                    value={form.ponds}
                    onSelect={(value) => nextFromChoice({ ponds: value as DiagnosticPayload["ponds"] }, 1)}
                  />
                ) : null}

                {step === 1 ? (
                  <ChoiceStep
                    title="Como vocês acompanham os ciclos hoje?"
                    options={[...cycleOptions]}
                    value={form.cycleTracking}
                    onSelect={(value) =>
                      nextFromChoice({ cycleTracking: value as DiagnosticPayload["cycleTracking"] }, 2)
                    }
                    onBack={() => setStep(0)}
                  />
                ) : null}

                {step === 2 ? (
                  <ChoiceStep
                    title="Qual é a maior dificuldade hoje?"
                    options={[...difficultyOptions]}
                    value={form.difficulty}
                    onSelect={(value) =>
                      nextFromChoice({ difficulty: value as DiagnosticPayload["difficulty"] }, 3)
                    }
                    onBack={() => setStep(1)}
                  />
                ) : null}

                {step === 3 ? (
                  <form onSubmit={onSubmit} className="grid gap-3">
                    <Field
                      icon={<IconUser />}
                      label="Nome completo"
                      value={form.name}
                      onChange={(value) => setForm({ ...form, name: value })}
                      autoComplete="name"
                    />
                    <Field
                      icon={<IconFarm />}
                      label="Nome da fazenda/empresa"
                      value={form.farm}
                      onChange={(value) => setForm({ ...form, farm: value })}
                    />
                    <Field
                      icon={<IconPhone />}
                      label="WhatsApp"
                      value={form.whatsapp}
                      onChange={(value) => setForm({ ...form, whatsapp: value })}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                    <Field
                      icon={<IconPin />}
                      label="Cidade"
                      value={form.city}
                      onChange={(value) => setForm({ ...form, city: value })}
                      autoComplete="address-level2"
                    />
                    <Field
                      icon={<IconMail />}
                      label="E-mail (opcional)"
                      value={form.email || ""}
                      onChange={(value) => setForm({ ...form, email: value })}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                    />
                    {error ? <p className="text-sm text-status-error">{error}</p> : null}
                    <Button type="submit" loading={status === "submitting"}>
                      {COPY.diagnostic.cta}
                      <IconArrow />
                    </Button>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                      Voltar
                    </button>
                  </form>
                ) : null}
              </>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AnalyzingState({ report }: { report: DiagnosticReport }) {
  return (
    <div className="py-8" role="status" aria-live="polite">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-primary">Lendo a operação</p>
      <h3 className="mt-3 font-display text-2xl font-semibold">Montando o Raio-X de {report.farmName}…</h3>
      <ul className="raiox-scan mt-6 space-y-3 text-sm text-text-secondary">
        <li>Escala · {report.ponds} viveiros</li>
        <li>Fonte · {report.cycleTracking}</li>
        <li>Pressão · {report.difficulty}</li>
        <li>Cruzando captura, conexão e decisão</li>
      </ul>
    </div>
  );
}

function ChoiceStep({
  title,
  options,
  value,
  onSelect,
  onBack,
}: {
  title: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  onBack?: () => void;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="chip"
            data-active={value === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {onBack ? (
        <button type="button" className="btn btn-ghost mt-4" onClick={onBack}>
          Voltar
        </button>
      ) : null}
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  autoComplete,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="grid gap-1.5 text-sm text-text-secondary" htmlFor={id}>
      {label}
      <span className="field-wrap">
        {icon}
        <input
          id={id}
          className="field"
          value={value}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required={type !== "email"}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}
