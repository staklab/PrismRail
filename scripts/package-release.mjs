import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist", "extension");
const packageDir = path.join(rootDir, "dist", "packages");
const version = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8")).version;
const zipPath = path.join(packageDir, `prismrail-v${version}-chromium.zip`);

mkdirSync(packageDir, { recursive: true });
rmSync(zipPath, { force: true });

execFileSync("zip", ["-r", zipPath, "."], {
  cwd: distDir,
  stdio: "inherit"
});

process.stdout.write(`Created ${zipPath}\n`);
