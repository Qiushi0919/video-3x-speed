const DEFAULT_SETTINGS = {
  enabled: true,
  speed: 3,
  holdSpeed: 3
};

const enabledToggle = document.querySelector("#enabledToggle");
const speedRange = document.querySelector("#speedRange");
const speedValue = document.querySelector("#speedValue");
const tabOverrideToggle = document.querySelector("#tabOverrideToggle");
const holdSpeedRange = document.querySelector("#holdSpeedRange");
const holdSpeedValue = document.querySelector("#holdSpeedValue");
const statusText = document.querySelector("#statusText");
const presetButtons = [...document.querySelectorAll("[data-speed]")];

let viewState = {
  ...DEFAULT_SETTINGS,
  tabOverrideEnabled: false,
  tabSpeed: DEFAULT_SETTINGS.speed
};

function normalizeSpeed(value, fallback = DEFAULT_SETTINGS.speed) {
  const speed = Number(value);
  if (!Number.isFinite(speed)) return fallback;
  return Math.min(5, Math.max(0.25, Math.round(speed * 4) / 4));
}

function formatSpeed(speed) {
  return `${Number(speed).toFixed(2).replace(/\.00$/, "").replace(/0$/, "")}x`;
}

function normalizeViewState(settings = {}) {
  return {
    enabled: settings.enabled !== false,
    speed: normalizeSpeed(settings.speed, DEFAULT_SETTINGS.speed),
    holdSpeed: normalizeSpeed(settings.holdSpeed, DEFAULT_SETTINGS.holdSpeed),
    tabOverrideEnabled: settings.tabOverrideEnabled === true,
    tabSpeed: normalizeSpeed(settings.tabSpeed, normalizeSpeed(settings.speed, DEFAULT_SETTINGS.speed))
  };
}

function getActiveSpeed(settings = viewState) {
  return settings.tabOverrideEnabled ? settings.tabSpeed : settings.speed;
}

function render(settings) {
  viewState = normalizeViewState(settings);
  const activeSpeed = getActiveSpeed(viewState);

  enabledToggle.checked = viewState.enabled;
  speedRange.value = String(activeSpeed);
  speedValue.value = formatSpeed(activeSpeed);
  tabOverrideToggle.checked = viewState.tabOverrideEnabled;
  holdSpeedRange.value = String(viewState.holdSpeed);
  holdSpeedValue.value = formatSpeed(viewState.holdSpeed);
  statusText.textContent = viewState.enabled
    ? viewState.tabOverrideEnabled ? "Enabled · This tab" : "Enabled"
    : "Paused";

  presetButtons.forEach((button) => {
    button.classList.toggle("active", normalizeSpeed(button.dataset.speed) === activeSpeed);
  });
}

function saveGlobalSettings(settings) {
  const nextSettings = {
    enabled: settings.enabled,
    speed: normalizeSpeed(settings.speed, DEFAULT_SETTINGS.speed),
    holdSpeed: normalizeSpeed(settings.holdSpeed, DEFAULT_SETTINGS.holdSpeed)
  };

  chrome.storage.sync.set(nextSettings);
  applyToActiveTab("VIDEO_3X_APPLY_SETTINGS", nextSettings);
  render({
    ...viewState,
    ...nextSettings
  });
}

function applyToActiveTab(type, settings, onResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (!tabId) return;

    chrome.tabs.sendMessage(tabId, {
      type,
      ...settings
    }).then((response) => {
      if (response && onResponse) {
        onResponse(response);
      }
    }).catch(() => {
      // The tab may be a browser page or may need a refresh before the content script loads.
    });
  });
}

function applyTabOverride(enabled, speed = getActiveSpeed()) {
  const tabSpeed = normalizeSpeed(speed, viewState.speed);
  const nextState = {
    ...viewState,
    tabOverrideEnabled: enabled,
    tabSpeed
  };

  render(nextState);
  applyToActiveTab(
    "VIDEO_3X_APPLY_TAB_OVERRIDE",
    {
      enabled,
      speed: tabSpeed
    },
    (response) => {
      render({
        ...nextState,
        tabOverrideEnabled: response.tabOverrideEnabled,
        tabSpeed: response.tabSpeed
      });
    }
  );
}

function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    render({
      ...viewState,
      ...settings
    });

    applyToActiveTab("VIDEO_3X_GET_SETTINGS", {}, (response) => {
      render({
        ...viewState,
        ...response
      });
    });
  });
}

loadSettings();

enabledToggle.addEventListener("change", () => {
  saveGlobalSettings({
    enabled: enabledToggle.checked,
    speed: viewState.speed,
    holdSpeed: holdSpeedRange.value
  });
});

speedRange.addEventListener("input", () => {
  if (tabOverrideToggle.checked) {
    applyTabOverride(true, speedRange.value);
    return;
  }

  saveGlobalSettings({
    enabled: enabledToggle.checked,
    speed: speedRange.value,
    holdSpeed: viewState.holdSpeed
  });
});

tabOverrideToggle.addEventListener("change", () => {
  applyTabOverride(tabOverrideToggle.checked, speedRange.value);
});

holdSpeedRange.addEventListener("input", () => {
  saveGlobalSettings({
    enabled: enabledToggle.checked,
    speed: viewState.speed,
    holdSpeed: holdSpeedRange.value
  });
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const speed = normalizeSpeed(button.dataset.speed);

    if (tabOverrideToggle.checked) {
      applyTabOverride(true, speed);
      return;
    }

    saveGlobalSettings({
      enabled: enabledToggle.checked,
      speed,
      holdSpeed: viewState.holdSpeed
    });
  });
});
