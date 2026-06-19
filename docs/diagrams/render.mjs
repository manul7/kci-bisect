#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : (args[i + 1] ?? fallback);
};

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourceDir = option("--source", scriptDir);
const outputDir = option("--output", sourceDir);
const format = option("--format", "svg");
const mermaidConfig = option("--config", join(scriptDir, "mermaid-config.json"));
const browser = option("--browser", option("--chrome", process.env.PUPPETEER_EXECUTABLE_PATH));
const browserChannel = option("--browser-channel", process.env.PUPPETEER_BROWSER_CHANNEL);

if (browser && browserChannel) {
  throw new Error("Use either --browser or --browser-channel, not both.");
}

if (spawnSync("mmdc", ["--version"], { encoding: "utf8" }).status !== 0) {
  throw new Error("Required command not found: mmdc");
}

const tmpRoot = join(tmpdir(), `kci-bisect-mermaid-${process.pid}`);
const tmpOutput = join(tmpRoot, "output");
mkdirSync(tmpRoot, { recursive: true });
mkdirSync(tmpOutput, { recursive: true });

// --no-sandbox is required on Linux/CI/root.
const puppeteerConfig = join(tmpRoot, "puppeteer.json");
writeFileSync(puppeteerConfig, JSON.stringify({
  ...(browser ? { executablePath: browser } : {}),
  ...(browserChannel ? { channel: browserChannel } : {}),
  args: ["--no-sandbox"],
}));

const sources = readdirSync(sourceDir).filter((name) => name.endsWith(".mmd")).sort();

try {
  for (const name of sources) {
    const input = join(sourceDir, name);
    const output = join(tmpOutput, name.replace(/\.mmd$/, `.${format}`));
    const mmdcArgs = ["-q", "-i", input, "-o", output, "-p", puppeteerConfig];
    if (existsSync(mermaidConfig)) {
      mmdcArgs.push("-c", mermaidConfig);
    }

    const result = spawnSync("mmdc", mmdcArgs, { encoding: "utf8" });
    if (result.status !== 0) {
      const detail = [result.stdout.trim(), result.stderr.trim()].filter(Boolean).join("\n");
      const browserHint = detail.includes("Could not find Chrome")
        ? "\nInstall a Puppeteer-compatible browser, set PUPPETEER_EXECUTABLE_PATH, or pass --browser."
        : detail.includes("Failed to launch")
          ? "\nThe configured browser was found but could not launch."
          : "";
      throw new Error(`Failed to render ${input}\n${detail}${browserHint}`);
    }
  }

  mkdirSync(outputDir, { recursive: true });
  for (const name of readdirSync(outputDir)) {
    if (extname(name) === `.${format}`) {
      rmSync(join(outputDir, name), { force: true });
    }
  }
  for (const name of readdirSync(tmpOutput)) {
    copyFileSync(join(tmpOutput, name), join(outputDir, name));
  }

  console.log(`Rendered ${sources.length} Mermaid diagram(s) to ${outputDir}`);
} finally {
  rmSync(tmpRoot, { recursive: true, force: true });
}
