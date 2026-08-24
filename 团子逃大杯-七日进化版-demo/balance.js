(function () {
  "use strict";

  const TIERS = Object.freeze([
    { id: "safe", label: "冰", gain: 1, color: "#a9deda", startRadius: 98, endRadius: 84, startDistance: 136, endDistance: 148 },
    { id: "medium", label: "甜", gain: 2, color: "#f0c86f", startRadius: 90, endRadius: 76, startDistance: 146, endDistance: 160 },
    { id: "risk", label: "爆", gain: 3, color: "#ad74ac", startRadius: 76, endRadius: 66, startDistance: 160, endDistance: 172 },
    { id: "bonus", label: "狂", gain: 4, color: "#f1a85d", startRadius: 62, endRadius: 60, startDistance: 176, endDistance: 178 }
  ]);

  const ZONES = Object.freeze([
    { id: "classic", icon: "○", name: "大杯热身", hint: "大落点练预判", countBonus: 0, platformScale: 1, windForce: 0 },
    { id: "swirl", icon: "↻", name: "杯壁旋流", hint: "轻微侧流＋漂移柠檬", countBonus: 0, platformScale: 1.02, windForce: 82 },
    { id: "relay", icon: "∞", name: "奶盖连跳", hint: "更多配料组成双圈路线", countBonus: 1, platformScale: 1.05, windForce: 0 },
    { id: "fizz", icon: "✦", name: "爆珠狂欢", hint: "+4 狂欢落点与真假果冻", countBonus: 1, platformScale: 1.02, windForce: 0 }
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function smoothstep01(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function zoneFor(level) {
    const currentLevel = Math.max(0, Math.floor(Number(level) || 0));
    const segment = Math.floor(currentLevel / 30);
    return { ...ZONES[segment % ZONES.length], segment, from: segment * 30, to: segment * 30 + 29 };
  }

  function profileFor(level) {
    const currentLevel = Math.max(0, Number(level) || 0);
    const progress = clamp(currentLevel / 120, 0, 1);
    const difficulty = smoothstep01(progress);
    const zone = zoneFor(currentLevel);
    const gravity = lerp(230, 520, difficulty);
    const fallScale = lerp(0.83, 0.86, difficulty);
    const floorStep = lerp(30, 42, difficulty);
    const plannedMaxGain = currentLevel < 10 ? 2 : 3;
    const apexClearance = lerp(20, 12, difficulty);
    const apexHeight = floorStep * plannedMaxGain + apexClearance;
    const impulse = Math.sqrt(2 * gravity * apexHeight);
    const tiers = {};

    TIERS.forEach((tier) => {
      tiers[tier.id] = {
        radius: lerp(tier.startRadius, tier.endRadius, difficulty) * zone.platformScale,
        distance: lerp(tier.startDistance, tier.endDistance, difficulty)
      };
    });

    return {
      sourceLevel: currentLevel,
      progress,
      difficulty,
      zone,
      gravity,
      impulse,
      fallGravity: gravity * fallScale,
      apexHeight,
      apexClearance,
      plannedMaxGain,
      ascentSeconds: impulse / gravity,
      moveAcceleration: lerp(960, 1480, difficulty),
      maxMoveSpeed: lerp(225, 305, difficulty),
      risingControl: lerp(0.68, 0.54, difficulty),
      floorStep,
      settleTime: 0,
      tiers
    };
  }

  function altitudeForLevel(level) {
    const target = Math.trunc(Number(level) || 0);
    if (target <= 0) return target * profileFor(0).floorStep;
    let altitude = 0;
    for (let current = 0; current < target; current += 1) altitude += profileFor(current).floorStep;
    return altitude;
  }

  function levelForAltitude(altitude) {
    const target = Number(altitude) || 0;
    if (target <= 0) return Math.max(0, Math.round(target / profileFor(0).floorStep));
    let lower = 0;
    for (let level = 1; level <= 999; level += 1) {
      const upper = lower + profileFor(level - 1).floorStep;
      if (target <= upper) return target - lower < upper - target ? level - 1 : level;
      lower = upper;
    }
    return 999;
  }

  window.BounceBalance = Object.freeze({ tiers: TIERS, zones: ZONES, zoneFor, profileFor, altitudeForLevel, levelForAltitude });
}());
