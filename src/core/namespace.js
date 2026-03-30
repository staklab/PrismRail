const app = (globalThis.__LLMThreadNavigator = globalThis.__LLMThreadNavigator || {});

app.version = "0.1.0";
app.adapters = app.adapters || [];
app.state = app.state || {
  started: false
};
