// Render many review stills with one bundle: node stills.mjs <CompositionId> <outDir> <frame,frame,...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [id, outDir, framesArg] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
for (const f of framesArg.split(",").map(Number)) {
  const output = path.join(outDir, `f${String(f).padStart(5, "0")}.jpg`);
  try {
    await renderStill({ composition, serveUrl, output, frame: f, imageFormat: "jpeg", jpegQuality: 70, scale: 0.5 });
    console.log(output);
  } catch (e) {
    console.log(`FAIL frame ${f}: ${String(e.message ?? e).split(String.fromCharCode(10)).slice(0, 4).join(" | ")}`);
  }
}
