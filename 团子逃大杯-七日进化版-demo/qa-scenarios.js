(function () {
  "use strict";

  function spawn(name, api) {
    const testMode = api.state().testMode;
    api.resetGame(90210, false);
    const state = api.state();
    state.testMode = testMode;
    api.setOverlay(null);
    state.started = true;
    const zoneScenarioLevel = { zone30: 30, zone60: 60, zone90: 90, zone90bonus: 90, zone120: 120 }[name];
    if (Number.isFinite(zoneScenarioLevel)) {
      const profile = api.balance.profileFor(zoneScenarioLevel);
      const origin = api.createPlatform({
        id: `scenario-zone-${zoneScenarioLevel}`, x: 0, y: 0, level: zoneScenarioLevel,
        tier: "safe", radius: profile.tiers.safe.radius, revealed: true, visited: true
      });
      state.platforms = [origin];
      state.run.maxLevel = zoneScenarioLevel;
      state.run.jumpIndex = name === "zone90bonus" ? 4 : Math.max(3, zoneScenarioLevel);
      state.run.maxConfirmedPlatformId = origin.id;
      state.run.lastZoneSegment = Math.max(0, profile.zone.segment - 1);
      state.player.currentPlatformId = origin.id;
      state.player.x = origin.x; state.player.y = origin.y; state.player.z = origin.altitude;
      api.launchJump();
      api.revealCandidates();
    } else if (name === "safe" || name === "edge") {
      api.launchJump();
      api.revealCandidates();
      const safe = state.candidates.map(api.platformById).find((platform) => platform && platform.tier === "safe");
      safe.revealed = true;
      safe.clearedAbove = true;
      const edge = api.geometry.points(safe, { x: safe.x, y: safe.y }, safe.radius, 0);
      state.player.x = name === "edge" ? (edge[0].x + edge[1].x) / 2 : safe.x;
      state.player.y = name === "edge" ? (edge[0].y + edge[1].y) / 2 : safe.y;
      state.player.z = safe.altitude + 8;
      state.player.vz = -150;
      state.phase = "FALLING";
    } else if (name === "multiFall") {
      state.platforms = [];
      const low = api.createPlatform({ id: "scenario-low", x: 0, y: 0, level: 3, tier: "safe", radius: 58, revealed: true, visited: true });
      const high = api.createPlatform({ id: "scenario-high", x: 170, y: 0, level: 8, tier: "risk", radius: 32, revealed: true, visited: true });
      state.platforms.push(low, high);
      state.run.maxLevel = 8;
      state.run.maxConfirmedPlatformId = high.id;
      state.player.currentPlatformId = high.id;
      state.player.x = 0; state.player.y = 0;
      state.player.z = api.platformAltitude(8) + 15;
      state.player.vz = -210;
      state.player.takeoffZ = api.platformAltitude(8);
      state.player.takeoffLevel = 8;
      state.player.apexRise = 120;
      state.jump.originId = high.id;
      state.jump.originLevel = 8;
      state.jump.highBeforeId = high.id;
      state.jump.profile = api.balance.profileFor(8);
      state.phase = "FALLING";
    } else if (name === "skill") {
      state.run.maxLevel = 5;
      state.run.nextSkillAt = api.skillThresholds[0];
      state.run.skillMilestoneIndex = 0;
      api.openSkillChoice();
    } else if (name === "revive") {
      state.platforms = [];
      const low = api.createPlatform({ id: "scenario-low", x: 0, y: 0, level: 2, tier: "safe", radius: 55, revealed: true, visited: true });
      const high = api.createPlatform({ id: "scenario-high", x: 120, y: -40, level: 8, tier: "risk", radius: 32, revealed: true, visited: true });
      state.platforms.push(low, high);
      state.run.maxLevel = 8;
      state.run.maxConfirmedPlatformId = high.id;
      state.player.currentPlatformId = low.id;
      state.player.x = low.x; state.player.y = low.y; state.player.z = low.altitude;
      state.phase = "LANDED";
      api.openRevive({ reason: "landed", dropped: 6, restorePlatformId: high.id });
    } else if (name === "gameOver" || name === "newRecord") {
      const resultLevel = name === "newRecord" ? state.run.bestBeforeRun + 5 : Math.min(12, state.run.bestBeforeRun);
      state.run.maxLevel = resultLevel;
      state.run.bestLevel = Math.max(state.run.bestBeforeRun, resultLevel);
      state.player.currentPlatformId = null;
      state.player.z = -120;
      api.finishGame();
    } else {
      return false;
    }
    api.updateHud(true);
    api.render();
    return api.getPublicState();
  }

  function assert(api) {
    const state = api.state();
    const errors = [];
    const numeric = [state.player.x, state.player.y, state.player.z, state.player.vx, state.player.vy, state.player.vz];
    if (numeric.some((value) => !Number.isFinite(value))) errors.push("player contains a non-finite number");
    const ids = state.platforms.map((platform) => platform.id);
    if (new Set(ids).size !== ids.length) errors.push("platform ids are not unique");
    if (!api.platformById(state.run.maxConfirmedPlatformId)) errors.push("confirmed high platform is missing");
    if (state.phase === "LANDED" && !api.currentPlatform()) errors.push("LANDED phase has no current platform");
    Object.keys(api.skills).forEach((id) => {
      const remaining = state.skills[id].remaining;
      if (!Number.isInteger(remaining) || remaining < 0) errors.push(`${id} duration is invalid`);
    });
    if (Object.keys(state.skills).length !== Object.keys(api.skills).length) errors.push("skill state does not match skill catalog");
    if (state.ad.status === "success" && !state.ad.used) errors.push("ad reward exists without a consumed ad attempt");
    if (state.metrics.adRewards > 1) errors.push("more than one ad reward was granted in one run");
    const anchor = api.worldToScreen(state.player.x, state.player.y);
    if (Math.abs(anchor.x - api.view.anchorX) > 0.001 || Math.abs(anchor.y - api.view.anchorY) > 0.001) errors.push("player screen anchor drifted");
    if (state.candidates.length) {
      const candidates = state.candidates.map(api.platformById).filter(Boolean);
      if (candidates.length < 2 || candidates.length > 5) errors.push("candidate count is outside 2-5");
      if (!candidates.some((platform) => platform.gain === 1 && platform.kind === "normal")) errors.push("candidate group has no reliable route");
      if (!candidates.some((platform) => platform.gain === state.jump.profile.plannedMaxGain)) errors.push("candidate group has no platform near the jump apex");
      if (state.jump.originLevel < 10 && candidates.some((platform) => ["drift", "fragile", "phase"].includes(platform.kind))) errors.push("early candidate group contains an advanced hazard");
      const highest = candidates.slice().sort((a, b) => b.altitude - a.altitude)[0];
      if (highest && highest.altitude > state.player.takeoffZ + state.player.apexRise + 0.5) errors.push("highest candidate exceeds this jump apex");
    }
    if (!state.jump.profile || !Number.isFinite(state.jump.profile.gravity)) errors.push("jump difficulty profile is invalid");
    return { ok: errors.length === 0, errors };
  }

  function metrics(api) {
    const state = api.state();
    const current = api.currentPlatform();
    return {
      ...JSON.parse(JSON.stringify(state.metrics)), currentLevel: current ? current.level : null,
      maxLevel: state.run.maxLevel, score: state.run.score, platformCount: state.platforms.length,
      difficulty: JSON.parse(JSON.stringify(state.jump.profile)), phase: state.phase, overlay: state.overlay
    };
  }

  window.BounceQaScenarios = Object.freeze({ spawn, assert, metrics });
}());
