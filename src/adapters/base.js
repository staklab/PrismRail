const app = globalThis.__LLMThreadNavigator;

class BaseAdapter {
  constructor() {
    this.id = "base";
    this.hostnames = [];
    this.messageSelectors = [
      "[data-message-author-role]",
      "[data-testid*='message']",
      "article",
      "[role='listitem']",
      ".message",
      ".conversation-turn",
      "[class*='message']",
      "[class*='conversation'] > *",
      "[class*='markdown']"
    ];
  }

  matches(hostname) {
    return this.hostnames.some((item) => hostname === item || hostname.endsWith(`.${item}`));
  }

  getScrollContainer() {
    const seed =
      this.getMessageNodes()[0] ||
      document.querySelector("main") ||
      document.body;

    let current = seed;
    while (current && current !== document.body) {
      if (this.isScrollable(current)) {
        return current;
      }
      current = current.parentElement;
    }

    return document.scrollingElement || document.documentElement;
  }

  getMessageNodes() {
    const nodes = app.dom.queryAll(this.messageSelectors).filter((node) => this.isMessageNode(node));
    return nodes;
  }

  isMessageNode(node) {
    if (!app.utils.isVisible(node)) {
      return false;
    }
    const text = app.utils.text(node);
    if (text.length >= 20) {
      return true;
    }
    return Boolean(node.querySelector("pre, code, img, video, canvas, table"));
  }

  inferRole(node, index) {
    const explicit = (
      node.getAttribute("data-message-author-role") ||
      node.getAttribute("data-role") ||
      node.getAttribute("data-testid") ||
      node.getAttribute("aria-label") ||
      ""
    ).toLowerCase();

    if (/(assistant|model|claude|gemini|gpt|deepseek|doubao|glm|grok|豆包|智谱|清言)/.test(explicit)) {
      return "assistant";
    }
    if (/(user|human|you)/.test(explicit)) {
      return "user";
    }

    const hint = `${node.className || ""} ${node.id || ""}`.toLowerCase();
    if (/(assistant|model|bot|response|reply|answer|deepseek|doubao|glm|grok|claude|gemini)/.test(hint)) {
      return "assistant";
    }
    if (/(user|human|prompt|query|question|ask)/.test(hint)) {
      return "user";
    }

    return index % 2 === 0 ? "user" : "assistant";
  }

  buildRecord(node, index, settings) {
    const role = this.inferRole(node, index);
    const text = app.utils.text(node);
    return {
      id: `${this.id}-${index}`,
      index,
      role,
      label: app.excerpt.label(role, index),
      excerpt: app.excerpt.make(text, settings.previewLength),
      text,
      node
    };
  }

  collectMessages(settings) {
    return this.getMessageNodes().map((node, index) => this.buildRecord(node, index, settings));
  }

  isScrollable(node) {
    if (!(node instanceof HTMLElement)) {
      return false;
    }

    const style = globalThis.getComputedStyle(node);
    const overflowY = style.overflowY;
    const allowsScroll = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
    return allowsScroll && node.scrollHeight - node.clientHeight > 48;
  }
}

app.BaseAdapter = BaseAdapter;
