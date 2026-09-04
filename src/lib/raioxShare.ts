import { SITE } from "@/data/farm";

export type RaioxShareCardInput = {
  farmName: string;
  profileTitle: string;
  maturityScore: number;
  maturityLabel: string;
  axes: {
    capture: number;
    connection: number;
    decision: number;
  };
  priorities: string[];
  diagnosticId: string;
  siteUrl?: string;
};

const W = 1080;
const H = 1350;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  label: string,
  score: number,
  x: number,
  y: number,
  width: number,
) {
  ctx.fillStyle = "#8BA9C5";
  ctx.font = "500 22px 'IBM Plex Sans', 'Segoe UI', sans-serif";
  ctx.fillText(label, x, y);
  ctx.fillStyle = "#546E8A";
  ctx.textAlign = "right";
  ctx.fillText(String(score), x + width, y);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, x, y + 12, width, 8, 99);
  ctx.fill();
  ctx.fillStyle = "#00C2FF";
  roundRect(ctx, x, y + 12, Math.max(8, (width * score) / 100), 8, 99);
  ctx.fill();
}

async function loadLogo() {
  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("logo"));
    });
    image.src = "/terus/terus-logo-on-dark.png";
    return await loaded;
  } catch {
    return null;
  }
}

export async function renderRaioxShareCard(input: RaioxShareCardInput): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível.");

  const site = (input.siteUrl || SITE.url).replace(/^https?:\/\//, "");

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#07101C");
  bg.addColorStop(1, "#050A14");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(0, 194, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(920, 180, 260, 0, Math.PI * 2);
  ctx.fill();

  const logo = await loadLogo();
  if (logo) {
    const logoH = 54;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.drawImage(logo, 72, 64, logoW, logoH);
  } else {
    ctx.fillStyle = "#E8F4FF";
    ctx.font = "700 36px 'DM Sans', 'Segoe UI', sans-serif";
    ctx.fillText("TERUS FARM", 72, 104);
  }

  ctx.fillStyle = "#00C2FF";
  ctx.font = "500 20px 'IBM Plex Mono', ui-monospace, monospace";
  ctx.fillText("RAIO-X DA FAZENDA", 72, 160);

  ctx.fillStyle = "#8BA9C5";
  ctx.font = "500 24px 'IBM Plex Sans', 'Segoe UI', sans-serif";
  ctx.fillText(input.farmName, 72, 214);

  ctx.fillStyle = "#E8F4FF";
  ctx.font = "700 56px 'DM Sans', 'Segoe UI', sans-serif";
  const titleLines = wrap(ctx, input.profileTitle, 760);
  titleLines.slice(0, 2).forEach((line, index) => {
    ctx.fillText(line, 72, 286 + index * 64);
  });

  roundRect(ctx, 72, 430, 936, 210, 28);
  ctx.fillStyle = "rgba(15, 30, 54, 0.88)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 194, 255, 0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#00C2FF";
  ctx.font = "700 72px 'DM Sans', 'Segoe UI', sans-serif";
  ctx.fillText(String(input.maturityScore), 104, 530);
  ctx.fillStyle = "#8BA9C5";
  ctx.font = "500 22px 'IBM Plex Sans', 'Segoe UI', sans-serif";
  ctx.fillText(input.maturityLabel.toUpperCase(), 104, 568);
  ctx.fillText("Maturidade de gestão da informação", 104, 598);

  drawAxis(ctx, "Captura", input.axes.capture, 430, 488, 530);
  drawAxis(ctx, "Conexão", input.axes.connection, 430, 548, 530);
  drawAxis(ctx, "Decisão", input.axes.decision, 430, 608, 530);

  ctx.fillStyle = "#546E8A";
  ctx.font = "500 20px 'IBM Plex Sans', 'Segoe UI', sans-serif";
  ctx.fillText("SEU PLANO DE EVOLUÇÃO", 72, 700);

  input.priorities.slice(0, 3).forEach((title, index) => {
    const y = 732 + index * 110;
    roundRect(ctx, 72, y, 936, 96, 20);
    ctx.fillStyle = "rgba(10, 22, 40, 0.9)";
    ctx.fill();
    ctx.fillStyle = "#00C2FF";
    ctx.font = "700 28px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.fillText(String(index + 1).padStart(2, "0"), 100, y + 58);
    ctx.fillStyle = "#E8F4FF";
    ctx.font = "600 28px 'DM Sans', 'Segoe UI', sans-serif";
    const lines = wrap(ctx, title, 760);
    ctx.fillText(lines[0] || title, 168, y + 58);
  });

  ctx.fillStyle = "#546E8A";
  ctx.font = "500 20px 'IBM Plex Mono', ui-monospace, monospace";
  ctx.fillText(input.diagnosticId, 72, 1238);
  ctx.fillStyle = "#8BA9C5";
  ctx.font = "500 22px 'IBM Plex Sans', 'Segoe UI', sans-serif";
  ctx.fillText("Ver a fazenda em um só lugar", 72, 1278);
  ctx.fillStyle = "#00C2FF";
  ctx.fillText(site, 72, 1312);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Não foi possível gerar a imagem.");
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function shareOrDownloadRaiox(blob: Blob, filename: string, title: string) {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  if (typeof nav.share === "function" && (!nav.canShare || nav.canShare({ files: [file] }))) {
    try {
      await nav.share({ title, files: [file], text: title });
      return "shared" as const;
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return "aborted" as const;
    }
  }

  downloadBlob(blob, filename);
  return "downloaded" as const;
}
