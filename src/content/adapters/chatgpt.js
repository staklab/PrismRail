import { SITE_NAMES } from "../../shared/constants.js";
import { BaseAdapter } from "./base.js";

export class ChatGPTAdapter extends BaseAdapter {
  constructor() {
    super({
      site: SITE_NAMES.CHATGPT,
      hostnames: ["chatgpt.com", "chat.openai.com"],
      rootSelectors: ["main", "[data-testid='conversation-turn-list']"],
      messageSelectors: [
        "[data-message-author-role]",
        "article[data-testid^='conversation-turn']"
      ],
      resolveRole(node, order) {
        const direct = node.getAttribute("data-message-author-role");
        if (direct) {
          return direct;
        }

        const nested = node.querySelector("[data-message-author-role]");
        if (nested) {
          return nested.getAttribute("data-message-author-role");
        }

        return order % 2 === 0 ? "user" : "assistant";
      }
    });
  }
}
