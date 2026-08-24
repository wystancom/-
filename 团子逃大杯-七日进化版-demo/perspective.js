(function () {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep01(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function project(platform, player, view, config) {
    const cameraZ = player.z + config.cameraHeight;
    const depth = cameraZ - platform.altitude;
    if (depth <= config.cameraNear) {
      return { visible: false, depth, scale: 0, alpha: 0, x: 0, y: 0 };
    }

    const scale = config.cameraHeight / depth;
    const nearAlpha = smoothstep01((depth - config.cameraNear) / config.cameraNearFade);
    const farFadeStart = config.cameraFar - config.cameraFarFade;
    const farAlpha = 1 - smoothstep01((depth - farFadeStart) / config.cameraFarFade);
    const alpha = nearAlpha * farAlpha;

    return {
      visible: alpha > 0.002,
      depth,
      scale,
      alpha,
      x: view.anchorX + (platform.x - player.x) * scale,
      y: view.anchorY + (platform.y - player.y) * scale
    };
  }

  window.BouncePerspective = Object.freeze({ project, smoothstep01 });
}());
