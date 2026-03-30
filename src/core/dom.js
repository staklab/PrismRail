const app = globalThis.__LLMThreadNavigator;

app.dom = {
  queryAll(selectors, root = document) {
    const matches = selectors.flatMap((selector) => Array.from(root.querySelectorAll(selector)));
    return app.utils.sortDomNodes(app.utils.uniqueNodes(matches));
  },

  waitFor(condition, { timeout = 12000, interval = 350 } = {}) {
    return new Promise((resolve) => {
      const startedAt = Date.now();
      const tick = () => {
        const value = condition();
        if (value) {
          resolve(value);
          return;
        }
        if (Date.now() - startedAt > timeout) {
          resolve(null);
          return;
        }
        globalThis.setTimeout(tick, interval);
      };
      tick();
    });
  }
};
