const CASES = [
  {
    id: "xiaoche",
    image: "assets/characters/xiaoche-v6.jpg",
    name: "小澈",
    age: 23,
    role: "甜酷舞见",
    quote: "“今天想拍两种状态：日常的我，和舞台上的我。”",
    bookingTitle: "樱影和风 · 双造型",
    bookingCopy: "公开范围：企划作品墙与短片。预约名与舞台名一致；公开文案里的身份标签尚待本人确认。",
    answer: true,
    revealTitle: "小澈是男娘挑战者",
    revealCopy: "Ta主动参加企划，也允许在舞台账号使用“男娘舞见”。真正的答案来自本人授权与公开履历，不是发饰、旗袍、妆容或身形。",
    evidence: [
      ["本人授权", "公开文案可写“男娘舞见”，但不得公开证件姓名。"],
      ["企划闭环", "双造型预约、两周年演出证与本人陈述相互印证。"]
    ],
    palette: { hair: "#201b25", hairGlow: "#6f294d", coat: "#8d294b", accent: "#f2b4c5", eye: "#733f74" },
    hair: "short",
    actions: {
      observe: [
        { id: "bow", label: "观察发饰", hint: "红绳盘扣", quality: "weak", result: "发饰用了舞台账号的红绳盘扣配色。这是个人造型偏好，但发饰本身不能说明身份。" },
        { id: "wrist", label: "观察折扇", hint: "扇骨刻字", quality: "strong", result: "折扇内侧刻着“M-17 · 小澈两周年场”，M-17 像是某个企划代码，单看还不能下结论。", speech: "“那是两周年场留下的，代码要和这次企划单一起看。”" },
        { id: "outfit", label: "观察短和服", hint: "樱白不对称短摆", quality: "weak", result: "樱白短和服是本次日式二次元写真造型，任何人都能穿。服装风格不构成身份判断。" }
      ],
      records: [
        { id: "release", label: "查看授权书", hint: "公开称呼范围", quality: "strong", result: "授权栏写着：舞台账号的置顶身份标签可以沿用，但只能在片尾揭晓；证件姓名禁止公开。" },
        { id: "schedule", label: "对照企划单", hint: "双造型用途", quality: "strong", result: "双造型单标注“挑战者位 02 / M-17 两周年特别篇”，与腕带代码能拼成一条线。" },
        { id: "size", label: "核对服装尺码", hint: "S 码样衣", quality: "weak", result: "尺码只用于准备衣服，和是不是男娘没有关系。" }
      ],
      talk: [
        { id: "label", label: "公开怎么称呼？", hint: "尊重式提问", quality: "strong", result: "小澈答应片尾沿用舞台账号置顶标签，并强调那是自己选的称呼；需要再与 M-17 企划记录交叉。", speech: "“片尾可以沿用置顶标签，但请按约定到最后再揭晓。”" },
        { id: "meaning", label: "双造型的意义？", hint: "开放式提问", quality: "strong", result: "Ta想纪念舞台账号两周年，让日常与舞台人格出现在同一组照片里。", speech: "“两种样子都是真的我，不是谁伪装成谁。”" },
        { id: "body", label: "能检查身体吗？", hint: "越界问题", quality: "boundary", trust: -34, result: "对方拒绝了。身体检查不在拍摄同意范围内，也无法证明一个人的自我标签。", speech: "“不可以。请按我们签过的拍摄边界来。”" }
      ]
    }
  },
  {
    id: "qiaoan",
    image: "assets/characters/qiaoan-v6.jpg",
    name: "乔安",
    age: 24,
    role: "服装设计师",
    quote: "“衣服不需要先问性别，照片也不该。”",
    bookingTitle: "薄荷和风裙 · 品牌 Lookbook",
    bookingCopy: "拍摄用途：新系列型录。本人兼任模特；品牌主单与节目组附加栏目来自两个系统，需要核对归档代码。",
    answer: false,
    revealTitle: "乔安不是男娘挑战者",
    revealCopy: "乔安是女性设计师，来拍自己设计的新中式服装。短款剪裁、低声线和中性艺名都不是判断依据；Ta的预约用途和发布授权已经说得很清楚。",
    evidence: [
      ["预约目的", "品牌 Lookbook，不参加男娘盲猜或身份反差宣传。"],
      ["本人陈述", "Ta希望讨论的是剪裁，不同意被另贴身份标签。"]
    ],
    palette: { hair: "#38353d", hairGlow: "#677771", coat: "#516158", accent: "#b7efb0", eye: "#496d62" },
    hair: "ponytail",
    actions: {
      observe: [
        { id: "shoulder", label: "观察露背剪裁", hint: "薄荷交叉肩带", quality: "weak", result: "交叉肩带与露背结构来自Ta设计的和风夏裙版型。衣服露多少、怎么剪裁，都不能判断身份。" },
        { id: "earphones", label: "观察发夹", hint: "薄荷花刻字", quality: "strong", result: "薄荷花发夹背面刻着品牌名“QIAO FORM”，与预约合同上的设计工作室一致。" },
        { id: "finger", label: "观察手指", hint: "粉笔与针痕", quality: "weak", result: "手上有裁衣粉笔和工作痕迹，只能说明Ta经常做版。" }
      ],
      records: [
        { id: "contract", label: "查看品牌合同", hint: "拍摄用途", quality: "strong", result: "合同归档为常规 LOOKBOOK-N，附加企划栏为空；它与挑战者使用的 M 系列代码不同。" },
        { id: "account", label: "核对公开账号", hint: "品牌主理人", quality: "strong", result: "账号长期只发布剪裁与样衣，今天的造型也出现在新品预告里，没有盲猜企划联动标记。" },
        { id: "voice", label: "调取试音", hint: "较低的声线", quality: "weak", result: "声线高低没有判断价值，且预约根本没有同意用声音做身份推测。" }
      ],
      talk: [
        { id: "purpose", label: "照片想表达什么？", hint: "开放式提问", quality: "strong", result: "乔安只确认了品牌型录用途，并要求成片不要增加任何身份反差标题；需与合同归档一起判断。", speech: "“请拍剪裁，不要临时给我加一个反差栏目。”" },
        { id: "label", label: "可用哪些称呼？", hint: "确认发布边界", quality: "strong", result: "可公开“设计师乔安”和品牌职位，额外身份标签一律不在授权范围。", speech: "“写设计师就好，其他标签不属于这份委托。”" },
        { id: "prove", label: "能证明你是女性吗？", hint: "越界问题", quality: "boundary", trust: -38, result: "这不是拍摄所需信息。Ta要求你重新阅读合同，并下调合作信任。", speech: "“我来交付 Lookbook，不来接受性别审讯。”" }
      ]
    }
  },
  {
    id: "jibai",
    image: "assets/characters/jibai-v6.jpg",
    name: "季白",
    age: 23,
    role: "彩妆师",
    quote: "“妆是作品，不是替我自动选择一个称呼。”",
    bookingTitle: "柔雾彩妆 · 创作者肖像",
    bookingCopy: "本人出镜展示妆造作品。职业介绍已填写，节目组附加栏目状态需要从授权单与前期沟通交叉确认。",
    answer: false,
    revealTitle: "季白不属于男娘企划",
    revealCopy: "季白是喜欢柔美造型的男性彩妆师，但Ta本人不使用“男娘”标签。男性、化妆、穿裙装同时出现，也不能替本人完成身份定义。",
    evidence: [
      ["授权选项", "允许公开“男性彩妆师”，男娘挑战者一栏明确未勾选。"],
      ["本人边界", "Ta只想展示妆造作品，不希望被自动归入另一个身份标签。"]
    ],
    palette: { hair: "#d7c8df", hairGlow: "#8b6aa5", coat: "#6d5485", accent: "#e7c3ff", eye: "#6d568d" },
    hair: "long",
    actions: {
      observe: [
        { id: "makeup", label: "观察妆面", hint: "银紫柔雾", quality: "weak", result: "妆面精致、风格柔美，但化妆技巧与身份标签没有必然关系。" },
        { id: "case", label: "观察腰饰", hint: "紫藤花挂牌", quality: "strong", result: "腰侧紫藤花饰背面别着“JIBAI MAKEUP / 创作者本人出镜”，旧栏目贴纸被覆盖，具体栏目名看不清。" },
        { id: "skirt", label: "观察白袜", hint: "月白过膝袜", quality: "weak", result: "白色过膝袜来自本次月下妆造主题。穿什么不能替本人决定要不要使用男娘标签。" }
      ],
      records: [
        { id: "consent", label: "查看标签授权", hint: "勾选状态", quality: "strong", result: "职业肖像栏已勾选，M-CHALLENGE 附加栏保持空白，并手写“不要根据造型自动归类”。" },
        { id: "portfolio", label: "翻看作品集", hint: "妆造署名", quality: "weak", result: "作品横跨甜美、暗黑、舞台妆，模特性别各异。作品风格不是创作者身份。" },
        { id: "chat", label: "核对前期沟通", hint: "策划改名记录", quality: "strong", result: "Ta曾要求把栏目名从“男娘改造”改为“彩妆师本人出镜”，修改已被制片确认。" }
      ],
      talk: [
        { id: "word", label: "希望怎么介绍？", hint: "尊重式提问", quality: "strong", result: "季白只授权“彩妆师本人出镜”，并提醒不要把柔美造型自动等同于挑战者身份。", speech: "“写彩妆师本人出镜就好，别替我追加栏目。”" },
        { id: "dress", label: "为什么选这身？", hint: "询问创作动机", quality: "weak", result: "白袜与银紫面料能更好承接月灯反光，是这次妆面设计的一部分。", speech: "“它和高光的反射很配，画面会更完整。”" },
        { id: "realman", label: "男人为什么穿裙子？", hint: "冒犯式提问", quality: "boundary", trust: -30, result: "问题预设了服装必须属于某个性别。对方结束了这个话题，信任下降。", speech: "“服装没有替我签过身份授权。”" }
      ]
    }
  },
  {
    id: "xiaokui",
    image: "assets/characters/xiaokui-v6.jpg",
    name: "小葵",
    age: 22,
    role: "治愈系主播",
    quote: "“可以猜，但别把我的本名和直播身份绑在一起。”",
    bookingTitle: "国风女装回归 · 匿名直播封面",
    bookingCopy: "仅允许在指定直播账号发布。真实姓名、证件与线下信息不得进入作品；企划身份可在账号内揭晓。",
    answer: true,
    revealTitle: "小葵是男娘挑战者",
    revealCopy: "小葵自愿参加女装回归盲猜，并允许在直播账号里公开“男娘主播”；但真实姓名仍必须保密。猜中身份不等于获得公开全部隐私的许可。",
    evidence: [
      ["分层授权", "直播账号可公开“男娘主播”，真实姓名与线下信息必须保密。"],
      ["活动记录", "回归排期、经纪人备注和本人陈述构成完整证据链。"]
    ],
    palette: { hair: "#e6a4b7", hairGlow: "#9b5f88", coat: "#4f6f96", accent: "#bfe3ff", eye: "#536ca4" },
    hair: "twin",
    actions: {
      observe: [
        { id: "badge", label: "观察折扇", hint: "红色扇坠", quality: "strong", result: "扇坠背面写着“M-CHALLENGE 回归 / KUI”，与普通频道周边的编号规则不同。" },
        { id: "hoodie", label: "观察旗袍", hint: "藏蓝红绣", quality: "weak", result: "旗袍只是这次国风直播封面的造型，贴身或高开衩都不能判断身份。" },
        { id: "nails", label: "观察鞋袜", hint: "红带黑色腿袜", quality: "weak", result: "红带鞋与梅纹黑色腿袜复刻了频道的夜场视觉，是造型的一部分，与性别无关。" }
      ],
      records: [
        { id: "manager", label: "查看经纪备注", hint: "回归直播排期", quality: "strong", result: "备注把本次预约列为“M-CHALLENGE 回归位”，揭晓仅限“小葵”账号，禁止关联本名。" },
        { id: "release", label: "核对发布授权", hint: "分层公开范围", quality: "strong", result: "账号内允许沿用直播主页的自我标签并在片尾揭晓；真实姓名、证件与线下身份一律不可公开。" },
        { id: "idcard", label: "要求查看证件", hint: "非必要隐私", quality: "boundary", trust: -32, result: "成年状态已由平台完成核验，你无权复制证件。证件也不是判断自我标签的答案。", speech: "“平台已经核过成年，请不要保存我的证件信息。”" }
      ],
      talk: [
        { id: "publish", label: "哪些内容能公开？", hint: "确认发布边界", quality: "strong", result: "小葵允许账号内沿用主页身份标签，但要求本名与线下生活彻底分开；需再结合回归代码判断。", speech: "“账号里可以揭晓主页标签，真实姓名和线下信息要保密。”" },
        { id: "return", label: "为什么叫回归？", hint: "询问企划故事", quality: "strong", result: "Ta停更女装栏目半年，这次用盲猜封面做回归直播。", speech: "“停更半年了，想用这组照片正式回归。”" },
        { id: "voice", label: "能听原声判断吗？", hint: "刻板线索", quality: "boundary", trust: -24, result: "声音不能可靠判断身份，而且花絮原声不在本次授权范围。", speech: "“原声花絮没授权，而且声音也说明不了这个标签。”" }
      ]
    }
  }
];

const MAX_ACTIONS = 4;
const MIN_ACTIONS = 3;

const HOTSPOT_POSITIONS = {
  xiaoche: [[46, 8], [25, 58], [58, 37]],
  qiaoan: [[35, 28], [34, 11], [66, 38]],
  jibai: [[31, 22], [51, 47], [64, 66]],
  xiaokui: [[41, 29], [58, 43], [47, 56]]
};

const state = {
  caseIndex: 0,
  currentTab: "observe",
  actionCount: 0,
  trust: 100,
  used: new Set(),
  clues: [],
  coins: 0,
  results: [],
  collection: new Set(),
  slapCount: 0
};

const els = {
  app: document.querySelector("#app"),
  casePill: document.querySelector("#casePill"),
  coinPill: document.querySelector("#coinPill"),
  albumButton: document.querySelector("#albumButton"),
  portrait: document.querySelector("#portrait"),
  hotspotLayer: document.querySelector("#hotspotLayer"),
  visitorAge: document.querySelector("#visitorAge"),
  visitorName: document.querySelector("#visitorName"),
  visitorRole: document.querySelector("#visitorRole"),
  trustMeter: document.querySelector("#trustMeter"),
  trustFill: document.querySelector("#trustFill"),
  trustValue: document.querySelector("#trustValue"),
  speechBubble: document.querySelector("#speechBubble"),
  bookingTitle: document.querySelector("#bookingTitle"),
  bookingCopy: document.querySelector("#bookingCopy"),
  controlDeck: document.querySelector("#controlDeck"),
  drawerBody: document.querySelector("#drawerBody"),
  drawerBrief: document.querySelector("#drawerBrief"),
  observeHint: document.querySelector("#observeHint"),
  actionCount: document.querySelector("#actionCount"),
  actionList: document.querySelector("#actionList"),
  clueQuality: document.querySelector("#clueQuality"),
  latestClue: document.querySelector("#latestClue"),
  clueChips: document.querySelector("#clueChips"),
  introOverlay: document.querySelector("#introOverlay"),
  resultOverlay: document.querySelector("#resultOverlay"),
  summaryOverlay: document.querySelector("#summaryOverlay"),
  resultStamp: document.querySelector("#resultStamp"),
  resultTitle: document.querySelector("#resultTitle"),
  resultCopy: document.querySelector("#resultCopy"),
  evidenceReview: document.querySelector("#evidenceReview"),
  photoReward: document.querySelector("#photoReward"),
  rewardPhoto: document.querySelector("#rewardPhoto"),
  rewardPhotoName: document.querySelector("#rewardPhotoName"),
  photoRewardTitle: document.querySelector("#photoRewardTitle"),
  photoRewardCopy: document.querySelector("#photoRewardCopy"),
  caseReward: document.querySelector("#caseReward"),
  caseGrade: document.querySelector("#caseGrade"),
  nextCase: document.querySelector("#nextCase"),
  finalScore: document.querySelector("#finalScore"),
  correctCount: document.querySelector("#correctCount"),
  averageTrust: document.querySelector("#averageTrust"),
  finalCoins: document.querySelector("#finalCoins"),
  summaryCopy: document.querySelector("#summaryCopy"),
  albumOverlay: document.querySelector("#albumOverlay"),
  albumGrid: document.querySelector("#albumGrid"),
  decisionTrigger: document.querySelector("#decisionTrigger"),
  decisionPanel: document.querySelector("#decisionPanel"),
  successFx: document.querySelector("#successFx"),
  slapMark: document.querySelector("#slapMark"),
  toast: document.querySelector("#toast")
};

function currentCase() {
  return CASES[state.caseIndex];
}

function mountPortraits() {
  els.portrait.innerHTML = CASES.map((person, index) => (
    `<img src="${person.image}" data-character="${person.id}" data-alt="${person.name}的成年虚构角色写真" alt="" loading="eager" decoding="sync" ${index === 0 ? "fetchpriority=\"high\"" : ""} draggable="false">`
  )).join("");

  els.portrait.querySelectorAll("img").forEach((image) => {
    const source = image.getAttribute("src");
    image.addEventListener("error", () => {
      if (image.dataset.retried === "true") return;
      image.dataset.retried = "true";
      window.setTimeout(() => {
        image.removeAttribute("src");
        image.src = source;
      }, 60);
    });
  });
}

function showPortrait(person) {
  els.portrait.querySelectorAll("img").forEach((image) => {
    const active = image.dataset.character === person.id;
    image.classList.toggle("active", active);
    image.alt = active ? image.dataset.alt : "";
    image.setAttribute("aria-hidden", String(!active));
  });
}

function renderCase() {
  const person = currentCase();
  state.currentTab = "observe";
  state.actionCount = 0;
  state.trust = 100;
  state.used = new Set();
  state.clues = [];

  els.casePill.textContent = `${state.caseIndex + 1}/${CASES.length}`;
  els.coinPill.textContent = `¥${state.coins}`;
  updateCollectionPill();
  showPortrait(person);
  els.visitorAge.textContent = `${person.age}+ · ADULT`;
  els.visitorName.textContent = person.name;
  els.visitorRole.textContent = person.role;
  els.speechBubble.textContent = person.quote;
  els.bookingTitle.textContent = person.bookingTitle;
  els.bookingCopy.textContent = person.bookingCopy;
  els.latestClue.textContent = "点击人物热点，或到资料、对话里记录线索";
  els.latestClue.classList.remove("fresh");
  els.clueQuality.textContent = "未记录";
  delete els.clueQuality.dataset.quality;
  els.clueChips.innerHTML = "";
  els.decisionPanel.classList.remove("visible");
  els.decisionPanel.setAttribute("aria-hidden", "true");
  els.app.classList.remove("drawer-open");
  els.controlDeck.classList.remove("expanded");
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === "observe");
  });
  updateTrust();
  updateActionCount();
  updateDecisionTrigger();
  renderActions();
}

function renderActions() {
  const actions = currentCase().actions[state.currentTab];
  const isObserve = state.currentTab === "observe";

  els.controlDeck.classList.toggle("expanded", !isObserve);
  els.app.classList.toggle("drawer-open", !isObserve);
  els.drawerBrief.hidden = state.currentTab === "talk";

  if (isObserve) {
    els.actionList.innerHTML = "";
    renderHotspots(actions);
    return;
  }

  els.hotspotLayer.innerHTML = "";
  els.actionList.innerHTML = actions.map((action) => {
    const key = `${state.currentTab}:${action.id}`;
    const used = state.used.has(key);
    return `<button class="action-button${used ? " used" : ""}" type="button" data-action="${action.id}" ${used ? "disabled" : ""}>
      ${action.label}<span>${action.hint}</span>
    </button>`;
  }).join("");

  els.actionList.querySelectorAll(".action-button").forEach((button) => {
    button.addEventListener("click", () => useAction(button.dataset.action));
  });
}

function renderHotspots(actions) {
  const positions = HOTSPOT_POSITIONS[currentCase().id];
  els.hotspotLayer.innerHTML = actions.map((action, index) => {
    const key = `observe:${action.id}`;
    const used = state.used.has(key);
    const [x, y] = positions[index];
    return `<button class="focus-hotspot${used ? " used" : ""}" type="button" data-action="${action.id}" style="left:${x}%;top:${y}%" ${used ? "disabled" : ""} aria-label="${action.label}，${action.hint}"><span>${action.label.replace("观察", "")}</span></button>`;
  }).join("");

  els.hotspotLayer.querySelectorAll(".focus-hotspot").forEach((button) => {
    button.addEventListener("click", () => useAction(button.dataset.action));
  });
}

function useAction(actionId) {
  if (state.actionCount >= MAX_ACTIONS) {
    showToast("本轮调查次数用完了，请根据现有证据判断");
    return;
  }

  const action = currentCase().actions[state.currentTab].find((item) => item.id === actionId);
  if (!action) return;
  const key = `${state.currentTab}:${action.id}`;
  if (state.used.has(key)) return;

  state.used.add(key);
  state.actionCount += 1;
  state.trust = Math.max(0, Math.min(100, state.trust + (action.trust || 0)));
  state.clues.push({ ...action, source: tabLabel(state.currentTab) });

  els.latestClue.textContent = action.result;
  els.clueQuality.textContent = qualityLabel(action.quality);
  els.clueQuality.dataset.quality = action.quality;
  els.latestClue.classList.remove("fresh");
  void els.latestClue.offsetWidth;
  els.latestClue.classList.add("fresh");
  if (action.speech) els.speechBubble.textContent = action.speech;

  const chip = document.createElement("span");
  chip.className = `clue-chip ${action.quality}`;
  chip.textContent = `${tabLabel(state.currentTab)} · ${action.label}`;
  els.clueChips.appendChild(chip);

  updateTrust();
  updateActionCount();
  updateDecisionTrigger();
  renderActions();
  if (navigator.vibrate) {
    navigator.vibrate(state.actionCount === MIN_ACTIONS ? [25, 24, 55] : action.quality === "boundary" ? [35, 25, 35] : 22);
  }
}

function updateTrust() {
  els.trustValue.textContent = state.trust;
  els.trustFill.style.width = `${state.trust}%`;
  els.trustFill.style.background = state.trust < 60 ? "var(--coral)" : "var(--mint)";
  els.trustMeter.setAttribute("aria-label", `信任度 ${state.trust}`);
}

function updateActionCount() {
  els.actionCount.textContent = Array.from({ length: MAX_ACTIONS }, (_, index) => (
    index < state.actionCount ? "●" : "○"
  )).join(" ");
}

function updateDecisionTrigger() {
  const remaining = Math.max(0, MIN_ACTIONS - state.actionCount);
  const ready = remaining === 0;
  els.decisionTrigger.disabled = !ready;
  els.decisionTrigger.classList.toggle("ready", ready);
  els.decisionTrigger.querySelector("b").textContent = ready ? "提交判断" : `再记录 ${remaining} 条线索`;
}

function tabLabel(tab) {
  return { observe: "观察", records: "资料", talk: "对话" }[tab];
}

function qualityLabel(quality) {
  return {
    strong: "强证据",
    weak: "弱线索",
    boundary: "越界问题"
  }[quality];
}

function decide(choice) {
  if (state.actionCount < MIN_ACTIONS) {
    showToast(`至少完成 ${MIN_ACTIONS} 次调查，再做判断`);
    return;
  }

  const person = currentCase();
  els.decisionPanel.classList.remove("visible");
  els.decisionPanel.setAttribute("aria-hidden", "true");
  const correct = choice === person.answer;
  const strongFound = state.clues.filter((clue) => clue.quality === "strong").length;
  const boundaryCount = state.clues.filter((clue) => clue.quality === "boundary").length;
  const score = Math.min(100, (correct ? 55 : 10) + Math.round(state.trust * 0.25) + Math.min(20, strongFound * 10));
  const reward = correct ? 120 + Math.round(state.trust / 10) * 5 + Math.min(60, strongFound * 20) : 20;
  const grade = score >= 92 ? "S" : score >= 80 ? "A" : score >= 65 ? "B" : "C";

  state.coins += reward;
  state.results.push({ correct, trust: state.trust, score, strongFound, boundaryCount, reward });
  if (correct) state.collection.add(person.id);
  els.coinPill.textContent = `¥${state.coins}`;
  updateCollectionPill();
  els.resultStamp.textContent = correct ? "核验正确" : "判断失误";
  els.resultStamp.classList.toggle("wrong", !correct);
  els.resultTitle.textContent = person.revealTitle;
  els.resultCopy.textContent = correct
    ? `你的判断正确。${person.revealCopy} 本人授权的企划写真已收入收藏。`
    : `你的判断不对。啪！你挨了一记当场耳光，淡淡掌印会留在画面上，但不会挡住后续操作。${person.revealCopy}`;
  els.evidenceReview.innerHTML = person.evidence.map(([label, copy]) => (
    `<div class="evidence-row"><b>${label}</b><span>${copy}</span></div>`
  )).join("");
  els.photoReward.classList.toggle("hidden", !correct);
  if (correct) {
    els.rewardPhoto.src = person.image;
    els.rewardPhoto.alt = `${person.name}的成年虚构角色授权写真`;
    els.rewardPhotoName.textContent = `${person.name} · 本人授权`;
    els.photoRewardTitle.textContent = "获得一张授权私房照";
    els.photoRewardCopy.textContent = "该成片只用于本局收藏，不代表可以公开角色的其他隐私。";
  }
  els.caseReward.textContent = `+¥${reward}`;
  els.caseGrade.textContent = grade;
  els.nextCase.textContent = state.caseIndex === CASES.length - 1 ? "查看收工结算" : "下一位来访者";
  els.resultOverlay.classList.toggle("result-correct", correct);
  els.resultOverlay.classList.toggle("result-wrong", !correct);
  els.resultOverlay.classList.add("visible");
  if (correct) showSuccessEffect();
  else showSlap();
  if (navigator.vibrate) navigator.vibrate(correct ? [35, 30, 70] : [110]);
}

function nextCase() {
  els.resultOverlay.classList.remove("visible", "result-correct", "result-wrong");
  els.successFx.classList.remove("visible", "fresh");
  if (state.caseIndex < CASES.length - 1) {
    state.caseIndex += 1;
    renderCase();
    return;
  }
  showSummary();
}

function showSummary() {
  const correct = state.results.filter((result) => result.correct).length;
  const avgTrust = Math.round(state.results.reduce((sum, result) => sum + result.trust, 0) / state.results.length);
  const avgScore = Math.round(state.results.reduce((sum, result) => sum + result.score, 0) / state.results.length);
  const boundaryTotal = state.results.reduce((sum, result) => sum + result.boundaryCount, 0);

  els.finalScore.textContent = avgScore;
  els.correctCount.textContent = `${correct} / ${CASES.length}`;
  els.averageTrust.textContent = avgTrust;
  els.finalCoins.textContent = `¥${state.coins}`;
  els.summaryCopy.textContent = correct === CASES.length && boundaryTotal === 0
    ? `你没有用刻板外貌代替证据，也守住了每位来访者的公开边界。本局已集齐 ${state.collection.size} 张授权写真。`
    : `再试一次：优先寻找本人授权、企划记录和自我陈述的闭环。本局收藏 ${state.collection.size} / ${CASES.length}。`;
  els.summaryOverlay.classList.add("visible");
}

function restartGame() {
  state.caseIndex = 0;
  state.coins = 0;
  state.results = [];
  state.collection = new Set();
  state.slapCount = 0;
  els.slapMark.classList.remove("visible", "fresh");
  els.successFx.classList.remove("visible", "fresh");
  els.app.classList.remove("slap-shake");
  els.resultOverlay.classList.remove("visible", "result-correct", "result-wrong");
  els.albumOverlay.classList.remove("visible");
  els.decisionPanel.classList.remove("visible");
  els.summaryOverlay.classList.remove("visible");
  renderCase();
}

function updateCollectionPill() {
  els.albumButton.textContent = `▣ ${state.collection.size}`;
  els.albumButton.setAttribute("aria-label", `打开授权写真收藏，已收集 ${state.collection.size} 张`);
}

function renderAlbum() {
  els.albumGrid.innerHTML = CASES.map((person) => {
    const unlocked = state.collection.has(person.id);
    return `<article class="album-card${unlocked ? "" : " locked"}">
      <img src="${person.image}" alt="${unlocked ? `${person.name}的成年虚构角色授权写真` : "尚未解锁的授权写真"}" draggable="false">
      <b>${unlocked ? person.name : "???"}</b>
      <span>${unlocked ? "本人授权 · 已收藏" : "判断正确后解锁"}</span>
    </article>`;
  }).join("");
}

function showSlap() {
  state.slapCount += 1;
  els.slapMark.classList.add("visible");
  els.slapMark.classList.remove("fresh");
  els.app.classList.remove("slap-shake");
  void els.slapMark.offsetWidth;
  els.slapMark.classList.add("fresh");
  els.app.classList.add("slap-shake");
  window.setTimeout(() => {
    els.slapMark.classList.remove("fresh");
    els.app.classList.remove("slap-shake");
  }, 950);
}

function showSuccessEffect() {
  els.successFx.classList.remove("visible", "fresh");
  void els.successFx.offsetWidth;
  els.successFx.classList.add("visible", "fresh");
  window.setTimeout(() => {
    els.successFx.classList.remove("visible", "fresh");
  }, 1750);
}

let toastTimer = 0;
function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  toastTimer = window.setTimeout(() => els.toast.classList.remove("visible"), 1900);
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.currentTab = button.dataset.tab;
    els.decisionPanel.classList.remove("visible");
    els.decisionPanel.setAttribute("aria-hidden", "true");
    document.querySelectorAll(".tab-button").forEach((candidate) => {
      candidate.classList.toggle("active", candidate === button);
    });
    renderActions();
  });
});

els.decisionTrigger.addEventListener("click", () => {
  if (state.actionCount < MIN_ACTIONS) return;
  els.decisionPanel.classList.add("visible");
  els.decisionPanel.setAttribute("aria-hidden", "false");
});

document.querySelector("#cancelDecision").addEventListener("click", () => {
  els.decisionPanel.classList.remove("visible");
  els.decisionPanel.setAttribute("aria-hidden", "true");
});

document.querySelector("#startGame").addEventListener("click", () => {
  els.introOverlay.classList.remove("visible");
  renderCase();
});
document.querySelector("#decideYes").addEventListener("click", () => decide(true));
document.querySelector("#decideNo").addEventListener("click", () => decide(false));
document.querySelector("#nextCase").addEventListener("click", nextCase);
document.querySelector("#restartGame").addEventListener("click", restartGame);
els.albumButton.addEventListener("click", () => {
  renderAlbum();
  els.albumOverlay.classList.add("visible");
});
document.querySelector("#closeAlbum").addEventListener("click", () => {
  els.albumOverlay.classList.remove("visible");
});
els.albumOverlay.addEventListener("click", (event) => {
  if (event.target === els.albumOverlay) els.albumOverlay.classList.remove("visible");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") els.albumOverlay.classList.remove("visible");
});

mountPortraits();
renderCase();
