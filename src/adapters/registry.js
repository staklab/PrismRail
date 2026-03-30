const app = globalThis.__LLMThreadNavigator;

app.registry = {
  findAdapter(hostname = globalThis.location.hostname) {
    return app.adapters.find((adapter) => adapter.matches(hostname)) || null;
  }
};
