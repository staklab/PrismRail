const extensionApi = globalThis.browser || globalThis.chrome;

const DEFAULTS = {
  enabled: true,
  messageThreshold: 24,
  previewLength: 96,
  collapseCodeBlocks: true,
  codeBlockHeight: 320
};

extensionApi.runtime.onInstalled.addListener(() => {
  extensionApi.storage.sync.get(DEFAULTS, (items) => {
    extensionApi.storage.sync.set({
      ...DEFAULTS,
      ...items
    });
  });
});
