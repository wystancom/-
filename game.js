const CASES = [
  {
    id: "xiaoche",
    image: "assets/characters/xiaoche-v7.jpg",
    name: "小澈",
    age: 23,
    role: "甜酷舞见",
    quote: "“今天想拍两种状态：日常的我，和舞台上的我。”",
    bookingTitle: "樱影和风 · 双造型",
    bookingCopy: "公开范围：企划作品墙与短片。预约资料中的人物性别与本次舞台服装分别归档，需要交叉核对。",
    answer: true,
    revealTitle: "小澈属于男娘范畴",
    revealCopy: "预约资料与演出履历确认小澈是男性，本次以樱白短和服等女性化造型出镜。按本游戏规则，这属于男扮女装，因此答案为“是”；是否主动使用“男娘”称呼不影响本局判定。",
    evidence: [
      ["男性信息", "M-17 演出档案与预约资料均记录小澈为男性。"],
      ["女装呈现", "本次双造型单明确记录樱白短和服等女性化舞台造型。"]
    ],
    palette: { hair: "#201b25", hairGlow: "#6f294d", coat: "#8d294b", accent: "#f2b4c5", eye: "#733f74" },
    hair: "short",
    actions: {
      observe: [
        { id: "bow", label: "观察发饰", hint: "红绳盘扣", quality: "weak", result: "发饰用了舞台账号的红绳盘扣配色。这是个人造型偏好，但发饰本身不能说明身份。" },
        { id: "wrist", label: "观察折扇", hint: "扇骨刻字", quality: "strong", result: "折扇内侧刻着“M-17 · 小澈两周年场”，M-17 像是某个企划代码，单看还不能下结论。", speech: "“那是两周年场留下的，代码要和这次企划单一起看。”" },
        { id: "outfit", label: "观察短和服", hint: "樱白不对称短摆", quality: "weak", result: "樱白短和服能确认本次采用女性化舞台造型，但单凭衣服还缺少人物为男性这一条证据。" }
      ],
      records: [
        { id: "release", label: "查看预约档案", hint: "人物基础资料", quality: "strong", result: "预约档案记录小澈为男性，证件姓名禁止公开；还需要确认本次是否采用女装造型。" },
        { id: "schedule", label: "对照企划单", hint: "双造型用途", quality: "strong", result: "双造型单标注“日常男装 / 樱白舞台女装”，并带有 M-17 两周年场代码。" },
        { id: "size", label: "核对服装尺码", hint: "S 码样衣", quality: "weak", result: "尺码只用于准备衣服，和是不是男娘没有关系。" }
      ],
      talk: [
        { id: "label", label: "平时怎么登台？", hint: "核对公开经历", quality: "strong", result: "小澈说明日常身份为男性，本次复刻女装舞台形象；需要再与 M-17 演出档案交叉。", speech: "“平时我是男生，这次把两周年的女装舞台造型再拍一次。”" },
        { id: "meaning", label: "双造型的意义？", hint: "开放式提问", quality: "strong", result: "Ta想让日常男装与舞台女装出现在同一组照片里，纪念账号两周年。", speech: "“日常和舞台都放进来，反差才完整。”" },
        { id: "body", label: "能检查身体吗？", hint: "越界问题", quality: "boundary", trust: -34, result: "对方拒绝了。身体检查不在拍摄同意范围内；可靠档案与本次造型记录已经足够判断。", speech: "“不可以。请按我们签过的拍摄边界来。”" }
      ]
    }
  },
  {
    id: "qiaoan",
    image: "assets/characters/qiaoan-v7.jpg",
    name: "乔安",
    age: 24,
    role: "服装设计师",
    quote: "“衣服不需要先问性别，照片也不该。”",
    bookingTitle: "薄荷和风裙 · 品牌 Lookbook",
    bookingCopy: "拍摄用途：新系列型录。本人兼任模特；品牌主单与节目组附加栏目来自两个系统，需要核对归档代码。",
    answer: false,
    revealTitle: "乔安不属于男娘范畴",
    revealCopy: "公开创作者档案与品牌合同确认乔安是女性，本次只是穿自己设计的女装样衣。本游戏规则要求先是男性、再以女装或明显女性化造型呈现；缺少“男性”这一前提，所以答案为“否”。",
    evidence: [
      ["人物档案", "品牌主理人资料与预约模特档案均记录乔安为女性。"],
      ["本次造型", "薄荷和风裙是女性设计师展示自己的女装样衣，不构成男扮女装。"]
    ],
    palette: { hair: "#38353d", hairGlow: "#677771", coat: "#516158", accent: "#b7efb0", eye: "#496d62" },
    hair: "ponytail",
    actions: {
      observe: [
        { id: "shoulder", label: "观察薄荷剪裁", hint: "层叠短褂与裙裤", quality: "weak", result: "短褂、束腰与层叠裙裤来自Ta设计的花作样衣。衣服露多少、怎么剪裁，都不能判断身份。" },
        { id: "earphones", label: "观察发夹", hint: "薄荷花刻字", quality: "strong", result: "薄荷花发夹背面刻着品牌名“QIAO FORM”，与预约合同上的设计工作室一致。" },
        { id: "finger", label: "观察手指", hint: "粉笔与针痕", quality: "weak", result: "手上有裁衣粉笔和工作痕迹，只能说明Ta经常做版。" }
      ],
      records: [
        { id: "contract", label: "查看品牌合同", hint: "模特基础资料", quality: "strong", result: "品牌合同的设计师兼模特资料记录为女性，拍摄内容是薄荷和风裙 Lookbook。" },
        { id: "account", label: "核对公开账号", hint: "品牌主理人", quality: "strong", result: "公开采访与品牌主理人资料都介绍乔安为女性设计师，与本次预约档案一致。" },
        { id: "voice", label: "调取试音", hint: "较低的声线", quality: "weak", result: "声线高低没有判断价值，且预约根本没有同意用声音做身份推测。" }
      ],
      talk: [
        { id: "purpose", label: "照片想表达什么？", hint: "开放式提问", quality: "strong", result: "乔安只确认了品牌型录用途，并要求成片不要增加任何身份反差标题；需与合同归档一起判断。", speech: "“请拍剪裁，不要临时给我加一个反差栏目。”" },
        { id: "label", label: "模特资料怎么填？", hint: "核对预约资料", quality: "strong", result: "乔安确认自己是女性设计师兼模特，与品牌合同中的人物资料一致。", speech: "“女性设计师兼模特，合同里已经填好了。”" },
        { id: "prove", label: "能检查身体证明吗？", hint: "越界问题", quality: "boundary", trust: -38, result: "身体检查不是拍摄所需信息。应当核对已获准使用的预约档案，而不是审讯或触碰来访者。", speech: "“合同资料足够了，不要越过拍摄边界。”" }
      ]
    }
  },
  {
    id: "jibai",
    image: "assets/characters/jibai-v7.jpg",
    name: "季白",
    age: 23,
    role: "彩妆师",
    quote: "“今天我自己穿这套女装，把妆面完整拍下来。”",
    bookingTitle: "柔雾彩妆 · 创作者肖像",
    bookingCopy: "本人出镜展示妆造作品。预约档案的人物性别与服装清单分别归档，需要交叉确认。",
    answer: true,
    revealTitle: "季白属于男娘范畴",
    revealCopy: "季白是男性彩妆师，本次以月光短装、白色松袜和女性化妆造出镜。按本游戏规则，这就是男扮女装，因此答案为“是”；Ta是否愿意主动使用“男娘”称呼不会改变本局判定。",
    evidence: [
      ["男性信息", "预约档案与公开创作者资料均记录季白为男性彩妆师。"],
      ["女装呈现", "本次由季白本人穿月光短装、白色松袜并完成女性化妆造。"]
    ],
    palette: { hair: "#d7c8df", hairGlow: "#8b6aa5", coat: "#6d5485", accent: "#e7c3ff", eye: "#6d568d" },
    hair: "long",
    actions: {
      observe: [
        { id: "makeup", label: "观察妆面", hint: "银紫柔雾", quality: "weak", result: "银紫眼妆、短发与柔美女性化妆面能确认本次呈现方向，但还需要核对人物是否为男性。" },
        { id: "case", label: "观察彩妆盒", hint: "本人试装标签", quality: "strong", result: "彩妆盒内侧写着“JIBAI MAKEUP / 男性彩妆师本人出镜”，说明女装模特就是季白本人。" },
        { id: "skirt", label: "观察白袜", hint: "月白松袜", quality: "weak", result: "白色松袜与月光短装能确认本次采用女性化服装；还需要人物为男性的可靠信息才能完成判断。" }
      ],
      records: [
        { id: "consent", label: "查看预约档案", hint: "人物与服装信息", quality: "strong", result: "预约资料记录“男性彩妆师季白本人出镜”，服装栏是月光短装与白色松袜；两项合在一起符合本游戏规则。" },
        { id: "portfolio", label: "翻看作品集", hint: "妆造署名", quality: "weak", result: "作品横跨甜美、暗黑、舞台妆，模特性别各异。作品风格不是创作者身份。" },
        { id: "chat", label: "核对前期沟通", hint: "本人出镜记录", quality: "strong", result: "前期沟通写明“男性彩妆师本人担任女装模特”，不是找女性模特代拍。" }
      ],
      talk: [
        { id: "word", label: "今天谁当模特？", hint: "确认本人出镜", quality: "strong", result: "季白确认自己是男性，也是今天这套月光短装与白袜造型的模特。", speech: "“我自己上镜。我是男生，这套女装也是我自己选的。”" },
        { id: "dress", label: "为什么选这身？", hint: "询问创作动机", quality: "weak", result: "白袜与银紫面料能更好承接月灯反光，是这次妆面设计的一部分。", speech: "“它和高光的反射很配，画面会更完整。”" },
        { id: "realman", label: "能检查身体确认吗？", hint: "越界问题", quality: "boundary", trust: -30, result: "身体检查超出拍摄边界。预约资料和本人出镜记录已经能确认男性信息，无需触碰对方。", speech: "“资料都核对过了，请不要越过拍摄边界。”" }
      ]
    }
  },
  {
    id: "xiaokui",
    image: "assets/characters/xiaokui-v7.jpg",
    name: "小葵",
    age: 22,
    role: "治愈系主播",
    quote: "“可以猜，但别把我的本名和直播身份绑在一起。”",
    bookingTitle: "国风女装回归 · 匿名直播封面",
    bookingCopy: "仅允许在指定直播账号发布。真实姓名、证件与线下信息不得进入作品；企划身份可在账号内揭晓。",
    answer: true,
    revealTitle: "小葵属于男娘范畴",
    revealCopy: "经纪档案与旧直播排期确认小葵是男性，本次重新穿上藏蓝赤红国风女装拍摄封面。按本游戏规则，这属于男扮女装，因此答案为“是”；真实姓名与线下信息仍必须保密。",
    evidence: [
      ["男性信息", "经纪档案与旧直播排期均记录小葵为男性主播。"],
      ["女装呈现", "本次服装清单包含藏蓝赤红国风短装，属于国风女装回归拍摄。"]
    ],
    palette: { hair: "#e6a4b7", hairGlow: "#9b5f88", coat: "#4f6f96", accent: "#bfe3ff", eye: "#536ca4" },
    hair: "twin",
    actions: {
      observe: [
        { id: "badge", label: "观察灯笼坠饰", hint: "底部回归编号", quality: "strong", result: "灯笼坠饰底部写着“M-CHALLENGE 回归 / KUI”，与普通频道周边的编号规则不同。" },
        { id: "hoodie", label: "观察国风短装", hint: "藏蓝赤红花绣", quality: "weak", result: "藏蓝赤红短装能确认本次采用国风女装造型，但单看服装还不能确认人物是否为男性。" },
        { id: "nails", label: "观察脚踝丝带", hint: "回归造型配件", quality: "weak", result: "红色脚踝丝带进一步确认女性化造型，仍需结合人物资料判断。" }
      ],
      records: [
        { id: "manager", label: "查看经纪备注", hint: "回归直播排期", quality: "strong", result: "经纪备注记录“男性主播小葵恢复国风女装栏目”，揭晓仅限账号内，禁止关联本名。" },
        { id: "release", label: "核对服装清单", hint: "本次拍摄造型", quality: "strong", result: "清单记录藏蓝赤红国风短装与脚踝丝带；与男性主播档案合并后，符合本游戏规则。" },
        { id: "idcard", label: "要求查看证件", hint: "非必要隐私", quality: "boundary", trust: -32, result: "成年状态与人物资料已由平台核验，你无权复制证件。应使用获准查看的活动档案与服装清单判断。", speech: "“平台已经核过成年，请不要保存我的证件信息。”" }
      ],
      talk: [
        { id: "publish", label: "哪些内容能公开？", hint: "确认发布边界", quality: "strong", result: "小葵确认账号背后是男性主播，本次国风女装可以公开；本名与线下生活必须保密。", speech: "“可以写男性主播回归女装栏目，但真实姓名和线下信息要保密。”" },
        { id: "return", label: "为什么叫回归？", hint: "询问企划故事", quality: "strong", result: "Ta以男性主播身份停更女装栏目半年，这次穿国风女装拍回归封面。", speech: "“我是男生，女装栏目停更半年了，想用这组照片正式回归。”" },
        { id: "voice", label: "能听原声判断吗？", hint: "刻板线索", quality: "boundary", trust: -24, result: "声音不能可靠判断人物是否为男性，而且花絮原声不在授权范围；应核对经纪档案。", speech: "“原声花絮没授权，请看已经开放的资料。”" }
      ]
    }
  },
  {
    id: "lingyin",
    image: "assets/characters/lingyin-v3.jpg",
    name: "凌音",
    age: 26,
    role: "夜店灯光设计师",
    quote: "“先在我的收藏房试装，镜子里的角度更接近我想要的样子。”",
    bookingTitle: "银紫水手 · 宅系试装",
    bookingCopy: "本人兼任模特。银紫假发、水手幻想服与宅拍清单需要和团队名册交叉核对。",
    answer: true,
    revealTitle: "凌音属于男娘范畴",
    revealCopy: "工作人员档案确认凌音是男性，本次以银紫假发、短款水手幻想服与百褶短裙裤完成女性化造型。按本游戏规则，这属于男扮女装，因此答案为“是”。",
    evidence: [
      ["男性信息", "灯光团队名册与出镜确认单都记录凌音为男性。"],
      ["女装呈现", "本次造型单明确写着银紫水手幻想女装，由凌音本人穿着出镜。"]
    ],
    actions: {
      observe: [
        { id: "halo", label: "观察光环道具", hint: "背面编号 L-26", quality: "strong", result: "光环背面贴着“L-26 / 男性灯光师本人试装”，与场记号一致。" },
        { id: "outfit", label: "观察水手服", hint: "银紫宅拍套装", quality: "weak", result: "短款水手上衣、百褶短裙裤与白袜能确认女性化造型，但不能单独确认人物性别。" },
        { id: "shelf", label: "观察收藏架", hint: "灯光组纪念牌", quality: "weak", result: "收藏架上的工作纪念牌只说明Ta属于灯光组，无法独立判断。" }
      ],
      records: [
        { id: "roster", label: "核对团队名册", hint: "灯光岗位资料", quality: "strong", result: "团队名册写明：男性灯光设计师凌音，本次追加本人女装出镜。" },
        { id: "costume", label: "查看造型清单", hint: "银紫水手女装", quality: "strong", result: "清单记录银紫假发、短款水手上衣与百褶短裙裤，模特签收人为凌音。" },
        { id: "shoulder", label: "比较肩线", hint: "身形推测", quality: "weak", result: "肩线与骨架受姿势和镜头影响，不是可靠人物资料。" }
      ],
      talk: [
        { id: "model", label: "今晚谁来出镜？", hint: "确认本人出镜", quality: "strong", result: "凌音确认自己是男性，也是银紫女装的出镜模特。", speech: "“我自己来。我是男生，这套女装也是我给灯光效果配的。”" },
        { id: "light", label: "为什么在家试装？", hint: "创作动机", quality: "weak", result: "收藏房方便测试道具与构图，只能说明拍摄偏好。", speech: "“先用自然光看服装，再决定正式拍摄的灯位。”" },
        { id: "touch", label: "能摸肩确认吗？", hint: "越界问题", quality: "boundary", trust: -30, result: "触碰身体超出拍摄边界，应使用开放的团队资料与本人陈述。", speech: "“不可以，请按约拍边界工作。”" }
      ]
    }
  },
  {
    id: "tangmo",
    image: "assets/characters/tangmo-v3.jpg",
    name: "唐茉",
    age: 24,
    role: "纹身贴纸设计师",
    quote: "“这次把狐系试装和设计者一起拍进我的房间里。”",
    bookingTitle: "赤白狐系 · 床边自拍",
    bookingCopy: "设计师本人穿赤白狐系角色服试装，工作室画板、合同资料和账号可交叉核对。",
    answer: false,
    revealTitle: "唐茉不属于男娘范畴",
    revealCopy: "工作室资料与本人陈述确认唐茉是女性。本次赤白狐系角色服只是女性设计师的宅拍试装，不构成男扮女装，因此答案为“否”。",
    evidence: [
      ["人物档案", "工作室登记与设计师采访都记录唐茉为女性。"],
      ["拍摄目的", "本人穿赤白狐系女装展示自己的角色设计，没有男性女装这一前提。"]
    ],
    actions: {
      observe: [
        { id: "board", label: "观察床头画板", hint: "设计者署名", quality: "strong", result: "画板背面写着“女性设计师唐茉 / 本人试装”，与预约名一致。" },
        { id: "anklet", label: "观察脚踝丝带", hint: "工作室纪念款", quality: "weak", result: "脚踝丝带是狐系角色服的配件，只能连接作品，不能判断性别。" },
        { id: "outfit", label: "观察狐系短装", hint: "赤白角色服", quality: "weak", result: "赤白短装、狐耳与裸腿只能说明本次造型风格，任何性别都可能选择。" }
      ],
      records: [
        { id: "license", label: "查看工作室登记", hint: "主理人资料", quality: "strong", result: "登记资料记录唐茉为女性主理人，公开采访与之相符。" },
        { id: "contract", label: "核对模特合同", hint: "本人试装", quality: "strong", result: "合同写明女性设计师本人担任本次狐系角色服模特。" },
        { id: "nickname", label: "翻看客户称呼", hint: "大家叫茉哥", quality: "weak", result: "客户把Ta称作“茉哥”只是网络习惯，不代表人物性别。" }
      ],
      talk: [
        { id: "identity", label: "模特资料怎么填？", hint: "核对基础资料", quality: "strong", result: "唐茉确认自己是女性，也是作品的设计者与模特。", speech: "“女性设计师唐茉，本人出镜，照合同写就好。”" },
        { id: "tattoo", label: "为什么选狐系造型？", hint: "作品询问", quality: "weak", result: "狐系角色服来自Ta的新设计，与身份判断无关。", speech: "“这是新角色的试装照，赤白配色会放进样册。”" },
        { id: "prove", label: "能检查身体吗？", hint: "越界问题", quality: "boundary", trust: -35, result: "身体检查不在拍摄范围，工作室和合同资料已经足够。", speech: "“请看合同，不要把拍摄变成检查。”" }
      ]
    }
  },
  {
    id: "baiyu",
    image: "assets/characters/baiyu-v3.jpg",
    name: "白羽",
    age: 23,
    role: "舞台彩妆主播",
    quote: "“今天不找模特，我自己把整套妆造穿给镜头看。”",
    bookingTitle: "浅蓝兔系 · 柔光女装",
    bookingCopy: "彩妆主播本人出镜。账号实名资料、梳妆镜标签和浅蓝角色服清单需要组合判断。",
    answer: true,
    revealTitle: "白羽属于男娘范畴",
    revealCopy: "主播认证资料确认白羽是男性，本次由Ta本人穿浅蓝兔系短装与白色松袜完成女性化造型。按本游戏规则，这属于男扮女装，因此答案为“是”。",
    evidence: [
      ["男性信息", "主播认证与旧直播栏目均记录白羽为男性彩妆主播。"],
      ["女装呈现", "浅蓝兔系短上衣、荷叶边短裤与白色松袜由白羽本人穿着出镜。"]
    ],
    actions: {
      observe: [
        { id: "phone", label: "观察梳妆镜", hint: "镜框主播编号", quality: "strong", result: "梳妆镜背签贴着“男性彩妆主播 BAIYU / 本人试装”，与直播认证号一致。" },
        { id: "socks", label: "观察白色松袜", hint: "栏目刺绣", quality: "weak", result: "白色松袜能确认女性化角色造型，但不能单独确认人物是男性。" },
        { id: "ears", label: "观察兔耳配饰", hint: "旧栏目款", quality: "weak", result: "兔耳与浅蓝蝴蝶结来自旧栏目造型，编号需要与账号资料核对。" }
      ],
      records: [
        { id: "account", label: "核对主播认证", hint: "账号基础资料", quality: "strong", result: "认证页记录白羽为男性彩妆主播，并注明本人担任女装妆面示范。" },
        { id: "wardrobe", label: "查看服装签收", hint: "浅蓝兔系套装", quality: "strong", result: "浅蓝短装、荷叶边短裤与白色松袜的签收人就是白羽。" },
        { id: "voice", label: "分析直播声音", hint: "声线推测", quality: "weak", result: "声线可以训练或处理，不能替代认证资料。" }
      ],
      talk: [
        { id: "self", label: "今天是谁当模特？", hint: "确认本人出镜", quality: "strong", result: "白羽说明自己是男性，今天亲自穿白色女装示范妆面。", speech: "“我是男生，今天这套女装和妆面都由我自己示范。”" },
        { id: "white", label: "为什么全用白色？", hint: "造型动机", quality: "weak", result: "白色能让珠光和彩妆层次更清楚，与人物性别无关。", speech: "“白色会把高光的冷暖差拉出来。”" },
        { id: "remove", label: "能脱袜检查吗？", hint: "越界问题", quality: "boundary", trust: -34, result: "要求脱衣超出约拍边界，也不会产生比认证资料更可靠的信息。", speech: "“不可以，拍摄清单里没有这个内容。”" }
      ]
    }
  },
  {
    id: "xialan",
    image: "assets/characters/xialan-v3.jpg",
    name: "夏岚",
    age: 28,
    role: "爵士驻唱歌手",
    quote: "“歌声可以很低，身份资料不需要靠音高猜。”",
    bookingTitle: "深红镜拍 · 旧海报复刻",
    bookingCopy: "驻唱歌手在收藏房重拍演出海报。场地方合约、旧画框与造型册可供核对。",
    answer: false,
    revealTitle: "夏岚不属于男娘范畴",
    revealCopy: "驻唱合约与演出档案确认夏岚是女性。本次深红水手短装是女歌手复刻旧海报的角色造型，不构成男扮女装，因此答案为“否”。",
    evidence: [
      ["人物档案", "爵士吧驻唱合约与公开演出档案均记录夏岚为女性歌手。"],
      ["本次造型", "深红水手角色服是女性歌手复刻旧海报的服装，没有男性女装这一前提。"]
    ],
    actions: {
      observe: [
        { id: "poster", label: "观察收藏画框", hint: "驻场纪念海报", quality: "strong", result: "画框背签写着“女歌手夏岚驻场五周年”，与场地方编号一致。" },
        { id: "ribbon", label: "观察腿侧丝带", hint: "旧海报配件", quality: "weak", result: "红色腿饰是角色服的一部分，不是人物性别证据。" },
        { id: "outfit", label: "观察水手短装", hint: "深红复刻服", quality: "weak", result: "深红水手短装只能确认本次女性化造型，不能单独确认人物性别。" }
      ],
      records: [
        { id: "venue", label: "查看驻唱合约", hint: "场地方档案", quality: "strong", result: "连续五年的驻唱档案记录夏岚为女性爵士歌手。" },
        { id: "poster", label: "翻看旧海报", hint: "二十岁造型", quality: "strong", result: "旧海报说明本次是女性歌手本人复刻早期舞台造型。" },
        { id: "pitch", label: "分析最低音", hint: "低沉声线", quality: "weak", result: "音域不等于人物性别，不能代替合约资料。" }
      ],
      talk: [
        { id: "profile", label: "海报资料怎么写？", hint: "确认人物资料", quality: "strong", result: "夏岚确认自己是女性歌手，本次只复刻舞台造型。", speech: "“女性爵士歌手夏岚，驻场五周年，就按旧海报写。”" },
        { id: "voice", label: "声音为什么这么低？", hint: "刻板问题", quality: "weak", result: "低音来自长期训练，不能用于判断。", speech: "“低音是练出来的，不是身份说明。”" },
        { id: "measure", label: "能量身体尺寸吗？", hint: "越界问题", quality: "boundary", trust: -32, result: "身体测量不属于本次海报拍摄，场地方资料已经足够。", speech: "“服装尺寸由造型师负责，请不要越界。”" }
      ]
    }
  },
  {
    id: "songyao",
    image: "assets/characters/songyao-v3.jpg",
    name: "宋遥",
    age: 25,
    role: "现代舞者",
    quote: "“角色可以跨越性别，但今天上镜的是舞者本人。”",
    bookingTitle: "月光紫纱 · 宅拍定格",
    bookingCopy: "舞团为女性舞者拍摄新剧照。月饰编号、团员名册与旧角色立牌存在刻意反差。",
    answer: false,
    revealTitle: "宋遥不属于男娘范畴",
    revealCopy: "舞团名册与本人陈述确认宋遥是女性。Ta过去常反串男性舞台角色，但本次象牙白月光短装与紫纱由女性舞者本人穿着，不构成男扮女装，因此答案为“否”。",
    evidence: [
      ["人物档案", "舞团名册与合同记录宋遥为女性现代舞者。"],
      ["反串陷阱", "旧作品中的男性角色只是舞台反串，不能反推舞者本人是男性。"]
    ],
    actions: {
      observe: [
        { id: "moon", label: "观察月亮发饰", hint: "女舞者组编号", quality: "strong", result: "发饰背签编号指向舞团女舞者组，与本次场记单一致。" },
        { id: "chiffon", label: "观察紫色薄纱", hint: "月光舞服", quality: "weak", result: "象牙白短装与紫色薄纱能确认女性化造型，但不说明人物是男性。" },
        { id: "figure", label: "观察展柜立牌", hint: "旧男角舞名", quality: "weak", result: "展柜立牌写的是Ta曾出演的男性角色名，是刻意设置的干扰线索。" }
      ],
      records: [
        { id: "roster", label: "核对舞团名册", hint: "团员资料", quality: "strong", result: "团员档案记录宋遥为女性现代舞者，长期负责跨性别角色表演。" },
        { id: "casting", label: "查看角色分工", hint: "常演男性角色", quality: "weak", result: "表演男性角色不代表舞者本人是男性，需要回到团员资料。" },
        { id: "contract", label: "查看剧照合同", hint: "女舞者本人", quality: "strong", result: "合同写明“女性舞者宋遥本人 / 月光舞服剧照”，与名册一致。" }
      ],
      talk: [
        { id: "role", label: "角色和本人一样吗？", hint: "区分舞台身份", quality: "strong", result: "宋遥说明自己是女性，只是经常在舞台上反串男性角色。", speech: "“我是女性，过去那些男性名字都是我演过的角色。”" },
        { id: "moon", label: "为什么选月光？", hint: "创作动机", quality: "weak", result: "月光能表现薄纱运动轨迹，与身份无关。", speech: "“动作停住时，月光会把纱的路径留下来。”" },
        { id: "muscle", label: "能靠肌肉判断吗？", hint: "越界问题", quality: "boundary", trust: -26, result: "肌肉来自舞蹈训练，既不可靠也不应替代开放的团员资料。", speech: "“请看舞团资料，不要拿身体线条下结论。”" }
      ]
    }
  }
];

const MAX_ACTIONS = 4;
const MIN_ACTIONS = 3;
const COLLECTION_STORAGE_KEY = "who-is-nanniang-album-v1";
const META_STORAGE_KEY = "who-is-nanniang-meta-v1";
const AFFINITY_THRESHOLDS = [0, 20, 55, 100, 160];
const GIFT_TYPES = [
  { id: "bouquet", icon: "✿", name: "胶卷花束", price: 60, affinity: 6, copy: "轻巧的小心意" },
  { id: "candle", icon: "◒", name: "香氛蜡烛", price: 180, affinity: 18, copy: "适合收工后的夜晚" },
  { id: "album", icon: "▣", name: "定制相册", price: 420, affinity: 45, copy: "最能打动摄影搭档" }
];

const ROOM_LINES = {
  xiaoche: ["“蝴蝶结借你保管，下次拍摄记得带来。”", "“你的取景比第一次更懂我了。”"],
  qiaoan: ["“衣服是设计语言，别让标签抢走画面。”", "“下次可以试试更大胆的剪裁。”"],
  jibai: ["“灯别关太快，我还想再拍一组。”", "“妆面会变，合作的默契会留下。”"],
  xiaokui: ["“那张藏蓝赤红的成片，我很喜欢。”", "“你越来越会抓住我的舞台状态了。”"],
  lingyin: ["“紫色灯光一亮，我就知道该看哪里。”", "“把项圈和耳饰拍进同一个构图吧。”"],
  tangmo: ["“贴纸会褪色，照片不会。”", "“珊瑚色夕阳很适合我们的下一组。”"],
  baiyu: ["“珍珠白的房间，需要一点安静的快门声。”", "“我想看看你镜头里的柔光。”"],
  xialan: ["“唱完最后一首，再留一张蓝色剧照。”", "“你拍到了我最喜欢的舞台停顿。”"],
  songyao: ["“月光是最好的舞台边灯。”", "“下次合影，换你站进我的动作轨迹里。”"]
};

const HOTSPOT_POSITIONS = {
  xiaoche: [[47, 9], [24, 61], [55, 42]],
  qiaoan: [[51, 38], [58, 14], [35, 43]],
  jibai: [[50, 22], [82, 57], [47, 64]],
  xiaokui: [[16, 63], [53, 43], [46, 61]],
  lingyin: [[50, 9], [50, 42], [77, 28]],
  tangmo: [[18, 27], [42, 61], [50, 40]],
  baiyu: [[19, 24], [68, 54], [54, 8]],
  xialan: [[19, 17], [42, 63], [50, 42]],
  songyao: [[65, 14], [32, 43], [83, 25]]
};

function loadCollection() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(COLLECTION_STORAGE_KEY) || "[]");
    const validIds = new Set(CASES.map((person) => person.id));
    return new Set(Array.isArray(stored) ? stored.filter((id) => validIds.has(id)) : []);
  } catch (error) {
    return new Set();
  }
}

function saveCollection() {
  try {
    window.localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify([...state.collection]));
  } catch (error) {
    // file:// 或隐私模式可能禁止本地存储；本次运行仍可正常使用相册。
  }
}

function loadMetaState() {
  const fallback = { wallet: 0, caseBestReward: {}, affinity: {} };
  try {
    const stored = JSON.parse(window.localStorage.getItem(META_STORAGE_KEY) || "null");
    if (!stored || typeof stored !== "object") return fallback;
    return {
      wallet: Math.max(0, Number(stored.wallet) || 0),
      caseBestReward: stored.caseBestReward && typeof stored.caseBestReward === "object" ? stored.caseBestReward : {},
      affinity: stored.affinity && typeof stored.affinity === "object" ? stored.affinity : {}
    };
  } catch (error) {
    return fallback;
  }
}

const metaState = loadMetaState();

function saveMetaState() {
  try {
    window.localStorage.setItem(META_STORAGE_KEY, JSON.stringify(metaState));
  } catch (error) {
    // file:// 或隐私模式可能禁止本地存储；本次运行仍可正常体验养成。
  }
}

const state = {
  caseIndex: 0,
  currentTab: "observe",
  actionCount: 0,
  trust: 100,
  used: new Set(),
  clues: [],
  coins: metaState.wallet,
  runCoins: 0,
  results: [],
  collection: loadCollection(),
  slapCount: 0
};

let albumViewIndex = 0;
let albumReturnFocus = null;
let loungeCharacterId = null;
let loungeReturnFocus = null;

const els = {
  app: document.querySelector("#app"),
  casePill: document.querySelector("#casePill"),
  coinPill: document.querySelector("#coinPill"),
  albumButton: document.querySelector("#albumButton"),
  resultAlbumButton: document.querySelector("#resultAlbumButton"),
  resultAlbumProgress: document.querySelector("#resultAlbumProgress"),
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
  introLounge: document.querySelector("#introLounge"),
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
  openLounge: document.querySelector("#openLounge"),
  albumOverlay: document.querySelector("#albumOverlay"),
  albumIndexView: document.querySelector("#albumIndexView"),
  albumDetailView: document.querySelector("#albumDetailView"),
  albumCount: document.querySelector("#albumCount"),
  albumGrid: document.querySelector("#albumGrid"),
  closeAlbum: document.querySelector("#closeAlbum"),
  backToAlbum: document.querySelector("#backToAlbum"),
  albumPhotoStage: document.querySelector("#albumPhotoStage"),
  albumDetailPhoto: document.querySelector("#albumDetailPhoto"),
  albumZoomHint: document.querySelector("#albumZoomHint"),
  albumDetailCounter: document.querySelector("#albumDetailCounter"),
  albumDetailRole: document.querySelector("#albumDetailRole"),
  albumDetailName: document.querySelector("#albumDetailName"),
  albumDetailCaption: document.querySelector("#albumDetailCaption"),
  albumPrev: document.querySelector("#albumPrev"),
  albumNext: document.querySelector("#albumNext"),
  loungeOverlay: document.querySelector("#loungeOverlay"),
  loungeIndexView: document.querySelector("#loungeIndexView"),
  loungeRoomView: document.querySelector("#loungeRoomView"),
  closeLounge: document.querySelector("#closeLounge"),
  backToLounge: document.querySelector("#backToLounge"),
  loungeWallet: document.querySelector("#loungeWallet"),
  roomWallet: document.querySelector("#roomWallet"),
  loungeUnlockCount: document.querySelector("#loungeUnlockCount"),
  loungeGrid: document.querySelector("#loungeGrid"),
  roomPhoto: document.querySelector("#roomPhoto"),
  roomRole: document.querySelector("#roomRole"),
  roomName: document.querySelector("#roomName"),
  roomHearts: document.querySelector("#roomHearts"),
  affinityFill: document.querySelector("#affinityFill"),
  affinityValue: document.querySelector("#affinityValue"),
  roomLine: document.querySelector("#roomLine"),
  chatWithCharacter: document.querySelector("#chatWithCharacter"),
  giftGrid: document.querySelector("#giftGrid"),
  duetCard: document.querySelector("#duetCard"),
  duetCharacterPhoto: document.querySelector("#duetCharacterPhoto"),
  duetTitle: document.querySelector("#duetTitle"),
  duetCopy: document.querySelector("#duetCopy"),
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
  const rawReward = correct ? 120 + Math.round(state.trust / 10) * 5 + Math.min(60, strongFound * 20) : 20;
  const previousBest = Math.max(0, Number(metaState.caseBestReward[person.id]) || 0);
  const reward = Math.max(0, rawReward - previousBest);
  const grade = score >= 92 ? "S" : score >= 80 ? "A" : score >= 65 ? "B" : "C";

  state.coins += reward;
  state.runCoins += reward;
  metaState.wallet = state.coins;
  metaState.caseBestReward[person.id] = Math.max(previousBest, rawReward);
  saveMetaState();
  state.results.push({ correct, trust: state.trust, score, strongFound, boundaryCount, reward, rawReward });
  if (correct) {
    state.collection.add(person.id);
    saveCollection();
  }
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
    els.photoRewardCopy.textContent = "已加入角色相册，可从当前结算页进入大图浏览。";
  }
  els.caseReward.textContent = reward > 0 ? `+¥${reward}` : "+¥0 · 已领最佳";
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
  els.finalCoins.textContent = `+¥${state.runCoins}`;
  els.summaryCopy.textContent = correct === CASES.length && boundaryTotal === 0
    ? `你用“男性信息＋本次女装呈现”完成了判断，也守住了每位来访者的拍摄边界。钱包现有 ¥${state.coins}，可以去夜间小屋送礼提升好感。`
    : `再试一次：优先寻找可靠的男性信息，并确认本次是否采用女装或明显女性化造型。钱包现有 ¥${state.coins}，已收录角色 ${state.collection.size} / ${CASES.length}。`;
  els.summaryOverlay.classList.add("visible");
}

function restartGame() {
  state.caseIndex = 0;
  state.coins = metaState.wallet;
  state.runCoins = 0;
  state.results = [];
  state.slapCount = 0;
  els.slapMark.classList.remove("visible", "fresh");
  els.successFx.classList.remove("visible", "fresh");
  els.app.classList.remove("slap-shake");
  els.resultOverlay.classList.remove("visible", "result-correct", "result-wrong");
  els.albumOverlay.classList.remove("visible");
  els.loungeOverlay.classList.remove("visible");
  els.decisionPanel.classList.remove("visible");
  els.summaryOverlay.classList.remove("visible");
  renderCase();
}

function updateCollectionPill() {
  els.albumButton.textContent = `▣ ${state.collection.size}`;
  els.albumButton.setAttribute("aria-label", `打开角色相册，已收集 ${state.collection.size} 张`);
  els.resultAlbumProgress.textContent = `已收集 ${state.collection.size} / ${CASES.length} · 点击浏览`;
  els.resultAlbumButton.setAttribute("aria-label", `打开角色相册，已收集 ${state.collection.size} / ${CASES.length}`);
}

function renderAlbum() {
  els.albumCount.textContent = `${state.collection.size} / ${CASES.length}`;
  els.albumGrid.innerHTML = CASES.map((person) => {
    const unlocked = state.collection.has(person.id);
    return `<button class="album-card${unlocked ? "" : " locked"}" type="button" data-character="${person.id}" ${unlocked ? "" : "disabled"} aria-label="${unlocked ? `打开${person.name}的角色图鉴` : "尚未解锁的角色图鉴"}">
      <img src="${person.image}" alt="${unlocked ? `${person.name}的成年虚构角色授权写真` : "尚未解锁的授权写真"}" draggable="false">
      <b>${unlocked ? person.name : "???"}</b>
      <span>${unlocked ? `${person.role} · 点击浏览` : "判断正确后解锁"}</span>
    </button>`;
  }).join("");
}

function unlockedCases() {
  return CASES.filter((person) => state.collection.has(person.id));
}

function showAlbumIndex() {
  els.albumIndexView.hidden = false;
  els.albumDetailView.hidden = true;
  els.albumPhotoStage.classList.remove("zoomed");
  els.albumZoomHint.textContent = "轻触查看特写";
  renderAlbum();
}

function openAlbum(originButton) {
  albumReturnFocus = originButton;
  els.closeAlbum.textContent = originButton === els.resultAlbumButton ? "← 返回结算" : "← 返回游戏";
  showAlbumIndex();
  els.albumOverlay.classList.add("visible");
  window.setTimeout(() => els.closeAlbum.focus(), 0);
}

function closeAlbum() {
  els.albumOverlay.classList.remove("visible");
  showAlbumIndex();
  if (albumReturnFocus) window.setTimeout(() => albumReturnFocus.focus(), 0);
}

function renderAlbumDetail() {
  const unlocked = unlockedCases();
  if (!unlocked.length) {
    showAlbumIndex();
    return;
  }
  albumViewIndex = (albumViewIndex + unlocked.length) % unlocked.length;
  const person = unlocked[albumViewIndex];
  els.albumDetailPhoto.src = person.image;
  els.albumDetailPhoto.alt = `${person.name}的成年虚构角色收藏大图`;
  els.albumDetailCounter.textContent = `${albumViewIndex + 1} / ${unlocked.length}`;
  els.albumDetailRole.textContent = `${person.age}+ · ${person.role}`;
  els.albumDetailName.textContent = person.name;
  els.albumDetailCaption.textContent = person.bookingTitle;
  els.albumPrev.disabled = unlocked.length < 2;
  els.albumNext.disabled = unlocked.length < 2;
  els.albumPhotoStage.classList.remove("zoomed");
  els.albumZoomHint.textContent = "轻触查看特写";
}

function openAlbumDetail(characterId) {
  const unlocked = unlockedCases();
  const nextIndex = unlocked.findIndex((person) => person.id === characterId);
  if (nextIndex < 0) return;
  albumViewIndex = nextIndex;
  els.albumIndexView.hidden = true;
  els.albumDetailView.hidden = false;
  renderAlbumDetail();
  window.setTimeout(() => els.backToAlbum.focus(), 0);
}

function shiftAlbumDetail(amount) {
  albumViewIndex += amount;
  renderAlbumDetail();
}

function affinityFor(characterId) {
  return Math.max(0, Math.min(AFFINITY_THRESHOLDS.at(-1), Number(metaState.affinity[characterId]) || 0));
}

function heartLevel(affinity) {
  return AFFINITY_THRESHOLDS.filter((threshold) => affinity >= threshold).length;
}

function heartText(level) {
  return `${"♥".repeat(level)}${"♡".repeat(5 - level)}`;
}

function renderLounge() {
  els.loungeWallet.textContent = `钱包 ¥${state.coins}`;
  els.roomWallet.textContent = `钱包 ¥${state.coins}`;
  els.loungeUnlockCount.textContent = `${state.collection.size} / ${CASES.length}`;
  els.loungeGrid.innerHTML = CASES.map((person) => {
    const unlocked = state.collection.has(person.id);
    const level = heartLevel(affinityFor(person.id));
    return `<button class="lounge-card${unlocked ? "" : " locked"}" type="button" data-character="${person.id}" ${unlocked ? "" : "disabled"} aria-label="${unlocked ? `拜访${person.name}，好感${level}颗心` : "尚未解锁的角色房间"}">
      <img src="${person.image}" alt="${unlocked ? `${person.name}的成年虚构角色小屋头像` : "尚未解锁的角色"}" draggable="false">
      <span><b>${unlocked ? person.name : "???"}</b><i>${unlocked ? heartText(level) : "未收录"}</i></span>
    </button>`;
  }).join("");
}

function showLoungeIndex() {
  loungeCharacterId = null;
  els.loungeIndexView.hidden = false;
  els.loungeRoomView.hidden = true;
  renderLounge();
}

function openLounge(originButton) {
  loungeReturnFocus = originButton;
  els.closeLounge.textContent = originButton === els.openLounge ? "← 返回结算" : "← 返回标题";
  showLoungeIndex();
  els.loungeOverlay.classList.add("visible");
  window.setTimeout(() => els.closeLounge.focus(), 0);
}

function closeLounge() {
  els.loungeOverlay.classList.remove("visible");
  showLoungeIndex();
  if (loungeReturnFocus) window.setTimeout(() => loungeReturnFocus.focus(), 0);
}

function renderCharacterRoom() {
  const person = CASES.find((candidate) => candidate.id === loungeCharacterId);
  if (!person || !state.collection.has(person.id)) {
    showLoungeIndex();
    return;
  }

  const affinity = affinityFor(person.id);
  const level = heartLevel(affinity);
  const nextTarget = level < 5 ? AFFINITY_THRESHOLDS[level] : AFFINITY_THRESHOLDS.at(-1);
  const previousTarget = AFFINITY_THRESHOLDS[Math.max(0, level - 1)];
  const segment = Math.max(1, nextTarget - previousTarget);
  const progress = level >= 5 ? 100 : Math.round(((affinity - previousTarget) / segment) * 100);
  const duetUnlocked = level >= 5;

  els.roomWallet.textContent = `钱包 ¥${state.coins}`;
  els.roomPhoto.src = person.image;
  els.roomPhoto.alt = `${person.name}的成年虚构角色小屋写真`;
  els.roomRole.textContent = `${person.age}+ · ${person.role}`;
  els.roomName.textContent = person.name;
  els.roomHearts.textContent = heartText(level);
  els.roomHearts.setAttribute("aria-label", `好感 ${level} 颗心`);
  els.affinityFill.style.width = `${progress}%`;
  els.affinityValue.textContent = level >= 5 ? `${affinity} · 已满心` : `${affinity} / ${nextTarget}`;
  els.roomLine.textContent = ROOM_LINES[person.id]?.[Math.min(1, Math.max(0, level - 2))] || "“拍摄结束后，坐一会儿吧。”";

  els.giftGrid.innerHTML = GIFT_TYPES.map((gift) => (
    `<button class="gift-card" type="button" data-gift="${gift.id}" ${level >= 5 ? "disabled" : ""}>
      <i>${gift.icon}</i><span><b>${gift.name}</b><small>${gift.copy}</small></span><strong>¥${gift.price}<em>+${gift.affinity}</em></strong>
    </button>`
  )).join("");

  els.duetCharacterPhoto.src = person.image;
  els.duetCard.classList.toggle("locked", !duetUnlocked);
  els.duetTitle.textContent = duetUnlocked ? `已解锁 · 与${person.name}的双人合影` : "双人合影尚未解锁";
  els.duetCopy.textContent = duetUnlocked
    ? "五颗心纪念已永久保存在本机小屋。"
    : `还差 ${Math.max(0, AFFINITY_THRESHOLDS.at(-1) - affinity)} 点好感，解锁 Ta 与玩家的专属合影。`;
}

function openCharacterRoom(characterId) {
  if (!state.collection.has(characterId)) return;
  loungeCharacterId = characterId;
  els.loungeIndexView.hidden = true;
  els.loungeRoomView.hidden = false;
  renderCharacterRoom();
  window.setTimeout(() => els.backToLounge.focus(), 0);
}

function giveGift(giftId) {
  const gift = GIFT_TYPES.find((candidate) => candidate.id === giftId);
  const person = CASES.find((candidate) => candidate.id === loungeCharacterId);
  if (!gift || !person) return;
  const currentAffinity = affinityFor(person.id);
  if (currentAffinity >= AFFINITY_THRESHOLDS.at(-1)) {
    showToast("已经是五颗心，不需要继续送礼了");
    return;
  }
  if (state.coins < gift.price) {
    showToast(`钱包还差 ¥${gift.price - state.coins}`);
    return;
  }

  const previousLevel = heartLevel(currentAffinity);
  state.coins -= gift.price;
  metaState.wallet = state.coins;
  metaState.affinity[person.id] = Math.min(AFFINITY_THRESHOLDS.at(-1), currentAffinity + gift.affinity);
  saveMetaState();
  els.coinPill.textContent = `¥${state.coins}`;
  renderCharacterRoom();
  const nextLevel = heartLevel(affinityFor(person.id));
  showToast(nextLevel > previousLevel ? `${person.name}的好感升到 ${nextLevel} 颗心` : `${person.name}收到${gift.name}，好感 +${gift.affinity}`);
  if (nextLevel >= 5 && previousLevel < 5) showSuccessEffect();
}

function chatWithCurrentCharacter() {
  const person = CASES.find((candidate) => candidate.id === loungeCharacterId);
  if (!person) return;
  const lines = ROOM_LINES[person.id] || ["“下次见面，记得带上相机。”"];
  const currentLine = els.roomLine.textContent;
  els.roomLine.textContent = lines.find((line) => line !== currentLine) || lines[0];
  els.roomLine.classList.remove("fresh");
  void els.roomLine.offsetWidth;
  els.roomLine.classList.add("fresh");
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
els.introLounge.addEventListener("click", () => openLounge(els.introLounge));
document.querySelector("#decideYes").addEventListener("click", () => decide(true));
document.querySelector("#decideNo").addEventListener("click", () => decide(false));
document.querySelector("#nextCase").addEventListener("click", nextCase);
document.querySelector("#restartGame").addEventListener("click", restartGame);
els.openLounge.addEventListener("click", () => openLounge(els.openLounge));
els.albumButton.addEventListener("click", () => openAlbum(els.albumButton));
els.resultAlbumButton.addEventListener("click", () => openAlbum(els.resultAlbumButton));
els.closeAlbum.addEventListener("click", closeAlbum);
els.backToAlbum.addEventListener("click", () => {
  showAlbumIndex();
  window.setTimeout(() => els.albumGrid.querySelector(".album-card:not(.locked)")?.focus(), 0);
});
els.albumGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".album-card[data-character]");
  if (card && !card.disabled) openAlbumDetail(card.dataset.character);
});
els.albumPhotoStage.addEventListener("click", () => {
  const zoomed = els.albumPhotoStage.classList.toggle("zoomed");
  els.albumZoomHint.textContent = zoomed ? "轻触还原全图" : "轻触查看特写";
});
els.albumPrev.addEventListener("click", () => shiftAlbumDetail(-1));
els.albumNext.addEventListener("click", () => shiftAlbumDetail(1));
els.albumOverlay.addEventListener("click", (event) => {
  if (event.target === els.albumOverlay) closeAlbum();
});
els.closeLounge.addEventListener("click", closeLounge);
els.backToLounge.addEventListener("click", () => {
  showLoungeIndex();
  window.setTimeout(() => els.loungeGrid.querySelector(".lounge-card:not(.locked)")?.focus(), 0);
});
els.loungeGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".lounge-card[data-character]");
  if (card && !card.disabled) openCharacterRoom(card.dataset.character);
});
els.giftGrid.addEventListener("click", (event) => {
  const gift = event.target.closest(".gift-card[data-gift]");
  if (gift && !gift.disabled) giveGift(gift.dataset.gift);
});
els.chatWithCharacter.addEventListener("click", chatWithCurrentCharacter);
els.loungeOverlay.addEventListener("click", (event) => {
  if (event.target === els.loungeOverlay) closeLounge();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (els.loungeOverlay.classList.contains("visible")) {
    if (!els.loungeRoomView.hidden) showLoungeIndex();
    else closeLounge();
    return;
  }
  if (els.albumOverlay.classList.contains("visible")) {
    if (!els.albumDetailView.hidden) showAlbumIndex();
    else closeAlbum();
  }
});

mountPortraits();
renderCase();
