(function () {
  "use strict";

  const STORAGE_KEY = "taro_escape_week_journey_v1";
  const MAX_TICKETS = 2;
  const CUPS = Object.freeze([
    { icon: "○", name: "焦糖热身", hint: "看懂三档落点" },
    { icon: "↗", name: "柠香侧流", hint: "预判轻微横流" },
    { icon: "◎", name: "奶盖保险", hint: "高台下有退路" },
    { icon: "◇", name: "三味订单", hint: "按配料顺序追点" },
    { icon: "▱", name: "布丁捷径", hint: "一次性高收益" },
    { icon: "◐", name: "果冻节拍", hint: "真假只是支路" },
    { icon: "✦", name: "大杯周章", hint: "受控混合试炼" }
  ]);
  const TYPE_INFO = Object.freeze({
    ice: { icon: "◇", label: "冰块" },
    foam: { icon: "☁", label: "奶盖" },
    boba: { icon: "●", label: "爆珠" },
    lemon: { icon: "◐", label: "柠檬" },
    pudding: { icon: "■", label: "布丁" }
  });
  const SEQUENCES = Object.freeze([
    ["ice", "foam", "boba"],
    ["foam", "boba", "ice"],
    ["ice", "lemon", "foam"],
    ["boba", "ice", "pudding"],
    ["pudding", "foam", "boba"],
    ["lemon", "ice", "boba"],
    ["ice", "foam", "pudding"]
  ]);

  const dom = {
    hud: document.getElementById("journeyHud"),
    cup: document.getElementById("journeyCup"),
    order: document.getElementById("journeyOrder"),
    progress: document.getElementById("journeyProgress"),
    combo: document.getElementById("journeyCombo"),
    meta: document.getElementById("journeyMeta"),
    map: document.getElementById("journeyMap"),
    gameOver: document.getElementById("gameOverJourney"),
    rebrew: document.getElementById("gameOverRebrewButton")
  };

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function readMeta() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (parsed && parsed.version === 1) {
        return { version: 1, stamps: Math.max(0, parsed.stamps | 0), tickets: clamp(parsed.tickets | 0, 0, MAX_TICKETS) };
      }
    } catch (_error) { /* Storage is optional. */ }
    return { version: 1, stamps: 0, tickets: 1 };
  }
  function saveMeta() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(meta)); } catch (_error) { /* Storage is optional. */ }
  }
  function cupIndex() { return clamp(Math.floor(meta.stamps / 2), 0, CUPS.length - 1); }
  function makeOrder(index) {
    const cycle = meta.stamps % 3;
    if (cycle === 0) {
      const sequence = SEQUENCES[index].slice();
      return { type: "sequence", title: "三味订单", target: sequence.length, progress: 0, sequence, completed: false };
    }
    if (cycle === 1) return { type: "streak", title: "稳稳连跳", target: index >= 4 ? 4 : 3, progress: 0, completed: false };
    return { type: "risk", title: "甜点冒险", target: index >= 3 ? 3 : 2, progress: 0, completed: false };
  }

  let meta = readMeta();
  let run = null;

  function startRun(recipeName) {
    const index = cupIndex();
    run = {
      cupIndex: index,
      recipeName: recipeName || "清爽原味",
      order: makeOrder(index),
      streak: 0,
      riskChain: 0,
      bestStreak: 0,
      climbed: 0,
      landings: 0,
      completedOrders: 0,
      rushJumps: 0,
      scoreMultiplier: 1,
      lastReward: null
    };
    render();
    return snapshot();
  }

  function orderProgressText(order) {
    if (order.type !== "sequence") return `${Math.min(order.progress, order.target)} / ${order.target}`;
    return order.sequence.map((type, index) => {
      const item = TYPE_INFO[type];
      return `${index < order.progress ? "✓" : item.icon}${item.label}`;
    }).join(" → ");
  }

  function multiplierFor(streak) {
    if (streak >= 5) return 1.5;
    if (streak === 4) return 1.3;
    if (streak === 3) return 1.2;
    if (streak === 2) return 1.1;
    return 1;
  }

  function updateOrder(data) {
    const order = run.order;
    if (order.completed || data.gained <= 0) return null;
    if (order.type === "sequence") {
      const target = order.sequence[order.progress];
      if (data.platformType === target) order.progress += 1;
    } else if (order.type === "streak") {
      order.progress = Math.max(order.progress, run.streak);
    } else if (order.type === "risk" && data.gain >= 2) {
      order.progress += 1;
    }
    if (order.progress < order.target) return null;
    order.completed = true;
    run.completedOrders += 1;
    meta.stamps += 1;
    meta.tickets = Math.min(MAX_TICKETS, meta.tickets + 1);
    saveMeta();
    const unlocked = cupIndex() > run.cupIndex ? CUPS[cupIndex()] : null;
    run.lastReward = { title: order.title, unlocked: unlocked ? unlocked.name : null };
    return { completed: true, title: order.title, scoreBonus: 300, ticketEarned: true, unlockedCup: unlocked ? unlocked.name : null };
  }

  function onLanding(details) {
    if (!run) startRun("清爽原味");
    const data = { ...details, gained: Math.max(0, Number(details.gained) || 0), gain: Math.max(0, Number(details.gain) || 0) };
    run.landings += 1;
    if (data.gained > 0) {
      run.climbed += data.gained;
      run.streak += 1;
      run.riskChain = data.gain >= 2 ? run.riskChain + 1 : 0;
    } else {
      run.streak = 0;
      run.riskChain = 0;
    }
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    run.scoreMultiplier = multiplierFor(run.streak);
    const rushTriggered = run.streak >= 5;
    if (rushTriggered) {
      run.rushJumps = 1;
      run.streak = 0;
    }
    const reward = updateOrder(data);
    render();
    return { scoreMultiplier: run.scoreMultiplier, rushTriggered, reward, streak: run.streak, riskChain: run.riskChain };
  }

  function consumeJumpBonus() {
    if (!run || run.rushJumps <= 0) return { extraBonus: false };
    run.rushJumps -= 1;
    render();
    return { extraBonus: true };
  }

  function targetPlatformType() {
    if (!run || run.order.completed || run.order.type !== "sequence") return null;
    return run.order.sequence[run.order.progress] || null;
  }

  function spendTicket() {
    if (meta.tickets <= 0) return false;
    meta.tickets -= 1;
    saveMeta();
    render();
    return true;
  }

  function finishRun(maxLevel) {
    if (dom.gameOver && run) {
      const orderText = run.order.completed ? `订单完成 · 获得杯贴与调杯券` : `${run.order.title} ${orderProgressText(run.order)}`;
      dom.gameOver.textContent = `第 ${run.cupIndex + 1} 杯 · ${orderText} · 最佳连击 ${run.bestStreak}`;
    }
    if (run) run.maxLevel = Math.max(0, Number(maxLevel) || 0);
    render();
    return snapshot();
  }

  function render() {
    const index = run ? run.cupIndex : cupIndex();
    const cup = CUPS[index];
    if (dom.cup) dom.cup.textContent = `第 ${index + 1} 杯 · ${cup.name}`;
    if (dom.order) dom.order.textContent = run ? run.order.title : cup.hint;
    if (dom.progress) dom.progress.textContent = run ? orderProgressText(run.order) : "待开杯";
    if (dom.combo) dom.combo.textContent = run
      ? run.rushJumps > 0 ? "甜度爆发：下一跳多一个高收益落点" : `甜度连击 ×${run.streak} · 当前计分 ×${run.scoreMultiplier.toFixed(1)}`
      : cup.hint;
    if (dom.hud) {
      dom.hud.classList.toggle("is-rush", Boolean(run && run.rushJumps > 0));
      dom.hud.classList.toggle("is-complete", Boolean(run && run.order.completed));
    }
    if (dom.meta) dom.meta.textContent = `杯贴 ${meta.stamps} · 调杯券 ${meta.tickets}`;
    if (dom.map) {
      dom.map.innerHTML = CUPS.map((entry, cupNumber) => {
        const unlocked = cupNumber <= cupIndex();
        const cleared = meta.stamps >= (cupNumber + 1) * 2;
        const classes = [unlocked ? "is-unlocked" : "", cupNumber === index ? "is-current" : "", cleared ? "is-cleared" : ""].filter(Boolean).join(" ");
        return `<span class="${classes}" title="第${cupNumber + 1}杯 ${entry.name}">${entry.icon}</span>`;
      }).join("");
    }
    if (dom.rebrew) {
      dom.rebrew.disabled = meta.tickets <= 0;
      dom.rebrew.textContent = meta.tickets > 0 ? `使用调杯券 · 重新调杯（${meta.tickets}）` : "完成订单获得调杯券";
    }
  }

  function snapshot() { return JSON.parse(JSON.stringify({ meta, run, currentCup: CUPS[run ? run.cupIndex : cupIndex()] })); }
  function resetForQa() { meta = { version: 1, stamps: 0, tickets: 1 }; saveMeta(); run = null; render(); return snapshot(); }

  window.BounceJourney = Object.freeze({
    cups: CUPS,
    startRun,
    onLanding,
    consumeJumpBonus,
    targetPlatformType,
    spendTicket,
    finishRun,
    render,
    getState: snapshot,
    resetForQa
  });
  render();
}());
