const app = globalThis.__LLMThreadNavigator;

class TimelinePanel {
  constructor() {
    this.root = null;
    this.nodesHost = null;
    this.tooltip = null;
    this.progressLine = null;
    this.activeId = "";
    this.markers = [];
    this.hideTooltipTimer = 0;
  }

  ensure() {
    if (this.root?.isConnected) {
      return this.root;
    }

    this.root = app.utils.create("aside", {
      id: "llmtn-panel",
      ariaLabel: "Conversation timeline"
    });

    const shell = app.utils.create("div", { className: "llmtn-shell" });
    const track = app.utils.create("div", { className: "llmtn-track" });
    this.progressLine = app.utils.create("div", { className: "llmtn-progress" });
    this.nodesHost = app.utils.create("div", { className: "llmtn-nodes" });
    this.tooltip = app.utils.create("div", {
      className: "llmtn-tooltip",
      role: "tooltip"
    });

    track.appendChild(this.progressLine);
    shell.append(track, this.nodesHost, this.tooltip);
    this.root.appendChild(shell);
    document.body.appendChild(this.root);
    return this.root;
  }

  render(records, onSelect) {
    this.ensure();
    this.markers = app.utils.buildTimelineMarkers(records);
    this.root.classList.toggle("llmtn-hidden", this.markers.length < 1);
    this.nodesHost.textContent = "";
    this.hideTooltip(true);

    this.markers.forEach((marker) => {
      const button = app.utils.create("button", {
        className: "llmtn-node",
        type: "button"
      });

      button.dataset.id = marker.id;
      button.dataset.kind = marker.kind;
      button.dataset.role = marker.record.role;
      button.style.top = `${marker.position}%`;
      button.setAttribute(
        "aria-label",
        `${marker.title}，${marker.subtitle}，${marker.record.excerpt}`
      );

      const core = app.utils.create("span", { className: "llmtn-node-core" });
      const srText = app.utils.create(
        "span",
        { className: "llmtn-sr-only" },
        `${marker.title} ${marker.record.excerpt}`
      );

      button.append(core, srText);
      button.addEventListener("click", () => onSelect(marker));
      button.addEventListener("mouseenter", () => this.showTooltip(button, marker));
      button.addEventListener("focus", () => this.showTooltip(button, marker));
      button.addEventListener("mouseleave", () => this.hideTooltip());
      button.addEventListener("blur", () => this.hideTooltip());

      this.nodesHost.appendChild(button);
    });
  }

  setActiveRecord(record, options = {}) {
    if (!this.nodesHost || !record) {
      return;
    }

    const marker = app.utils.findActiveMarker(this.markers, record, options);
    if (!marker || this.activeId === marker.id) {
      return;
    }

    this.activeId = marker.id;
    this.nodesHost.querySelectorAll(".llmtn-node").forEach((node) => {
      node.classList.toggle("is-active", node.dataset.id === marker.id);
    });
    this.progressLine.style.setProperty("--llmtn-progress-scale", String(Math.max(marker.progress, 0.04)));
  }

  showTooltip(anchor, marker) {
    if (!this.tooltip || !this.root) {
      return;
    }

    globalThis.clearTimeout(this.hideTooltipTimer);
    const rootRect = this.root.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const centerY = app.utils.clamp(
      anchorRect.top - rootRect.top + anchorRect.height / 2,
      48,
      rootRect.height - 48
    );

    this.tooltip.innerHTML = "";

    const eyebrow = app.utils.create("div", { className: "llmtn-tooltip-eyebrow" }, marker.title);
    const heading = app.utils.create("div", { className: "llmtn-tooltip-title" }, marker.subtitle);
    const preview = app.utils.create("p", { className: "llmtn-tooltip-body" }, marker.record.excerpt);
    const meta = app.utils.create(
      "div",
      { className: "llmtn-tooltip-meta" },
      `${marker.record.role === "assistant" ? "Assistant" : marker.record.role === "user" ? "User" : "System"} · ${marker.record.label}`
    );

    this.tooltip.append(eyebrow, heading, preview, meta);
    this.tooltip.style.top = `${centerY}px`;
    this.tooltip.hidden = false;
    this.tooltip.classList.add("is-visible");
  }

  hideTooltip(immediate = false) {
    globalThis.clearTimeout(this.hideTooltipTimer);

    if (immediate) {
      this.tooltip?.classList.remove("is-visible");
      if (this.tooltip) {
        this.tooltip.hidden = true;
      }
      return;
    }

    this.hideTooltipTimer = globalThis.setTimeout(() => {
      this.tooltip?.classList.remove("is-visible");
      if (this.tooltip) {
        this.tooltip.hidden = true;
      }
    }, 90);
  }
}

app.TimelinePanel = TimelinePanel;
