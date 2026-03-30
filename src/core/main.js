const app = globalThis.__LLMThreadNavigator;

app.main = {
  async start() {
    if (app.state.started) {
      return;
    }

    const adapter = app.registry.findAdapter();
    if (!adapter) {
      return;
    }

    const settings = await app.storage.loadSettings();
    if (!settings.enabled) {
      return;
    }

    app.state.started = true;
    const session = new app.Session({ adapter, settings });
    session.start();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => app.main.start(), { once: true });
} else {
  app.main.start();
}
