import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import sharp from "sharp";

const root = process.cwd();
const aquafarmDir = join(root, "public/aquafarm");
const ogDir = join(root, "public/og");

const WEBP_MAP = [
  ["hero-aerial.png", "hero-aerial.webp"],
  ["case-wide.png", "case-wide.webp"],
  ["case-detail-1.png", "case-detail-1.webp"],
  ["case-detail-2.png", "case-detail-2.webp"],
];

async function toWebp(inputName, outputName) {
  const input = join(aquafarmDir, inputName);
  const output = join(aquafarmDir, outputName);
  await sharp(input).webp({ quality: 82, effort: 4 }).toFile(output);
  const [src, dst] = await Promise.all([readFile(input), readFile(output)]);
  console.log(`webp ${outputName}: ${Math.round(src.length / 1024)}KB → ${Math.round(dst.length / 1024)}KB`);
}

async function buildOg() {
  await mkdir(ogDir, { recursive: true });
  const hero = join(aquafarmDir, "hero-aerial.png");
  const logo = join(root, "public/terus/terus-logo-on-dark.png");

  const overlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#050a14" stop-opacity="0.25"/>
          <stop offset="55%" stop-color="#050a14" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#050a14" stop-opacity="0.88"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#wash)"/>
      <text x="64" y="470" fill="#e8f4ff" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">
        Sua fazenda já gera os dados.
      </text>
      <text x="64" y="530" fill="#00c2ff" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">
        Agora transforme-os em decisões.
      </text>
      <text x="64" y="582" fill="#8ba9c5" font-family="Arial, Helvetica, sans-serif" font-size="24">
        Intelligence OS para carcinicultura · Terus Farm
      </text>
    </svg>
  `);

  const base = sharp(hero).resize(1200, 630, { fit: "cover", position: "centre" });
  const logoBuf = await readFile(logo);
  const logoResized = await sharp(logoBuf).resize(180, null, { fit: "inside" }).png().toBuffer();

  const pngOut = join(ogDir, "share.png");
  const webpOut = join(ogDir, "share.webp");

  await base
    .clone()
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: logoResized, top: 48, left: 64 },
    ])
    .png()
    .toFile(pngOut);

  await base
    .clone()
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: logoResized, top: 48, left: 64 },
    ])
    .webp({ quality: 86 })
    .toFile(webpOut);

  console.log("og share.png + share.webp generated");
}

for (const [input, output] of WEBP_MAP) {
  await toWebp(input, output);
}

await buildOg();
