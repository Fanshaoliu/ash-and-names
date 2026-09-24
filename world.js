'use strict';
const MAPS={};
const hash=(x,y,s=0)=>{let v=Math.sin(x*127.1+y*311.7+s*41.7)*43758.5453;return v-Math.floor(v);};
function makeMap(id,name,w,h,kind='room',theme='warm',parent=null){const seed=Object.keys(MAPS).length+1;const m={id,name,w,h,kind,theme,parent,seed,objects:[],decor:[],start:{x:Math.floor(w/2),y:h-3},tiles:Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>kind==='room'?(x<1||x>=w-1||y<3||y>=h-1?'wall':'floor'):(x===0||y===0||x===w-1||y===h-1?'hedge':'grass')))};MAPS[id]=m;return m;}
function paint(m,x,y,w,h,type){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(m.tiles[j]?.[i]!==undefined)m.tiles[j][i]=type;}
function road(m,x,y,tx,ty,width=1){const step=()=>{for(let yy=-Math.floor(width/2);yy<=Math.floor(width/2);yy++)for(let xx=-Math.floor(width/2);xx<=Math.floor(width/2);xx++){if(m.tiles[y+yy]?.[x+xx]!==undefined)m.tiles[y+yy][x+xx]=['water','bridge'].includes(m.tiles[y+yy][x+xx])?'bridge':m.kind==='room'?'floor':'path';}};step();while(x!==tx){x+=Math.sign(tx-x);step();}while(y!==ty){y+=Math.sign(ty-y);step();}}
function prop(map,index,x,y,w=1,h=1,extra={}){const o={type:'prop',index,x,y,w,h,...extra};MAPS[map].decor.push(o);return o;}
function npc(map,id,person,x,y){const o={type:'npc',id,person,x,y};MAPS[map].objects.push(o);return o;}
function clue(map,id,x,y,propIndex=12){const o={type:'clue',id,x,y,index:propIndex};MAPS[map].objects.push(o);return o;}
function side(map,id,x,y,index=12){const o={type:'side',id,x,y,index};MAPS[map].objects.push(o);return o;}
function join(parent,child,x,y,art=6,opt={}){const a=MAPS[parent],b=MAPS[child],doorX=Math.floor(b.w/2),doorY=b.h-2;b.parent=parent;b.start={x:doorX,y:doorY-1};
 a.objects.push({type:'portal',id:'to_'+child,x,y,dest:child,spawn:{...b.start},label:b.name,art,...opt});
 b.objects.push({type:'portal',id:'back_'+parent,x:doorX,y:doorY,dest:parent,spawn:{x,y:y+1},label:'返回'+a.name,art:-1,back:true});
 b.tiles[doorY][doorX]=b.kind==='room'?'floor':'path';if(b.tiles[doorY+1])b.tiles[doorY+1][doorX]=b.kind==='room'?'floor':'path';
 road(a,x,y,x,Math.min(a.h-2,y+2));if(art===6||art===7||art===8){for(let yy=y-2;yy<y;yy++)for(let xx=x-1;xx<=x+1;xx++)if(a.tiles[yy]?.[xx]!==undefined)a.tiles[yy][xx]='solid';}
}
const world=makeMap('isles','白页群岛',54,38,'overworld','sea');world.start={x:12,y:26};
for(let y=0;y<world.h;y++)for(let x=0;x<world.w;x++){let center=(x-27)**2/25**2+(y-19)**2/17**2;world.tiles[y][x]=center>1+.08*Math.sin(y*.9)?'water':'grass';if(x>27&&x<31&&y>17)world.tiles[y][x]='water';if(x>2&&x<9&&y>13&&y<22)world.tiles[y][x]='water';}
makeMap('sugar','方糖镇',32,26,'town','warm','isles');makeMap('square','昼务城',38,30,'town','stone','isles');makeMap('station','镜湖驿站',30,26,'town','sea','isles');makeMap('homes','学舍街',32,26,'town','garden','isles');makeMap('castle','钟城',36,28,'town','stone','isles');makeMap('garden','回声温室庭院',32,26,'town','garden','isles');makeMap('waterworks','旧水务所',30,28,'town','industrial','isles');
for(const [id,name,w,h,theme]of[
 ['noodle','四碗面早餐铺',24,20,'warm'],['pantry','店后冷库',20,18,'cool'],['workshop','竹翁修理所',26,20,'warm'],['alley','后巷小院',24,20,'garden'],
 ['council','临时议事厅',30,24,'stone'],['press','印刷间',22,20,'warm'],['cafe','河边茶室',24,20,'warm'],
 ['postoffice','未来邮局',26,20,'warm'],['signal','信号塔值班室',22,20,'cool'],['platform','不订行程的候车室',24,18,'warm'],
 ['dorm','铃的家',26,22,'warm'],['upstairs','楼上的卧室',22,18,'warm'],['clinic','记忆诊疗室',24,20,'cool'],['attic','小阁楼',22,18,'warm'],
 ['hall','明日事务局大厅',32,26,'stone'],['archive','名字档案馆',30,24,'cool'],['office','调岗办公室',24,20,'stone'],['secret','旧校准室',28,22,'dark'],['roof','钟城屋顶',28,22,'roof'],
 ['greenhouse','温室工作间',28,22,'garden'],['restroom','闻灯的休息室',22,18,'warm'],['backup','备份室',24,20,'cool'],['shed','工具棚',22,18,'garden'],
 ['pump','泵房',30,24,'industrial'],['canal','地下河道',34,22,'dark'],['control','调度控制室',26,20,'cool'],['sluice','旧渡口闸室',26,22,'dark']])makeMap(id,name,w,h,id==='alley'||id==='roof'?'court':'room',theme);
// Geography remains navigable; doors enter separate maps and return to the same threshold.
join('isles','sugar',12,25,7,{unlock:0});join('isles','square',24,20,8,{unlock:1});join('isles','station',14,9,6,{unlock:2});join('isles','homes',36,24,7,{unlock:3});join('isles','castle',35,11,8,{unlock:4});join('isles','garden',43,6,6,{unlock:5});join('isles','waterworks',43,30,8,{unlock:6});
for(const [x,y,tx,ty]of[[12,27,24,22],[24,22,14,11],[24,22,36,26],[24,22,35,13],[35,13,43,8],[36,26,43,32]])road(world,x,y,tx,ty,1);
join('sugar','noodle',10,9,7);join('sugar','workshop',23,12,6);join('sugar','alley',23,21,20);join('noodle','pantry',19,5,20,{route:[0,0]});
join('square','council',19,10,8);join('square','cafe',8,20,7);join('council','press',24,6,20,{route:[1,0]});
join('station','postoffice',10,9,6);join('station','signal',24,9,8,{route:[2,0]});join('station','platform',21,20,20);
join('homes','dorm',11,11,6);join('homes','clinic',25,9,7,{route:[3,0]});join('dorm','upstairs',20,6,19);join('upstairs','attic',17,5,19,{route:[3,1]});
join('castle','hall',18,9,8);join('hall','archive',7,6,20);join('hall','office',25,6,20,{route:[4,0]});join('archive','secret',24,5,19,{route:[4,1],puzzle:'clock'});join('hall','roof',25,18,19,{unlock:7});
join('garden','greenhouse',15,10,7);join('greenhouse','restroom',7,5,20);join('greenhouse','backup',22,5,20,{route:[5,0]});join('garden','shed',25,19,6);
join('waterworks','pump',15,10,8);join('pump','canal',7,6,19);join('pump','control',24,6,20,{route:[6,0]});join('canal','sluice',27,6,20);
// Outdoor layouts have distinct water, streets and planting plans.
for(const id of ['sugar','square','station','homes','castle','garden','waterworks']){const m=MAPS[id];
 if(['square','station','waterworks'].includes(id)){paint(m,3,5,id==='waterworks'?3:2,m.h-9,'water');if(id==='station')paint(m,2,2,m.w-4,3,'water');}
 if(id==='homes')paint(m,18,15,7,5,'garden');if(id==='garden')paint(m,4,5,5,12,'garden');
 road(m,Math.floor(m.w/2),m.h-2,Math.floor(m.w/2),Math.floor(m.h*.6),3);
 for(const o of m.objects){road(m,o.x,o.y,Math.floor(m.w/2),Math.floor(m.h*.6),1);if(o.art===6||o.art===7||o.art===8){paint(m,o.x-1,o.y-2,3,2,'solid');m.tiles[o.y][o.x]='path';}}
 for(let y=2;y<m.h-2;y+=3)for(let x=2;x<m.w-2;x+=3)if(m.tiles[y][x]==='grass'&&hash(x,y,m.seed)>.57&&!m.objects.some(o=>Math.abs(o.x-x)<4&&Math.abs(o.y-y)<5)){prop(id,hash(x,y)>.5?0:1,x,y,1,1,{kind:'tree'});m.tiles[y][x]='solid';}
 prop(id,10,Math.floor(m.w/2)-4,Math.floor(m.h*.6)-2,1,1);prop(id,3,Math.floor(m.w/2)+4,Math.floor(m.h*.6)+3,2,1);prop(id,22,Math.floor(m.w/2)+2,m.h-5,1,1);
}
for(const m of Object.values(MAPS).filter(m=>m.kind==='room')){
 if(m.theme==='stone')paint(m,Math.floor(m.w/2)-1,4,3,m.h-6,'carpet');
 if(m.theme==='dark'){paint(m,Math.floor(m.w/2),5,2,m.h-7,'water');road(m,Math.floor(m.w/2),m.h-3,Math.floor(m.w/2),5);}
 // Furnish each place for its actual use: a café has tables, an office has desks.
 const layouts={
 noodle:[[16,4,11],[16,8,14],[16,18,9],[12,4,5],[17,13,5],[13,15,4]],
 pantry:[[17,4,5],[17,7,5],[17,14,5],[21,4,11],[21,14,12]],
 workshop:[[12,4,6],[12,19,6],[17,21,12],[21,5,13],[13,12,4]],
 council:[[12,8,8],[12,11,8],[12,17,8],[12,24,13],[13,6,4],[13,9,4]],
 press:[[12,5,6],[12,15,6],[17,4,13],[21,15,14]],
 cafe:[[16,5,6],[16,19,7],[16,17,14],[16,10,15],[13,4,4]],
 postoffice:[[12,5,6],[12,13,6],[17,20,6],[17,21,13],[13,4,4]],
 signal:[[18,4,5],[18,7,5],[17,17,7],[12,5,13]],
 platform:[[15,4,6],[15,6,6],[15,18,6],[15,20,6],[22,20,12]],
 dorm:[[16,5,13],[14,5,5],[13,14,4],[17,20,13],[3,4,17]],
 upstairs:[[14,5,5],[14,14,5],[17,18,11],[12,6,12]],
 clinic:[[14,4,6],[14,8,6],[17,19,5],[18,20,14],[12,4,14]],
 attic:[[13,4,5],[21,16,6],[21,17,12],[3,5,12]],
 hall:[[12,6,10],[12,10,10],[12,22,10],[12,26,10],[17,5,17],[13,11,4],[13,20,4]],
 archive:[[13,4,5],[13,7,5],[13,10,5],[13,16,5],[13,19,5],[13,6,12],[13,23,13]],
 office:[[12,6,7],[12,17,7],[17,4,13],[17,19,13]],
 secret:[[18,5,7],[18,10,7],[18,22,7],[17,7,13],[21,21,14]],
 greenhouse:[[3,5,8],[3,8,8],[3,5,12],[3,23,12],[3,22,16],[12,10,16]],
 restroom:[[14,5,6],[16,16,12],[3,4,12],[13,16,4]],
 backup:[[18,5,6],[18,8,6],[18,17,6],[18,20,6],[17,5,13]],
 shed:[[21,4,5],[21,17,6],[12,17,13],[3,4,13]],
 pump:[[23,4,8],[23,8,10],[23,25,9],[18,5,17],[21,25,17]],
 canal:[[22,4,7],[22,29,12],[21,6,14],[23,22,6]],
 control:[[18,5,6],[18,9,6],[18,17,6],[18,21,6],[12,5,14]],
 sluice:[[23,5,7],[23,20,7],[22,5,14],[21,20,15]]
 };
 for(const [index,x,y]of layouts[m.id]||[])prop(m.id,index,x,y,index===13||index===12?2:1,1);

}
// Characters and examinable details: clues are notes, never combat loot or consumable inventory.
npc('noodle','grandma','grandma',7,7);npc('noodle','threshold','threshold',16,13);npc('workshop','bamboo','bamboo',10,8);
npc('council','clerk','clerk',13,8);npc('cafe','singer','singer',9,9);npc('press','editor','jin',14,10);
npc('postoffice','post','post',9,8);npc('platform','passenger','ling',9,7);npc('signal','signal_agent','threshold',10,7);
npc('dorm','ling','ling',9,9);npc('upstairs','zero','zero',8,7);npc('clinic','nurse','mio',13,8);
npc('hall','registrar','clerk',16,9);npc('archive','archivist','jin',10,10);npc('roof','artist','child',10,8);
npc('greenhouse','wen','wen',13,9);npc('shed','seven','seven',9,7);npc('backup','backup_seven','seven',13,9);
npc('pump','jin','jin',15,10);npc('control','system','system',14,9);npc('sluice','listener','singer',12,10);
npc('sugar','girl','mio',17,16);npc('square','public_agent','agent',26,18);npc('station','ticket','post',10,18);npc('homes','outside_zero','zero',22,19);npc('garden','gardener','seven',12,18);npc('castle','observer','bamboo',10,18);npc('waterworks','engineer','wen',20,19);
for(const [map,id,x,y,index]of[
 ['noodle','breakfast_receipt',11,8,12],['workshop','breakfast_hammer',15,10,12],['pantry','breakfast_old',10,7,17],['alley','breakfast_hours',10,8,18],
 ['square','consensus_board',25,16,18],['council','consensus_log',20,12,18],['press','consensus_proof',10,10,12],['cafe','consensus_silence',15,9,16],
 ['postoffice','forecast_notice',17,9,12],['station','forecast_rain',12,17,23],['signal','forecast_model',14,11,18],['platform','forecast_wait',15,8,15],
 ['dorm','double_photo',15,9,12],['upstairs','double_schedule',13,9,12],['clinic','double_record',16,11,18],['attic','double_attic',12,7,12],
 ['archive','origin_registry',16,9,17],['hall','origin_clock',11,16,18],['office','origin_office',12,8,12],['secret','origin_secret',19,9,18],
 ['greenhouse','warranty_clock',17,12,18],['restroom','warranty_letter',12,8,12],['backup','warranty_copy',17,11,18],['shed','warranty_plant',13,10,3],
 ['pump','stock_list',21,14,12],['waterworks','stock_pump',10,19,23],['control','stock_control',18,12,18],['sluice','stock_sluice',18,12,15],
 ['square','tomorrow_minutes',17,20,12],['archive','tomorrow_blank',9,16,12],['roof','tomorrow_roof',17,9,12],['canal','tomorrow_river',11,15,15]
])clue(map,id,x,y,index);
for(const [map,id,x,y,index]of[['alley','side_cat',16,13,21],['cafe','side_wait',7,13,15],['platform','side_rain',6,10,18],['attic','side_drawing',7,10,12],['archive','side_pet',5,16,13],['shed','side_flower',6,10,3],['canal','side_invoice',23,15,12],['roof','side_door',23,14,20]])side(map,id,x,y,index);
MAPS.council.objects.push({type:'ending',id:'ending_board',x:16,y:15,index:18,label:'空白公告板'});
// Paths end on a floor cell and all interaction footprints remain reachable.
for(const m of Object.values(MAPS)){
 for(const o of m.objects){if(o.type!=='portal'||o.back){if(m.tiles[o.y]?.[o.x]!==undefined)m.tiles[o.y][o.x]=m.kind==='room'?'floor':'path';}for(const [dx,dy]of [[0,1],[1,0],[-1,0],[0,-1]])if(m.tiles[o.y+dy]?.[o.x+dx]==='wall'&&o.type!=='portal')m.tiles[o.y+dy][o.x+dx]=m.kind==='room'?'floor':'path';}
 m.decor=m.decor.filter(o=>!m.objects.some(e=>Math.abs(e.x-o.x)<2&&Math.abs(e.y-o.y)<2));
 for(const d of m.decor)if(d.kind!=='tree'){if(m.tiles[d.y]?.[d.x])m.tiles[d.y][d.x]='solid';}
 // Ensure a clear corridor from each threshold to its room's center; keep portals unobstructed.
 if(m.kind==='room')for(const o of m.objects){road(m,o.x,o.y,o.x,Math.min(m.h-3,o.y+1));road(m,o.x,Math.min(m.h-3,o.y+1),Math.floor(m.w/2),m.h-3);}
 m.decor=m.decor.filter(d=>!m.objects.some(o=>o.x===d.x&&o.y===d.y));
}
// Ground footprints match the base of the art; canopies and roofs occlude by depth.
for(const m of Object.values(MAPS)){
 m.blocked=new Set();
 for(const o of m.objects){
  if(o.type!=='portal')m.blocked.add(o.x+','+o.y);
  else if([6,7,8].includes(o.art)){
   const half=m.kind==='overworld'?1:2,depth=m.kind==='overworld'?2:o.art===8?3:2;
   for(let yy=o.y-depth;yy<=o.y;yy++)for(let xx=o.x-half;xx<=o.x+half;xx++)if(xx!==o.x||yy!==o.y)m.blocked.add(xx+','+yy);
  }
 }
 for(const d of m.decor){for(let k=0;k<(d.w||1);k++)m.blocked.add((d.x+k)+','+d.y);}
 // Small towns have planted verges and low garden edges rather than isolated objects on a plain.
 if(m.kind==='town')for(let y=3;y<m.h-3;y+=4)for(let x=3;x<m.w-3;x+=4){
  if(m.tiles[y][x]!=='grass'||hash(x,y,m.seed)<.5||m.objects.some(o=>Math.abs(o.x-x)<4&&Math.abs(o.y-y)<4)||m.decor.some(o=>Math.abs(o.x-x)<2&&Math.abs(o.y-y)<2))continue;
  prop(m.id,hash(x,y,30)>.55?3:2,x,y,1,1);m.blocked.add(x+','+y);
 }
}
for(let y=3;y<world.h-3;y+=2)for(let x=3;x<world.w-3;x+=2){
 if(world.tiles[y][x]!=='grass'||world.objects.some(o=>Math.abs(o.x-x)<3&&Math.abs(o.y-y)<4))continue;
 if(hash(Math.floor(x/5),Math.floor(y/5),3)>.48&&hash(x,y,11)>.27){prop('isles',y<12?4:hash(x,y)>.5?0:1,x,y);world.blocked.add(x+','+y);}
}
const CLUE_PLACES={};for(const m of Object.values(MAPS))for(const o of m.objects)if(o.type==='clue')CLUE_PLACES[o.id]={map:m.id,x:o.x,y:o.y};
function ancestors(id){let a=[],cur=MAPS[id];while(cur){a.unshift(cur.name);cur=MAPS[cur.parent];}return a;}
function portalAllowed(o,s){if(o.unlock!==undefined&&Math.min(7,s.chapter)<o.unlock)return '先沿着眼前的线索调查，之后会知道去这里的理由。';if(o.route){let [c,r]=o.route,rec=s.records[c];if(s.chapter<c)return '这扇门暂时没有开放。';if(s.chapter===c&&rec.route!==r)return rec.route===null?'先与本案委托人商量调查路线。':'本次调查走另一条路线。完成案件后可以回来看看。';}if(o.puzzle&&!s.flags.archiveDoor)return '这扇门需要一个下班时间。';return '';}
function passable(m,x,y){return x>=0&&y>=0&&x<m.w&&y<m.h&&!['wall','water','hedge','solid'].includes(m.tiles[y][x])&&!m.blocked?.has(x+','+y);}
function findPath(m,from,to){let tx=Math.round(to.x),ty=Math.round(to.y),sx=Math.round(from.x),sy=Math.round(from.y);if(!passable(m,tx,ty)||!passable(m,sx,sy))return [];let q=[[sx,sy]],prev=new Map([[sx+','+sy,null]]),p=0;while(p<q.length){let [x,y]=q[p++],k=x+','+y;if(x===tx&&y===ty){let route=[];while(prev.get(k)!==null){route.push({x:Number(k.split(',')[0]),y:Number(k.split(',')[1])});k=prev.get(k);}return route.reverse();}for(let [dx,dy]of[[0,1],[1,0],[0,-1],[-1,0]]){let xx=x+dx,yy=y+dy,key=xx+','+yy;if(passable(m,xx,yy)&&!prev.has(key)){prev.set(key,k);q.push([xx,yy]);}}}return [];}
function mapRoute(from,to,s){if(from===to)return [];let q=[from],prev=new Map([[from,null]]),p=0;while(p<q.length){let id=q[p++];if(id===to){let a=[];while(prev.get(id)){let v=prev.get(id);a.unshift(v.portal);id=v.from;}return a;}for(const o of MAPS[id].objects.filter(o=>o.type==='portal')){let denied=portalAllowed(o,s);if(denied&&!o.puzzle)continue;if(!prev.has(o.dest)){prev.set(o.dest,{from:id,portal:{...o,map:id}});q.push(o.dest);}}}return null;}
globalThis.WORLD={maps:MAPS,cluePlaces:CLUE_PLACES,passable,findPath,mapRoute,ancestors,portalAllowed};
