(async () => {
  try {
    const url = chrome.runtime.getURL("src/content/app.js");
    const module = await import(url);
    await module.start();
  } catch (error) {
    console.error("[PrismRail] bootstrap failed", error);
  }
})();
