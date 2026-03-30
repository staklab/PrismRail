import { PERFORMANCE_MODES } from "../../shared/constants.js";

function supportsContentVisibility() {
  return "contentVisibility" in document.documentElement.style;
}

export class ConversationVirtualizer {
  constructor(adapter, settings) {
    this.adapter = adapter;
    this.settings = settings;
    this.itemsById = new Map();
    this.orderedIds = [];
    this.activeId = null;
  }

  syncSettings(settings) {
    const previousMode = this.settings.performanceMode;
    this.settings = settings;

    if (previousMode === PERFORMANCE_MODES.FOCUS && settings.performanceMode !== PERFORMANCE_MODES.FOCUS) {
      this.restoreAll();
    }
  }

  update(messages, settings = this.settings) {
    this.syncSettings(settings);
    const nextMap = new Map();

    for (const message of messages) {
      const existing = this.itemsById.get(message.id);
      if (existing) {
        existing.order = message.order;
        existing.role = message.role;
        existing.site = message.site;
        existing.badge = message.badge;
        existing.element = message.element ?? existing.element;

        if (!existing.isParked) {
          existing.text = message.text;
          existing.preview = message.preview;
          existing.keywords = message.keywords;
        }

        nextMap.set(existing.id, existing);
        continue;
      }

      nextMap.set(message.id, {
        ...message,
        isParked: false,
        storedNodes: [],
        lastKnownHeight: Math.max(120, message.element?.getBoundingClientRect().height || 0)
      });
    }

    for (const [id, item] of this.itemsById.entries()) {
      if (nextMap.has(id)) {
        continue;
      }

      if (item.isParked || item.element?.isConnected) {
        nextMap.set(id, item);
      }
    }

    this.itemsById = nextMap;
    this.orderedIds = [...nextMap.values()]
      .sort((left, right) => left.order - right.order)
      .map((item) => item.id);
  }

  getItems() {
    return this.orderedIds
      .map((id) => this.itemsById.get(id))
      .filter(Boolean);
  }

  getTimelineItems() {
    return this.getItems().map((item) => ({
      id: item.id,
      order: item.order,
      role: item.role,
      preview: item.preview,
      keywords: item.keywords,
      badge: item.badge,
      parked: item.isParked
    }));
  }

  getActiveId() {
    return this.activeId;
  }

  evaluate() {
    const viewportHeight = globalThis.innerHeight || 900;
    const buffer =
      this.settings.performanceMode === PERFORMANCE_MODES.FOCUS
        ? viewportHeight * 0.95
        : viewportHeight * 1.75;
    let closestDistance = Number.POSITIVE_INFINITY;
    let activeId = this.activeId;

    for (const item of this.getItems()) {
      if (!(item.element instanceof HTMLElement)) {
        continue;
      }

      const rect = item.element.getBoundingClientRect();
      const height = Math.max(rect.height, item.lastKnownHeight || 0, 1);
      item.lastKnownHeight = height;
      const distance = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeId = item.id;
      }

      const farAway = rect.bottom < -buffer || rect.top > viewportHeight + buffer;

      if (this.settings.performanceMode === PERFORMANCE_MODES.FOCUS) {
        this.clearBalancedState(item);
        if (farAway && this.shouldPark(item)) {
          this.park(item);
        } else {
          this.restore(item);
        }
        continue;
      }

      this.restore(item);
      this.applyBalancedState(item, farAway, height);
    }

    this.activeId = activeId;
    return activeId;
  }

  shouldPark(item) {
    const height = item.lastKnownHeight || 0;
    return (
      height >= this.settings.minParkHeight ||
      item.text.length > 900 ||
      item.text.includes("```")
    );
  }

  applyBalancedState(item, farAway, height) {
    if (!(item.element instanceof HTMLElement)) {
      return;
    }

    if (!farAway) {
      this.clearBalancedState(item);
      return;
    }

    item.element.classList.add("ctn-balanced-message");
    item.element.style.setProperty("--ctn-intrinsic-size", `${Math.ceil(height)}px`);

    if (supportsContentVisibility()) {
      item.element.style.contentVisibility = "auto";
      item.element.style.contain = "layout paint style";
      item.element.style.containIntrinsicSize = `${Math.ceil(height)}px`;
    }
  }

  clearBalancedState(item) {
    if (!(item.element instanceof HTMLElement)) {
      return;
    }

    item.element.classList.remove("ctn-balanced-message");
    item.element.style.removeProperty("content-visibility");
    item.element.style.removeProperty("contain");
    item.element.style.removeProperty("contain-intrinsic-size");
    item.element.style.removeProperty("--ctn-intrinsic-size");
  }

  park(item) {
    if (item.isParked || !(item.element instanceof HTMLElement)) {
      return;
    }

    item.lastKnownHeight = Math.max(item.element.getBoundingClientRect().height, item.lastKnownHeight || 0);
    item.storedNodes = [];
    while (item.element.firstChild) {
      item.storedNodes.push(item.element.removeChild(item.element.firstChild));
    }

    item.isParked = true;
    item.element.dataset.contextTrailParked = "true";
    item.element.classList.add("ctn-parked-message");
    item.element.style.minHeight = `${Math.ceil(item.lastKnownHeight)}px`;
    item.element.appendChild(this.buildParkedShell(item));
  }

  restore(item) {
    if (!item.isParked || !(item.element instanceof HTMLElement)) {
      return;
    }

    item.element.replaceChildren();
    for (const node of item.storedNodes) {
      item.element.appendChild(node);
    }

    item.storedNodes = [];
    item.isParked = false;
    item.element.classList.remove("ctn-parked-message");
    item.element.style.removeProperty("min-height");
    delete item.element.dataset.contextTrailParked;
  }

  restoreAll() {
    for (const item of this.getItems()) {
      this.restore(item);
      this.clearBalancedState(item);
    }
  }

  jumpTo(itemId) {
    const item = this.itemsById.get(itemId);
    if (!item) {
      return false;
    }

    this.restore(item);
    return this.adapter.jumpToMessage(item);
  }

  destroy() {
    this.restoreAll();
  }

  buildParkedShell(item) {
    const wrapper = document.createElement("div");
    wrapper.className = "ctn-park-shell";

    const top = document.createElement("div");
    top.className = "ctn-park-top";
    top.textContent = `${capitalize(item.role)} · parked for smoother scrolling`;

    const preview = document.createElement("p");
    preview.className = "ctn-park-preview";
    preview.textContent = item.preview;

    const meta = document.createElement("div");
    meta.className = "ctn-park-meta";
    meta.textContent = item.keywords?.slice(0, 3).join(" · ") || item.badge;

    const restoreButton = document.createElement("button");
    restoreButton.type = "button";
    restoreButton.className = "ctn-park-button";
    restoreButton.textContent = "Restore";
    restoreButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.restore(item);
      this.adapter.jumpToMessage(item);
    });

    wrapper.append(top, preview, meta, restoreButton);
    return wrapper;
  }
}

function capitalize(value) {
  const normalized = String(value ?? "");
  if (!normalized) {
    return "Message";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
