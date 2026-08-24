(function () {
  "use strict";

  const thresholds = Object.freeze([8, 26, 44, 62, 80, 98, 116]);
  const catalog = Object.freeze({
    spring: {
      id: "spring", icon: "●", name: "爆爆珠", short: "气泡更猛",
      description: "接下来 2 跳的峰值高度提高 10%。", duration: 2, category: "risk"
    },
    feather: {
      id: "feather", icon: "☁", name: "奶盖托举", short: "回落更慢",
      description: "接下来 3 跳的下落重力降低 15%。", duration: 3, category: "assist"
    },
    magnet: {
      id: "magnet", icon: "⌁", name: "吸管牵引", short: "配料牵引",
      description: "接下来 3 跳在回落时获得轻微配料牵引。", duration: 3, category: "assist"
    },
    wide: {
      id: "wide", icon: "▰", name: "超大杯盖", short: "平台变宽",
      description: "接下来 3 跳的新平台半径 +12%，面积约 +25%。", duration: 3, category: "assist"
    },
    turbo: {
      id: "turbo", icon: "»", name: "吸管涡轮", short: "横移加速",
      description: "接下来 3 跳的横移速度和加速度提高 12%。", duration: 3, category: "control"
    },
    rain: {
      id: "rain", icon: "✦", name: "珍珠雨", short: "多一个落点",
      description: "接下来 2 跳必定刷新一个高收益爆珠平台。", duration: 2, category: "fun"
    },
    reverse: {
      id: "reverse", icon: "↔", name: "吸管喝反了", short: "方向反转",
      description: "接下来 2 跳方向反转；踩稳后糖晶 ×1.5。", duration: 2, category: "fun"
    }
  });

  window.BounceSkillCatalog = Object.freeze({ catalog, thresholds });
}());
