import { mkdir, cp } from "node:fs/promises";
import { build, context } from "esbuild";

const watchMode = process.argv.includes("--watch");

const buildConfig = {
  entryPoints: {
    background: "src/entrypoints/background.ts",
    content: "src/entrypoints/content.ts",
    popup: "src/entrypoints/popup.ts",
    options: "src/entrypoints/options.ts",
    sidepanel: "src/entrypoints/sidepanel.ts"
  },
  outdir: "dist",
  bundle: true,
  format: "esm",
  target: "chrome120",
  sourcemap: true,
  platform: "browser",
  logLevel: "info"
};

async function copyStaticFiles() {
  await mkdir("dist", { recursive: true });
  await cp("static", "dist", { recursive: true });
}

if (watchMode) {
  await copyStaticFiles();
  const ctx = await context(buildConfig);
  await ctx.watch();
  console.log("Watching extension files...");
} else {
  await build(buildConfig);
  await copyStaticFiles();
}
