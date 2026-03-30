import test from "node:test";
import assert from "node:assert/strict";

globalThis.__LLMThreadNavigator = {
  adapters: []
};

await import("../src/core/namespace.js");
await import("../src/core/config.js");
await import("../src/core/excerpt.js");
await import("../src/core/utils.js");
await import("../src/core/dom.js");
await import("../src/adapters/base.js");
await import("../src/adapters/chatgpt.js");
await import("../src/adapters/gemini.js");
await import("../src/adapters/claude.js");
await import("../src/adapters/deepseek.js");
await import("../src/adapters/doubao.js");
await import("../src/adapters/glm.js");
await import("../src/adapters/grok.js");
await import("../src/adapters/registry.js");

const { registry } = globalThis.__LLMThreadNavigator;

test("registry matches ChatGPT host", () => {
  assert.equal(registry.findAdapter("chatgpt.com")?.id, "chatgpt");
});

test("registry matches Gemini host", () => {
  assert.equal(registry.findAdapter("gemini.google.com")?.id, "gemini");
});

test("registry matches Claude host", () => {
  assert.equal(registry.findAdapter("claude.ai")?.id, "claude");
});

test("registry matches DeepSeek host", () => {
  assert.equal(registry.findAdapter("www.deepseek.com")?.id, "deepseek");
});

test("registry matches Doubao host", () => {
  assert.equal(registry.findAdapter("www.doubao.com")?.id, "doubao");
});

test("registry matches GLM host", () => {
  assert.equal(registry.findAdapter("chatglm.cn")?.id, "glm");
});

test("registry matches Grok host", () => {
  assert.equal(registry.findAdapter("grok.com")?.id, "grok");
});

test("registry returns null for unknown host", () => {
  assert.equal(registry.findAdapter("example.com"), null);
});
