import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectDir = process.cwd();
const publicDir = path.join(projectDir, "public");
const displayFont = await fs.readFile(path.join(projectDir, "fonts", "TalinademoRegular-BLP7G.otf"));
const encodedFont = displayFont.toString("base64");

const titlePanel = {
  left: 920,
  top: 39,
  width: 720,
  height: 480,
  radius: 54,
};

function titleSvg() {
  const { left, top, width, height, radius } = titlePanel;
  return Buffer.from(`
    <svg width="2566" height="1038" xmlns="http://www.w3.org/2000/svg">
      <style>
        @font-face { font-family: Display; src: url(data:font/otf;base64,${encodedFont}); }
        .display { font-family: Display, sans-serif; font-weight: 400; }
      </style>
      <rect x="${left}" y="${top}" width="${width}" height="${height}" rx="${radius}" fill="#012863"/>
      <text x="1280" y="182" text-anchor="middle" class="display" font-size="101" fill="#fffaf0">One chapter.</text>
      <text x="1280" y="282" text-anchor="middle" class="display" font-size="78" fill="#ffd13d">Endless impact.</text>
      <rect x="960" y="438" width="92" height="7" rx="3.5" fill="#ffd13d"/>
      <rect x="1508" y="438" width="92" height="7" rx="3.5" fill="#ffd13d"/>
      <text x="1280" y="464" text-anchor="middle" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-size="37" font-weight="700" fill="#fffaf0">Campbell FBLA</text>
    </svg>`);
}

async function update(inputName, outputName) {
  await sharp(path.join(publicDir, inputName))
    .composite([{ input: titleSvg(), blend: "over" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, outputName));
}

await update("campbell-fbla-three-year-collage-final.png", "campbell-fbla-impact-collage-final.png");
await update("campbell-fbla-collage-blank-template.png", "campbell-fbla-impact-collage-blank-template.png");
console.log("Updated impact-title collage assets.");
