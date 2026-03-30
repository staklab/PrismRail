const app = globalThis.__LLMThreadNavigator;

class DoubaoAdapter extends app.BaseAdapter {
  constructor() {
    super();
    this.id = "doubao";
    this.hostnames = ["doubao.com", "www.doubao.com", "inhouse.doubao.com"];
    this.messageSelectors = [
      "main article",
      "main [data-testid*='message']",
      "main [class*='message']",
      "main [class*='answer']",
      "main [class*='question']",
      "main [role='listitem']"
    ];
  }
}

app.adapters.push(new DoubaoAdapter());
