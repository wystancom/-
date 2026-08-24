(function () {
  "use strict";

  function hashNoise(seed, index) {
    let value = (seed + Math.imul(index + 1, 0x9e3779b1)) >>> 0;
    value ^= value >>> 16;
    value = Math.imul(value, 0x7feb352d);
    value ^= value >>> 15;
    return (value >>> 0) / 4294967296;
  }

  function points(platform, center, radius, yOffset) {
    const result = [];
    const count = platform.vertexCount || 7;
    for (let index = 0; index < count; index += 1) {
      const angle = -Math.PI / 2 + (platform.rotation || 0) + (index / count) * Math.PI * 2;
      const irregular = 0.84 + hashNoise(platform.shapeSeed, index) * 0.25;
      result.push({
        x: center.x + Math.cos(angle) * radius * irregular * (platform.shapeX || 1),
        y: center.y + Math.sin(angle) * radius * irregular * (platform.shapeY || 1) + (yOffset || 0)
      });
    }
    return result;
  }

  function onEdge(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) return Math.hypot(point.x - start.x, point.y - start.y) <= 0.5;
    const projection = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
    return Math.hypot(point.x - (start.x + projection * dx), point.y - (start.y + projection * dy)) <= 0.5;
  }

  function platformType(platform) {
    if (platform.materialType) return platform.materialType;
    if (platform.kind === "boost") return "boba";
    if (platform.kind === "cushion") return "foam";
    if (platform.kind === "drift") return "lemon";
    if (platform.kind === "fragile") return "pudding";
    if (platform.tier === "safe") return "ice";
    if (platform.tier === "medium") return ((platform.shapeSeed >>> 0) & 1) ? "lemon" : "pudding";
    return "boba";
  }

  function containsPlatform(platform, x, y) {
    // Hand-painted top-view collision silhouettes:
    // ice = rounded square; pudding/lemon/foam/boba = ellipse.
    // The shadow center only needs to be inside or on the visible food edge.
    // A foot/body radius is intentionally not subtracted from the platform.
    const type = platformType(platform);
    const dx = x - platform.x;
    const dy = y - platform.y;
    if (type === "ice") {
      const rx = platform.radius;
      const ry = platform.radius;
      return Math.pow(Math.abs(dx) / Math.max(1, rx), 4) + Math.pow(Math.abs(dy) / Math.max(1, ry), 4) <= 1;
    }
    const rx = platform.radius * (type === "foam" ? 1.08 : type === "boba" ? 0.92 : 1);
    const ry = platform.radius * (type === "foam" ? 0.76 : type === "boba" ? 0.92 : 1);
    return (dx * dx) / Math.max(1, rx * rx) + (dy * dy) / Math.max(1, ry * ry) <= 1;
  }

  function containsPolygon(platform, x, y) {
    const polygon = points(platform, { x: platform.x, y: platform.y }, platform.radius, 0);
    const point = { x, y };
    let inside = false;
    for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
      const a = polygon[previous];
      const b = polygon[index];
      if (onEdge(point, a, b)) return true;
      if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  }

  window.BounceGeometry = Object.freeze({ points, containsPlatform, containsPolygon, platformType });
}());
