import {chapters,heroes,nodes,type Element} from './content';
export type Journey={version:1;chapter:number;coins:number;sparks:number;nodes:string[];items:{tonic:number;ether:number;seed:number}};
export type Unit={id:string;name:string;hero:boolean;hp:number;maxHp:number;mp:number;maxMp:number;power:number;speed:number;ready:number;recoveryUntil?:number;charge:number;slow:number;guard:number;weak:Element;resist:Element;armor:boolean;form:string};
export type Battle={chapter:number;units:Unit[];active:string[];items:Journey['items'];revision:number;turns:number;lighthouse:number;ward:number;tempo:number;outcome:'playing'|'won'|'lost';log:string[];opportunity?:{actor:string;time:number}};
export type Action={kind:'attack'|'ember'|'tide'|'volt'|'heal'|'revive'|'bind'|'protect'|'guard'|'special'|'lighthouse'|'tonic'|'ether'|'seed'|'swap'|'enemy';target?:string};
export const fresh=():Journey=>({version:1,chapter:0,coins:60,sparks:0,nodes:['root'],items:{tonic:4,ether:2,seed:2}});
export function startBattle(j:Journey):Battle{
 if(j.chapter>=chapters.length) throw Error('The journey is complete.');
 const hp=j.nodes.includes('heart')?40:0,mp=j.nodes.includes('well')?12:0,power=j.nodes.includes('edge')?8:0;
 return {chapter:j.chapter,units:[...heroes.map(h=>({id:h.id,name:h.name,hero:true,hp:h.hp+hp,maxHp:h.hp+hp,mp:h.mp+mp,maxMp:h.mp+mp,power:h.power+power,speed:h.speed,ready:h.id==='tavi'?0:h.id==='iona'?15:h.id==='sable'?25:30,charge:0,slow:0,guard:0,weak:'none' as Element,resist:'none' as Element,armor:false,form:'hero'})),...chapters[j.chapter].foes.map((e,i)=>({id:`foe${i}`,name:e.name,hero:false,hp:e.hp,maxHp:e.hp,mp:0,maxMp:0,power:e.power,speed:e.speed,ready:45+i*10,charge:0,slow:0,guard:0,weak:e.weak,resist:e.resist,armor:e.armor,form:e.form}))],active:['iona','sable','tavi'],items:{...j.items},revision:0,turns:0,lighthouse:j.nodes.includes('beacon')?40:0,ward:j.nodes.includes('ward')?5:0,tempo:j.nodes.includes('tempo')?15:0,outcome:'playing',log:['The flame steadies. Choose your moment.']};
}
export function current(b:Battle):Unit|undefined{
 const incoming=b.opportunity&&b.units.find(u=>u.id===b.opportunity!.actor&&u.hp>0&&b.active.includes(u.id));
 if(incoming)return incoming;
 return b.units.filter(u=>u.hp>0&&(!u.hero||b.active.includes(u.id))).sort((a,c)=>a.ready-c.ready||a.id.localeCompare(c.id))[0];}
export function forcedSlot(b:Battle):string|undefined{
 if(b.outcome!=='playing'||!b.units.some(u=>u.hero&&u.hp>0&&!b.active.includes(u.id)))return;
 return b.active.find(id=>b.units.find(u=>u.id===id)!.hp===0);
}
export const costs:Record<Action['kind'],number>={attack:0,ember:5,tide:5,volt:5,heal:6,revive:10,bind:4,protect:4,guard:0,special:0,lighthouse:0,tonic:0,ether:0,seed:0,swap:0,enemy:0};
export function delay(b:Battle,u:Unit,a:Action):number{
 const modifier:Partial<Record<Action['kind'],number>>={ember:25,tide:25,volt:25,heal:20,revive:40,bind:15,protect:10,guard:-20,special:55,lighthouse:65,tonic:10,ether:10,seed:25};
 return a.kind==='swap'?0:Math.max(25,u.speed+(modifier[a.kind]??0)+(u.slow>0?40:0)-(u.hero?b.tempo:0));
}
function recover(b:Battle,u:Unit,ticks:number){
 const time=b.opportunity?.time??u.ready;
 // Opening initiative is not debt; only previously earned recovery survives a free swap.
 u.ready=(b.opportunity?Math.max(time,u.recoveryUntil??time):time)+ticks;
 if(u.hero)u.recoveryUntil=u.ready;
 delete b.opportunity;
}
export function actions(u:Unit):Action['kind'][] {
 if(!u.hero)return ['enemy'];
 return ['attack',...(u.id==='sable'?['ember','tide','volt'] as const:[]),...(u.id==='orin'?['heal','revive'] as const:[]),...(u.id==='tavi'?['bind'] as const:[]),...(u.id==='iona'?['protect'] as const:[]),'guard','special','lighthouse','tonic','ether','seed','swap'];
}
export function targets(b:Battle,a:Action):Unit[]{
 if(a.kind==='swap')return b.units.filter(u=>u.hero&&u.hp>0&&!b.active.includes(u.id));
 if(['guard','protect','special','lighthouse','enemy'].includes(a.kind))return [];
 const ally=['heal','revive','tonic','ether','seed'].includes(a.kind),dead=['revive','seed'].includes(a.kind);
 return b.units.filter(u=>u.hero===ally&&(dead?u.hp===0:u.hp>0));
}
export function reason(b:Battle,a:Action):string|undefined{
 if(b.outcome!=='playing')return 'Encounter has ended.';
 const forced=forcedSlot(b),u=current(b);
 if(!u)return 'No actor.';
 if(forced&&a.kind!=='swap')return 'Replace the fallen keeper first.';
 if(!forced&&!actions(u).includes(a.kind))return 'This keeper cannot use that action.';
 if(a.kind==='swap'&&!targets(b,a).some(t=>t.id===a.target))return 'Choose a living reserve.';
 if(!['swap','guard','protect','special','lighthouse','enemy'].includes(a.kind)&&!targets(b,a).some(t=>t.id===a.target))return 'Choose a valid target.';
 if(!forced&&u.mp<costs[a.kind])return 'Not enough MP.';
 if(a.kind==='special'&&u.charge<100)return 'Charge must reach 100%.';
 if(a.kind==='lighthouse'&&b.lighthouse<100)return 'Lighthouse must reach 100%.';
 if(['tonic','ether','seed'].includes(a.kind)&&b.items[a.kind as keyof Journey['items']]<1)return 'No item remaining.';
}
function hurt(b:Battle,target:Unit,amount:number){const hit=Math.max(1,amount-(target.hero?b.ward:0));target.hp=Math.max(0,target.hp-hit);if(target.hero)target.charge=Math.min(100,target.charge+20);return hit;}
export function act(before:Battle,a:Action,expectedRevision:number):Battle{
 if(expectedRevision!==before.revision)throw Error('That turn has already resolved.');
 const invalid=reason(before,a);if(invalid)throw Error(invalid);
 const b=structuredClone(before),u=current(b)!,forced=forcedSlot(b),t=b.units.find(x=>x.id===a.target);
 const time=b.opportunity?.time??u.ready,recovery=delay(b,u,a);
 let text='';
 if(a.kind==='swap'){
 const out=forced??u.id,old=b.units.find(x=>x.id===out)!;
 b.active[b.active.indexOf(out)]=t!.id;
 if(forced){t!.ready=time;delete t!.recoveryUntil;delete b.opportunity;}
 else b.opportunity={actor:t!.id,time};
 text=`${t!.name} replaces ${old.name}${forced?' · forced, free':' · free, acts immediately'}.`;
 }else{
 u.mp-=costs[a.kind];
 if(a.kind==='guard'){u.guard=2;text=`${u.name} guards · damage halved until next action.`;}
 else if(a.kind==='protect'){b.units.filter(x=>x.hero&&b.active.includes(x.id)&&x.hp>0).forEach(x=>x.guard=2);text='Iona shelters the active keepers · 2 actions.';}
 else if(a.kind==='heal'||a.kind==='tonic'){const n=a.kind==='tonic'?90:95+u.power;t!.hp=Math.min(t!.maxHp,t!.hp+n);text=`${u.name} restores ${t!.name} · ${n} HP (capped).`;}
 else if(a.kind==='revive'||a.kind==='seed'){t!.hp=Math.ceil(t!.maxHp*.5);t!.ready=time+60;t!.recoveryUntil=t!.ready;t!.slow=0;t!.guard=0;text=`${t!.name} returns · half HP, ready in 60 ticks.`;}
 else if(a.kind==='ether'){t!.mp=Math.min(t!.maxMp,t!.mp+18);text=`${t!.name} recovers 18 MP (capped).`;}
 else if(a.kind==='special'||a.kind==='lighthouse'){
 if(a.kind==='special')u.charge=0;else b.lighthouse=0;
 const healing=a.kind==='special'&&u.id==='orin';
 if(healing){b.units.filter(x=>x.hero&&x.hp>0).forEach(x=>x.hp=Math.min(x.maxHp,x.hp+150));text='Orin · Resonance: every living keeper restores 150 HP.';}
 else {const n=a.kind==='lighthouse'?150:u.power*3+35;b.units.filter(x=>!x.hero&&x.hp>0).forEach(x=>hurt(b,x,n));text=`${u.name} · ${a.kind==='lighthouse'?'Lighthouse: the sea remembers':'charged burst'} · ${n} to every foe, ignores armor.`;}
 }else if(a.kind==='enemy'){
 const living=b.units.filter(x=>x.hero&&b.active.includes(x.id)&&x.hp>0);
 const victim=living[(b.turns+b.chapter)%living.length];
 const heavy=b.chapter===4&&b.turns%3===0;
 const hit=hurt(b,victim,Math.round(u.power*(heavy?1.6:1)*(victim.guard>0?.5:1)));
 if(b.chapter>=3&&b.turns%2===0)victim.slow=3;
 text=`${u.name} ${heavy?'crushes':'strikes'} ${victim.name} · ${hit}${victim.slow>0?' · Slow 3 actions':''}.`;
 }else {
 const element:Element=['ember','tide','volt'].includes(a.kind)?a.kind as Element:'none';
 let n=u.power+(element==='none'?0:14);
 if(element!=='none'&&t!.weak===element){n*=2;b.lighthouse=Math.min(100,b.lighthouse+25);}
 if(element!=='none'&&t!.resist===element)n*=.5;
 if(element==='none'&&t!.armor)n*=.5;
 const hit=hurt(b,t!,Math.round(n));if(a.kind==='bind')t!.slow=3;
 text=`${u.name} → ${t!.name} · ${hit}${element!=='none'&&t!.weak===element?' · WEAK +25 Lighthouse':''}${a.kind==='bind'?' · Slow 3 actions':''}.`;
 }
 if(['tonic','ether','seed'].includes(a.kind))b.items[a.kind as keyof Journey['items']]--;
 if(u.hero&&a.kind!=='special')u.charge=Math.min(100,u.charge+18);
 recover(b,u,recovery);
 if(u.slow>0)u.slow--;if(u.guard>0&&a.kind!=='protect')u.guard--;
 }
 b.revision++;if(a.kind!=='swap'||forced)b.turns++;b.log=[text,...b.log].slice(0,8);
 if(!b.units.some(x=>!x.hero&&x.hp>0))b.outcome='won';
 else if(!b.units.some(x=>x.hero&&x.hp>0))b.outcome='lost';
 return b;
}
export function preview(b:Battle,a?:Action,count=8):string[]{
 let p=structuredClone(b);const order:string[]=[];
 if(a){try{p=act(p,a,p.revision);}catch{return [];}}
 for(let i=0;i<count;i++){
 const u=current(p);if(!u||p.outcome!=='playing')break;
 order.push(u.id);recover(p,u,delay(p,u,{kind:u.hero?'attack':'enemy'}));if(u.slow>0)u.slow--;if(u.guard>0)u.guard--;
 }return order;
}
export function purchase(j:Journey,id:string):Journey{
 const n=nodes.find(x=>x.id===id);if(!n||j.nodes.includes(id)||!n.links.some(x=>j.nodes.includes(x))||j.sparks<n.cost)throw Error('Node needs a connected light and enough sparks.');
 return {...j,sparks:j.sparks-n.cost,nodes:[...j.nodes,id]};
}
export const prices={tonic:20,ether:25,seed:35};
export function buy(j:Journey,item:keyof Journey['items']):Journey{
 if(!Object.hasOwn(prices,item)||j.coins<prices[item]||j.items[item]>=99)throw Error('Cannot purchase this supply.');
 return {...j,coins:j.coins-prices[item],items:{...j.items,[item]:j.items[item]+1}};
}
export function complete(j:Journey,b:Battle):Journey{
 if(b.outcome!=='won'||b.chapter!==j.chapter)throw Error('No unclaimed victory.');
 return {...j,chapter:j.chapter+1,coins:j.coins+45+j.chapter*10,sparks:j.sparks+3,items:{...b.items,tonic:Math.min(99,b.items.tonic+1),ether:Math.min(99,b.items.ether+1)}};
}
export function decodeSave(raw:string):Journey|undefined{
 try{
 const j=JSON.parse(raw) as Journey;const int=(x:unknown,max:number)=>typeof x==='number'&&Number.isInteger(x)&&x>=0&&x<=max;
 if(!j||j.version!==1||!int(j.chapter,5)||!int(j.coins,10000)||!int(j.sparks,15)||!Array.isArray(j.nodes)||!j.nodes.includes('root')||new Set(j.nodes).size!==j.nodes.length||!j.nodes.every(x=>typeof x==='string'&&nodes.some(n=>n.id===x))||!j.items||!Object.keys(prices).every(k=>int(j.items[k as keyof Journey['items']],99)))return;
 const reached=['root'];let pending=j.nodes.filter(x=>x!=='root');
 while(pending.length){const id=pending.find(x=>nodes.find(n=>n.id===x)!.links.some(l=>reached.includes(l)));if(!id)return;reached.push(id);pending=pending.filter(x=>x!==id);}
 const spent=j.nodes.reduce((sum,id)=>sum+nodes.find(n=>n.id===id)!.cost,0);
 if(spent+j.sparks!==j.chapter*3)return;
 return {version:1,chapter:j.chapter,coins:j.coins,sparks:j.sparks,nodes:[...j.nodes],items:{...j.items}};
 }catch{return;}
}
