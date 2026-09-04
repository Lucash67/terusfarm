import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { readCampaignAttribution } from "../config/campaign";
import type { DiagnosticPayload } from "./diagnostic";
import { applyLeadAction, classifyLead, scoreLead } from "./leadScoring";
import { buildRaioxReport, computeMaturity } from "./raiox";
import { buildDiagnosticId, buildProfileCode, createUniqueSuffix } from "./raioxIds";
import { buildDiagnosticCrmPayload } from "./raioxPayload";
import { buildActionPlan, buildFarmEntry } from "./raioxPlan";
import { buildRaioxWhatsAppMessage } from "./raioxWhatsapp";

const FORBIDDEN = [
  "vai reduzir seus custos",
  "aumentar a produtividade",
  "vai melhorar seu fca",
  "vai economizar",
  "economizar r$",
  "leadclass",
  "leadpriorityscore",
  "commercialintentscore",
  "high_intent",
];

function fixture(
  ponds: DiagnosticPayload["ponds"],
  cycleTracking: DiagnosticPayload["cycleTracking"],
  difficulty: DiagnosticPayload["difficulty"],
  extra?: Partial<DiagnosticPayload>,
): DiagnosticPayload {
  return {
    ponds,
    cycleTracking,
    difficulty,
    name: extra?.name ?? "Lucas Henrique",
    farm: extra?.farm ?? "Fazenda Jaguaribe",
    whatsapp: extra?.whatsapp ?? "85992900440",
    city: extra?.city ?? "Aracati",
    email: extra?.email ?? "",
  };
}

const SCENARIOS = {
  c1: fixture("21–50", "ERP", "Produção"),
  c2: fixture("+50", "Planilha", "Dados espalhados", {
    name: "Marina Costa",
    farm: "Costa Azul",
    city: "Areia Branca",
  }),
  c3: fixture("1–5", "Outro", "Outra", {
    name: "João Silva",
    farm: "Sítio Norte",
    city: "Beberibe",
  }),
  c4: fixture("6–20", "BI", "Indicadores", {
    name: "Ana Souza",
    farm: "Delta Camarão",
    city: "Macau",
  }),
} as const;

function collectPublicText(payload: DiagnosticPayload, suffix = "A7K2") {
  const report = buildRaioxReport(payload, { uniqueSuffix: suffix });
  return {
    report,
    blob: JSON.stringify(report).toLowerCase(),
    plan: report.actionPlan
      .flatMap((item) => [item.title, item.explanation, item.whyItMatters, item.howFarmHelps])
      .join(" ")
      .toLowerCase(),
  };
}

describe("Raio-X engine", () => {
  it("gera profileCode e diagnosticId únicos e legíveis", () => {
    assert.equal(buildProfileCode("21–50", "ERP", "Produção"), "RX-CER-PR");
    assert.equal(buildProfileCode("+50", "Planilha", "Dados espalhados"), "RX-DPL-DS");
    assert.equal(buildProfileCode("1–5", "Outro", "Outra"), "RX-AOT-OU");
    assert.equal(buildProfileCode("6–20", "BI", "Indicadores"), "RX-BBI-IN");

    assert.equal(buildDiagnosticId("RX-CER-PR", "A7K2"), "RX-CER-PR-A7K2");
    const a = createUniqueSuffix(Uint8Array.from([1, 2, 3, 4]));
    const b = createUniqueSuffix(Uint8Array.from([9, 8, 7, 6]));
    assert.equal(a.length, 4);
    assert.notEqual(a, b);

    const report = buildRaioxReport(SCENARIOS.c1, { uniqueSuffix: "A7K2" });
    assert.equal(report.profileCode, "RX-CER-PR");
    assert.equal(report.diagnosticId, "RX-CER-PR-A7K2");
    assert.equal(report.id, report.diagnosticId);
  });

  it("mantém o índice de maturidade de gestão da informação", () => {
    const s1 = computeMaturity(SCENARIOS.c1);
    const s2 = computeMaturity(SCENARIOS.c2);
    const s3 = computeMaturity(SCENARIOS.c3);
    const s4 = computeMaturity(SCENARIOS.c4);

    assert.equal(s1.score, 57);
    assert.equal(s1.label, "Parcialmente conectada");
    assert.equal(s1.axes.capture.score, 70);
    assert.equal(s1.axes.connection.score, 52);
    assert.equal(s1.axes.decision.score, 50);

    assert.equal(s2.score, 28);
    assert.equal(s2.band, "fragmentada");
    assert.equal(s3.score, 29);
    assert.equal(s4.score, 63);

    assert.ok(s1.score >= 24 && s1.score <= 82);
    assert.ok(s2.score >= 24 && s2.score <= 82);
  });

  it("calcula commercialIntentScore, classe e flags sem misturar com maturidade", () => {
    const s1 = scoreLead({ ...SCENARIOS.c1, completed: true });
    const s2 = scoreLead({ ...SCENARIOS.c2, completed: true });
    const s3 = scoreLead({ ...SCENARIOS.c3, completed: true });
    const s4 = scoreLead({ ...SCENARIOS.c4, completed: true });

    assert.equal(s1.leadPriorityScore, 78);
    assert.equal(s1.leadClass, "B");
    assert.ok(s1.flags.includes("large_operation"));
    assert.ok(s1.flags.includes("erp_user"));
    assert.ok(s1.flags.includes("production_pain"));
    assert.ok(s1.flags.includes("completed_raiox"));

    assert.equal(s2.leadPriorityScore, 85);
    assert.equal(s2.leadClass, "A");
    assert.ok(s2.flags.includes("spreadsheet_dependency"));
    assert.ok(s2.flags.includes("fragmented_data"));
    assert.ok(s2.flags.includes("high_intent"));

    assert.equal(s3.leadPriorityScore, 40);
    assert.equal(s3.leadClass, "C");
    assert.ok(s3.flags.includes("fragmented_data"));

    assert.equal(s4.leadPriorityScore, 68);
    assert.equal(s4.leadClass, "B");
    assert.ok(s4.flags.includes("bi_user"));
    assert.ok(s4.flags.includes("indicator_pain"));

    assert.equal(classifyLead(80), "A");
    assert.equal(classifyLead(55), "B");
    assert.equal(classifyLead(54), "C");

    const afterDemo = applyLeadAction(s1, SCENARIOS.c1, "demo");
    assert.equal(afterDemo.leadPriorityScore, 93);
    assert.equal(afterDemo.leadClass, "A");
    assert.ok(afterDemo.flags.includes("demo_requested"));

    const afterWa = applyLeadAction(s3, SCENARIOS.c3, "whatsapp");
    assert.equal(afterWa.leadPriorityScore, 50);
    assert.ok(afterWa.flags.includes("whatsapp_requested"));

    assert.notEqual(s1.leadPriorityScore, computeMaturity(SCENARIOS.c1).score);
  });

  it("gera plano de evolução e ponte do Farm para os 4 cenários", () => {
    for (const payload of Object.values(SCENARIOS)) {
      const plan = buildActionPlan(payload);
      const entry = buildFarmEntry(payload);
      assert.equal(plan.length, 3);
      assert.deepEqual(plan.map((item) => item.rank), [1, 2, 3]);
      plan.forEach((item) => {
        assert.ok(item.title);
        assert.ok(item.explanation);
        assert.ok(item.whyItMatters);
        assert.ok(item.howFarmHelps);
        assert.ok(item.modules.length >= 1);
      });
      assert.ok(entry.length >= 2 && entry.length <= 4);
      entry.forEach((line) => {
        assert.ok(line.from && line.through && line.to);
      });
    }

    assert.equal(buildActionPlan(SCENARIOS.c1)[0].title, "Centralizar a leitura dos ciclos");
    assert.equal(buildActionPlan(SCENARIOS.c2)[1].title, "Reduzir dependência de planilhas");
    assert.match(buildFarmEntry(SCENARIOS.c1)[0].from, /ERP/);
    assert.match(buildFarmEntry(SCENARIOS.c2)[0].from, /Planilha/);
  });

  it("monta WhatsApp contextual sem dados comerciais internos", () => {
    const report = buildRaioxReport(SCENARIOS.c1, { uniqueSuffix: "A7K2" });
    const message = buildRaioxWhatsAppMessage(
      {
        diagnosticId: report.diagnosticId,
        farmName: report.farmName,
        city: report.city,
        profileName: report.archetype.title,
        maturityScore: report.maturity.score,
        maturityLabel: report.maturity.label,
        mainPain: report.difficulty,
      },
      "demo",
    );

    assert.match(message, /Fazenda: Fazenda Jaguaribe/);
    assert.match(message, /Cidade: Aracati/);
    assert.match(message, /Perfil: Produção fora do cockpit/);
    assert.match(message, /Maturidade: 57\/100/);
    assert.match(message, /Principal desafio: Produção/);
    assert.match(message, /ID do diagnóstico: RX-CER-PR-A7K2/);
    assert.match(message, /Quero uma demonstração/);
    assert.doesNotMatch(message.toLowerCase(), /leadclass|leadpriority|high_intent|flags/);
    assert.ok(report.whatsappDemoUrl.includes("wa.me"));
    assert.ok(report.whatsappDemoUrl.includes(encodeURIComponent("RX-CER-PR-A7K2")));
  });

  it("monta payload CRM estruturado", () => {
    const answers = SCENARIOS.c2;
    const report = buildRaioxReport(answers, { uniqueSuffix: "K2M4" });
    const commercial = scoreLead({ ...answers, completed: true });
    const source = readCampaignAttribution("?source=stand-banner&utm_source=qr&utm_campaign=festival");
    const payload = buildDiagnosticCrmPayload({
      answers,
      report,
      commercial,
      source,
      intent: "complete",
      createdAt: "2026-09-04T12:00:00.000Z",
    });

    assert.equal(payload.diagnosticId, "RX-DPL-DS-K2M4");
    assert.equal(payload.profileCode, "RX-DPL-DS");
    assert.equal(payload.answers.managementSystem, "Planilha");
    assert.equal(payload.answers.mainPain, "Dados espalhados");
    assert.equal(payload.contact.farmName, "Costa Azul");
    assert.equal(payload.contact.phone, "85992900440");
    assert.equal(payload.maturity.score, 28);
    assert.equal(payload.diagnosis.actionPlan.length, 3);
    assert.equal(payload.commercial.leadClass, "A");
    assert.equal(payload.commercial.leadPriorityScore, 85);
    assert.ok(payload.commercial.flags.includes("spreadsheet_dependency"));
    assert.equal(payload.source.touch, "stand-banner");
    assert.equal(payload.source.utmSource, "qr");
    assert.equal(payload.source.campaign, "festival");
    assert.equal(payload.createdAt, "2026-09-04T12:00:00.000Z");
  });

  it("não vaza score comercial nem promessas indevidas no resultado público", () => {
    for (const payload of Object.values(SCENARIOS)) {
      const { report, blob, plan } = collectPublicText(payload);
      for (const word of FORBIDDEN) {
        assert.equal(blob.includes(word), false, `vazou "${word}" no report`);
        assert.equal(plan.includes(word), false, `vazou "${word}" no plano`);
      }
      assert.equal("leadPriorityScore" in report, false);
      assert.equal("leadClass" in report, false);
      assert.equal("flags" in report, false);
      assert.match(report.nextMove, /ERP|arquivo|BI|conversa|cockpit|inteligência|decisão/i);
      assert.doesNotMatch(report.nextMove, /substitui o ERP/i);
    }
  });
});
