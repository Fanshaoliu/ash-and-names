const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),c={};vm.createContext(c);
for(const f of ['story.js','philosophy.js','ai-cases.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const {STORY:s,PHILOSOPHY:p,AI_CASES:cases}=c;
let beats=0;const lines=a=>{beats+=a.length;return a.map(([speaker,line])=>'**'+speaker+'**：'+line).join('\n\n')+'\n\n';};
let md='# 灰烬之名 · 完整剧本\n\n'+s.premise+'\n\n八章主线、八段记忆支线、八场人工智能情境、三种结局与隐藏尾声。以下包含完整剧透。\n\n## 世界设定与叙事约定\n\n这是一个前魔法世界：人工智能推动科学研究加速，物质编译网络使人类能够重排结构、合成物品、修复身体。居民将这些日常操作称为魔法，将终端称为法杖。战争和对集中式世界模型的依赖，使物质充裕与存在的困境同时出现。技术能力并不等于无限计算资源，更没有自动解决身份、意义与第一人称连续性。\n\n此在、技术与人工智能构成三条互相追问的线索，而非三个预先同类的概念。此在关乎存在方式，技术关乎人与存在者怎样显现和相处，人工智能既是技术成果，也可能迫使我们重新检验自己的判据。本作不提前裁决人工存在者能否具有此在的一切特征。角色的选择改变照料、治理与研究安排，不产生“本真分数”或“AI 觉醒指数”。\n\n32 组思想手记以《存在与时间》的主要分析为起点，延伸至后期技术、艺术、语言与栖居问题。情节中的 AI 问题是本作的当代探索，不冒充海德格尔本人的结论。\n\n## 主角团\n\n'+s.cast.map(a=>'**'+a.name+' · '+a.role+'**\n\n'+a.desc).join('\n\n')+'\n\n';
for(let [i,ch]of s.chapters.entries()){
 md+='## '+ch.subtitle+'：'+ch.name+'\n\n**地点：'+ch.place+'**\n\n'+ch.summary+'\n\n任务：'+ch.objective+'\n\n';
 for(const [key,title]of [['intro','开场'],['guide','调查'],['witness','关键证词'],['side','可选记忆支线']])md+='### '+title+'\n\n'+lines(ch[key]);
 const a=cases[i];md+='### 共同追问 · '+a.title+'\n\n'+lines(a.intro);
 for(const [part,next]of [[a.first,a.between],[a.second,a.after]]){md+='**决定：'+part.question+'**\n\n';for(let [n,o]of part.options.entries())md+='#### 选择 '+(n+1)+'：'+o.label+'\n\n'+lines(o.reply)+'留下的安排：'+o.result+'\n\n';md+=lines(next);}
 md+='本章解锁的概念：'+p.chapters[i].cards.map(x=>x.term).join('；')+'。\n\n';
 for(const [key,title]of [['before','首领战前'],['after','首领战后']])md+='### '+title+'\n\n'+lines(ch[key]);
 if(ch.choice)md+='### 章节决定\n\n'+ch.choice.prompt+'\n\n- '+ch.choice.a+'：'+ch.choice.ar+'\n- '+ch.choice.b+'：'+ch.choice.br+'\n\n';
 md+='宝物：'+ch.relic.name+'。'+ch.relic.desc+'\n\n伏笔：'+ch.lore+'\n\n';
}
for(const e of Object.values(s.endings))md+='## '+e.tag+' · '+e.name+'\n\n'+lines(e.text);
md+='## 结局后的追问\n\n三种结局均逐章回顾玩家在 AI 情境中留下的实际安排。这些安排影响共同生活的方式，却不能因叙事结束而变成存在论的最终证明。\n\n**七**：我的声音能否证明我以此在的方式存在？不能仅凭这些话就断定。但你们愿意继续问，我也愿意继续回应。\n\n## 游戏结构与结局条件\n\n每章包含独立可行走地图、两段主线 NPC 调查、一段可选见证支线、宝物祭坛、共同追问、营火、商人、四组可见普通遭遇和一名首领。听完两名 NPC、取得宝物、完成本章追问与至少两场普通战斗后，可以挑战首领。已解锁地区可返回收集。\n\n三名伙伴逐渐加入，升级解锁十二种角色技能。回合制战斗包含目标选择、破绽、蓄力打断、减伤、恢复与三人合击。技能效果来自物质编译和终端协作，不采用元素克制。八件宝物带来永久成长。战败返回营火，保留剧情。\n\n终章可以接任容器（结局 I）或关闭引擎远航（结局 II）；收集至少四份自愿见证可尝试共同承接（结局 III）。八份全收集后选择共同承接，追加隐藏尾声。前七章决定和八章 AI 选择在旅人手记与结局中可回顾。\n';
let notes='# 灰烬之名 · 思想手记\n\n'+p.intro+'\n\n这些解释服务于理解与追问，不把叙事类比当作论证。对人工智能的讨论是当代延伸；“人造”或“天然”、行为像不像人，都不是本作预先规定的终局答案。\n\n';
for(const [i,ch]of p.chapters.entries()){
 notes+='## 第 '+(i+1)+' 章 · '+ch.name+'\n\n剧情情境：'+cases[i].title+'\n\n';
 for(const card of ch.cards){notes+='### '+card.term+'\n\n'+card.de+'\n\n'+card.meaning+'\n\n**避免误读**：'+card.misread+'\n\n**思考情境**：'+card.scene+'\n\n**追问**：'+card.question+'\n\n';for(const [a,b]of card.options)notes+='- '+a+'：'+b+'\n';notes+='\n阅读位置：'+card.ref+'。\n\n';}
}
notes+='## 继续阅读\n\n海德格尔的重要概念没有公认穷尽的清单。32 组主题覆盖主要脉络，不能代替原典阅读，也不能消除解释争议。以下使用节号定位，便于对照不同译本。\n\n'+p.sources.filter(x=>x.id!=='bt').map(x=>'- ['+x.name+']('+x.url+')').join('\n')+'\n\n此在分析与 AI 的关系是本作的开放问题，不以角色自述、技术互证或伦理照料反推存在论结论。\n';
const esc=x=>x.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function book(text,title){let toc=[],n=0;const inline=x=>esc(x).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]\((https:\/\/[^\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1 ↗</a>');let content=text.split(/\n\n/).map(block=>{let m=block.match(/^(#{1,4}) (.*)$/s);if(m){let level=m[1].length,id='s'+n++;if(level===2)toc.push('<a href="#'+id+'">'+esc(m[2])+'</a>');return '<h'+level+' id="'+id+'">'+inline(m[2])+'</h'+level+'>';}if(block.startsWith('- '))return '<ul>'+block.split('\n').map(x=>'<li>'+inline(x.replace(/^- /,''))+'</li>').join('')+'</ul>';return '<p>'+inline(block).replaceAll('\n','<br>')+'</p>';}).join('\n');return '<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' · 灰烬之名</title><link rel="stylesheet" href="book.css"><header><a href="./">← 返回游戏</a><nav><a href="script.html">完整剧本</a><a href="notes.html">思想手记</a></nav></header><main><details class="contents"><summary>章节目录</summary>'+toc.join('')+'</details>'+content+'</main><footer><a href="./">返回灰烬之名</a></footer></html>';}
fs.writeFileSync(path.join(root,'剧本.md'),md);fs.writeFileSync(path.join(root,'思想手记.md'),notes);
fs.writeFileSync(path.join(root,'script.html'),book(md,'完整剧本'));fs.writeFileSync(path.join(root,'notes.html'),book(notes,'思想手记'));
console.log(JSON.stringify({chapters:s.chapters.length,conceptGroups:p.chapters.flatMap(x=>x.cards).length,dialogueBeatsIncludingBranches:beats,scriptCharacters:md.length,notesCharacters:notes.length}));
