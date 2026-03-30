const app = globalThis.__LLMThreadNavigator;

app.utils = {
  clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  },

  throttleFrame(callback) {
    let queued = false;
    return (...args) => {
      if (queued) {
        return;
      }
      queued = true;
      globalThis.requestAnimationFrame(() => {
        queued = false;
        callback(...args);
      });
    };
  },

  debounce(callback, delay) {
    let timer = 0;
    return (...args) => {
      globalThis.clearTimeout(timer);
      timer = globalThis.setTimeout(() => callback(...args), delay);
    };
  },

  isVisible(node) {
    if (!(node instanceof HTMLElement)) {
      return false;
    }
    const style = globalThis.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  },

  uniqueNodes(nodes) {
    return Array.from(new Set(nodes));
  },

  sortDomNodes(nodes) {
    return [...nodes].sort((left, right) => {
      if (left === right) {
        return 0;
      }
      const relation = left.compareDocumentPosition(right);
      if (relation & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }
      if (relation & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      }
      return 0;
    });
  },

  text(node) {
    return (node?.innerText || node?.textContent || "").replace(/\s+/g, " ").trim();
  },

  create(tagName, attributes = {}, text = "") {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
        return;
      }
      if (key.startsWith("data-")) {
        element.setAttribute(key, value);
        return;
      }
      element[key] = value;
    });
    if (text) {
      element.textContent = text;
    }
    return element;
  },

  nearestByViewportCenter(records) {
    const viewportCenter = globalThis.innerHeight / 2;
    let winner = null;
    let distance = Number.POSITIVE_INFINITY;

    records.forEach((record) => {
      if (!record.node?.isConnected) {
        return;
      }
      const rect = record.node.getBoundingClientRect();
      const nodeCenter = rect.top + rect.height / 2;
      const nextDistance = Math.abs(viewportCenter - nodeCenter);
      if (nextDistance < distance) {
        distance = nextDistance;
        winner = record;
      }
    });

    return winner;
  },

  fixedMarkerPosition(index, count, padding = 6) {
    if (count <= 1) {
      return 50;
    }

    const span = 100 - padding * 2;
    return padding + (span / (count - 1)) * index;
  },

  buildTimelineMarkers(records) {
    if (!records.length) {
      return [];
    }

    const markers = [];
    const totalMarkers = 12;
    const deciles = Array.from({ length: 10 }, (_, index) => (index + 1) / 10);
    const lastRecord = records[records.length - 1];

    markers.push({
      id: `marker-start-${records[0].id}`,
      kind: "start",
      markerIndex: 0,
      recordIndex: 0,
      record: records[0],
      position: app.utils.fixedMarkerPosition(0, totalMarkers),
      progress: 0,
      title: "Start",
      subtitle: "首对话起点",
      jumpMode: "start"
    });

    deciles.forEach((progress, index) => {
      const recordIndex = app.utils.clamp(
        Math.ceil(records.length * progress) - 1,
        0,
        records.length - 1
      );
      const record = records[recordIndex];

      markers.push({
        id: `marker-${Math.round(progress * 100)}-${record.id}-${index}`,
        kind: "ratio",
        markerIndex: index + 1,
        recordIndex,
        record,
        position: app.utils.fixedMarkerPosition(index + 1, totalMarkers),
        progress: (index + 1) / (totalMarkers - 1),
        title: `${Math.round(progress * 100)}%`,
        subtitle: `第 ${recordIndex + 1} 段起点`,
        jumpMode: "start"
      });
    });

    markers.push({
      id: `marker-end-${lastRecord.id}`,
      kind: "end",
      markerIndex: totalMarkers - 1,
      recordIndex: records.length - 1,
      record: lastRecord,
      position: app.utils.fixedMarkerPosition(totalMarkers - 1, totalMarkers),
      progress: 1,
      title: "End",
      subtitle: "最后回复尾部",
      jumpMode: "end"
    });

    return markers;
  },

  findActiveMarker(markers, activeRecord, options = {}) {
    if (!markers.length || !activeRecord) {
      return null;
    }

    if (options.atEnd) {
      return markers.find((marker) => marker.kind === "end") || markers[markers.length - 1];
    }

    let winner = null;
    let distance = Number.POSITIVE_INFINITY;

    markers.forEach((marker) => {
      const nextDistance = Math.abs(marker.recordIndex - activeRecord.index);
      if (nextDistance < distance) {
        distance = nextDistance;
        winner = marker;
      }
    });

    return winner;
  }
};
