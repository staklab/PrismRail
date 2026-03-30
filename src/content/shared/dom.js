export function isVisible(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const style = globalThis.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export function compareDocumentPosition(left, right) {
  if (left === right) {
    return 0;
  }

  return left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

export function uniqueElements(elements) {
  return [...new Set(elements)].filter((element) => element instanceof HTMLElement);
}

export function filterTopLevelCandidates(elements) {
  const unique = uniqueElements(elements);

  return unique.filter((candidate) => {
    const nestedCount = unique.filter(
      (other) => other !== candidate && candidate.contains(other)
    ).length;

    return nestedCount < 2;
  });
}

export function queryFirst(selectors, root = document) {
  for (const selector of selectors) {
    const match = root.querySelector(selector);
    if (match) {
      return match;
    }
  }

  return null;
}

export function queryAll(selectors, root = document) {
  const matches = [];
  for (const selector of selectors) {
    matches.push(...root.querySelectorAll(selector));
  }

  return matches;
}

export function smoothScrollTo(element) {
  element?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest"
  });
}

export function isNarrowViewport() {
  return globalThis.matchMedia?.("(max-width: 880px)")?.matches ?? false;
}

export function onReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, {
      once: true
    });
    return;
  }

  callback();
}
