(function () {
  "use strict";

  const W = 360;
  const H = 500;
  const BALL_RADIUS = 13;
  const LANES = [76, 180, 284];
  const INGREDIENTS = Object.freeze({
    ice: { label: "冰块", icon: "◇", color: "#8bd7df", dark: "#398f9c", skillId: "feather", duration: 3, name: "冰镇慢落", effect: "回落重力 -15%，持续 3 次成功落点" },
    foam: { label: "奶盖", icon: "☁", color: "#fff0cf", dark: "#b48a6e", skillId: "wide", duration: 3, name: "厚奶盖", effect: "平台半径 +12%，持续 3 次成功落点" },
    straw: { label: "吸管", icon: "»", color: "#ef9da8", dark: "#a75068", skillId: "turbo", duration: 3, name: "吸管加压", effect: "横移速度 +12%，持续 3 次成功落点" },
    boba: { label: "爆珠", icon: "●", color: "#aa6fa5", dark: "#673c66", skillId: "spring", duration: 3, name: "爆珠气泡", effect: "峰高 +10%，持续 3 次成功落点" },
    lemon: { label: "柠檬", icon: "◐", color: "#f0cf58", dark: "#a77d28", skillId: "magnet", duration: 3, name: "酸甜牵引", effect: "靠近平台时弱牵引，持续 3 次成功落点" },
    pudding: { label: "布丁", icon: "■", color: "#e6a765", dark: "#a45e42", skillId: "rain", duration: 2, name: "布丁加料", effect: "保证高收益落点，持续 2 跳" },
    contract: { label: "黑糖", icon: "!", color: "#734653", dark: "#402633", contract: true }
  });
  const POCKETS = Object.freeze([
    { label: "稳稳杯", color: "#79bcb4", fallback: "foam", secondary: "magnet", duration: 3, icon: "◎", effectName: "稳稳牵引", effect: "附加 3 跳平台牵引" },
    { label: "双料杯", color: "#dda458", fallback: "ice", secondary: "rain", duration: 2, icon: "✦", effectName: "双料珍珠", effect: "附加 2 跳高收益落点" },
    { label: "爆珠杯", color: "#b36997", fallback: "boba", secondary: "spring", duration: 3, icon: "↑", effectName: "爆珠加压", effect: "附加 3 跳峰高提升" }
  ]);

  const dom = {
    overlay: document.getElementById("mixMachineOverlay"),
    panel: document.querySelector(".mix-machine-panel"),
    canvas: document.getElementById("mixMachineCanvas"),
    hint: document.getElementById("mixMachineHint"),
    toast: document.getElementById("mixHitToast"),
    setup: document.getElementById("mixSetupControls"),
    active: document.getElementById("mixActiveControls"),
    result: document.getElementById("mixResult"),
    laneButtons: [...document.querySelectorAll("[data-mix-lane]")],
    drop: document.getElementById("mixDropButton"),
    skip: document.getElementById("mixSkipButton"),
    blowLeft: document.getElementById("mixBlowLeft"),
    blowRight: document.getElementById("mixBlowRight"),
    nudges: document.getElementById("mixNudgesLeft"),
    recipe: document.getElementById("mixRecipeName"),
    cards: document.getElementById("mixEffectCards"),
    contract: document.getElementById("mixContractChoice"),
    declineContract: document.getElementById("mixDeclineContract"),
    acceptContract: document.getElementById("mixAcceptContract"),
    enter: document.getElementById("mixEnterRunButton")
  };
  if (!dom.overlay || !dom.canvas) return;
  const ctx = dom.canvas.getContext("2d");
  let state = null;
  let completion = null;
  let rafId = 0;
  let lastFrame = 0;
  let toastTimer = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function createState(seed) {
    const numericSeed = Number.isFinite(Number(seed)) ? Number(seed) >>> 0 : Date.now() >>> 0;
    return {
      phase: "setup",
      seed: numericSeed,
      rngState: numericSeed || 1,
      lane: 1,
      ball: { x: LANES[1], y: 34, vx: 0, vy: 0, r: BALL_RADIUS, rotation: 0 },
      pegs: [],
      pins: [],
      hits: Object.fromEntries(Object.keys(INGREDIENTS).map((id) => [id, 0])),
      nudgesLeft: 2,
      elapsed: 0,
      pocket: null,
      outcome: null,
      contractAccepted: false,
      testMode: false
    };
  }

  function random() {
    state.rngState ^= state.rngState << 13;
    state.rngState ^= state.rngState >>> 17;
    state.rngState ^= state.rngState << 5;
    return (state.rngState >>> 0) / 4294967296;
  }

  function shuffle(values) {
    const result = values.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function generateBoard() {
    const positions = [
      [62, 102], [178, 88], [298, 112],
      [112, 178], [246, 184],
      [62, 268], [180, 254], [298, 274],
      [112, 354], [248, 346]
    ];
    const types = shuffle(["ice", "foam", "straw", "boba", "lemon", "pudding", "ice", "foam", "boba", "contract"]);
    state.pegs = positions.map((position, index) => ({
      id: `ingredient-${index}`,
      x: position[0] + (random() * 2 - 1) * 8,
      y: position[1] + (random() * 2 - 1) * 6,
      r: types[index] === "contract" ? 17 : 20,
      type: types[index],
      hit: false,
      pulse: 0,
      wobble: random() * Math.PI * 2
    }));
    state.pins = [];
    for (let row = 0; row < 6; row += 1) {
      for (let column = 0; column < 6; column += 1) {
        const x = 36 + column * 58 + (row % 2) * 27 + (random() * 2 - 1) * 5;
        const y = 65 + row * 67 + (random() * 2 - 1) * 5;
        if (x > W - 20 || y > 420) continue;
        const blocked = state.pegs.some((peg) => Math.hypot(x - peg.x, y - peg.y) < peg.r + 20);
        if (!blocked) state.pins.push({ x, y, r: 5 + random() * 1.8 });
      }
    }
  }

  function reset(seed) {
    const testMode = state ? state.testMode : false;
    state = createState(seed);
    state.testMode = testMode;
    generateBoard();
    syncUi();
    draw();
    return getState();
  }

  function syncUi() {
    const setup = state.phase === "setup";
    const active = state.phase === "dropping";
    const result = state.phase === "result";
    dom.setup.hidden = !setup;
    dom.active.hidden = !active;
    dom.result.hidden = !result;
    dom.panel.classList.toggle("is-result", result);
    dom.laneButtons.forEach((button, index) => button.classList.toggle("is-selected", index === state.lane));
    dom.nudges.textContent = `吹气 ${state.nudgesLeft} 次`;
    dom.nudges.classList.toggle("is-empty", state.nudgesLeft <= 0);
    dom.hint.textContent = setup
      ? "先选投放位置，下坠时还能吹气两次。"
      : active
        ? "点击画面左右两侧，或按 A / D 吹气。"
        : "配方只在本局生效，局内三选一仍会正常出现。";
  }

  function open(options) {
    completion = options && typeof options.onComplete === "function" ? options.onComplete : null;
    dom.overlay.hidden = false;
    reset(options && options.seed);
    dom.drop.focus();
    return getState();
  }

  function close() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    dom.overlay.hidden = true;
    state.phase = "closed";
  }

  function setLane(index) {
    if (state.phase !== "setup") return false;
    state.lane = clamp(Math.round(Number(index) || 0), 0, 2);
    state.ball.x = LANES[state.lane];
    syncUi();
    draw();
    return true;
  }

  function dropBall() {
    if (state.phase !== "setup") return false;
    state.phase = "dropping";
    state.ball.x = LANES[state.lane];
    state.ball.y = 34;
    state.ball.vx = (random() * 2 - 1) * 14;
    state.ball.vy = 8;
    state.elapsed = 0;
    syncUi();
    lastFrame = performance.now();
    if (!state.testMode) rafId = requestAnimationFrame(frame);
    return true;
  }

  function nudge(direction) {
    if (state.phase !== "dropping" || state.nudgesLeft <= 0) return false;
    const sign = direction < 0 ? -1 : 1;
    state.ball.vx = clamp(state.ball.vx + sign * 118, -185, 185);
    state.ball.vy = Math.max(state.ball.vy - 22, 35);
    state.nudgesLeft -= 1;
    showHit(sign < 0 ? "吹向左边 ←" : "→ 吹向右边");
    syncUi();
    return true;
  }

  function showHit(text) {
    dom.toast.hidden = false;
    dom.toast.textContent = text;
    toastTimer = 0.72;
  }

  function resolveCircle(body, obstacle, restitution) {
    const dx = body.x - obstacle.x;
    const dy = body.y - obstacle.y;
    const distance = Math.hypot(dx, dy);
    const minimum = body.r + obstacle.r;
    if (distance >= minimum) return false;
    const nx = distance > 0.001 ? dx / distance : 0;
    const ny = distance > 0.001 ? dy / distance : -1;
    const push = minimum - distance + 0.2;
    body.x += nx * push;
    body.y += ny * push;
    const alongNormal = body.vx * nx + body.vy * ny;
    if (alongNormal < 0) {
      body.vx -= (1 + restitution) * alongNormal * nx;
      body.vy -= (1 + restitution) * alongNormal * ny;
      body.vx += (random() * 2 - 1) * 7;
    }
    return true;
  }

  function registerIngredientHit(peg) {
    peg.pulse = 1;
    if (peg.hit) return;
    peg.hit = true;
    state.hits[peg.type] += 1;
    const ingredient = INGREDIENTS[peg.type];
    showHit(ingredient.contract ? "撞到黑糖契约：稍后由你决定" : `吸到${ingredient.label} · 配方 +1`);
  }

  function updatePhysics(dt) {
    if (state.phase !== "dropping") return;
    const substeps = 3;
    const step = dt / substeps;
    for (let substep = 0; substep < substeps; substep += 1) {
      const ball = state.ball;
      state.elapsed += step;
      ball.vy += (state.elapsed > 4 ? 380 : 180) * step;
      ball.vx *= Math.pow(0.996, step * 60);
      if (state.elapsed > 4) ball.vy = Math.max(ball.vy, (state.elapsed - 4) * 42);
      ball.vy = Math.min(ball.vy, 300);
      ball.x += ball.vx * step;
      ball.y += ball.vy * step;
      ball.rotation += ball.vx * step * 0.015;
      if (ball.x - ball.r < 12) {
        ball.x = 12 + ball.r;
        ball.vx = Math.abs(ball.vx) * 0.76;
      } else if (ball.x + ball.r > W - 12) {
        ball.x = W - 12 - ball.r;
        ball.vx = -Math.abs(ball.vx) * 0.76;
      }
      state.pins.forEach((pin) => resolveCircle(ball, pin, 0.5));
      state.pegs.forEach((peg) => {
        if (resolveCircle(ball, peg, 0.6)) registerIngredientHit(peg);
        peg.pulse = Math.max(0, peg.pulse - step * 3.2);
      });
      if (ball.y > 414) {
        [120, 240].forEach((divider) => {
          if (Math.abs(ball.x - divider) < ball.r + 3 && ball.y < H - 12) {
            ball.x = divider + (ball.x < divider ? -(ball.r + 3) : ball.r + 3);
            ball.vx = (ball.x < divider ? -1 : 1) * Math.max(45, Math.abs(ball.vx) * 0.7);
          }
        });
      }
      if (ball.y - ball.r > H || state.elapsed > 7.2) {
        finishDrop(clamp(Math.floor(ball.x / 120), 0, 2));
        return;
      }
    }
    if (toastTimer > 0) {
      toastTimer = Math.max(0, toastTimer - dt);
      if (toastTimer <= 0) dom.toast.hidden = true;
    }
  }

  function buildOutcome(pocketIndex) {
    const ranked = Object.entries(state.hits)
      .filter(([id, count]) => id !== "contract" && count > 0)
      .sort((a, b) => b[1] - a[1] || INGREDIENTS[a[0]].label.localeCompare(INGREDIENTS[b[0]].label));
    const pocket = POCKETS[pocketIndex];
    const primaryId = ranked[0] ? ranked[0][0] : pocket.fallback;
    const primary = INGREDIENTS[primaryId];
    const primaryEffect = {
      skillId: primary.skillId,
      duration: primary.duration,
      icon: primary.icon,
      name: primary.name,
      description: primary.effect,
      source: primary.label
    };
    let secondaryEffect = {
      skillId: pocket.secondary,
      duration: pocket.duration,
      icon: pocket.icon,
      name: pocket.effectName,
      description: pocket.effect,
      source: pocket.label
    };
    if (secondaryEffect.skillId === primaryEffect.skillId) {
      const alternateId = ranked.find(([id]) => INGREDIENTS[id].skillId !== primaryEffect.skillId)?.[0];
      if (alternateId) {
        const alternate = INGREDIENTS[alternateId];
        secondaryEffect = {
          skillId: alternate.skillId,
          duration: Math.max(2, alternate.duration - 1),
          icon: alternate.icon,
          name: alternate.name,
          description: `${alternate.effect.replace(/\d+ \u8df3/, `${Math.max(2, alternate.duration - 1)} \u8df3`)}`,
          source: alternate.label
        };
      } else {
        const fallbackId = [pocket.fallback, "foam", "ice", "lemon", "boba", "pudding", "straw"]
          .find((id) => INGREDIENTS[id].skillId !== primaryEffect.skillId);
        const fallback = INGREDIENTS[fallbackId];
        const fallbackDuration = Math.max(2, fallback.duration - 1);
        secondaryEffect = {
          skillId: fallback.skillId,
          duration: fallbackDuration,
          icon: fallback.icon,
          name: fallback.name,
          description: fallback.effect.replace(/\d+ 跳/, `${fallbackDuration} 跳`),
          source: pocket.label
        };
      }
    }
    const pairKey = [primaryEffect.skillId, secondaryEffect.skillId].sort().join("+");
    const namedRecipes = {
      "feather+wide": "冰云稳稳杯",
      "magnet+turbo": "柠香追风杯",
      "rain+spring": "爆珠大满贯",
      "magnet+wide": "奶盖牵引杯",
      "feather+rain": "冰镇双料杯",
      "spring+wide": "云顶爆爆杯",
      "rain+turbo": "追风双料杯",
      "spring+turbo": "暴走爆爆杯",
      "magnet+rain": "柠檬珍珠雨",
      "magnet+spring": "牵引爆珠杯",
      "feather+spring": "冰爆气泡杯"
    };
    return {
      recipeName: namedRecipes[pairKey] || `${primary.label}${pocket.label}`,
      pocketIndex,
      pocketLabel: pocket.label,
      primary: primaryEffect,
      secondary: secondaryEffect,
      contractHit: state.hits.contract > 0
    };
  }

  function finishDrop(pocketIndex) {
    if (state.phase !== "dropping") return false;
    state.phase = "result";
    state.pocket = pocketIndex;
    state.outcome = buildOutcome(pocketIndex);
    state.contractAccepted = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    renderResult();
    syncUi();
    draw();
    dom.enter.focus();
    return true;
  }

  function selectedEffects() {
    if (!state.outcome) return [];
    if (state.contractAccepted) {
      return [
        state.outcome.primary,
        { skillId: "reverse", duration: 2, icon: "↔", name: "黑糖怪味", description: "前 2 次成功落点方向反转，糖晶 ×1.5", source: "黑糖契约" }
      ];
    }
    return [state.outcome.primary, state.outcome.secondary];
  }

  function renderResult() {
    const effects = selectedEffects();
    dom.recipe.textContent = state.contractAccepted ? `${state.outcome.recipeName}·怪味` : state.outcome.recipeName;
    dom.cards.innerHTML = effects.map((effect) => `
      <div class="mix-effect-card">
        <span>${effect.icon}</span>
        <div><strong>${effect.name}</strong><small>${effect.description}</small></div>
      </div>`).join("");
    dom.contract.hidden = !state.outcome.contractHit;
    dom.acceptContract.classList.toggle("is-selected", state.contractAccepted);
    dom.declineContract.classList.toggle("is-selected", !state.contractAccepted);
  }

  function setContract(accepted) {
    if (!state.outcome || !state.outcome.contractHit) return false;
    state.contractAccepted = Boolean(accepted);
    renderResult();
    return true;
  }

  function finishMachine(skipped) {
    const callback = completion;
    const payload = skipped || !state.outcome
      ? { recipeName: "清爽原味", pocketLabel: "原味直冲", effects: [], contractAccepted: false, hits: { ...state.hits }, seed: state.seed, skipped: true }
      : { recipeName: state.contractAccepted ? `${state.outcome.recipeName}·怪味` : state.outcome.recipeName, pocketLabel: state.outcome.pocketLabel, effects: selectedEffects(), contractAccepted: state.contractAccepted, hits: { ...state.hits }, seed: state.seed, skipped: false };
    completion = null;
    close();
    if (callback) callback(payload);
    return payload;
  }

  function frame(now) {
    if (state.phase !== "dropping" || state.testMode) return;
    const dt = clamp((now - lastFrame) / 1000, 0, 0.033);
    lastFrame = now;
    updatePhysics(dt);
    draw();
    if (state.phase === "dropping") rafId = requestAnimationFrame(frame);
  }

  function drawBackground() {
    const gradient = ctx.createRadialGradient(180, 215, 24, 180, 250, 310);
    gradient.addColorStop(0, "#edc58c");
    gradient.addColorStop(0.68, "#c98a62");
    gradient.addColorStop(1, "#835260");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#fff3cd";
    ctx.lineWidth = 2;
    for (let ring = 0; ring < 4; ring += 1) {
      ctx.beginPath();
      ctx.ellipse(180, 252, 155 - ring * 30, 220 - ring * 34, ring * 0.06, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(255,246,219,0.74)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(18, 12);
    ctx.quadraticCurveTo(4, 245, 18, 487);
    ctx.moveTo(W - 18, 12);
    ctx.quadraticCurveTo(W - 4, 245, W - 18, 487);
    ctx.stroke();
  }

  function drawPins() {
    state.pins.forEach((pin) => {
      ctx.fillStyle = "rgba(255, 240, 205, 0.76)";
      ctx.strokeStyle = "rgba(118, 72, 68, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, pin.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  function drawIngredient(peg) {
    const item = INGREDIENTS[peg.type];
    const pulse = 1 + peg.pulse * 0.13;
    ctx.save();
    ctx.translate(peg.x, peg.y);
    ctx.rotate(Math.sin(peg.wobble) * 0.05);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(75, 42, 53, 0.2)";
    ctx.beginPath();
    ctx.ellipse(4, 6, peg.r * 1.05, peg.r * 0.86, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = item.color;
    ctx.strokeStyle = peg.hit ? "#fff2cf" : item.dark;
    ctx.lineWidth = peg.hit ? 4 : 2.4;
    ctx.beginPath();
    if (peg.type === "straw") ctx.roundRect(-peg.r * 0.48, -peg.r, peg.r * 0.96, peg.r * 2, 7);
    else if (peg.type === "pudding") ctx.roundRect(-peg.r, -peg.r * 0.72, peg.r * 2, peg.r * 1.44, 9);
    else ctx.arc(0, 0, peg.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = peg.type === "foam" ? "#845f5c" : "#fff6de";
    ctx.font = "900 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.label, 0, 1);
    ctx.restore();
  }

  function drawPockets() {
    ctx.save();
    ctx.strokeStyle = "rgba(255, 244, 216, 0.75)";
    ctx.lineWidth = 3;
    [120, 240].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, 420);
      ctx.lineTo(x, H);
      ctx.stroke();
    });
    POCKETS.forEach((pocket, index) => {
      const left = index * 120;
      ctx.fillStyle = `${pocket.color}55`;
      ctx.fillRect(left + 3, 444, 114, 53);
      ctx.fillStyle = "#fff5d9";
      ctx.font = "900 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pocket.label, left + 60, 474);
    });
    ctx.restore();
  }

  function drawLaneGuide() {
    if (state.phase !== "setup") return;
    LANES.forEach((x, index) => {
      ctx.strokeStyle = index === state.lane ? "rgba(255, 245, 211, 0.95)" : "rgba(255, 245, 211, 0.28)";
      ctx.lineWidth = index === state.lane ? 3 : 1.5;
      ctx.setLineDash(index === state.lane ? [6, 5] : [3, 7]);
      ctx.beginPath();
      ctx.moveTo(x, 9);
      ctx.lineTo(x, 58);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  function drawBall() {
    const ball = state.ball;
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);
    ctx.fillStyle = "rgba(72, 39, 58, 0.24)";
    ctx.beginPath();
    ctx.ellipse(4, 6, ball.r * 1.02, ball.r * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ac75b5";
    ctx.strokeStyle = "#65405f";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff6df";
    ctx.beginPath();
    ctx.arc(-4.5, -1.5, 2.5, 0, Math.PI * 2);
    ctx.arc(4.5, -1.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4e3049";
    ctx.beginPath();
    ctx.arc(-4.5, -1, 1.25, 0, Math.PI * 2);
    ctx.arc(4.5, -1, 1.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#613a58";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (state.phase === "dropping" && ball.vy > 260) ctx.arc(0, 5, 3, 0, Math.PI * 2);
    else ctx.arc(0, 3.5, 4, 0.15, Math.PI - 0.15);
    ctx.stroke();
    ctx.fillStyle = "#6baf69";
    ctx.beginPath();
    ctx.ellipse(-3, -ball.r - 2, 5, 2.6, -0.5, 0, Math.PI * 2);
    ctx.ellipse(3, -ball.r - 2, 5, 2.6, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawResultPath() {
    if (state.phase !== "result" || state.pocket === null) return;
    const pocketX = state.pocket * 120 + 60;
    ctx.save();
    ctx.strokeStyle = "rgba(255,248,218,0.72)";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(pocketX, 430);
    ctx.lineTo(pocketX, 490);
    ctx.stroke();
    ctx.restore();
  }

  function prepareCanvasResolution() {
    const rect = dom.canvas.getBoundingClientRect();
    const cssWidth = Number.isFinite(rect.width) && rect.width > 0 ? rect.width : W;
    const cssHeight = Number.isFinite(rect.height) && rect.height > 0 ? rect.height : H;
    const dpr = clamp(window.devicePixelRatio || 1, 1, 3);
    const pixelWidth = Math.max(W, Math.round(cssWidth * dpr));
    const pixelHeight = Math.max(H, Math.round(cssHeight * dpr));
    if (dom.canvas.width !== pixelWidth || dom.canvas.height !== pixelHeight) {
      dom.canvas.width = pixelWidth;
      dom.canvas.height = pixelHeight;
    }
    ctx.setTransform(pixelWidth / W, 0, 0, pixelHeight / H, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  function draw() {
    if (!state || state.phase === "closed") return;
    prepareCanvasResolution();
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawLaneGuide();
    drawPins();
    state.pegs.forEach(drawIngredient);
    drawPockets();
    drawResultPath();
    drawBall();
  }

  function pointerPosition(event) {
    const rect = dom.canvas.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * W, y: ((event.clientY - rect.top) / rect.height) * H };
  }

  function handleCanvasPointer(event) {
    const point = pointerPosition(event);
    if (state.phase === "setup") {
      const nearest = LANES.map((x, index) => ({ index, distance: Math.abs(point.x - x) })).sort((a, b) => a.distance - b.distance)[0];
      setLane(nearest.index);
    } else if (state.phase === "dropping") {
      nudge(point.x < W / 2 ? -1 : 1);
    }
  }

  function handleKey(event) {
    if (dom.overlay.hidden) return;
    if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD", "Enter", "Space"].includes(event.code)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    if (state.phase === "setup") {
      if (event.code === "ArrowLeft" || event.code === "KeyA") setLane(state.lane - 1);
      else if (event.code === "ArrowRight" || event.code === "KeyD") setLane(state.lane + 1);
      else if (event.code === "Enter" || event.code === "Space") dropBall();
    } else if (state.phase === "dropping") {
      if (event.code === "ArrowLeft" || event.code === "KeyA") nudge(-1);
      else if (event.code === "ArrowRight" || event.code === "KeyD") nudge(1);
    } else if (state.phase === "result" && (event.code === "Enter" || event.code === "Space")) {
      finishMachine(false);
    }
  }

  dom.laneButtons.forEach((button) => button.addEventListener("click", () => setLane(Number(button.dataset.mixLane))));
  dom.drop.addEventListener("click", dropBall);
  dom.skip.addEventListener("click", () => finishMachine(true));
  dom.blowLeft.addEventListener("click", () => nudge(-1));
  dom.blowRight.addEventListener("click", () => nudge(1));
  dom.declineContract.addEventListener("click", () => setContract(false));
  dom.acceptContract.addEventListener("click", () => setContract(true));
  dom.enter.addEventListener("click", () => finishMachine(false));
  dom.canvas.addEventListener("pointerdown", handleCanvasPointer);
  window.addEventListener("keydown", handleKey, true);
  window.addEventListener("resize", draw);

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  function step(milliseconds) {
    if (!state.testMode || state.phase !== "dropping") return getState();
    let remaining = clamp(Number(milliseconds) || 0, 0, 20000) / 1000;
    while (remaining > 0 && state.phase === "dropping") {
      const dt = Math.min(1 / 120, remaining);
      updatePhysics(dt);
      remaining -= dt;
    }
    draw();
    return getState();
  }

  window.BounceMixMachine = Object.freeze({
    open,
    close,
    isOpen() { return !dom.overlay.hidden; },
    getState,
    reset,
    setLane,
    drop: dropBall,
    nudge,
    step,
    setTestMode(enabled) { state.testMode = Boolean(enabled); return state.testMode; },
    acceptContract: setContract,
    finish(skipped) { return finishMachine(Boolean(skipped)); }
  });
}());
