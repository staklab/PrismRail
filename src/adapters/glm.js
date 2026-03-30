const app = globalThis.__LLMThreadNavigator;

class GLMAdapter extends app.BaseAdapter {
  constructor() {
    super();
    this.id = "glm";
    this.hostnames = ["chatglm.cn", "www.chatglm.cn", "z.ai", "www.z.ai", "chat.z.ai"];
    this.messageSelectors = [
      "main article",
      "main [data-testid*='message']",
      "main [class*='message']",
      "main [class*='answer']",
      "main [class*='conversation'] > *",
      "main [role='listitem']"
    ];
  }
}

app.adapters.push(new GLMAdapter());
