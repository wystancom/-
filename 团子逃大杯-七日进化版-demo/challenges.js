(function () {
  "use strict";

  const PALETTES = Object.freeze({
    normal: ["#a9deda", "#c8e7de", "#efcf86", "#f4ddaa"],
    cushion: ["#fff1cf", "#f5dfc3", "#f9e8d5"],
    boost: ["#8f6683", "#6f506f", "#ad78a4"],
    drift: ["#f2c950", "#e5d967", "#c9d982"],
    fragile: ["#d89761", "#c77555", "#e0aa72"],
    phase: ["#ba8dbc", "#caa1c8", "#a87bad"]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pickWeighted(random, entries) {
    const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = random() * total;
    for (const entry of entries) {
      roll -= entry.weight;
      if (roll <= 0) return entry.value;
    }
    return entries[entries.length - 1].value;
  }

  function rulesFor(level, zoneId) {
    if (level < 10) return { counts: [2, 3], kinds: { normal: 8, cushion: 2 }, budget: 0 };
    if (level < 30) return { counts: [3, 3, 4], kinds: { normal: 62, cushion: 22, boost: 16 }, budget: 1.2 };
    if (level < 60) return { counts: [3, 4], kinds: { normal: 48, cushion: 15, boost: 12, drift: 25 }, budget: 2.2 };
    if (level < 80) return { counts: [3, 4], kinds: { normal: 43, cushion: 28, boost: 21, drift: 8 }, budget: 2.2 };
    if (level < 90) return { counts: [3, 4], kinds: { normal: 42, cushion: 20, boost: 14, drift: 8, fragile: 16 }, budget: 2.6 };
    if (level < 100) return { counts: [3, 4], kinds: { normal: 42, cushion: 14, boost: 27, drift: 10, fragile: 7 }, budget: 2.8 };
    if (level < 110) return { counts: [3, 4], kinds: { normal: 40, cushion: 16, boost: 20, drift: 8, fragile: 6, phase: 10 }, budget: 3.2 };
    if (zoneId === "fizz") return { counts: [3, 4], kinds: { normal: 38, cushion: 14, boost: 22, drift: 10, fragile: 8, phase: 8 }, budget: 3.2 };
    return { counts: [3, 4], kinds: { normal: 48, cushion: 18, boost: 16, drift: 10, fragile: 6, phase: 2 }, budget: 2.8 };
  }

  function chooseKind(random, rules, usedBudget, phaseUsed, count) {
    const costs = { normal: 0, cushion: 0, boost: 0.5, drift: 1, fragile: 1, phase: 2 };
    const entries = Object.entries(rules.kinds)
      .filter(([kind]) => usedBudget + costs[kind] <= rules.budget)
      .filter(([kind]) => kind !== "phase" || (!phaseUsed && count > 2))
      .map(([value, weight]) => ({ value, weight }));
    return pickWeighted(random, entries.length ? entries : [{ value: "normal", weight: 1 }]);
  }

  function chooseMotif(options, random) {
    if (options.recovery) return "recovery";
    if (options.jumpIndex <= 1) return "duo";
    const level = options.level;
    const pool = level < 10 ? ["duo", "stair", "cushion"]
      : level < 30 ? ["stair", "fan", "order", "duo"]
        : level < 60 ? ["drift", "fan", "order", "stair"]
          : level < 80 ? ["insurance", "cushion", "order", "constellation"]
            : level < 90 ? ["insurance", "fragile", "order", "fan"]
              : level < 100 ? ["boost", "fan", "order", "constellation"]
                : level < 110 ? ["phase", "order", "fan", "insurance"]
                  : ["insurance", "order", "fragile", "phase", "constellation"];
    const choices = pool.filter((motif) => motif !== options.lastMotif);
    return choices[Math.floor(random() * choices.length)];
  }

  function planJump(options) {
    const { level, profile, random, heading, originRadius, availableTiers } = options;
    const rules = options.recovery
      ? { counts: [2, 3], kinds: { normal: 7, cushion: 3 }, budget: 0 }
      : rulesFor(level, profile.zone.id);
    const bonusActive = Boolean(options.extraBonus && !options.recovery);
    const motif = chooseMotif(options, random);
    const tierPool = level < 10 ? availableTiers.filter((tier) => tier.gain <= 2) : availableTiers;
    let count = rules.counts[Math.floor(random() * rules.counts.length)];
    if (motif === "duo") count = 2;
    if (motif === "stair") count = 3;
    if (motif === "constellation") count = 4;
    count = clamp(count + profile.zone.countBonus + (bonusActive ? 1 : 0), 2, 5);
    if (count === options.lastCount && rules.counts.some((value) => value !== count)) {
      count = rules.counts.find((value) => value !== count) || count;
    }
    let mainAngle = heading + (random() * 2 - 1) * Math.PI;
    if (Number.isFinite(options.lastAngle) && Math.abs(Math.atan2(Math.sin(mainAngle - options.lastAngle), Math.cos(mainAngle - options.lastAngle))) < 0.7) {
      mainAngle += Math.PI * (random() < 0.5 ? -0.55 : 0.55);
    }

    const reliableTier = availableTiers.slice().sort((a, b) => a.gain - b.gain)[0];
    const ceilingTier = tierPool.slice().sort((a, b) => b.gain - a.gain)[0] || reliableTier;
    const specs = [];
    let usedBudget = 0;
    let phaseUsed = false;
    const costs = { normal: 0, cushion: 0, boost: 0.5, drift: 1, fragile: 1, phase: 2 };
    const bonusIndex = bonusActive ? count - 1 : -1;

    for (let index = 0; index < count; index += 1) {
      const tier = index === bonusIndex
        ? ceilingTier
        : index === 0
        ? reliableTier
        : index === 1
          ? ceilingTier
        : tierPool[Math.floor(random() * tierPool.length)];
      const forcedKinds = { cushion: "cushion", boost: "boost", drift: "drift", fragile: "fragile", phase: "phase" };
      const kind = index === bonusIndex
        ? "boost"
        : index === 0 || (options.jumpIndex <= 1 && index === 1)
        ? "normal"
        : index === 1 && forcedKinds[motif] ? forcedKinds[motif] : chooseKind(random, rules, usedBudget, phaseUsed, count);
      usedBudget += costs[kind];
      if (kind === "phase") phaseUsed = true;
      const tuning = profile.tiers[tier.id];
      const difficulty = profile.difficulty;
      const sizeVariance = (0.97 - difficulty * 0.04) + random() * (0.1 + difficulty * 0.03);
      const kindScale = kind === "cushion" ? 1.14 : kind === "drift" ? 1.08 : kind === "phase" ? 1.1 : 1;
      const radius = tuning.radius * sizeVariance * kindScale * (options.recovery ? 1.12 : 1) * (options.widePlatforms ? 1.12 : 1) * (index === bonusIndex ? 0.94 : 1);
      let distance = Math.max(
        originRadius * 0.45 + radius * 0.78 + 12 + difficulty * 5,
        tuning.distance * (options.recovery ? 0.88 : 0.88 + random() * 0.2)
      );
      let angle = index === 0 ? mainAngle : heading + (random() * 2 - 1) * Math.PI;
      let x = Math.cos(angle) * distance;
      let y = Math.sin(angle) * distance;
      for (let attempt = 0; attempt < 384 && specs.some((spec) => Math.hypot(x - spec.localX, y - spec.localY) < radius + spec.radius + 12); attempt += 1) {
        if (attempt > 0 && attempt % 96 === 0) distance += 8;
        angle = mainAngle + (random() * 2 - 1) * Math.PI;
        x = Math.cos(angle) * distance;
        y = Math.sin(angle) * distance;
      }
      if (specs.some((spec) => Math.hypot(x - spec.localX, y - spec.localY) < radius + spec.radius + 12)) continue;

      const palette = PALETTES[kind];
      const amplitude = kind === "drift" ? (8 + difficulty * 18) * (0.8 + random() * 0.4) : 0;
      specs.push({
        tierId: tier.id,
        kind,
        radius,
        angle,
        distance,
        localX: x,
        localY: y,
        color: palette[Math.floor(random() * palette.length)],
        vertexCount: kind === "cushion" ? 8 + Math.floor(random() * 3) : 5 + Math.floor(random() * 5),
        rotation: random() * Math.PI * 2,
        shapeX: 0.86 + random() * 0.28,
        shapeY: 0.86 + random() * 0.28,
        motionAxis: random() * Math.PI * 2,
        motionAmplitude: amplitude,
        motionSpeed: kind === "drift" ? 0.75 + random() * 0.55 : 0,
        motionPhase: random() * Math.PI * 2,
        phaseSolidTime: 1.45 + random() * 0.35,
        phaseGhostTime: 0.58 + random() * 0.16,
        phaseOffset: random() * 2.2,
        materialType: null,
        scoreMultiplier: kind === "phase" ? 1.35 : kind === "fragile" ? 1.22 : kind === "drift" ? 1.12 : kind === "boost" ? 1.08 : 1
      });
    }
    if (motif === "insurance" && specs.length >= 2) {
      const low = specs[0];
      const high = specs[1];
      high.localX = low.localX;
      high.localY = low.localY;
      high.angle = low.angle;
      high.distance = low.distance;
      high.radius = Math.min(high.radius, low.radius * 0.68);
      high.kind = "normal";
      high.motionAmplitude = 0;
      high.motionSpeed = 0;
    }
    if (options.orderTarget && specs.length >= 2) {
      const featured = specs[1];
      featured.materialType = options.orderTarget;
    }
    if (bonusActive && !specs.some((spec) => spec.kind === "boost" && spec.tierId === ceilingTier.id)) {
      const fallback = specs[specs.length - 1];
      if (fallback && specs.length >= 2) {
        const bonusRadius = profile.tiers[ceilingTier.id].radius * 0.94 * (options.widePlatforms ? 1.12 : 1);
        fallback.tierId = ceilingTier.id;
        fallback.kind = "boost";
        fallback.radius = Math.min(fallback.radius, bonusRadius);
        fallback.color = PALETTES.boost[Math.floor(random() * PALETTES.boost.length)];
        fallback.motionAmplitude = 0;
        fallback.motionSpeed = 0;
        fallback.scoreMultiplier = 1.08;
      }
    }
    return { specs, count: specs.length, mainAngle, motif, zoneId: profile.zone.id };
  }

  function phaseSolid(platform, time) {
    if (platform.kind !== "phase") return true;
    if (platform.phaseLocked !== null && platform.phaseLocked !== undefined) return platform.phaseLocked;
    const solid = platform.phaseSolidTime || 1.6;
    const ghost = platform.phaseGhostTime || 0.65;
    const position = ((time + (platform.phaseOffset || 0)) % (solid + ghost) + solid + ghost) % (solid + ghost);
    return position < solid;
  }

  function positionAt(platform, time) {
    if (platform.kind !== "drift") return { x: platform.baseX, y: platform.baseY };
    const offset = Math.sin(time * platform.motionSpeed + platform.motionPhase) * platform.motionAmplitude;
    return {
      x: platform.baseX + Math.cos(platform.motionAxis) * offset,
      y: platform.baseY + Math.sin(platform.motionAxis) * offset
    };
  }

  function visualFor(platform, time) {
    const solid = phaseSolid(platform, time);
    const icons = { normal: "", cushion: "软", boost: "爆", drift: "柠", fragile: "裂", phase: solid ? "实" : "虚" };
    return { solid, icon: icons[platform.kind] || "", alpha: platform.kind === "phase" && !solid ? 0.42 : 1, dashed: platform.kind === "phase" };
  }

  function hintFor(platforms) {
    const hints = { cushion: "软：奶盖让下一跳更低更稳", boost: "爆：爆爆珠让下一跳更高", drift: "柠：柠檬片会漂移", fragile: "裂：焦糖布丁踩过会碎", phase: "实/虚：透明果冻会穿透" };
    const active = [...new Set(platforms.map((platform) => hints[platform.kind]).filter(Boolean))];
    return active.slice(0, 2).join(" · ");
  }

  function motifHint(motif) {
    const hints = {
      order: "订单追光：目标配料保证出现在本跳",
      insurance: "双层保险：小高台下面藏着大接救台",
      drift: "扇形风路：顺着侧流提前选边",
      fragile: "布丁捷径：高收益，但踩过就会碎",
      phase: "果冻节拍：真假平台只作为可选支路",
      constellation: "配料星座：先想好下一跳方向"
    };
    return hints[motif] || "";
  }

  window.BounceChallenges = Object.freeze({ planJump, rulesFor, phaseSolid, positionAt, visualFor, hintFor, motifHint });
}());
