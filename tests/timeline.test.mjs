import test from "node:test";
import assert from "node:assert/strict";

globalThis.__LLMThreadNavigator = {
  adapters: []
};

await import("../src/core/namespace.js");
await import("../src/core/utils.js");

const { utils } = globalThis.__LLMThreadNavigator;

function makeRecord(index) {
  return {
    id: `record-${index + 1}`,
    index,
    role: index % 2 === 0 ? "user" : "assistant",
    label: `R${index + 1}`,
    excerpt: `第 ${index + 1} 段对话`
  };
}

test("timeline always renders twelve fixed markers with start and end anchors", () => {
  const markers = utils.buildTimelineMarkers([0, 1, 2].map(makeRecord));
  assert.equal(markers.length, 12);
  assert.equal(markers[0].kind, "start");
  assert.equal(markers.at(-1)?.kind, "end");
  assert.deepEqual(
    markers.slice(0, 3).map((marker) => Number(marker.position.toFixed(2))),
    [6, 14, 22]
  );
});

test("timeline markers sample start, deciles, and end", () => {
  const markers = utils.buildTimelineMarkers(Array.from({ length: 24 }, (_, index) => makeRecord(index)));
  assert.equal(markers.length, 12);
  assert.deepEqual(
    markers.map((marker) => marker.recordIndex),
    [0, 2, 4, 7, 9, 11, 14, 16, 19, 21, 23, 23]
  );
});

test("active marker resolves to nearest sampled record", () => {
  const markers = utils.buildTimelineMarkers(Array.from({ length: 24 }, (_, index) => makeRecord(index)));
  const active = utils.findActiveMarker(markers, makeRecord(15));
  assert.equal(active?.recordIndex, 14);
});

test("active marker resolves to end marker when viewport is at the bottom", () => {
  const markers = utils.buildTimelineMarkers(Array.from({ length: 24 }, (_, index) => makeRecord(index)));
  const active = utils.findActiveMarker(markers, makeRecord(23), { atEnd: true });
  assert.equal(active?.kind, "end");
});
