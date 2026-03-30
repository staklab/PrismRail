import test from "node:test";
import assert from "node:assert/strict";

globalThis.__LLMThreadNavigator = {};

await import("../src/core/namespace.js");
await import("../src/core/config.js");
await import("../src/core/excerpt.js");

const { excerpt } = globalThis.__LLMThreadNavigator;

test("make returns fallback for empty text", () => {
  assert.equal(excerpt.make("", 80), "点击跳转到此消息");
});

test("make keeps sentence when it fits", () => {
  const value = excerpt.make("这是第一句。这里是第二句。", 24);
  assert.equal(value, "这是第一句。");
});

test("make truncates long text", () => {
  const value = excerpt.make("abcdefghijklmnopqrstuvwxyz", 10);
  assert.equal(value, "abcdefghi…");
});
