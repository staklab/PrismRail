const app = globalThis.__LLMThreadNavigator;
const extensionApi = globalThis.browser || globalThis.chrome;

app.storage = {
  loadSettings() {
    return new Promise((resolve) => {
      extensionApi.storage.sync.get(app.defaults, (items) => {
        resolve({
          ...app.defaults,
          ...items
        });
      });
    });
  }
};
