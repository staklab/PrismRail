import { DEFAULT_SETTINGS, STORAGE_KEY } from "./constants.js";
import { addStorageListener, storageGet, storageSet } from "./browser.js";

export async function readSettings() {
  const result = await storageGet(STORAGE_KEY);
  return {
    ...DEFAULT_SETTINGS,
    ...(result?.[STORAGE_KEY] ?? {})
  };
}

export async function writeSettings(partial) {
  const current = await readSettings();
  const next = {
    ...current,
    ...partial
  };

  await storageSet({
    [STORAGE_KEY]: next
  });

  return next;
}

export function subscribeSettings(callback) {
  return addStorageListener((changes, areaName) => {
    if (areaName !== "local" || !changes?.[STORAGE_KEY]) {
      return;
    }

    callback({
      ...DEFAULT_SETTINGS,
      ...(changes[STORAGE_KEY].newValue ?? {})
    });
  });
}
