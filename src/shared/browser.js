export function getExtensionApi() {
  return globalThis.browser ?? globalThis.chrome ?? null;
}

function usesPromiseApi(storageArea) {
  return typeof storageArea?.get === "function" && storageArea.get.length <= 1;
}

export function promisifyChromeCall(area, method, payload) {
  return new Promise((resolve, reject) => {
    area[method](payload, (result) => {
      const runtime = globalThis.chrome?.runtime;
      if (runtime?.lastError) {
        reject(new Error(runtime.lastError.message));
        return;
      }

      resolve(result);
    });
  });
}

export async function storageGet(keys) {
  const api = getExtensionApi();
  if (!api?.storage?.local) {
    return {};
  }

  if (usesPromiseApi(api.storage.local)) {
    return api.storage.local.get(keys);
  }

  return promisifyChromeCall(api.storage.local, "get", keys);
}

export async function storageSet(value) {
  const api = getExtensionApi();
  if (!api?.storage?.local) {
    return;
  }

  if (usesPromiseApi(api.storage.local)) {
    await api.storage.local.set(value);
    return;
  }

  await promisifyChromeCall(api.storage.local, "set", value);
}

export function addStorageListener(listener) {
  const api = getExtensionApi();
  api?.storage?.onChanged?.addListener(listener);
  return () => api?.storage?.onChanged?.removeListener?.(listener);
}
