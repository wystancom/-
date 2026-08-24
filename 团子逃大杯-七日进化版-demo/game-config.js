(function () {
  "use strict";
  const physics = Object.freeze({
    fixedStep: 1 / 120,
    cameraHeight: 30,
    cameraNear: 9,
    cameraNearFade: 11,
    cameraFar: 126,
    cameraFarFade: 26,
    moveDrag: 4.2,
    adSeconds: 2.6,
    recoveryFallLayers: 4,
    severeFallLayers: 8,
    maxPlatforms: 240
  });
  const phaseLabels = Object.freeze({
    READY: "气泡蓄力",
    LANDED: "贴住配料 · 立即回弹",
    RISING: "上浮 · 穿过配料层",
    FALLING: "回落 · 对准甜点",
    GAME_OVER: "沉回杯底"
  });
  window.BounceGameConfig = Object.freeze({ physics, phaseLabels });
}());
