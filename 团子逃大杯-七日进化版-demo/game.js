(function () {
  "use strict";
  const Perspective = window.BouncePerspective;
  const Balance = window.BounceBalance;
  const Challenges = window.BounceChallenges;
  const Geometry = window.BounceGeometry;
  const Theme = window.BounceTaroTheme;
  const MixMachine = window.BounceMixMachine;
  const Journey = window.BounceJourney;
  const SkillCatalog = window.BounceSkillCatalog;
  const QaScenarios = window.BounceQaScenarios;
  const GameConfig = window.BounceGameConfig;
  const Utils = window.BounceUtils;
  const { createStars, clamp, length, safeStorageGet, safeStorageSet, shuffle, tracePolygon } = Utils;
  const CFG = GameConfig.physics;
  const TIERS = Balance.tiers;
  const SKILL_THRESHOLDS = SkillCatalog.thresholds;
  const SKILLS = SkillCatalog.catalog;
  const PHASE_LABELS = GameConfig.phaseLabels;
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const shell = document.getElementById("gameShell");
  const dom = {
    height: document.getElementById("heightValue"),
    best: document.getElementById("bestValue"),
    score: document.getElementById("scoreValue"),
    phase: document.getElementById("phasePill"),
    tutorial: document.getElementById("tutorialBubble"),
    toast: document.getElementById("toast"),
    buffs: document.getElementById("buffBar"),
    controlHint: document.getElementById("controlHint"),
    live: document.getElementById("liveRegion"),
    stick: document.getElementById("stickVisual"),
    stickKnob: document.getElementById("stickKnob"),
    intro: document.getElementById("introOverlay"),
    skill: document.getElementById("skillOverlay"),
    revive: document.getElementById("reviveOverlay"),
    pause: document.getElementById("pauseOverlay"),
    gameOver: document.getElementById("gameOverOverlay"),
    skillChoices: document.getElementById("skillChoices"),
    reviveCopy: document.getElementById("reviveCopy"),
    watchAd: document.getElementById("watchAdButton"),
    declineAd: document.getElementById("declineAdButton"),
    closePlayingAd: document.getElementById("closePlayingAdButton"),
    adProgress: document.getElementById("adProgress"),
    adProgressBar: document.getElementById("adProgressBar"),
    adProgressText: document.getElementById("adProgressText"),
    gameOverStats: document.getElementById("gameOverStats"),
    gameOverFloor: document.getElementById("gameOverFloor"),
    gameOverBest: document.getElementById("gameOverBest"),
    gameOverRecord: document.getElementById("gameOverRecord"),
    soundButton: document.getElementById("soundButton")
  };
  const overlayByName = {
    intro: dom.intro,
    skill: dom.skill,
    revive: dom.revive,
    pause: dom.pause,
    gameOver: dom.gameOver
  };
  const view = { width: 360, height: 640, dpr: 1, anchorX: 180, anchorY: 320 };
  const keys = new Set();
  const pointer = { active: false, id: -1, startX: 0, startY: 0, x: 0, y: 0 };
  const stars = createStars(58);
  let state;
  let lastMixResult = null;
  let lastTime = performance.now();
  let accumulator = 0;
  let audioContext = null;
  function random() {
    state.rngState = (state.rngState + 0x6d2b79f5) >>> 0;
    let value = state.rngState;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }
  function createPlatform(options) {
    const tier = TIERS.find((entry) => entry.id === options.tier) || TIERS[0];
    return {
      id: options.id || `p${state.nextPlatformId++}`,
      x: options.x,
      y: options.y,
      level: options.level,
      altitude: Number.isFinite(options.altitude) ? options.altitude : Balance.altitudeForLevel(options.level),
      tier: tier.id,
      tierLabel: tier.label,
      gain: tier.gain,
      radius: options.radius || Balance.profileFor(options.level).tiers[tier.id].radius,
      color: options.color || tier.color,
      originId: options.originId || null,
      revealed: options.revealed !== false,
      clearedAbove: options.clearedAbove !== false,
      visited: Boolean(options.visited),
      retiring: false,
      shapeSeed: options.shapeSeed || Math.floor(random() * 0xffffffff),
      bornAt: state.time,
      kind: options.kind || "normal", baseX: options.x, baseY: options.y,
      vertexCount: options.vertexCount || 7, rotation: options.rotation || 0,
      shapeX: options.shapeX || 1, shapeY: options.shapeY || 1,
      motionAxis: options.motionAxis || 0, motionAmplitude: options.motionAmplitude || 0,
      motionSpeed: options.motionSpeed || 0, motionPhase: options.motionPhase || 0,
      phaseSolidTime: options.phaseSolidTime, phaseGhostTime: options.phaseGhostTime,
      phaseOffset: options.phaseOffset || 0, phaseLocked: null,
      scoreMultiplier: options.scoreMultiplier || 1,
      materialType: options.materialType || null
    };
  }
  function makeInitialState(seed, showIntro) {
    const previous = state;
    const storedBest = safeStorageGet("taro_escape_week_journey_best", 0);
    state = {
      version: 1,
      seed: Number.isFinite(Number(seed)) ? Number(seed) >>> 0 : Date.now() >>> 0,
      rngState: Number.isFinite(Number(seed)) ? Number(seed) >>> 0 : Date.now() >>> 0,
      nextPlatformId: 1,
      time: 0,
      started: !showIntro,
      phase: "LANDED",
      overlay: showIntro ? "intro" : null,
      testMode: previous ? previous.testMode : false,
      soundOn: previous ? previous.soundOn : true,
      player: {
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        currentPlatformId: "p0",
        takeoffZ: 0,
        takeoffLevel: 0,
        apexRise: 1,
        impactUntil: -1
      },
      run: {
        score: 0,
        maxLevel: 0,
        bestLevel: storedBest,
        bestBeforeRun: storedBest,
        maxConfirmedPlatformId: "p0",
        nextSkillAt: SKILL_THRESHOLDS[0],
        skillMilestoneIndex: 0,
        skillReady: false,
        lastSkillTime: -999,
        jumpIndex: 0,
        landingCount: 0,
        heading: -Math.PI / 2,
        lastCandidateCount: 0,
        lastCandidateAngle: null,
        lastMotif: null,
        recoveryJumps: 0,
        nextJumpHeightMultiplier: 1,
        lastZoneSegment: 0,
        mixRecipe: "清爽原味",
        mixEffects: [],
        freeRescueUsed: false,
        cupLidCleared: false
      },
      platforms: [],
      candidates: [],
      jump: {
        originId: "p0",
        originLevel: 0,
        highBeforeId: "p0",
        revealTriggered: false,
        activeSkills: [],
        journeyBonus: { extraBonus: false },
        magnetTargetId: null,
        windAngle: 0,
        windLabel: "",
        profile: Balance.profileFor(0)
      },
      skills: Object.fromEntries(Object.keys(SKILLS).map((id) => [id, { remaining: 0 }])),
      pendingSkill: false,
      pendingRevive: null,
      settleTimer: showIntro ? 999 : 0.2,
      toast: { text: "", timer: 0 },
      tutorialText: "",
      ad: {
        eligible: false,
        used: false,
        status: "idle",
        timer: 0,
        restorePlatformId: null,
        reason: null
      },
      input: { forced: null },
      metrics: {
        elapsed: 0,
        jumps: 0,
        landings: 0,
        severeFalls: 0,
        totalDroppedLayers: 0,
        adAttempts: 0,
        adRewards: 0,
        skillChoices: 0
      }
    };
    state.platforms.push(createPlatform({
      id: "p0",
      x: 0,
      y: 0,
      level: 0,
      tier: "safe",
      radius: 72,
      revealed: true,
      visited: true,
      color: "#719b91"
    }));
    accumulator = 0;
    setOverlay(state.overlay);
    updateHud(true);
    return state;
  }
  function resetGame(seed, showIntro) {
    makeInitialState(seed, Boolean(showIntro));
    if (!showIntro) {
      state.started = true;
      state.settleTimer = 0.22;
      announce("团子开始逃杯");
    }
    render();
    return getPublicState();
  }
  function setOverlay(name) {
    state.overlay = name || null;
    Object.entries(overlayByName).forEach(([key, element]) => {
      element.hidden = key !== name;
    });
    clearPointerInput();
  }
  function applyMixLoadout(result) {
    const mixResult = result || { recipeName: "清爽原味", effects: [] };
    state.run.mixRecipe = mixResult.recipeName || "清爽原味";
    state.run.mixEffects = Array.isArray(mixResult.effects) ? JSON.parse(JSON.stringify(mixResult.effects)) : [];
    state.run.mixEffects.forEach((effect) => {
      if (!effect || !SKILLS[effect.skillId]) return;
      const duration = Math.max(1, Math.round(Number(effect.duration) || SKILLS[effect.skillId].duration));
      state.skills[effect.skillId].remaining = Math.max(state.skills[effect.skillId].remaining, duration);
    });
  }
  function startGame(mixResult) {
    ensureAudio();
    state.started = true;
    state.settleTimer = 0.22;
    setOverlay(null);
    const effectCount = mixResult && Array.isArray(mixResult.effects) ? mixResult.effects.length : 0;
    showToast(effectCount > 0 ? `本局配方：${state.run.mixRecipe} · ${effectCount} 种加料生效` : "清爽原味 · 自动弹跳开始", 1.7);
    beep(330, 0.08, "triangle", 0.035);
  }
  function beginRunWithMix(result) {
    const mixResult = result || { recipeName: "清爽原味", effects: [] };
    lastMixResult = JSON.parse(JSON.stringify(mixResult));
    resetGame(Date.now(), false);
    applyMixLoadout(mixResult);
    if (Journey) Journey.startRun(mixResult.recipeName);
    startGame(mixResult);
    updateHud(true);
    announce(`带着${state.run.mixRecipe}配方开始逃杯`);
    return getPublicState();
  }
  function restartWithCurrentMix() {
    if (MixMachine && MixMachine.isOpen()) return false;
    if (!lastMixResult) return openMixMachine();
    beginRunWithMix(lastMixResult);
    showToast(`沿用 ${state.run.mixRecipe} · 立即再跳`, 1.25);
    return true;
  }
  function rebrewWithTicket() {
    if (Journey && !Journey.spendTicket()) {
      showToast("完成本杯订单可获得调杯券", 1.35);
      return false;
    }
    return openMixMachine();
  }
  function openMixMachine() {
    keys.clear();
    clearPointerInput();
    state.started = false;
    setOverlay(null);
    if (!MixMachine) {
      beginRunWithMix({ recipeName: "清爽原味", effects: [] });
      return false;
    }
    MixMachine.open({ seed: Date.now(), onComplete: beginRunWithMix });
    return true;
  }
  function ensureAudio() {
    if (!state.soundOn || audioContext) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try {
      audioContext = new AudioCtor();
    } catch (_error) {
      audioContext = null;
    }
  }
  function beep(frequency, duration, type, volume) {
    if (!state.soundOn || !audioContext) return;
    try {
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.type = type || "sine";
      gain.gain.setValueAtTime(volume || 0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (_error) {
      // Sound is an optional enhancement.
    }
  }
  function currentPlatform() {
    return state.platforms.find((platform) => platform.id === state.player.currentPlatformId) || null;
  }
  function platformById(id) {
    return state.platforms.find((platform) => platform.id === id) || null;
  }
  function generateCandidates(origin) {
    const candidates = [];
    const profile = state.jump.profile || Balance.profileFor(origin.level);
    const availableTiers = TIERS.filter((tier) => Balance.altitudeForLevel(origin.level + tier.gain) <= state.player.takeoffZ + state.player.apexRise - 6);
    const plan = Challenges.planJump({
      level: origin.level, jumpIndex: state.run.jumpIndex, profile, random,
      heading: state.run.heading, originRadius: origin.radius,
      availableTiers: availableTiers.length ? availableTiers : [TIERS[0]],
      lastCount: state.run.lastCandidateCount, lastAngle: state.run.lastCandidateAngle,
      lastMotif: state.run.lastMotif, recovery: state.run.recoveryJumps > 0,
      widePlatforms: state.jump.activeSkills.includes("wide"),
      extraBonus: state.jump.activeSkills.includes("rain") || Boolean(state.jump.journeyBonus && state.jump.journeyBonus.extraBonus),
      orderTarget: Journey ? Journey.targetPlatformType() : null
    });
    plan.specs.forEach((spec) => {
      const tier = TIERS.find((entry) => entry.id === spec.tierId) || TIERS[0];
      const platform = createPlatform({
        x: origin.x + spec.localX, y: origin.y + spec.localY,
        level: origin.level + tier.gain,
        tier: tier.id,
        radius: spec.radius, color: spec.color, kind: spec.kind,
        originId: origin.id,
        revealed: false,
        clearedAbove: false,
        vertexCount: spec.vertexCount, rotation: spec.rotation,
        shapeX: spec.shapeX, shapeY: spec.shapeY,
        motionAxis: spec.motionAxis, motionAmplitude: spec.motionAmplitude,
        motionSpeed: spec.motionSpeed, motionPhase: spec.motionPhase,
        phaseSolidTime: spec.phaseSolidTime, phaseGhostTime: spec.phaseGhostTime,
        phaseOffset: spec.phaseOffset, scoreMultiplier: spec.scoreMultiplier,
        materialType: spec.materialType
      });
      state.platforms.push(platform);
      candidates.push(platform.id);
    });
    state.candidates = candidates;
    state.run.lastCandidateCount = plan.count;
    state.run.lastCandidateAngle = plan.mainAngle;
    state.run.lastMotif = plan.motif;
    if (state.run.recoveryJumps > 0) state.run.recoveryJumps -= 1;
    prunePlatforms();
  }
  function prunePlatforms() {
    if (state.platforms.length <= CFG.maxPlatforms) return;
    const protectedIds = new Set([
      state.player.currentPlatformId,
      state.run.maxConfirmedPlatformId,
      state.jump.originId,
      ...state.candidates
    ]);
    const removable = state.platforms
      .filter((platform) => !protectedIds.has(platform.id))
      .sort((a, b) => a.level - b.level || a.bornAt - b.bornAt);
    const removeCount = state.platforms.length - CFG.maxPlatforms;
    const removeIds = new Set(removable.slice(0, removeCount).map((platform) => platform.id));
    state.platforms = state.platforms.filter((platform) => !removeIds.has(platform.id));
  }
  function launchJump() {
    const origin = currentPlatform();
    if (!origin) {
      handleVoidFall();
      return;
    }
    state.run.jumpIndex += 1;
    state.metrics.jumps += 1;
    state.jump.originId = origin.id;
    state.jump.originLevel = origin.level;
    state.jump.highBeforeId = state.run.maxConfirmedPlatformId;
    state.jump.revealTriggered = false;
    state.jump.activeSkills = Object.keys(SKILLS).filter((id) => state.skills[id].remaining > 0);
    state.jump.journeyBonus = Journey ? Journey.consumeJumpBonus() : { extraBonus: false };
    state.jump.magnetTargetId = null;
    const baseProfile = Balance.profileFor(origin.level);
    const isScheduledBonus = origin.level >= 90 && state.run.jumpIndex % 5 === 0;
    const bonusJump = isScheduledBonus || state.jump.activeSkills.includes("rain") || Boolean(state.jump.journeyBonus && state.jump.journeyBonus.extraBonus);
    const plannedMaxGain = bonusJump ? 4 : baseProfile.plannedMaxGain;
    const apexHeight = baseProfile.floorStep * plannedMaxGain + baseProfile.apexClearance;
    state.jump.profile = {
      ...baseProfile,
      plannedMaxGain,
      apexHeight,
      impulse: Math.sqrt(2 * baseProfile.gravity * apexHeight)
    };
    const zone = state.jump.profile.zone;
    const windDirection = (state.run.jumpIndex + zone.segment) % 2 === 0 ? 1 : -1;
    state.jump.windAngle = state.run.heading + windDirection * Math.PI / 2;
    state.jump.windLabel = windDirection > 0 ? "右侧旋流" : "左侧旋流";
    const enteredNewZone = zone.segment !== state.run.lastZoneSegment;
    if (enteredNewZone) state.run.lastZoneSegment = zone.segment;
    state.player.takeoffZ = origin.altitude;
    state.player.takeoffLevel = origin.level;
    const springActive = state.jump.activeSkills.includes("spring");
    const heightMultiplier = clamp((state.run.nextJumpHeightMultiplier || 1) * (springActive ? 1.1 : 1), 0.9, 1.2);
    const impulse = state.jump.profile.impulse * Math.sqrt(heightMultiplier);
    state.run.nextJumpHeightMultiplier = 1;
    state.jump.actualImpulse = impulse;
    state.player.vz = impulse;
    state.player.z = Math.max(state.player.z, origin.altitude + 0.01);
    state.player.apexRise = (impulse * impulse) / (2 * state.jump.profile.gravity);
    state.phase = "RISING";
    generateCandidates(origin);
    if (origin.kind === "fragile") origin.retiring = true;
    setTutorialForPhase("launch");
    if (enteredNewZone) showToast(`进入 ${zone.from}–${zone.to} 层 · ${zone.name}：${zone.hint}`, 2.2);
    else if (state.jump.activeSkills.includes("reverse")) showToast("整活生效：方向反转，踩稳糖晶 ×1.5", 1.5);
    beep(springActive ? 470 : 390, 0.11, "triangle", 0.035);
  }
  function revealCandidates() {
    state.jump.revealTriggered = true;
    showToast("穿过配料高度，新甜点从杯壁边缘展开", 1.25);
    setTutorialForPhase("reveal");
    beep(590, 0.07, "sine", 0.025);
  }
  function updateCandidateVisibility() {
    let anyVisible = false;
    state.candidates.forEach((id) => {
      const platform = platformById(id);
      if (!platform) return;
      const projection = platformProjection(platform);
      if (projection.depth > CFG.cameraNear) {
        platform.revealed = true;
        anyVisible = true;
      }
      if (state.player.z >= platform.altitude + 1) platform.clearedAbove = true;
    });
    if (anyVisible && !state.jump.revealTriggered) revealCandidates();
  }
  function getControlInput() {
    if (state.input.forced) return state.input.forced;
    let x = 0;
    let y = 0;
    if (keys.has("ArrowLeft") || keys.has("KeyA")) x -= 1;
    if (keys.has("ArrowRight") || keys.has("KeyD")) x += 1;
    if (keys.has("ArrowUp") || keys.has("KeyW")) y -= 1;
    if (keys.has("ArrowDown") || keys.has("KeyS")) y += 1;
    if (pointer.active) {
      x += pointer.x;
      y += pointer.y;
    }
    const magnitude = length(x, y);
    if (magnitude > 1) return { x: x / magnitude, y: y / magnitude };
    return { x, y };
  }
  function updateHorizontal(dt) {
    const input = getControlInput();
    const magnitude = length(input.x, input.y);
    const profile = state.jump.profile || Balance.profileFor(state.player.takeoffLevel);
    const reverseActive = state.jump.activeSkills.includes("reverse");
    const turboActive = state.jump.activeSkills.includes("turbo");
    const inputX = reverseActive ? -input.x : input.x;
    const inputY = reverseActive ? -input.y : input.y;
    const control = state.phase === "FALLING" ? 1 : profile.risingControl;
    const acceleration = profile.moveAcceleration * control * (turboActive ? 1.12 : 1);
    state.player.vx += inputX * acceleration * dt;
    state.player.vy += inputY * acceleration * dt;
    if (profile.zone.windForce > 0 && state.phase === "FALLING") {
      state.player.vx += Math.cos(state.jump.windAngle) * profile.zone.windForce * dt;
      state.player.vy += Math.sin(state.jump.windAngle) * profile.zone.windForce * dt;
    }
    const drag = Math.exp(-CFG.moveDrag * (magnitude > 0.05 ? 0.55 : 1) * dt);
    state.player.vx *= drag;
    state.player.vy *= drag;
    const speed = length(state.player.vx, state.player.vy);
    const maxSpeed = profile.maxMoveSpeed * (turboActive ? 1.12 : 1);
    if (speed > maxSpeed) {
      state.player.vx = (state.player.vx / speed) * maxSpeed;
      state.player.vy = (state.player.vy / speed) * maxSpeed;
    }
    state.player.x += state.player.vx * dt;
    state.player.y += state.player.vy * dt;
  }
  function applyMagnet(dt) {
    const magnetActive = state.jump.activeSkills.includes("magnet");
    if (!magnetActive) return;
    let nearest = platformById(state.jump.magnetTargetId);
    let nearestDistance = 80;
    if (!nearest || nearest.retiring || !nearest.revealed) {
      nearest = null;
      state.platforms.forEach((platform) => {
        if (platform.retiring || !platform.revealed || !platform.clearedAbove || platform.altitude > state.player.z + 7) return;
        if (!Challenges.phaseSolid(platform, state.time)) return;
        const distance = length(platform.x - state.player.x, platform.y - state.player.y);
        if (distance < nearestDistance) { nearest = platform; nearestDistance = distance; }
      });
      state.jump.magnetTargetId = nearest ? nearest.id : null;
    } else {
      nearestDistance = length(nearest.x - state.player.x, nearest.y - state.player.y);
    }
    if (!nearest || nearestDistance < 1) return;
    state.player.vx += ((nearest.x - state.player.x) / nearestDistance) * 90 * dt;
    state.player.vy += ((nearest.y - state.player.y) / nearestDistance) * 90 * dt;
  }
  function updateAirborne(dt) {
    const previousZ = state.player.z;
    const profile = state.jump.profile || Balance.profileFor(state.player.takeoffLevel);
    const featherActive = state.jump.activeSkills.includes("feather") && state.phase === "FALLING";
    let gravity = state.phase === "FALLING" ? profile.fallGravity : profile.gravity;
    if (featherActive) gravity *= 0.85;
    state.player.vz -= gravity * dt;
    state.player.z += state.player.vz * dt;
    updateHorizontal(dt);
    updateCandidateVisibility();
    pruneRetiredPlatforms();
    if (state.phase === "RISING" && state.player.vz <= 0) {
      state.phase = "FALLING";
      setTutorialForPhase("apex");
      showToast("到达顶点，现在全力瞄准", 0.95);
      beep(720, 0.06, "sine", 0.022);
    }
    if (state.phase === "FALLING") {
      applyMagnet(dt);
      const landing = findLanding(previousZ, state.player.z);
      if (landing) {
        landOnPlatform(landing);
        return;
      }
      const lowestLevel = state.platforms.reduce((lowest, platform) => Math.min(lowest, platform.level), 0);
      if (state.player.z < Balance.altitudeForLevel(lowestLevel - 3)) handleVoidFall();
    }
  }
  function findLanding(previousZ, nextZ) {
    let best = null;
    state.platforms.forEach((platform) => {
      if (platform.retiring || !platform.revealed || !platform.clearedAbove) return;
      if (!Challenges.phaseSolid(platform, state.time)) return;
      if (previousZ + 0.001 < platform.altitude || nextZ > platform.altitude) return;
      if (!Geometry.containsPlatform(platform, state.player.x, state.player.y)) return;
      if (!best || platform.altitude > best.altitude) best = platform;
    });
    return best;
  }
  function finishJumpSkills(consume) {
    if (consume) {
      state.jump.activeSkills.forEach((id) => {
        state.skills[id].remaining = Math.max(0, state.skills[id].remaining - 1);
      });
    }
    state.jump.activeSkills = [];
  }
  function retireJumpCandidates(landedId) {
    const candidateIds = new Set(state.candidates);
    state.platforms.forEach((platform) => {
      if (candidateIds.has(platform.id) && platform.id !== landedId && !platform.visited) platform.retiring = true;
    });
    state.candidates = [];
    pruneRetiredPlatforms();
  }
  function pruneRetiredPlatforms() {
    state.platforms = state.platforms.filter((platform) => (
      !platform.retiring || (platform.revealed && platformProjection(platform).visible)
    ));
  }
  function landOnPlatform(platform, options) {
    const settings = options || {};
    const previousMax = state.run.maxLevel;
    const origin = platformById(state.jump.originId);
    const reverseReward = state.jump.activeSkills.includes("reverse") ? 1.5 : 1;
    const gained = platform.level > previousMax ? platform.level - previousMax : 0;
    const landingAccuracy = length(platform.x - state.player.x, platform.y - state.player.y) / Math.max(1, platform.radius);
    const journeyResult = Journey ? Journey.onLanding({
      gained,
      gain: platform.gain,
      tier: platform.tier,
      kind: platform.kind,
      platformType: Geometry.platformType(platform),
      accuracy: landingAccuracy
    }) : { scoreMultiplier: 1, rushTriggered: false, reward: null };
    state.player.currentPlatformId = platform.id;
    state.player.z = platform.altitude;
    state.player.vz = 0;
    state.player.vx *= 0.34;
    state.player.vy *= 0.34;
    state.player.impactUntil = state.time + 0.1;
    state.phase = "LANDED";
    state.settleTimer = settings.restored ? 0.48 : Balance.profileFor(platform.level).settleTime;
    state.run.landingCount += 1;
    state.metrics.landings += 1;
    platform.visited = true;
    if (platform.kind === "boost") state.run.nextJumpHeightMultiplier = 1.1;
    if (platform.kind === "cushion") state.run.nextJumpHeightMultiplier = 0.94;
    retireJumpCandidates(platform.id);
    finishJumpSkills(gained > 0);
    if (origin && platform.level > origin.level) {
      state.run.heading = Math.atan2(platform.y - origin.y, platform.x - origin.x);
    }
    if (platform.level > previousMax) {
      state.run.maxLevel = platform.level;
      state.run.maxConfirmedPlatformId = platform.id;
      const landingScore = ({ 1: 100, 2: 240, 3: 450, 4: 720 })[platform.gain] || gained * 100;
      state.run.score += Math.round(landingScore * platform.scoreMultiplier * reverseReward * (journeyResult.scoreMultiplier || 1));
      if (journeyResult.reward) state.run.score += journeyResult.reward.scoreBonus || 0;
      state.run.bestLevel = Math.max(state.run.bestLevel, state.run.maxLevel);
      safeStorageSet("taro_escape_week_journey_best", state.run.bestLevel);
      const reachedCupLid = previousMax < 120 && state.run.maxLevel >= 120 && !state.run.cupLidCleared;
      if (reachedCupLid) {
        state.run.cupLidCleared = true;
        state.run.score += 1200;
        showToast("冲破第120层杯盖！获得周章分数，继续挑战无尽大杯", 2.2);
      } else if (journeyResult.reward) {
        const unlockCopy = journeyResult.reward.unlockedCup ? ` · 解锁${journeyResult.reward.unlockedCup}` : "";
        showToast(`订单完成 +300糖晶 +1调杯券${unlockCopy}`, 1.8);
        state.pendingSkill = true;
      } else if (journeyResult.rushTriggered) {
        showToast("甜度5连！下一跳追加高收益落点", 1.55);
      } else {
        showToast(`${platform.tierLabel}配料踩稳 · 最高第 ${platform.level} 层`, 1.15);
      }
      announce(`成功落在第 ${platform.level} 层`);
      while (state.run.skillMilestoneIndex < SKILL_THRESHOLDS.length && state.run.maxLevel >= SKILL_THRESHOLDS[state.run.skillMilestoneIndex]) {
        state.run.skillReady = true;
        state.run.skillMilestoneIndex += 1;
        state.run.nextSkillAt = SKILL_THRESHOLDS[state.run.skillMilestoneIndex] || 999999;
      }
      if (state.run.skillReady) {
        state.pendingSkill = true;
        state.run.skillReady = false;
        state.run.lastSkillTime = state.time;
      }
      beep(520 + platform.gain * 55, 0.09, "triangle", 0.035);
    } else {
      const highPlatform = platformById(state.jump.highBeforeId);
      const highLevel = highPlatform ? highPlatform.level : state.run.maxLevel;
      const dropped = Math.max(0, highLevel - platform.level);
      if (dropped > 0) {
        state.metrics.totalDroppedLayers += dropped;
        showToast(`被低层配料接住，但沉了 ${dropped} 层`, 1.5);
        beep(180, 0.18, "sawtooth", 0.025);
      }
      if (dropped >= CFG.recoveryFallLayers) state.run.recoveryJumps = 2;
      if (!settings.restored && dropped >= CFG.severeFallLayers && !state.ad.used) {
        state.metrics.severeFalls += 1;
        state.pendingRevive = {
          reason: "landed",
          dropped,
          restorePlatformId: state.jump.highBeforeId
        };
      }
    }
  }
  function handleVoidFall() {
    if (state.phase === "GAME_OVER") return;
    retireJumpCandidates(null);
    finishJumpSkills(false);
    state.player.currentPlatformId = null;
    state.player.vz = 0;
    const high = platformById(state.jump.highBeforeId) || platformById(state.run.maxConfirmedPlatformId);
    const dropped = high ? Math.max(1, high.level) : 1;
    state.metrics.totalDroppedLayers += dropped;
    if (high && high.level < 15 && !state.run.freeRescueUsed) {
      state.run.freeRescueUsed = true;
      state.player.currentPlatformId = high.id;
      state.player.x = high.x;
      state.player.y = high.y;
      state.player.z = high.altitude;
      state.player.vx = 0;
      state.player.vy = 0;
      state.phase = "LANDED";
      state.settleTimer = 0;
      state.run.recoveryJumps = 2;
      showToast(`新手保护：免费回到第 ${high.level} 层，本局仅一次`, 1.7);
      return;
    }
    if (!state.ad.used && high && high.level >= 15) {
      state.pendingRevive = {
        reason: "void",
        dropped,
        restorePlatformId: high.id
      };
      openRevive(state.pendingRevive);
    } else {
      finishGame();
    }
  }
  function fixedUpdate(dt) {
    if (!state.started || state.overlay || state.phase === "GAME_OVER") return;
    state.time += dt;
    state.metrics.elapsed += dt;
    state.platforms.forEach((platform) => {
      const position = Challenges.positionAt(platform, state.time);
      platform.x = position.x; platform.y = position.y;
      if (platform.kind === "phase" && platform.phaseLocked === null && state.phase === "FALLING" && platform.clearedAbove && state.player.z >= platform.altitude && state.player.z - platform.altitude <= 35) {
        platform.phaseLocked = Challenges.phaseSolid(platform, state.time);
      }
    });
    if (state.toast.timer > 0) state.toast.timer = Math.max(0, state.toast.timer - dt);
    if (state.phase === "LANDED") {
      state.settleTimer -= dt;
      if (state.settleTimer <= 0) {
        if (state.pendingRevive) {
          const pending = state.pendingRevive;
          state.pendingRevive = null;
          openRevive(pending);
        } else if (state.pendingSkill) {
          state.pendingSkill = false;
          openSkillChoice();
        } else {
          launchJump();
        }
      }
      return;
    }
    if (state.phase === "RISING" || state.phase === "FALLING") updateAirborne(dt);
  }
  function chooseSkillOffers() {
    const all = Object.values(SKILLS);
    const inactive = all.filter((skill) => state.skills[skill.id].remaining === 0);
    const pool = inactive.length >= 3 ? inactive : all;
    const helpers = pool.filter((skill) => skill.category === "assist");
    const offers = [];
    if (helpers.length) offers.push(helpers[Math.floor(random() * helpers.length)]);
    shuffle(pool.filter((skill) => !offers.includes(skill)), random).forEach((skill) => {
      if (offers.length < 3) offers.push(skill);
    });
    return offers;
  }
  function openSkillChoice() {
    dom.skillChoices.innerHTML = "";
    chooseSkillOffers().forEach((skill) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "skill-card";
      button.dataset.skillId = skill.id;
      button.innerHTML = `<span class="skill-icon">${skill.icon}</span><span class="skill-copy"><strong>${skill.name}</strong><small>${skill.description}</small></span><span class="skill-duration">${skill.duration} 跳</span>`;
      button.addEventListener("click", () => chooseSkill(skill.id));
      dom.skillChoices.appendChild(button);
    });
    setOverlay("skill");
    announce("到达技能选择，请三选一");
  }
  function chooseSkill(id) {
    const skill = SKILLS[id];
    if (!skill) return false;
    state.skills[id].remaining = Math.max(state.skills[id].remaining, skill.duration);
    state.metrics.skillChoices += 1;
    setOverlay(null);
    state.settleTimer = 0;
    showToast(`获得 ${skill.name} · ${skill.duration} 跳`, 1.25);
    announce(`选择了${skill.name}`);
    beep(760, 0.12, "triangle", 0.035);
    return true;
  }
  function openRevive(details) {
    const high = platformById(details.restorePlatformId);
    state.ad.eligible = true;
    state.ad.status = "offered";
    state.ad.timer = 0;
    state.ad.restorePlatformId = details.restorePlatformId;
    state.ad.reason = details.reason;
    const destination = high ? `第 ${high.level} 层` : "失误前高点";
    dom.reviveCopy.textContent = details.reason === "void"
      ? `你从所有配料空隙中沉回杯底。可结束本局，或观看一次模拟广告，回到已踩稳的 ${destination}。`
      : `这次连续下沉了 ${details.dropped} 层。可接受当前配料，或观看一次模拟广告，回到已踩稳的 ${destination}。`;
    updateAdUi();
    setOverlay("revive");
    announce("出现模拟激励广告恢复选择");
  }
  function startSimulatedAd() {
    if (!state.ad.eligible || state.ad.used || state.ad.status === "playing") return;
    state.ad.status = "playing";
    state.ad.timer = CFG.adSeconds;
    state.metrics.adAttempts += 1;
    updateAdUi();
    ensureAudio();
  }
  function updateAdTimer(dt) {
    if (state.ad.status !== "playing") return;
    state.ad.timer = Math.max(0, state.ad.timer - dt);
    updateAdUi();
    if (state.ad.timer <= 0) simulateAdResult("success");
  }
  function updateAdUi() {
    const playing = state.ad.status === "playing";
    dom.adProgress.hidden = !playing;
    dom.watchAd.hidden = playing;
    dom.declineAd.hidden = playing;
    dom.closePlayingAd.hidden = !playing;
    if (playing) {
      const progress = 1 - state.ad.timer / CFG.adSeconds;
      dom.adProgressBar.style.width = `${clamp(progress, 0, 1) * 100}%`;
      dom.adProgressText.textContent = `模拟播放中 ${state.ad.timer.toFixed(1)} 秒`;
    }
  }
  function simulateAdResult(result) {
    if (!["success", "close", "fail"].includes(result)) return false;
    if (!state.ad.eligible && state.ad.status !== "playing") return false;
    state.ad.used = true;
    state.ad.eligible = false;
    state.ad.status = result;
    if (result === "success") {
      const restore = platformById(state.ad.restorePlatformId);
      if (!restore) {
        finishGame();
        return false;
      }
      state.metrics.adRewards += 1;
      state.player.currentPlatformId = restore.id;
      state.player.x = restore.x;
      state.player.y = restore.y;
      state.player.z = restore.altitude;
      state.player.vx = 0;
      state.player.vy = 0;
      state.player.vz = 0;
      state.phase = "LANDED";
      state.settleTimer = 0;
      state.run.recoveryJumps = 2;
      state.pendingRevive = null;
      setOverlay(null);
      showToast(`模拟广告完成 · 恢复到第 ${restore.level} 层`, 1.6);
      announce(`恢复到第 ${restore.level} 层`);
      beep(660, 0.16, "triangle", 0.04);
      return true;
    }
    setOverlay(null);
    showToast(result === "close" ? "已关闭模拟广告，不发奖励" : "模拟广告失败，不发奖励", 1.5);
    if (state.player.currentPlatformId) {
      state.phase = "LANDED";
      state.settleTimer = 0;
    } else {
      finishGame();
    }
    return true;
  }
  function declineRevive() {
    state.ad.eligible = false;
    state.ad.status = "declined";
    setOverlay(null);
    if (state.player.currentPlatformId) {
      state.phase = "LANDED";
      state.settleTimer = 0;
      showToast("接受掉层，继续向上", 1.05);
    } else {
      finishGame();
    }
  }
  function finishGame() {
    state.phase = "GAME_OVER";
    state.started = false;
    state.ad.eligible = false;
    const newRecord = state.run.maxLevel > state.run.bestBeforeRun;
    dom.gameOverFloor.textContent = String(state.run.maxLevel);
    dom.gameOverBest.textContent = `${state.run.bestLevel} 层`;
    dom.gameOverRecord.hidden = !newRecord;
    dom.gameOver.classList.toggle("is-new-record", newRecord);
    if (Journey) Journey.finishRun(state.run.maxLevel);
    setOverlay("gameOver");
    beep(440, 0.09, "triangle", 0.03);
    window.setTimeout(() => beep(newRecord ? 760 : 620, 0.14, "triangle", 0.035), 95);
    announce(`游戏结束，本局抵达第 ${state.run.maxLevel} 层，历史最高第 ${state.run.bestLevel} 层${newRecord ? "，刷新纪录" : ""}`);
  }
  function togglePause(forceResume) {
    if (MixMachine && MixMachine.isOpen()) return;
    if (forceResume === true) {
      if (state.overlay === "pause") setOverlay(null);
      return;
    }
    if (state.overlay === "pause") {
      setOverlay(null);
    } else if (!state.overlay && state.started && state.phase !== "GAME_OVER") {
      setOverlay("pause");
    }
  }
  function toggleSound() {
    state.soundOn = !state.soundOn;
    if (state.soundOn) ensureAudio();
    dom.soundButton.textContent = state.soundOn ? "♫" : "×";
    dom.soundButton.setAttribute("aria-label", state.soundOn ? "关闭声音" : "开启声音");
    dom.soundButton.setAttribute("aria-pressed", String(!state.soundOn));
    if (state.soundOn) beep(440, 0.08, "sine", 0.03);
  }
  function setTutorialForPhase(moment) {
    if (state.run.jumpIndex > 3) {
      state.tutorialText = "";
      return;
    }
    if (moment === "launch") {
      state.tutorialText = `第 ${state.run.jumpIndex}/3 跳保护：新配料会先从杯壁边缘露出。`;
    } else if (moment === "reveal") {
      state.tutorialText = "团子越过哪层高度，哪层配料才会完整展开。";
    } else if (moment === "apex") {
      state.tutorialText = "屋顶面积有限；没对准就会从空隙继续掉向低层。";
    }
  }
  function showToast(text, seconds) {
    state.toast.text = text;
    state.toast.timer = seconds;
  }
  function announce(text) {
    dom.live.textContent = "";
    window.setTimeout(() => { dom.live.textContent = text; }, 10);
  }
  function updateHud(force) {
    if (!state) return;
    const current = currentPlatform();
    const visibleLevel = current ? current.level : Balance.levelForAltitude(state.player.z);
    dom.height.textContent = `第 ${visibleLevel} 层`;
    dom.best.textContent = String(state.run.maxLevel);
    dom.score.textContent = String(state.run.score);
    const air = airVisualRatio();
    const profile = state.jump.profile || Balance.profileFor(visibleLevel);
    const zone = profile.zone;
    const zoneLabel = `${zone.icon}${zone.name}`;
    dom.phase.textContent = state.phase === "RISING"
      ? `${zoneLabel} · 上升 ↑ ${Math.round(air * 100)}%`
      : state.phase === "FALLING"
        ? `${zoneLabel} · 下降 ↓ ${Math.round((1 - air) * 100)}%`
        : PHASE_LABELS[state.phase] || "选择中";
    const challengeHint = Challenges.hintFor(state.candidates.map(platformById).filter(Boolean));
    const motifHint = Challenges.motifHint(state.run.lastMotif);
    const reverseActive = state.jump.activeSkills.includes("reverse");
    dom.controlHint.textContent = state.phase === "FALLING"
      ? reverseActive
        ? "整活中：拖动方向已反转，踩稳可得 1.5 倍糖晶"
        : zone.id === "swirl"
          ? `${state.jump.windLabel}正在轻推团子，提前反向修正`
          : challengeHint || motifHint || "拖向目标，让有限的配料对准团子影子"
      : state.phase === "RISING"
        ? reverseActive ? "吸管喝反了：上升期也要反向预判" : `${motifHint || zone.hint} · 上升期可轻微预判`
        : "自动连续弹跳，无需点击起跳";
    const tutorialVisible = Boolean(state.tutorialText) && state.started && !state.overlay;
    dom.tutorial.hidden = !tutorialVisible;
    if (tutorialVisible) dom.tutorial.textContent = state.tutorialText;
    const toastVisible = state.toast.timer > 0 && !state.overlay;
    dom.toast.hidden = !toastVisible;
    if (toastVisible) dom.toast.textContent = state.toast.text;
    const activeBuffs = Object.entries(SKILLS)
      .filter(([id]) => state.skills[id].remaining > 0)
      .map(([id, skill]) => `<span class="buff-chip"><span>${skill.icon}</span>${skill.name}<b>${state.skills[id].remaining}次</b></span>`)
      .join("");
    if (force || dom.buffs.dataset.html !== activeBuffs) {
      dom.buffs.innerHTML = activeBuffs;
      dom.buffs.dataset.html = activeBuffs;
    }
    if (Journey) Journey.render();
  }
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    view.width = Math.max(1, rect.width);
    view.height = Math.max(1, rect.height);
    view.dpr = clamp(window.devicePixelRatio || 1, 1, 3);
    view.anchorX = view.width / 2;
    view.anchorY = view.height / 2;
    const pixelWidth = Math.round(view.width * view.dpr);
    const pixelHeight = Math.round(view.height * view.dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
  }
  function worldToScreen(x, y) {
    const groundScale = groundVisualScale();
    return {
      x: view.anchorX + (x - state.player.x) * groundScale,
      y: view.anchorY + (y - state.player.y) * groundScale
    };
  }
  function drawBackground() {
    const air = airVisualRatio();
    if (Theme) {
      Theme.drawBackground(ctx, { view, state, air, stars });
      return;
    }
    const gradient = ctx.createRadialGradient(
      view.anchorX,
      view.anchorY,
      20,
      view.anchorX,
      view.anchorY,
      Math.max(view.width, view.height) * 0.74
    );
    gradient.addColorStop(0, air > 0.55 ? "#33264c" : "#463154");
    gradient.addColorStop(0.5, "#231f40");
    gradient.addColorStop(1, "#10142c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, view.width, view.height);
    stars.forEach((star, index) => {
      const x = ((star.x * view.width - state.player.x * 0.035 + index * 13) % view.width + view.width) % view.width;
      const y = ((star.y * view.height - state.player.y * 0.025) % view.height + view.height) % view.height;
      ctx.globalAlpha = star.a;
      ctx.fillStyle = "#fff4ca";
      ctx.beginPath();
      ctx.arc(x, y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(view.anchorX, view.anchorY);
    for (let ring = 0; ring < 5; ring += 1) {
      const radius = 95 + ring * 86 - air * 22;
      ctx.strokeStyle = `rgba(178, 151, 199, ${0.055 - ring * 0.006})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 12; i += 1) {
        const angle = (i / 12) * Math.PI * 2;
        const wobble = 1 + Math.sin(i * 2.7 + ring * 1.9) * 0.08;
        const x = Math.cos(angle) * radius * wobble;
        const y = Math.sin(angle) * radius * wobble;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function platformProjection(platform) {
    return Perspective.project(platform, state.player, view, CFG);
  }
  function drawPlatform(platform) {
    if (!platform.revealed) return;
    const projection = platformProjection(platform);
    if (!projection.visible) return;
    const screen = { x: projection.x, y: projection.y };
    const radius = platform.radius * projection.scale;
    if (screen.x < -radius * 2 || screen.x > view.width + radius * 2 || screen.y < -radius * 2 || screen.y > view.height + radius * 2) return;
    const belowHigh = state.run.maxLevel - platform.level;
    const ageAlpha = belowHigh > 16 ? clamp(1 - (belowHigh - 16) / 20, 0.22, 1) : 1;
    const candidate = state.candidates.includes(platform.id);
    const functionVisual = Challenges.visualFor(platform, state.time);
    const top = Geometry.points(platform, screen, radius, 0);
    if (Theme) {
      Theme.drawPlatform(ctx, { platform, projection, screen, radius, ageAlpha, candidate, functionVisual, top });
      return;
    }
    ctx.save();
    ctx.globalAlpha = ageAlpha * projection.alpha * functionVisual.alpha;
    ctx.fillStyle = "rgba(6, 8, 24, 0.3)";
    const shadow = Geometry.points(platform, {
      x: screen.x + 4 * projection.scale,
      y: screen.y + 5 * projection.scale
    }, radius * 1.05, 0);
    tracePolygon(ctx, shadow);
    ctx.fill();
    tracePolygon(ctx, top);
    ctx.fillStyle = platform.color;
    ctx.fill();
    const center = { x: screen.x, y: screen.y };
    top.forEach((point, index) => {
      const next = top[(index + 1) % top.length];
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(point.x, point.y);
      ctx.lineTo(next.x, next.y);
      ctx.closePath();
      const light = index % 3;
      ctx.fillStyle = light === 0 ? "rgba(255,255,225,0.13)" : light === 1 ? "rgba(47,25,65,0.09)" : "rgba(255,255,255,0.025)";
      ctx.fill();
    });
    ctx.strokeStyle = candidate ? "rgba(255,244,207,0.8)" : "rgba(255,255,255,0.24)";
    ctx.lineWidth = candidate ? 2 : 1;
    ctx.setLineDash(functionVisual.dashed ? [5 * projection.scale, 4 * projection.scale] : []);
    tracePolygon(ctx, top);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(27, 27, 50, 0.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, radius * 0.52, 0, Math.PI * 2);
    ctx.stroke();
    if ((candidate || platform.id === state.player.currentPlatformId) && projection.alpha > 0.18) {
      const labelScale = clamp(projection.scale, 0.74, 1.12);
      const fallbackNames = { normal: `${platform.tierLabel}普通`, cushion: "奶盖缓冲", boost: "爆珠高跳", drift: "柠檬漂移", fragile: "布丁易碎", phase: functionVisual.solid ? "果冻可踩" : "果冻穿透" };
      ctx.fillStyle = "rgba(19, 17, 39, 0.9)";
      ctx.beginPath();
      ctx.roundRect(
        screen.x - 39 * labelScale,
        screen.y - 18 * labelScale,
        78 * labelScale,
        36 * labelScale,
        12 * labelScale
      );
      ctx.fill();
      ctx.fillStyle = "#fff6dc";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${15.5 * labelScale}px system-ui, sans-serif`;
      ctx.fillText(`+${platform.gain}层`, screen.x, screen.y - 6 * labelScale);
      ctx.fillStyle = "rgba(255, 246, 220, 0.8)";
      ctx.font = `800 ${9.5 * labelScale}px system-ui, sans-serif`;
      ctx.fillText(fallbackNames[platform.kind] || fallbackNames.normal, screen.x, screen.y + 8 * labelScale, 70 * labelScale);
    }
    ctx.restore();
  }
  function airVisualRatio() {
    if (state.phase !== "RISING" && state.phase !== "FALLING") return 0;
    const rise = Math.max(0, state.player.z - state.player.takeoffZ);
    return clamp(rise / Math.max(1, state.player.apexRise), 0, 1);
  }
  function groundVisualScale() {
    return 1 - airVisualRatio() * 0.32;
  }
  function platformUnderReticle() {
    let best = null;
    state.platforms.forEach((platform) => {
      if (platform.retiring || !platform.revealed || !platform.clearedAbove || platform.altitude > state.player.z + 8) return;
      if (!Challenges.phaseSolid(platform, state.time)) return;
      if (!Geometry.containsPlatform(platform, state.player.x, state.player.y)) return;
      if (!best || platform.altitude > best.altitude) best = platform;
    });
    return best;
  }
  function drawLiftCues(air) {
    if (air <= 0.02) return;
    ctx.save();
    ctx.translate(view.anchorX, view.anchorY);
    const falling = state.phase === "FALLING";
    for (let i = 0; i < 12; i += 1) {
      const angle = (i / 12) * Math.PI * 2 + state.time * (falling ? -0.18 : 0.18);
      const inner = 54 + air * 25;
      const outer = inner + 12 + air * 22;
      ctx.strokeStyle = `rgba(244, 231, 202, ${0.08 + air * 0.22})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawZoneCue(air) {
    const profile = state.jump.profile || Balance.profileFor(state.player.takeoffLevel);
    if (profile.zone.id !== "swirl" || air <= 0.04 || (state.phase !== "RISING" && state.phase !== "FALLING")) return;
    const falling = state.phase === "FALLING";
    const pulse = 0.82 + Math.sin(state.time * 7) * 0.08;
    ctx.save();
    ctx.translate(view.anchorX, view.anchorY);
    ctx.rotate(state.jump.windAngle);
    ctx.globalAlpha = falling ? 0.92 : 0.48;
    ctx.strokeStyle = "rgba(255, 247, 220, 0.96)";
    ctx.fillStyle = "rgba(255, 247, 220, 0.96)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(42, 0);
    ctx.lineTo(72 * pulse, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(72 * pulse, 0);
    ctx.lineTo(61 * pulse, -7);
    ctx.lineTo(61 * pulse, 7);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha *= 0.55;
    ctx.lineWidth = 1.5;
    [-12, 12].forEach((offset) => {
      ctx.beginPath();
      ctx.moveTo(47, offset);
      ctx.lineTo(66 * pulse, offset);
      ctx.stroke();
    });
    ctx.restore();
  }
  function drawLandingReticle(air) {
    const target = platformUnderReticle();
    const falling = state.phase === "FALLING";
    const radius = 25 + air * 7;
    ctx.save();
    ctx.translate(view.anchorX, view.anchorY);
    ctx.strokeStyle = target && falling
      ? "rgba(137,216,166,0.95)"
      : falling
        ? "rgba(255,236,207,0.88)"
        : "rgba(255,255,255,0.28)";
    ctx.lineWidth = falling ? 2.5 : 1.5;
    ctx.setLineDash(falling ? [7, 5] : [3, 7]);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    if (falling) {
      ctx.fillStyle = target ? "rgba(137,216,166,0.9)" : "rgba(255,236,207,0.8)";
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawPlayer() {
    const input = getControlInput();
    const air = airVisualRatio();
    const scale = 1 + air * 0.72;
    const inputLength = length(input.x, input.y);
    const facing = inputLength > 0.08
      ? Math.atan2(input.y, input.x) + Math.PI / 2
      : state.run.heading + Math.PI / 2;
    drawLiftCues(air);
    drawZoneCue(air);
    drawLandingReticle(air);
    if (Theme) {
      Theme.drawPlayer(ctx, { view, state, air, scale, facing, input, inputLength });
      return;
    }
    ctx.save();
    ctx.translate(view.anchorX, view.anchorY);
    ctx.globalAlpha = 0.5 - air * 0.38;
    ctx.fillStyle = "#080a1c";
    ctx.beginPath();
    ctx.arc(air * 30, air * 22, 22 * (1 - air * 0.56), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.scale(scale, scale);
    ctx.rotate(facing);
    ctx.fillStyle = "#43253e";
    ctx.strokeStyle = "#251731";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-9, 8);
    ctx.lineTo(-7, 18);
    ctx.lineTo(0, 23);
    ctx.lineTo(7, 18);
    ctx.lineTo(9, 8);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ff9a6f";
    ctx.beginPath();
    ctx.ellipse(-11, 6, 7, 11, -0.25, 0, Math.PI * 2);
    ctx.ellipse(11, 6, 7, 11, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7d3f58";
    ctx.beginPath();
    ctx.ellipse(0, 7, 13, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f0b071";
    ctx.beginPath();
    ctx.arc(0, -5, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffd36a";
    ctx.strokeStyle = "#42233f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -8, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#cf6d58";
    ctx.beginPath();
    ctx.arc(0, -8, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (state.phase === "FALLING" && inputLength > 0.08) {
      const magnitude = Math.min(1, inputLength);
      const nx = input.x / Math.max(0.001, inputLength);
      const ny = input.y / Math.max(0.001, inputLength);
      ctx.save();
      ctx.strokeStyle = "rgba(255, 223, 132, 0.72)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(view.anchorX + nx * 25, view.anchorY + ny * 25);
      ctx.lineTo(view.anchorX + nx * (48 + 20 * magnitude), view.anchorY + ny * (48 + 20 * magnitude));
      ctx.stroke();
      ctx.restore();
    }
  }
  function drawDangerVignette() {
    if (state.phase !== "FALLING") return;
    const speed = clamp((-state.player.vz - 300) / 380, 0, 1);
    if (speed <= 0) return;
    const gradient = ctx.createRadialGradient(view.anchorX, view.anchorY, view.width * 0.15, view.anchorX, view.anchorY, view.height * 0.7);
    gradient.addColorStop(0, "rgba(93, 47, 60, 0)");
    gradient.addColorStop(1, `rgba(102, 42, 55, ${speed * 0.3})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, view.width, view.height);
  }
  function render() {
    if (!state) return;
    resizeCanvas();
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    drawBackground();
    state.platforms
      .filter((platform) => platform.revealed)
      .slice()
      .sort((a, b) => {
        const aProjection = platformProjection(a);
        const bProjection = platformProjection(b);
        return bProjection.depth - aProjection.depth || a.level - b.level;
      })
      .forEach(drawPlatform);
    drawPlayer();
    drawDangerVignette();
  }
  function frame(now) {
    const realDt = clamp((now - lastTime) / 1000, 0, 0.05);
    lastTime = now;
    if (!state.testMode) {
      updateAdTimer(realDt);
      accumulator += realDt;
      while (accumulator >= CFG.fixedStep) {
        fixedUpdate(CFG.fixedStep);
        accumulator -= CFG.fixedStep;
      }
    }
    updateHud(false);
    render();
    requestAnimationFrame(frame);
  }
  function pointerCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  function onPointerDown(event) {
    if (state.overlay || !state.started) return;
    event.preventDefault();
    const point = pointerCoordinates(event);
    pointer.active = true;
    pointer.id = event.pointerId;
    pointer.startX = point.x;
    pointer.startY = point.y;
    pointer.x = 0;
    pointer.y = 0;
    canvas.setPointerCapture(event.pointerId);
    dom.stick.hidden = false;
    dom.stick.style.left = `${point.x}px`;
    dom.stick.style.top = `${point.y}px`;
    dom.stickKnob.style.transform = "translate(-50%, -50%)";
  }
  function onPointerMove(event) {
    if (!pointer.active || event.pointerId !== pointer.id) return;
    event.preventDefault();
    const point = pointerCoordinates(event);
    const dx = point.x - pointer.startX;
    const dy = point.y - pointer.startY;
    const distance = length(dx, dy);
    const max = 46;
    const scale = distance > max ? max / distance : 1;
    const limitedX = dx * scale;
    const limitedY = dy * scale;
    pointer.x = limitedX / max;
    pointer.y = limitedY / max;
    dom.stickKnob.style.transform = `translate(calc(-50% + ${limitedX}px), calc(-50% + ${limitedY}px))`;
  }
  function clearPointerInput(event) {
    if (event && pointer.active && event.pointerId !== pointer.id) return;
    pointer.active = false;
    pointer.id = -1;
    pointer.x = 0;
    pointer.y = 0;
    dom.stick.hidden = true;
  }
  function stepTest(milliseconds) {
    const total = clamp(Number(milliseconds) || 0, 0, 30000) / 1000;
    let remaining = total;
    while (remaining > 0) {
      const dt = Math.min(CFG.fixedStep, remaining);
      updateAdTimer(dt);
      fixedUpdate(dt);
      remaining -= dt;
    }
    updateHud(true);
    render();
    return getPublicState();
  }
  function getPublicState() {
    const snapshot = JSON.parse(JSON.stringify(state));
    snapshot.screenAnchor = { x: view.anchorX, y: view.anchorY };
    snapshot.playerScreen = worldToScreen(state.player.x, state.player.y);
    snapshot.platformProjections = state.platforms.map((platform) => {
      const projection = platformProjection(platform);
      return {
        id: platform.id, level: platform.level, visible: projection.visible,
        depth: projection.depth, scale: projection.scale, alpha: projection.alpha,
        x: projection.x, y: projection.y
      };
    });
    return snapshot;
  }
  function setTestInput(x, y) {
    const nx = Number(x) || 0;
    const ny = Number(y) || 0;
    const magnitude = length(nx, ny);
    state.input.forced = magnitude > 1 ? { x: nx / magnitude, y: ny / magnitude } : { x: nx, y: ny };
    return state.input.forced;
  }
  function qaApi() {
    return {
      state: () => state,
      resetGame, setOverlay, createPlatform, launchJump, revealCandidates,
      platformById, platformAltitude: Balance.altitudeForLevel, openSkillChoice, openRevive, finishGame,
      updateHud, render, getPublicState, currentPlatform, worldToScreen,
      balance: Balance, geometry: Geometry, skillThresholds: SKILL_THRESHOLDS,
      skills: SKILLS, view
    };
  }
  function spawnScenario(name) {
    return QaScenarios.spawn(name, qaApi());
  }
  function assertInvariants() {
    return QaScenarios.assert(qaApi());
  }
  function getMetrics() {
    return QaScenarios.metrics(qaApi());
  }
  function bindEvents() {
    document.getElementById("startButton").addEventListener("click", openMixMachine);
    document.getElementById("pauseButton").addEventListener("click", () => togglePause());
    document.getElementById("resumeButton").addEventListener("click", () => togglePause(true));
    document.getElementById("restartButton").addEventListener("click", restartWithCurrentMix);
    document.getElementById("pauseRestartButton").addEventListener("click", restartWithCurrentMix);
    document.getElementById("gameOverRestartButton").addEventListener("click", restartWithCurrentMix);
    document.getElementById("gameOverRebrewButton").addEventListener("click", rebrewWithTicket);
    document.getElementById("soundButton").addEventListener("click", toggleSound);
    dom.watchAd.addEventListener("click", startSimulatedAd);
    dom.declineAd.addEventListener("click", declineRevive);
    dom.closePlayingAd.addEventListener("click", () => simulateAdResult("close"));
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", clearPointerInput);
    canvas.addEventListener("pointercancel", clearPointerInput);
    canvas.addEventListener("lostpointercapture", clearPointerInput);
    window.addEventListener("keydown", (event) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) event.preventDefault();
      if (event.repeat && ["KeyP", "KeyR", "KeyM", "Escape"].includes(event.code)) return;
      keys.add(event.code);
      if (event.code === "KeyP" || event.code === "Escape") togglePause();
      if (event.code === "KeyR") restartWithCurrentMix();
      if (event.code === "KeyM") toggleSound();
    }, { passive: false });
    window.addEventListener("keyup", (event) => keys.delete(event.code));
    window.addEventListener("blur", () => {
      keys.clear();
      clearPointerInput();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        keys.clear();
        clearPointerInput();
        if (!state.overlay && state.started) togglePause();
      }
    });
    window.addEventListener("resize", resizeCanvas);
  }
  window.__BOUNCE_DEMO__ = {
    getState: getPublicState,
    reset(seed) {
      return resetGame(seed, false);
    },
    step: stepTest,
    setInput: setTestInput,
    clearInput() {
      state.input.forced = null;
      return true;
    },
    setTestMode(enabled) {
      state.testMode = Boolean(enabled);
      accumulator = 0;
      return state.testMode;
    },
    spawnScenario,
    chooseSkill,
    simulateAdResult,
    assertInvariants,
    getMetrics,
    getDifficulty(level) {
      return Balance.profileFor(level);
    },
    getSkillCatalog() {
      return JSON.parse(JSON.stringify(SKILLS));
    },
    getZone(level) {
      return Balance.zoneFor(level);
    },
    getJourneyState() {
      return Journey ? Journey.getState() : null;
    },
    getMixState() {
      return MixMachine ? MixMachine.getState() : null;
    }
  };
  makeInitialState(Date.now(), true);
  bindEvents();
  resizeCanvas();
  updateHud(true);
  render();
  requestAnimationFrame(frame);
})();
