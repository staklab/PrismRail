const app = globalThis.__LLMThreadNavigator;

class Session {
  constructor({ adapter, settings }) {
    this.adapter = adapter;
    this.settings = settings;
    this.panel = new app.TimelinePanel();
    this.records = [];
    this.mutationObserver = null;
    this.scrollContainer = null;
    this.handleScroll = app.utils.throttleFrame(() => this.syncActiveNode());
    this.scheduleRefresh = app.utils.debounce(() => this.refresh(), 180);
  }

  async start() {
    await app.dom.waitFor(() => this.adapter.getMessageNodes().length > 0);
    this.scrollContainer = this.adapter.getScrollContainer();
    this.refresh();
    this.bindEvents();
  }

  bindEvents() {
    if (this.scrollContainer) {
      this.scrollContainer.addEventListener("scroll", this.handleScroll, { passive: true });
    }

    globalThis.addEventListener("resize", this.handleScroll, { passive: true });

    this.mutationObserver = new MutationObserver(() => {
      this.scheduleRefresh();
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false
    });
  }

  refresh() {
    const records = this.adapter.collectMessages(this.settings);
    if (!records.length) {
      this.panel.render([], () => {});
      return;
    }

    this.records = records;
    app.optimizer.apply(records, this.settings);
    this.panel.render(records, (marker) => {
      this.scrollToMarker(marker);
      this.panel.setActiveRecord(marker.record, {
        atEnd: marker.kind === "end"
      });
    });
    this.syncActiveNode();
  }

  syncActiveNode() {
    if (!this.records.length) {
      return;
    }
    const active = app.utils.nearestByViewportCenter(this.records);
    if (active) {
      this.panel.setActiveRecord(active, {
        atEnd: this.isNearBottom()
      });
    }
  }

  scrollToMarker(marker) {
    if (!marker?.record?.node?.isConnected) {
      return;
    }

    marker.record.node.scrollIntoView({
      behavior: "smooth",
      block: marker.jumpMode === "end" ? "end" : "start",
      inline: "nearest"
    });
  }

  isNearBottom() {
    const container = this.scrollContainer;
    if (!container) {
      return false;
    }

    const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;
    return remaining <= 24;
  }
}

app.Session = Session;
