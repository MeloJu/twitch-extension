import { mkdir, cp, readFile, writeFile } from "node:fs/promises";
import { build, context } from "esbuild";

const watchMode = process.argv.includes("--watch");
const targetBrowser = process.argv.includes("--firefox") ? "firefox" : "chrome";

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
  target: targetBrowser === "firefox" ? "firefox121" : "chrome120",
  sourcemap: true,
  platform: "browser",
  logLevel: "info"
};

async function adjustManifestForTarget() {
  const manifestPath = "dist/manifest.json";
  const manifestRaw = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(manifestRaw);

  if (targetBrowser === "firefox") {
    manifest.permissions = (manifest.permissions ?? []).filter((permission) => permission !== "sidePanel");
    delete manifest.side_panel;
    manifest.browser_specific_settings = {
      gecko: {
        id: "yt-twitch-chat-bridge@melodu"
      }
    };
  } else {
    delete manifest.browser_specific_settings;
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function copyStaticFiles() {
  await mkdir("dist", { recursive: true });
  await cp("static", "dist", { recursive: true });
  await adjustManifestForTarget();
}

if (watchMode) {
  await copyStaticFiles();
  const ctx = await context(buildConfig);
  await ctx.watch();
  console.log(`Watching extension files for ${targetBrowser}...`);
} else {
  await build(buildConfig);
  await copyStaticFiles();
}
