export function throttle(callback, wait = 120) {
  let lastRun = 0;
  let timeoutId = 0;
  let lastArgs = [];

  return (...args) => {
    const now = Date.now();
    lastArgs = args;
    const remaining = wait - (now - lastRun);

    if (remaining <= 0) {
      lastRun = now;
      callback(...lastArgs);
      return;
    }

    globalThis.clearTimeout(timeoutId);
    timeoutId = globalThis.setTimeout(() => {
      lastRun = Date.now();
      callback(...lastArgs);
    }, remaining);
  };
}

export function idle(callback, timeout = 180) {
  if (typeof globalThis.requestIdleCallback === "function") {
    return globalThis.requestIdleCallback(callback, {
      timeout
    });
  }

  return globalThis.setTimeout(callback, timeout);
}

export function cancelIdle(token) {
  if (typeof globalThis.cancelIdleCallback === "function") {
    globalThis.cancelIdleCallback(token);
    return;
  }

  globalThis.clearTimeout(token);
}
