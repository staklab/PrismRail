export const STORAGE_KEY = "context-trail-settings";

export const PERFORMANCE_MODES = {
  BALANCED: "balanced",
  FOCUS: "focus"
};

export const SITE_NAMES = {
  CHATGPT: "chatgpt",
  GEMINI: "gemini",
  CLAUDE: "claude",
  UNKNOWN: "unknown"
};

export const DEFAULT_SETTINGS = {
  enabled: true,
  previewEnabled: true,
  performanceMode: PERFORMANCE_MODES.BALANCED,
  collapsed: false,
  mobileDrawer: true,
  minParkHeight: 220,
  previewLength: 72,
  desktopOffset: 22,
  compactNodeThreshold: 40
};
