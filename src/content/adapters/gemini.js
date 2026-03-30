import { SITE_NAMES } from "../../shared/constants.js";
import { BaseAdapter } from "./base.js";

export class GeminiAdapter extends BaseAdapter {
  constructor() {
    super({
      site: SITE_NAMES.GEMINI,
      hostnames: ["gemini.google.com"],
      rootSelectors: ["main", "chat-app", ".conversation-container"],
      messageSelectors: [
        "user-query",
        "model-response",
        ".user-query-container",
        ".model-response-container",
        ".conversation-container .query-text-line"
      ],
      resolveRole(node, order) {
        const marker = `${node.tagName} ${node.className}`.toLowerCase();
        if (marker.includes("user")) {
          return "user";
        }

        if (marker.includes("model") || marker.includes("response")) {
          return "assistant";
        }

        return order % 2 === 0 ? "user" : "assistant";
      }
    });
  }
}
