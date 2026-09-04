"use client";

import { useMemo, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import {
  IconArrow,
  IconCheck,
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

type Step = 0 | 1 | 2 | 3;
type Status = "idle" | "submitting" | "success" | "error";

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

    setStatus("submitting");
    setError("");
    const result = await submitFarmDiagnostic(parsed.data);
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }

    setStatus("success");
    track("raiox_complete", { ponds: parsed.data.ponds, cycleTracking: parsed.data.cycleTracking });
  };

  return (
    <section id="raio-x" className="tf-section">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px tf-horizon" />
      <div className="tf-container relative max-w-2xl">
        <Reveal>
          <h2 className="tf-headline">{COPY.diagnostic.headline}</h2>
          <p className="tf-sub mt-4">{COPY.diagnostic.subheadline}</p>
          <p className="mt-3 text-sm text-text-tertiary">{COPY.diagnostic.promise}</p>
        </Reveal>

        <Reveal variant="scale" className="mt-7">
          <div className="tf-card p-4 md:p-6">
            {status === "success" ? (
              <SuccessState />
            ) : (
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
                      {status === "submitting" ? "Enviando…" : COPY.diagnostic.cta}
                      <IconArrow />
                    </Button>
                  </form>
                ) : null}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ChoiceStep({
  title,
  options,
  value,
  onSelect,
}: {
  title: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
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
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

function SuccessState() {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
        <IconCheck className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl font-semibold">Diagnóstico recebido.</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
        Nosso time vai usar essas respostas para entender o momento da sua operação e continuar a conversa.
      </p>
    </div>
  );
}
