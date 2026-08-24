(function () {
  "use strict";
  function createStars(count) {
    let seed = 0x51273;
    const result = [];
    for (let index = 0; index < count; index += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const x = seed / 4294967296;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const y = seed / 4294967296;
      result.push({ x, y, r: 0.5 + ((seed >>> 9) % 10) / 10, a: 0.18 + ((seed >>> 17) % 36) / 100 });
    }
    return result;
  }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function length(x, y) { return Math.hypot(x, y); }
  function safeStorageGet(key, fallback) {
    try {
      const value = Number(localStorage.getItem(key));
      return Number.isFinite(value) ? value : fallback;
    } catch (_error) { return fallback; }
  }
  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (_error) { /* Storage is optional. */ }
  }
  function shuffle(values, random) {
    const result = values.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }
  function tracePolygon(ctx, points) {
    ctx.beginPath();
    points.forEach((point, index) => index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
    ctx.closePath();
  }
  window.BounceUtils = Object.freeze({ createStars, clamp, length, safeStorageGet, safeStorageSet, shuffle, tracePolygon });
}());
