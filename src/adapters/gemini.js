const app = globalThis.__LLMThreadNavigator;

class GeminiAdapter extends app.BaseAdapter {
  constructor() {
    super();
    this.id = "gemini";
    this.hostnames = ["gemini.google.com"];
    this.messageSelectors = [
      "main message-content",
      "main .conversation-container > *",
      "main [data-test-id*='conversation']",
      "main [role='listitem']",
      "main article"
    ];
  }
}

app.adapters.push(new GeminiAdapter());
