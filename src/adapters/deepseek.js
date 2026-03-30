const app = globalThis.__LLMThreadNavigator;

class DeepSeekAdapter extends app.BaseAdapter {
  constructor() {
    super();
    this.id = "deepseek";
    this.hostnames = ["deepseek.com", "www.deepseek.com", "chat.deepseek.com"];
    this.messageSelectors = [
      "main article",
      "main [data-testid*='message']",
      "main [class*='message']",
      "main [class*='markdown']",
      "main [role='listitem']"
    ];
  }
}

app.adapters.push(new DeepSeekAdapter());
