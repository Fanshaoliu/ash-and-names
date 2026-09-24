'use strict';
const Art=(()=>{
 const T=16,cache=new Map(),images={},frames=[],portraits={},oldFrames=[],propFrames=[];let ready=false;
 const colors={warm:{ground:'#658258',light:'#6c895e',dark:'#58734f',path:'#b49b70',edge:'#8b785b',water:'#4d9ba0',wall:'#a89577',floor:'#907052'},stone:{ground:'#6b836d',light:'#738b72',dark:'#5c755f',path:'#b5b39a',edge:'#8e9687',water:'#55959a',wall:'#9ca69e',floor:'#9ca69e'},sea:{ground:'#668464',light:'#718f6b',dark:'#58765c',path:'#beab80',edge:'#9a8c6e',water:'#528f9d',wall:'#91aaa8',floor:'#b2a58c'},garden:{ground:'#6e8961',light:'#79966c',dark:'#617b57',path:'#b1a17d',edge:'#8d8867',water:'#599c9c',wall:'#8eab9c',floor:'#889e84'},cool:{ground:'#587667',light:'#668573',dark:'#4b675b',path:'#99ada9',edge:'#728c8a',water:'#4b8999',wall:'#7e9698',floor:'#859e9e'},industrial:{ground:'#718078',light:'#7c8a80',dark:'#64726b',path:'#a9a595',edge:'#81867d',water:'#4d8b92',wall:'#748788',floor:'#879592'},dark:{ground:'#495d58',light:'#516c60',dark:'#3d504b',path:'#788c84',edge:'#596f6b',water:'#375e70',wall:'#526b70',floor:'#657c7b'},roof:{ground:'#4c6772',light:'#557780',dark:'#3e5662',path:'#97a69c',edge:'#788f87',water:'#5496a1',wall:'#93aaa9',floor:'#849d9d'}};
 function rect(g,c,x,y,w,h){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
 function shadow(g,x,y,w=12,a=.3){g.save();g.globalAlpha=a;rect(g,'#172a2a',x-w/2,y-2,w,3);rect(g,'#172a2a',x-w/2+2,y-3,w-4,5);g.restore();}
 function normalize(img,sx,sy,sw,sh,w,h){let c=document.createElement('canvas');c.width=w;c.height=h;let g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(img,sx,sy,sw,sh,0,0,w,h);let d=g.getImageData(0,0,w,h);for(let i=3;i<d.data.length;i+=4)if(d.data[i]<115)d.data[i]=0;else d.data[i]=255;g.putImageData(d,0,0);return c;}
 async function init(){await Promise.all(Object.entries({walk:'walk-v3.png',world:'world-v3.png',old:'characters.png',pet:'fanshao.webp'}).map(([key,path])=>new Promise((res,rej)=>{let im=new Image();im.onload=()=>{images[key]=im;res();};im.onerror=()=>rej(new Error('未能加载 '+path));im.src='assets/'+path;})));
 for(let i=0;i<4;i++){const row=ART_LAYOUT.walk.filter(f=>f.row===i),maxH=Math.max(...row.map(f=>f.opaqueBounds[3])),scale=28/maxH;
  frames[i]=row.map(f=>{const [sx,sy,sw,sh]=f.opaqueBounds;let w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));return {image:normalize(images.walk,sx,sy,sw,sh,w,h),w,h,dx:Math.round((sx-(f.cell[0]+f.cell[2]/2))*scale),dy:Math.round((sy-f.feetY)*scale)};});
  const f=row[1].opaqueBounds;portraits['s'+i]=normalize(images.walk,f[0],f[1],f[2],f[3]*.48,56,56);
 }
 for(let i=0;i<32;i++){let cw=images.old.naturalWidth/4,ch=images.old.naturalHeight/8,sx=Math.round(i%4*cw),sy=Math.round(Math.floor(i/4)*ch),c=document.createElement('canvas');c.width=Math.round(cw);c.height=Math.round(ch);let g=c.getContext('2d');g.drawImage(images.old,sx,sy,cw,ch,0,0,cw,ch);let d=g.getImageData(0,0,c.width,c.height).data,l=c.width,r=0,t=c.height,b=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>130){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}let sw=r-l+1,sh=b-t+1,w=Math.min(21,Math.round(sw/sh*28));oldFrames[i]={image:normalize(images.old,sx+l,sy+t,sw,sh,w,28),w,h:28};portraits['o'+i]=normalize(images.old,sx+l,sy+t,sw,Math.min(sh*.5,sw),56,56);}
 const sizes=[[34,36],[27,42],[30,17],[26,15],[27,22],[32,16],[64,66],[64,64],[80,82],[48,27],[32,34],[32,37],[28,25],[29,32],[28,35],[17,24],[34,34],[21,33],[22,32],[30,24],[20,29],[25,25],[13,43],[28,32]];
 for(let i=0;i<24;i++){const s=ART_LAYOUT.props[i],[w,h]=sizes[i];propFrames[i]={image:normalize(images.world,...s,w,h),w,h};}
 ready=true;return true;
 }
 function person(g,id,x,y,dir='down',frame=1,scale=1){const p=TALE.people[id]||TALE.people.fan;shadow(g,x,y,10*scale,.32);g.save();g.translate(Math.round(x),Math.round(y));g.scale(scale,scale);g.imageSmoothingEnabled=false;
 if(p.terminal){const v=propFrames[18];if(v)g.drawImage(v.image,-9,-25,18,25);g.restore();return;}
 if(p.sprite!==undefined){const base=dir==='up'?8:dir==='left'||dir==='right'?4:0,f=frames[p.sprite]?.[base+frame];if(f){if(dir==='right')g.scale(-1,1);if(p.tint)g.filter='hue-rotate(38deg)';g.drawImage(f.image,f.dx,f.dy);}}else{const f=oldFrames[p.old];if(f)g.drawImage(f.image,-Math.floor(f.w/2),-f.h);}g.restore();
 }
 function portrait(canvas,id){const p=TALE.people[id]||TALE.people.fan,g=canvas.getContext('2d');canvas.width=canvas.height=112;g.imageSmoothingEnabled=false;rect(g,'#203b45',0,0,112,112);if(p.terminal){rect(g,'#477c7a',8,8,96,96);g.strokeStyle='#c2e8cc';g.lineWidth=3;g.beginPath();for(let x=14;x<100;x++){let y=53+Math.sin(x*.18)*13;if(x===14)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();rect(g,'#e8cc91',24,86,64,3);}else{const im=portraits[p.sprite!==undefined?'s'+p.sprite:'o'+p.old];if(im){if(p.tint)g.filter='hue-rotate(38deg)';g.drawImage(im,0,0,112,112);g.filter='none';}}}
 function prop(g,index,x,y,scale=1,{lit=false}={}){let f=propFrames[index];if(!f)return;shadow(g,x,y,Math.min(f.w*.7,40)*scale,index>=6?.24:.16);g.save();g.imageSmoothingEnabled=false;g.drawImage(f.image,Math.round(x-f.w*scale/2),Math.round(y-f.h*scale+2),Math.round(f.w*scale),Math.round(f.h*scale));if(lit&&index===22){g.globalAlpha=.13;rect(g,'#ffe0a5',x-12,y-34,24,19);}g.restore();}
 function bake(m){if(cache.has(m.id))return cache.get(m.id);let c=document.createElement('canvas');c.width=m.w*T;c.height=m.h*T;let g=c.getContext('2d'),p=colors[m.theme];g.imageSmoothingEnabled=false;
 for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){let type=m.tiles[y][x],px=x*T,py=y*T,r=hash(x,y,m.seed),ground=m.kind==='room'?p.floor:p.ground;rect(g,ground,px,py,T,T);
  if(type==='grass'||type==='solid'||type==='hedge'){if(m.kind==='room'){type='floor';}else{for(let k=0;k<3;k++){let xx=Math.floor(hash(x+k,y,8)*14)+1,yy=Math.floor(hash(x,y+k,4)*14)+1;rect(g,k===0?p.light:p.dark,px+xx,py+yy,2,1);}if(type==='hedge'){rect(g,p.dark,px,py,16,16);rect(g,p.ground,px+1,py+2,14,10);} }}
  if(type==='path'){rect(g,p.path,px,py,16,16);if(m.tiles[y-1]?.[x]!=='path')rect(g,p.edge,px,py,16,1);if(m.tiles[y]?.[x-1]!=='path')rect(g,p.edge,px,py,1,16);if(r>.7)rect(g,p.edge,px+3+Math.floor(r*8),py+7,2,1);}
  if(type==='water'){rect(g,p.water,px,py,16,16);if(m.tiles[y-1]?.[x]!=='water'){rect(g,'#c6bb8f',px,py,16,2);rect(g,'#bad5bf',px,py+2,16,1);}if(m.tiles[y]?.[x-1]!=='water'){rect(g,'#c6bb8f',px,py,2,16);rect(g,'#bad5bf',px+2,py,1,16);}rect(g,'#75adb2',px+3+Math.floor(r*4),py+5+(x%2)*4,7,1);}
  if(type==='bridge'){rect(g,p.water,px,py,16,16);rect(g,'#846b4d',px,py+1,16,14);for(let k=0;k<4;k++){rect(g,'#bea272',px+k*4,py+2,3,12);}rect(g,'#594f3e',px,py,16,2);rect(g,'#d1bc8c',px,py+14,16,2);}
  if(type==='floor'){rect(g,p.floor,px,py,16,16);if(['warm','garden'].includes(m.theme)){rect(g,'#674e3e44',px,py+15,16,1);rect(g,'#c3a47c55',px,py,16,1);for(let plank=4;plank<16;plank+=4){rect(g,'#674e3e33',px,py+plank,16,1);rect(g,'#b7977322',px,py+plank+1,16,1);}if(x%2===y%2)rect(g,'#74574044',px+9,py+2,1,13);}else{rect(g,'#d0d8c922',px,py,15,1);rect(g,'#263f4222',px+15,py,1,16);}}
  if(type==='carpet'){rect(g,'#607f7b',px,py,16,16);rect(g,'#71918b',px+3,py+3,10,10);if(m.tiles[y]?.[x-1]!=='carpet')rect(g,'#d5b57e',px,py,2,16);if(m.tiles[y]?.[x+1]!=='carpet')rect(g,'#d5b57e',px+14,py,2,16);}
  if(type==='garden'){rect(g,p.dark,px,py,16,16);rect(g,p.light,px+2,py+3,4,6);rect(g,'#c7ad8b',px+6,py+5,2,2);rect(g,p.ground,px+9,py+8,4,5);}
  if(type==='wall'){rect(g,'#263f49',px,py,16,16);if(y===2||y===m.h-1){rect(g,p.wall,px,py,16,13);rect(g,'#d2d0b077',px,py,16,2);rect(g,'#536765',px,py+13,16,3);rect(g,'#5a706e',px+(y%2)*7,py+5,1,7);}else if(x===0||x===m.w-1)rect(g,'#607b76',px+3,py,10,16);}
 }
 if(m.kind==='room'){for(let x=4;x<m.w-3;x+=6){rect(g,'#324a50',x*T,20,24,24);rect(g,m.theme==='dark'?'#3c5c6a':'#93bbb4',x*T+2,22,20,19);rect(g,'#d0bf9b',x*T+11,22,2,20);rect(g,'#d0bf9b',x*T+2,31,20,2);rect(g,'#b9a680',x*T-2,42,28,3);}rect(g,'#2d454544',16,48,(m.w-2)*16,3);}
 cache.set(m.id,c);return c;}
 function map(g,m,state,camera,w,h,time,followers=[],waypoint=null){g.clearRect(0,0,w,h);g.imageSmoothingEnabled=false;g.save();g.translate(-Math.round(camera.x),-Math.round(camera.y));g.drawImage(bake(m),0,0);
 const isBig=m.kind==='overworld';const draws=[];
 for(const d of m.decor)draws.push({y:d.y,fn:()=>prop(g,d.index,(d.x+.5)*T,(d.y+1)*T,isBig?.58:1,{lit:m.theme==='dark'})});
 for(const o of m.objects){let x=(o.x+.5)*T,y=(o.y+1)*T;
  if(o.type==='portal'){draws.push({y:o.y,fn:()=>{if(o.back){rect(g,'#e8d3a4',x-5,y-5,10,3);rect(g,'#e8d3a4',x-3,y-2,6,2);}else prop(g,o.art,x,y,isBig?.58:1);if(!WORLD.portalAllowed(o,state)&&!o.back){rect(g,'#eee3ad',x-2,y-2,4,2);}}});}
  else if(o.type==='npc')draws.push({y:o.y,fn:()=>{person(g,o.person,x,y);let active=TALE.cases[state.chapter];if(active&&o.id===active.hostId&&m.id===active.hostMap){const done=state.records[state.chapter].started;rect(g,done?'#dfc483':'#fff0b5',x-1,y-37,2,5);rect(g,done?'#dfc483':'#fff0b5',x-1,y-30,2,2);}}});
  else if(['clue','side','ending'].includes(o.type)){draws.push({y:o.y,fn:()=>{let active=o.type==='ending'?state.chapter===8:o.type==='side'?!state.sides.includes(o.id):TALE.clues[o.id].case===state.chapter&&!state.clues.includes(o.id);let opacity=o.type==='clue'&&TALE.clues[o.id].case>state.chapter?.7:1;g.save();g.globalAlpha=opacity;prop(g,o.index,x,y,.72);g.restore();if(active){const n=Math.floor(time/440)%2;rect(g,'#ffe2a2',x-1,y-27-n,2,5);rect(g,'#fff2c9',x-3,y-25-n,6,1);}}});}
 }
 for(const f of followers)draws.push({y:f.y,fn:()=>person(g,f.id,(f.x+.5)*T,(f.y+1)*T,f.dir,f.frame,isBig?.6:1)});
 draws.push({y:state.pos.y+.04,fn:()=>person(g,'fan',(state.pos.x+.5)*T,(state.pos.y+1)*T,state.dir,state.walkFrame,isBig?.6:1)});
 draws.sort((a,b)=>a.y-b.y);for(const d of draws)d.fn();
 if(waypoint&&waypoint.map===m.id){let x=(waypoint.x+.5)*T,y=(waypoint.y+.5)*T;g.strokeStyle='#ffe5a6';g.lineWidth=1;g.strokeRect(Math.round(x-7),Math.round(y-6),14,12);}
 if(m.theme==='dark'){g.fillStyle='#102d4344';g.fillRect(0,0,m.w*T,m.h*T);}g.restore();
 }
 function minimap(canvas,m,state){const g=canvas.getContext('2d');canvas.width=m.w*2;canvas.height=m.h*2;for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){let t=m.tiles[y][x];rect(g,t==='water'?'#527e8a':['wall','solid','hedge'].includes(t)?'#344f52':t==='path'?'#b4ad86':'#718c78',x*2,y*2,2,2);}for(let o of m.objects.filter(o=>o.type==='portal'))rect(g,o.back?'#c4dbda':'#ecd194',o.x*2-1,o.y*2-1,3,3);rect(g,'#ffffff',Math.round(state.pos.x)*2-1,Math.round(state.pos.y)*2-1,3,3);}
 return {init,portrait,person,prop,map,minimap,colors,frames,propFrames,get ready(){return ready},clear:()=>cache.clear()};
})();
globalThis.Art=Art;
