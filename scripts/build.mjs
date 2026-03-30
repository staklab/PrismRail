import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const outDir = path.join(rootDir, "dist", "extension");

const bundleOrder = [
  "core/namespace.js",
  "core/config.js",
  "core/utils.js",
  "core/storage.js",
  "core/excerpt.js",
  "core/dom.js",
  "adapters/base.js",
  "adapters/chatgpt.js",
  "adapters/gemini.js",
  "adapters/claude.js",
  "adapters/deepseek.js",
  "adapters/doubao.js",
  "adapters/glm.js",
  "adapters/grok.js",
  "adapters/registry.js",
  "performance/optimizer.js",
  "timeline/panel.js",
  "core/session.js",
  "core/main.js"
];

async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

async function bundleContentScript() {
  const contents = await Promise.all(
    bundleOrder.map(async (relativePath) => {
      const absolutePath = path.join(srcDir, relativePath);
      const source = await readFile(absolutePath, "utf8");
      return `\n/* ${relativePath} */\n{\n${source.trim()}\n}\n`;
    })
  );

  const bundle = `'use strict';\n(() => {\n${contents.join("\n")}\n})();\n`;
  await writeFile(path.join(outDir, "content.bundle.js"), bundle, "utf8");
}

async function copyStaticFiles() {
  const files = [
    ["manifest.json", "manifest.json"],
    ["ui/content.css", "content.css"],
    ["background/background.js", "background.js"],
    ["options/options.html", "options.html"],
    ["options/options.css", "options.css"],
    ["options/options.js", "options.js"],
    ["icons/prismrail-16.png", "icons/prismrail-16.png"],
    ["icons/prismrail-32.png", "icons/prismrail-32.png"],
    ["icons/prismrail-48.png", "icons/prismrail-48.png"],
    ["icons/prismrail-128.png", "icons/prismrail-128.png"],
    ["icons/prismrail-256.png", "icons/prismrail-256.png"],
    ["icons/prismrail-512.png", "icons/prismrail-512.png"],
    ["icons/prismrail-1024.png", "icons/prismrail-1024.png"],
    ["icons/prismrail.svg", "icons/prismrail.svg"]
  ];

  await ensureDir(path.join(outDir, "icons"));
  await Promise.all(
    files.map(([from, to]) => copyFile(path.join(srcDir, from), path.join(outDir, to)))
  );
}

async function main() {
  await ensureDir(outDir);
  await bundleContentScript();
  await copyStaticFiles();
  process.stdout.write(`Built extension into ${outDir}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
