import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve(process.cwd(), "manifest.json");
const raw = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(raw);

const requiredKeys = [
  "manifest_version",
  "name",
  "version",
  "background",
  "content_scripts"
];

for (const key of requiredKeys) {
  if (!(key in manifest)) {
    throw new Error(`manifest.json is missing "${key}"`);
  }
}

if (manifest.manifest_version !== 3) {
  throw new Error("manifest_version must be 3");
}

console.log("manifest.json looks valid.");
