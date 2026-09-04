import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Terus Farm | Inteligência para Carcinicultura";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          padding: 72,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#00c2ff" }}>TERUS FARM</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
            Sua fazenda já gera os dados. Agora transforme-os em decisões.
          </div>
          <div style={{ fontSize: 28, color: "#8ba9c5", maxWidth: 780 }}>
            Intelligence OS para carcinicultura.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
