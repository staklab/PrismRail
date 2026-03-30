const app = globalThis.__LLMThreadNavigator;

class ClaudeAdapter extends app.BaseAdapter {
  constructor() {
    super();
    this.id = "claude";
    this.hostnames = ["claude.ai"];
    this.messageSelectors = [
      "main article",
      "main [data-testid*='message']",
      "main [role='listitem']",
      "main .prose"
    ];
  }
}

app.adapters.push(new ClaudeAdapter());
