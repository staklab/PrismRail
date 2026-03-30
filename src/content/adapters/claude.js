import { SITE_NAMES } from "../../shared/constants.js";
import { BaseAdapter } from "./base.js";

export class ClaudeAdapter extends BaseAdapter {
  constructor() {
    super({
      site: SITE_NAMES.CLAUDE,
      hostnames: ["claude.ai"],
      rootSelectors: ["main", "[data-testid='conversation']"],
      messageSelectors: [
        "[data-testid*='message']",
        "[class*='font-user-message']",
        "[class*='font-claude-message']",
        "[class*='prose']"
      ],
      resolveRole(node, order) {
        const marker = `${node.getAttribute("data-testid") || ""} ${node.className}`.toLowerCase();
        if (marker.includes("user")) {
          return "user";
        }

        if (marker.includes("assistant") || marker.includes("claude")) {
          return "assistant";
        }

        return order % 2 === 0 ? "user" : "assistant";
      }
    });
  }
}
