import { PERFORMANCE_MODES } from "../shared/constants.js";
import { readSettings, writeSettings } from "../shared/settings.js";

const form = {
  enabled: document.querySelector("#enabled"),
  previewEnabled: document.querySelector("#previewEnabled"),
  performanceMode: document.querySelector("#performanceMode"),
  collapsed: document.querySelector("#collapsed")
};

const settings = await readSettings();
form.enabled.checked = settings.enabled;
form.previewEnabled.checked = settings.previewEnabled;
form.performanceMode.value = settings.performanceMode;
form.collapsed.checked = settings.collapsed;

form.enabled.addEventListener("change", () => {
  writeSettings({
    enabled: form.enabled.checked
  });
});

form.previewEnabled.addEventListener("change", () => {
  writeSettings({
    previewEnabled: form.previewEnabled.checked
  });
});

form.collapsed.addEventListener("change", () => {
  writeSettings({
    collapsed: form.collapsed.checked
  });
});

form.performanceMode.addEventListener("change", () => {
  const value = form.performanceMode.value === PERFORMANCE_MODES.FOCUS
    ? PERFORMANCE_MODES.FOCUS
    : PERFORMANCE_MODES.BALANCED;

  writeSettings({
    performanceMode: value
  });
});
