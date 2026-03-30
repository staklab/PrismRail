const extensionApi = globalThis.browser || globalThis.chrome;

const DEFAULTS = {
  enabled: true,
  messageThreshold: 24,
  previewLength: 96,
  collapseCodeBlocks: true,
  codeBlockHeight: 320
};

const form = document.getElementById("settings-form");
const statusNode = document.getElementById("status");

function load() {
  extensionApi.storage.sync.get(DEFAULTS, (items) => {
    document.getElementById("enabled").checked = Boolean(items.enabled);
    document.getElementById("messageThreshold").value = Number(items.messageThreshold);
    document.getElementById("previewLength").value = Number(items.previewLength);
    document.getElementById("collapseCodeBlocks").checked = Boolean(items.collapseCodeBlocks);
    document.getElementById("codeBlockHeight").value = Number(items.codeBlockHeight);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  extensionApi.storage.sync.set(
    {
      enabled: document.getElementById("enabled").checked,
      messageThreshold: Number(document.getElementById("messageThreshold").value),
      previewLength: Number(document.getElementById("previewLength").value),
      collapseCodeBlocks: document.getElementById("collapseCodeBlocks").checked,
      codeBlockHeight: Number(document.getElementById("codeBlockHeight").value)
    },
    () => {
      statusNode.textContent = "设置已保存";
      globalThis.setTimeout(() => {
        statusNode.textContent = "";
      }, 1800);
    }
  );
});

load();
