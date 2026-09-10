import { NextResponse } from "next/server";
import { z } from "zod";

const diagnosticPayloadSchema = z.object({
  diagnosticId: z.string().min(6),
  profileCode: z.string().min(4),
  contact: z.object({
    name: z.string().min(1),
    farmName: z.string().min(1),
    phone: z.string().min(8),
    city: z.string().min(1),
    email: z.string().optional(),
  }),
  intent: z.enum(["complete", "demo", "whatsapp", "share"]).optional(),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const parsed = diagnosticPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Payload incompleto." }, { status: 400 });
  }

  const webhook = process.env.DIAGNOSTIC_WEBHOOK_URL;

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("[api/diagnostic] webhook failed", response.status, parsed.data.diagnosticId);
        return NextResponse.json(
          { ok: false, error: "Não foi possível registrar agora. Tente pelo WhatsApp." },
          { status: 502 },
        );
      }
    } catch (error) {
      console.error("[api/diagnostic] webhook error", error);
      return NextResponse.json(
        { ok: false, error: "Falha de conexão. Tente pelo WhatsApp." },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[api/diagnostic]", {
      diagnosticId: parsed.data.diagnosticId,
      profileCode: parsed.data.profileCode,
      intent: parsed.data.intent ?? "complete",
      farm: parsed.data.contact.farmName,
    });
  } else {
    console.info("[api/diagnostic] lead", parsed.data.diagnosticId, parsed.data.profileCode);
  }

  return NextResponse.json({ ok: true });
}
