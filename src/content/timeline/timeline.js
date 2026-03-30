import { isNarrowViewport } from "../shared/dom.js";

function humanizeSite(site) {
  return String(site ?? "assistant").replace(/^\w/, (char) => char.toUpperCase());
}

function buildClusters(items, maxNodes) {
  if (items.length <= maxNodes) {
    return items.map((item) => ({
      id: item.id,
      itemIds: [item.id],
      role: item.role,
      preview: item.preview,
      keywords: item.keywords,
      badge: item.badge,
      order: item.order,
      startOrder: item.order,
      endOrder: item.order
    }));
  }

  const size = Math.ceil(items.length / maxNodes);
  const clusters = [];
  for (let index = 0; index < items.length; index += size) {
    const slice = items.slice(index, index + size);
    const first = slice[0];
    const last = slice[slice.length - 1];
    clusters.push({
      id: first.id,
      itemIds: slice.map((entry) => entry.id),
      role: first.role,
      preview: first.preview,
      keywords: first.keywords,
      badge: first.badge,
      order: first.order,
      startOrder: first.order,
      endOrder: last.order
    });
  }

  return clusters;
}

export class TimelineOverlay {
  constructor({ onSelect, onToggleCollapsed }) {
    this.onSelect = onSelect;
    this.onToggleCollapsed = onToggleCollapsed;
    this.host = null;
    this.track = null;
    this.status = null;
    this.tooltip = null;
    this.toggle = null;
    this.clusterNodes = [];
    this.activeId = null;
    this.settings = null;
  }

  updateSettings(settings) {
    this.settings = settings;
    this.ensureRoot();
    this.host.classList.toggle("ctn-hidden", !settings.enabled);
    this.host.classList.toggle("ctn-collapsed", !!settings.collapsed);
    this.host.classList.toggle("ctn-mobile", isNarrowViewport());
  }

  render(items, meta) {
    this.ensureRoot();
    const narrow = isNarrowViewport();
    const maxNodes = narrow ? 18 : 42;
    const clusters = buildClusters(items, maxNodes);
    this.clusterNodes = clusters;

    this.track.replaceChildren();

    if (clusters.length === 0) {
      const empty = document.createElement("div");
      empty.className = "ctn-empty";
      empty.textContent = "Timeline appears after the page has a few conversation turns.";
      this.track.appendChild(empty);
      this.status.textContent = `${humanizeSite(meta.site)} · waiting for content`;
      return;
    }

    const line = document.createElement("div");
    line.className = "ctn-line";
    this.track.appendChild(line);

    clusters.forEach((cluster, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ctn-node";
      button.dataset.itemId = cluster.id;
      button.dataset.role = cluster.role;
      button.dataset.badge = cluster.badge;
      button.setAttribute(
        "aria-label",
        cluster.startOrder === cluster.endOrder
          ? `Jump to message ${cluster.startOrder + 1}`
          : `Jump to messages ${cluster.startOrder + 1} to ${cluster.endOrder + 1}`
      );

      const ratio = clusters.length === 1 ? 0 : index / (clusters.length - 1);
      button.style.setProperty("--ctn-node-top", `${ratio * 100}%`);
      button.addEventListener("click", () => this.onSelect(cluster.id));
      button.addEventListener("mouseenter", () => this.showTooltip(button, cluster));
      button.addEventListener("mouseleave", () => this.hideTooltip());
      button.addEventListener("focus", () => this.showTooltip(button, cluster));
      button.addEventListener("blur", () => this.hideTooltip());

      const label = document.createElement("span");
      label.className = "ctn-node-dot";
      label.textContent = cluster.role === "user" ? "U" : "A";

      button.appendChild(label);
      this.track.appendChild(button);
    });

    this.status.textContent = `${humanizeSite(meta.site)} · ${items.length} turns · ${meta.performanceMode}`;
    this.setActive(this.activeId);
  }

  setActive(itemId) {
    this.activeId = itemId;
    for (const node of this.track.querySelectorAll(".ctn-node")) {
      const cluster = this.clusterNodes.find((entry) => entry.id === node.dataset.itemId);
      const active = cluster?.itemIds.includes(itemId) ?? false;
      node.classList.toggle("is-active", active);
    }
  }

  destroy() {
    this.host?.remove();
  }

  ensureRoot() {
    if (this.host) {
      return;
    }

    this.host = document.createElement("aside");
    this.host.id = "ctn-root";
    this.host.innerHTML = `
      <button type="button" class="ctn-toggle" aria-label="Toggle timeline">Trail</button>
      <div class="ctn-panel">
        <div class="ctn-header">
          <div>
            <strong>PrismRail</strong>
            <span class="ctn-caption">Local timeline navigator</span>
          </div>
          <button type="button" class="ctn-collapse" aria-label="Collapse timeline">Hide</button>
        </div>
        <div class="ctn-track" aria-live="polite"></div>
        <div class="ctn-status"></div>
      </div>
      <div class="ctn-tooltip" hidden></div>
    `;

    this.track = this.host.querySelector(".ctn-track");
    this.status = this.host.querySelector(".ctn-status");
    this.tooltip = this.host.querySelector(".ctn-tooltip");
    this.toggle = this.host.querySelector(".ctn-toggle");

    const collapse = this.host.querySelector(".ctn-collapse");
    this.toggle.addEventListener("click", () => this.onToggleCollapsed(false));
    collapse.addEventListener("click", () => this.onToggleCollapsed(true));
    document.body.appendChild(this.host);
  }

  showTooltip(anchor, cluster) {
    if (!this.settings?.previewEnabled || isNarrowViewport()) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    this.tooltip.hidden = false;
    this.tooltip.innerHTML = `
      <div class="ctn-tooltip-role">${cluster.role}</div>
      <div class="ctn-tooltip-preview">${escapeHtml(cluster.preview)}</div>
      <div class="ctn-tooltip-meta">${escapeHtml(cluster.keywords?.slice(0, 3).join(" · ") || cluster.badge)}</div>
    `;
    this.tooltip.style.top = `${rect.top}px`;
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.hidden = true;
    }
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
