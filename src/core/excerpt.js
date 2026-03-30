const app = globalThis.__LLMThreadNavigator;

app.excerpt = {
  make(text, maxLength) {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (!normalized) {
      return "点击跳转到此消息";
    }

    const punctuationIndex = normalized.search(/[。！？.!?]/);
    if (punctuationIndex >= 0) {
      const firstSentence = normalized.slice(0, punctuationIndex + 1).trim();
      if (firstSentence.length <= maxLength) {
        return firstSentence;
      }
    }

    if (normalized.length <= maxLength) {
      return normalized;
    }

    return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
  },

  label(role, index) {
    const short = role === "assistant" ? "A" : role === "user" ? "U" : "S";
    return `${short}${index + 1}`;
  }
};
