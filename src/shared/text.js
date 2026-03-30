const EN_STOPWORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "been",
  "being",
  "between",
  "could",
  "from",
  "have",
  "into",
  "just",
  "more",
  "only",
  "over",
  "should",
  "some",
  "such",
  "than",
  "that",
  "their",
  "there",
  "these",
  "they",
  "this",
  "those",
  "very",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
  "your"
]);

const ZH_STOPWORDS = new Set([
  "我们",
  "你们",
  "这是",
  "那个",
  "这个",
  "然后",
  "如果",
  "因为",
  "所以",
  "或者",
  "可以",
  "需要",
  "已经",
  "进行",
  "以及",
  "一个",
  "一下"
]);

export function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/\u200b/g, "")
    .trim();
}

export function splitSentences(text) {
  return normalizeText(text)
    .split(/(?<=[。！？.!?])\s+/u)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function truncate(text, maxLength = 72) {
  const normalized = normalizeText(text);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

export function extractKeywords(text, limit = 4) {
  const normalized = normalizeText(text);
  const counts = new Map();
  const hasHan = /[\p{Script=Han}]/u.test(normalized);
  const matcher = hasHan
    ? normalized.match(/[\p{Script=Han}]{2,8}/gu) ?? []
    : normalized.match(/[A-Za-z][A-Za-z0-9-]{2,}/g) ?? [];

  for (const token of matcher) {
    const lower = token.toLowerCase();
    const blocked = hasHan ? ZH_STOPWORDS.has(lower) : EN_STOPWORDS.has(lower);
    if (blocked) {
      continue;
    }

    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return right[0].length - left[0].length;
    })
    .slice(0, limit)
    .map(([token]) => token);
}

export function buildPreview(text, maxLength = 72) {
  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    return "This part of the conversation has no preview text yet.";
  }

  return truncate(sentences[0], maxLength);
}

export function buildLocalSummary(text, maxLength = 72) {
  const preview = buildPreview(text, maxLength);
  const keywords = extractKeywords(text, 3);
  return {
    preview,
    keywords,
    badge: inferBadge(text)
  };
}

export function inferBadge(text) {
  const normalized = normalizeText(text).toLowerCase();
  if (!normalized) {
    return "empty";
  }

  if (normalized.includes("```") || normalized.includes("function") || normalized.includes("const ")) {
    return "code";
  }

  if (/\d+\.\s/.test(normalized) || normalized.includes("step")) {
    return "steps";
  }

  if (normalized.includes("?") || normalized.includes("吗") || normalized.includes("如何")) {
    return "question";
  }

  return "note";
}
