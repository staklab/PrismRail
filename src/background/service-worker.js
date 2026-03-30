import { DEFAULT_SETTINGS, STORAGE_KEY } from "../shared/constants.js";
import { storageGet, storageSet } from "../shared/browser.js";

chrome.runtime.onInstalled.addListener(async () => {
  const current = await storageGet(STORAGE_KEY);
  if (current?.[STORAGE_KEY]) {
    return;
  }

  await storageSet({
    [STORAGE_KEY]: DEFAULT_SETTINGS
  });
});
