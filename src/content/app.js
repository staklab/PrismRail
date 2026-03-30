import { readSettings, subscribeSettings, writeSettings } from "../shared/settings.js";
import { getAdapterForLocation } from "./adapters/index.js";
import { ConversationVirtualizer } from "./performance/virtualizer.js";
import { throttle, idle, cancelIdle } from "./shared/scheduler.js";
import { TimelineOverlay } from "./timeline/timeline.js";

class ContextTrailApp {
  constructor(adapter, settings) {
    this.adapter = adapter;
    this.settings = settings;
    this.virtualizer = new ConversationVirtualizer(adapter, settings);
    this.timeline = new TimelineOverlay({
      onSelect: (itemId) => {
        this.virtualizer.jumpTo(itemId);
        this.timeline.setActive(itemId);
      },
      onToggleCollapsed: (collapsed) => {
        writeSettings({
          collapsed
        });
      }
    });

    this.refreshToken = null;
    this.unsubscribeObserver = null;
    this.unsubscribeSettings = null;
    this.handleViewport = throttle(() => {
      if (!this.settings.enabled) {
        return;
      }

      const activeId = this.virtualizer.evaluate();
      this.timeline.setActive(activeId);
    }, 90);
  }

  init() {
    this.timeline.updateSettings(this.settings);
    this.unsubscribeObserver = this.adapter.observeChanges(() => this.queueRefresh());
    this.unsubscribeSettings = subscribeSettings((settings) => this.applySettings(settings));
    globalThis.addEventListener("scroll", this.handleViewport, {
      passive: true
    });
    globalThis.addEventListener("resize", this.handleViewport, {
      passive: true
    });
    this.queueRefresh();
  }

  applySettings(settings) {
    this.settings = settings;
    this.virtualizer.syncSettings(settings);
    this.timeline.updateSettings(settings);

    if (!settings.enabled) {
      this.virtualizer.restoreAll();
      return;
    }

    this.queueRefresh();
  }

  queueRefresh() {
    cancelIdle(this.refreshToken);
    this.refreshToken = idle(() => this.refresh(), 120);
  }

  refresh() {
    if (!this.settings.enabled) {
      return;
    }

    const messages = this.adapter.collectMessages();
    this.virtualizer.update(messages, this.settings);
    const activeId = this.virtualizer.evaluate();
    this.timeline.render(this.virtualizer.getTimelineItems(), {
      site: this.adapter.site,
      performanceMode: this.settings.performanceMode
    });
    this.timeline.setActive(activeId);
  }

  destroy() {
    cancelIdle(this.refreshToken);
    this.unsubscribeObserver?.();
    this.unsubscribeSettings?.();
    globalThis.removeEventListener("scroll", this.handleViewport);
    globalThis.removeEventListener("resize", this.handleViewport);
    this.virtualizer.destroy();
    this.timeline.destroy();
  }
}

export async function start() {
  if (globalThis.__contextTrailApp) {
    return;
  }

  const adapter = getAdapterForLocation();
  if (!adapter) {
    return;
  }

  const settings = await readSettings();
  const app = new ContextTrailApp(adapter, settings);
  app.init();
  globalThis.__contextTrailApp = app;
}
