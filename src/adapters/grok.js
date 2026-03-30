const app = globalThis.__LLMThreadNavigator;

class GrokAdapter extends app.BaseAdapter {
  constructor() {
    super();
    this.id = "grok";
    this.hostnames = ["grok.com", "www.grok.com"];
    this.messageSelectors = [
      "main article",
      "main [data-testid*='message']",
      "main [data-testid*='conversation']",
      "main [class*='message']",
      "main [class*='response']",
      "main [role='listitem']"
    ];
  }
}

app.adapters.push(new GrokAdapter());
