import { ChatGPTAdapter } from "./chatgpt.js";
import { GeminiAdapter } from "./gemini.js";
import { ClaudeAdapter } from "./claude.js";

const ADAPTERS = [
  new ChatGPTAdapter(),
  new GeminiAdapter(),
  new ClaudeAdapter()
];

export function getAdapterForLocation(location = globalThis.location) {
  return ADAPTERS.find((adapter) => adapter.detect(location)) ?? null;
}
