import { SITE_NAMES } from "../../shared/constants.js";
import { buildMessageId } from "../../shared/uid.js";
import { buildLocalSummary, normalizeText } from "../../shared/text.js";
import {
  compareDocumentPosition,
  filterTopLevelCandidates,
  isVisible,
  queryAll,
  queryFirst,
  smoothScrollTo
} from "../shared/dom.js";

export class BaseAdapter {
  constructor(config) {
    this.site = config.site ?? SITE_NAMES.UNKNOWN;
    this.hostnames = config.hostnames ?? [];
    this.rootSelectors = config.rootSelectors ?? ["main"];
    this.messageSelectors = config.messageSelectors ?? [];
    this.fallbackSelectors = config.fallbackSelectors ?? [
      "[data-context-trail-id]",
      "[data-testid*='message']",
      "[class*='message']",
      "[class*='response']",
      "article",
      "section"
    ];
    this.resolveRole = config.resolveRole ?? (() => "assistant");
  }

  detect(location = globalThis.location) {
    return this.hostnames.some((hostname) => location.hostname.includes(hostname));
  }

  getConversationRoot() {
    return queryFirst(this.rootSelectors) ?? document.body;
  }

  getMessageNodes() {
    const root = this.getConversationRoot();
    const preferred = filterTopLevelCandidates(queryAll(this.messageSelectors, root));
    const selected = preferred.length >= 2
      ? preferred
      : filterTopLevelCandidates(queryAll(this.fallbackSelectors, root));

    return selected
      .filter((element) => isVisible(element) && normalizeText(element.innerText).length > 8)
      .sort(compareDocumentPosition);
  }

  extractMessage(node, order) {
    const text = normalizeText(node.innerText || node.textContent || "");
    if (!text) {
      return null;
    }

    const role = this.resolveRole(node, order);
    const id = node.dataset.contextTrailId || buildMessageId(this.site, role, order, text);
    const summary = buildLocalSummary(text, 72);
    node.dataset.contextTrailId = id;
    node.dataset.contextTrailRole = role;

    return {
      id,
      site: this.site,
      order,
      role,
      text,
      preview: summary.preview,
      keywords: summary.keywords,
      badge: summary.badge,
      element: node
    };
  }

  collectMessages() {
    return this.getMessageNodes()
      .map((node, order) => this.extractMessage(node, order))
      .filter(Boolean);
  }

  observeChanges(callback) {
    const root = this.getConversationRoot();
    const observer = new MutationObserver((entries) => {
      const relevant = entries.some((entry) => entry.addedNodes.length || entry.removedNodes.length);
      if (relevant) {
        callback();
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }

  jumpToMessage(item) {
    if (!item?.element?.isConnected) {
      return false;
    }

    smoothScrollTo(item.element);
    item.element.classList.add("ctn-jump-target");
    globalThis.setTimeout(() => item.element?.classList.remove("ctn-jump-target"), 1600);
    return true;
  }
}
