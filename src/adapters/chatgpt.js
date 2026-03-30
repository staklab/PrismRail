const app = globalThis.__LLMThreadNavigator;

class ChatGPTAdapter extends app.BaseAdapter {
  constructor() {
    super();
    this.id = "chatgpt";
    this.hostnames = ["chat.openai.com", "chatgpt.com"];
    this.messageSelectors = [
      "[data-testid^='conversation-turn']",
      "[data-message-author-role]",
      "main article",
      "main [role='listitem']"
    ];
  }
}

app.adapters.push(new ChatGPTAdapter());
