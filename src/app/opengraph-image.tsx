import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Terus Farm | Inteligência para Carcinicultura";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/terus/terus-logo-on-dark.png"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #050a14 0%, #0a1628 55%, #071820 100%)",
          color: "#e8f4ff",
          padding: 64,
        }}
      >
        <img
          src={`data:image/png;base64,${logo.toString("base64")}`}
          alt="Terus Farm"
          width={196}
          height={160}
          style={{ objectFit: "contain" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1, maxWidth: 920 }}>
            Sua fazenda já gera os dados. Agora transforme-os em decisões.
          </div>
          <div style={{ fontSize: 26, color: "#8ba9c5", maxWidth: 780 }}>
            Intelligence OS para carcinicultura.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
