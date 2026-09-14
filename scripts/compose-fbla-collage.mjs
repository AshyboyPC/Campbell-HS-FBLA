import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const publicDir = path.join(projectDir, "public");
const sourcesDir = path.join(publicDir, "collage-sources");

const canvas = {
  width: 2566,
  height: 1038,
  template: path.join(publicDir, "campbell-fbla-new-frame-blank.png"),
  output: path.join(publicDir, "campbell-fbla-new-frame-final.png"),
};

// Coordinates are inset inside the template's white rounded outlines so the
// original decorative frame remains visible. Source pixels are only resized
// proportionally and clipped; no enhancement or color processing is applied.
const placements = [
  {
    input: path.join(sourcesDir, "rlc-winners-upscaled.png"),
    left: 53,
    top: 75,
    width: 849,
    height: 449,
    radius: 46,
    position: "north",
  },
  {
    input: path.join(sourcesDir, "ga-fbla-letters-upscaled.png"),
    left: 1658,
    top: 75,
    width: 849,
    height: 449,
    radius: 46,
    position: "north",
  },
  {
    input: path.join(sourcesDir, "conference-team-upscaled.png"),
    left: 47,
    top: 548,
    width: 740,
    height: 392,
    radius: 43,
    position: "centre",
  },
  {
    input: path.join(sourcesDir, "state-team-upscaled.png"),
    left: 808,
    top: 548,
    width: 644,
    height: 392,
    radius: 43,
    position: "centre",
  },
  {
    input: path.join(sourcesDir, "chapter-meeting-upscaled.png"),
    left: 1472,
    top: 548,
    width: 660,
    height: 392,
    radius: 43,
    position: "centre",
  },
];

function roundedMask(width, height, radius) {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${width}" height="${height}" rx="${radius}" fill="#fff"/>` +
    `</svg>`,
  );
}

const layers = await Promise.all(
  placements.map(async ({ input, left, top, width, height, radius, position }) => {
    const image = await sharp(input)
      .rotate()
      .resize({ width, height, fit: "cover", position, kernel: "lanczos3" })
      .ensureAlpha()
      .composite([{ input: roundedMask(width, height, radius), blend: "dest-in" }])
      .png()
      .toBuffer();

    return { input: image, left, top };
  }),
);

await sharp(canvas.template)
  .resize(canvas.width, canvas.height, { fit: "fill" })
  .composite(layers)
  .png({ compressionLevel: 9 })
  .toFile(canvas.output);

console.log(canvas.output);
