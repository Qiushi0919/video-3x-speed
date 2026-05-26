const DEFAULT_SETTINGS = {
  enabled: true,
  speed: 3,
  holdSpeed: 3
};

const HOLD_KEY = "ArrowRight";
const HOLD_ACTIVATION_DELAY_MS = 280;

const watchedVideos = new WeakSet();
let currentSettings = { ...DEFAULT_SETTINGS };
let tabOverride = {
  enabled: false,
  speed: DEFAULT_SETTINGS.speed
};
let isApplyingRate = false;
let enforceTimer = null;
let holdState = {
  keyDown: false,
  active: false,
  timer: null
};

function normalizeSpeed(value, fallback = DEFAULT_SETTINGS.speed) {
  const speed = Number(value);
  if (!Number.isFinite(speed)) return fallback;
  return Math.min(5, Math.max(0.25, Math.round(speed * 4) / 4));
}

function getTargetRate() {
  if (holdState.active) {
    return normalizeSpeed(currentSettings.holdSpeed, DEFAULT_SETTINGS.holdSpeed);
  }

  if (tabOverride.enabled) {
    return normalizeSpeed(tabOverride.speed, currentSettings.speed);
  }

  return normalizeSpeed(currentSettings.speed, DEFAULT_SETTINGS.speed);
}

function setVideoSpeed(video) {
  if (!(video instanceof HTMLVideoElement)) return;

  if (!currentSettings.enabled) {
    if (video.dataset.video3xManaged === "true") {
      delete video.dataset.video3xManaged;
    }
    return;
  }

  const targetRate = getTargetRate();

  try {
    isApplyingRate = true;
    video.playbackRate = targetRate;
    video.defaultPlaybackRate = targetRate;
    video.dataset.video3xManaged = "true";
  } finally {
    isApplyingRate = false;
  }
}

function syncVideoSpeed(video) {
  if (!(video instanceof HTMLVideoElement)) return;
  if (!currentSettings.enabled) return;

  const targetRate = getTargetRate();
  if (video.playbackRate !== targetRate || video.defaultPlaybackRate !== targetRate) {
    setVideoSpeed(video);
  }
}

function watchVideo(video) {
  if (!(video instanceof HTMLVideoElement)) return;

  if (!watchedVideos.has(video)) {
    watchedVideos.add(video);

    ["loadedmetadata", "play", "playing", "ratechange"].forEach((eventName) => {
      video.addEventListener(eventName, () => {
        if (!isApplyingRate) {
          syncVideoSpeed(video);
        }
      });
    });
  }

  setVideoSpeed(video);
}

function scanVideos(root = document) {
  if (root instanceof HTMLVideoElement) {
    watchVideo(root);
    return;
  }

  root.querySelectorAll?.("video").forEach(watchVideo);
}

function enforceAllVideos() {
  if (!currentSettings.enabled) return;
  document.querySelectorAll("video").forEach((video) => {
    watchVideo(video);
    syncVideoSpeed(video);
  });
}

function startEnforcing() {
  if (enforceTimer) return;
  enforceTimer = window.setInterval(enforceAllVideos, 500);
}

function stopEnforcing() {
  if (!enforceTimer) return;
  window.clearInterval(enforceTimer);
  enforceTimer = null;
}

function clearHoldTimer() {
  if (!holdState.timer) return;
  window.clearTimeout(holdState.timer);
  holdState.timer = null;
}

function activateHoldSpeed() {
  holdState.timer = null;

  if (!holdState.keyDown || holdState.active || !currentSettings.enabled) return;

  holdState.active = true;
  enforceAllVideos();
}

function resetHoldSpeed() {
  const wasActive = holdState.active;

  holdState.keyDown = false;
  holdState.active = false;
  clearHoldTimer();

  if (wasActive) {
    enforceAllVideos();
  }
}

function isEditableTarget(target) {
  if (!(target instanceof Element)) return false;

  const editable = target.closest("input, textarea, select, [contenteditable], [role='textbox']");
  if (!editable) return false;

  return editable.getAttribute("contenteditable") !== "false";
}

function shouldHandleHoldShortcut(event) {
  if (event.key !== HOLD_KEY) return false;
  if (event.ctrlKey || event.altKey || event.metaKey) return false;
  if (event.isComposing) return false;
  return !isEditableTarget(event.target);
}

function handleHoldKeyDown(event) {
  if (!shouldHandleHoldShortcut(event) || !currentSettings.enabled) return;

  if (holdState.active) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (holdState.keyDown) {
    if (event.repeat) {
      clearHoldTimer();
      activateHoldSpeed();

      if (holdState.active) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    return;
  }

  holdState.keyDown = true;
  clearHoldTimer();
  holdState.timer = window.setTimeout(activateHoldSpeed, HOLD_ACTIVATION_DELAY_MS);
}

function handleHoldKeyUp(event) {
  if (event.key !== HOLD_KEY) return;

  resetHoldSpeed();

  if (currentSettings.enabled) {
    window.setTimeout(enforceAllVideos, 0);
  }
}

function installHoldShortcut() {
  window.addEventListener("keydown", handleHoldKeyDown, true);
  window.addEventListener("keyup", handleHoldKeyUp, true);
  window.addEventListener("blur", resetHoldSpeed);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      resetHoldSpeed();
    }
  });
}

function applySettings(settings = {}) {
  const enabled = settings.enabled === undefined ? currentSettings.enabled : settings.enabled !== false;

  currentSettings = {
    enabled,
    speed: normalizeSpeed(settings.speed ?? currentSettings.speed, DEFAULT_SETTINGS.speed),
    holdSpeed: normalizeSpeed(settings.holdSpeed ?? currentSettings.holdSpeed, DEFAULT_SETTINGS.holdSpeed)
  };

  if (!currentSettings.enabled) {
    resetHoldSpeed();
  }

  if (currentSettings.enabled) {
    startEnforcing();
  } else {
    stopEnforcing();
  }

  scanVideos();
  enforceAllVideos();
}

function applyTabOverride(settings = {}) {
  tabOverride = {
    enabled: settings.enabled === true,
    speed: normalizeSpeed(settings.speed ?? tabOverride.speed, currentSettings.speed)
  };

  if (!tabOverride.enabled) {
    resetHoldSpeed();
  }

  scanVideos();
  enforceAllVideos();
}

function getPopupSettings() {
  return {
    enabled: currentSettings.enabled,
    speed: currentSettings.speed,
    holdSpeed: currentSettings.holdSpeed,
    tabOverrideEnabled: tabOverride.enabled,
    tabSpeed: tabOverride.speed,
    effectiveSpeed: getTargetRate()
  };
}

chrome.storage.sync.get(DEFAULT_SETTINGS, applySettings);

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return;

  applySettings({
    enabled: changes.enabled?.newValue,
    speed: changes.speed?.newValue,
    holdSpeed: changes.holdSpeed?.newValue
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "VIDEO_3X_GET_SETTINGS") {
    sendResponse(getPopupSettings());
    return;
  }

  if (message?.type === "VIDEO_3X_APPLY_SETTINGS") {
    applySettings({
      enabled: message.enabled,
      speed: message.speed,
      holdSpeed: message.holdSpeed
    });

    sendResponse(getPopupSettings());
    return;
  }

  if (message?.type === "VIDEO_3X_APPLY_TAB_OVERRIDE") {
    applyTabOverride({
      enabled: message.enabled,
      speed: message.speed
    });

    sendResponse(getPopupSettings());
  }
});

installHoldShortcut();
scanVideos();
startEnforcing();

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      scanVideos(node);
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
