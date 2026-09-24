# 灰烬之名 · Ash & Names

一个可以在手机和电脑浏览器中游玩的原创 2D 像素 RPG。

**[开始游戏](https://fanshaoliu.github.io/ash-and-names/)** · [完整剧本](./剧本.md) · [思想手记](./思想手记.md)

AI 推动科学发展，人类获得自由操纵物质的技术。居民把这些效果叫作魔法。维系聚落的日轮却在每次重燃时抹去一个人的名字；少年凡少沿着一碗多出来的面，开始追查这套世界的代价。

故事以海德格尔的分析框架重新追问此在、技术与人工智能的关系。它不预设人工智能必然具备或永远不可能具备此在的特征，也不把行为相似、生成来源、记忆备份或角色自述直接当作证明。

## 可玩的内容

- 八章主线，八张可探索地图，八名首领，八段可选记忆支线，八件永久成长宝物。
- 三名伙伴、共享等级、十二种角色技能，以及三人共鸣合击；包含蓄力、破绽、打断、防御、复苏与补给。
- 八段 AI 情境，每段两次决定；选择形成不同的后续安排，并写入手记与结局。
- 32 组思想手记，覆盖此在、在世存在、上手与在手、常人、畏、操心、本真性、向死而在、时间性、座架、解蔽、栖居等核心脉络。没有“本真分数”或“觉醒指数”。
- 三个结局；至少四份记忆可开启第三种选择，八份全部收集后追加隐藏尾声。
- 独立人物造型与对话头像，城镇、森林、港口、雪原与遗迹场景；合成配乐与技能音效。

主线、各选项及结局约 2.7 万中文字符，独立思想手记约 1.3 万字符。不是开放世界，也不接入在线大模型；所有剧情与分支均在本地运行。

## 操作与存档

电脑使用 WASD / 方向键移动，E / 空格 / Enter 互动，J 打开手记。也可以点击地图或人物自动行走。手机使用方向键与 A 键，或直接点地图与战斗指令。黄色任务文字可点击带路。

每章先调查两名主线人物，获得宝物、完成蓝色 ◎ 处的追问并击败两组普通敌人，然后挑战首领。营火免费恢复并刷新普通敌人。战败不扣等级或丢剧情。已解锁地区可在「旅人手记 → 世界」返回。

进度自动保存在当前浏览器的 localStorage。换设备请从「存档管理」导出 JSON，再在另一台设备导入。清除浏览器数据会清除本机进度；不提供账号与云同步。兼容 v1 存档，旧进度可以返回各章补充新追问。

## 本地运行

无需安装依赖。在项目目录运行：

```sh
python3 -m http.server 8765
```

打开 `http://127.0.0.1:8765/`。正式站点由 GitHub Pages 从 `main` 根目录发布，`.nojekyll` 保证原样提供静态文件。游戏运行不依赖外部字体、CDN、API、账号或任何密钥。

需要 Node.js 18 或更新版本来运行开发检查和重建读本：

```sh
npm test
npm run books
```

`tests/engine-test.cjs` 以模拟 DOM 驱动实际游戏逻辑，验证八章通关、路径可达性、升级、分支、结局、保存和损坏文件拒绝。它不能代替真实浏览器的图像、音频与触摸检查；人工浏览器检查记录见 [验证记录](./验证记录.md)。

## 文件与素材

- `story.js`：主线、支线与结局；`ai-cases.js`：开放式 AI 情境；`philosophy.js`：32 组概念与阅读线索。
- `game.js`：地图、交互、回合战斗、成长、特效、声音与保存。
- `scripts/export-books.cjs`：从剧情源文件生成 Markdown 与可阅读的 `script.html` / `notes.html`。
- `assets/fanshao.webp`：沿用此前为本项目作者制作的「凡少」动画宠物，实际用于镜影技能动画。
- `assets/shattered-sun.png`：保留的原创生成封面；`terrain.png`、`props.png`、`characters.png`：本次生成并接入的游戏素材，提示词随附。

美术方向参考 SFC 时代俯视 RPG 的地图层次与细致可辨的人物；没有打包《勇者斗恶龙》或《泰拉瑞亚》的原游戏素材。本作不是这些游戏或《火影忍者》的官方作品。

## 哲学阅读

- Heidegger, *Being and Time*：以节号定位（详见思想手记）。
- [The Question Concerning Technology](https://www.beyng.com/docs/QCT.html)
- [Building Dwelling Thinking](https://doubleoperative.com/wp-content/uploads/2009/12/heidegger-martin_building-dwelling-thinking.pdf)
- [Letter on “Humanism” 摘页](https://www.beyng.com/pages/en/Pathmarks/Pathmarks.274.html)
- [Stanford Encyclopedia of Philosophy: Heidegger](https://plato.stanford.edu/entries/heidegger/)
- [Stanford Encyclopedia of Philosophy: Authenticity](https://plato.stanford.edu/entries/authenticity/)

32 组主题是供玩家进一步阅读的主干，并非公认穷尽的术语表。AI 情境是当代延伸，不冒充海德格尔本人的答案；选择后的照料安排与存在论判断保持区分。
