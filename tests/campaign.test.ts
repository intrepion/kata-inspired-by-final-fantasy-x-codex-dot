import {expect,test} from 'vitest';
import {fresh,startBattle,current,forcedSlot,act,complete,purchase,decodeSave,type Action,type Journey} from '../src/engine';
import {chapters} from '../src/content';
function runCampaign(upgrades:boolean){
 let j=fresh();const report:string[]=[];
 for(let chapter=0;chapter<5;chapter++){
  if(upgrades)for(const id of ['edge','heart','well','tempo','ward','beacon']){try{j=purchase(j,id);}catch{/* unreachable or unaffordable branch waits */}}
  let b=startBattle(j),n=0;
  while(b.outcome==='playing'&&n++<300){
   const u=current(b)!;const fallen=forcedSlot(b);let a:Action;
   const enemies=b.units.filter(x=>!x.hero&&x.hp>0),injured=b.units.filter(x=>x.hero&&x.hp>0).sort((x,y)=>x.hp/x.maxHp-y.hp/y.maxHp)[0];
   if(fallen)a={kind:'swap',target:b.units.find(x=>x.hero&&x.hp>0&&!b.active.includes(x.id))!.id};
   else if(!u.hero)a={kind:'enemy'};
   else if(b.lighthouse===100)a={kind:'lighthouse'};
   else if(u.charge===100)a={kind:'special'};
   else if(injured.hp/injured.maxHp<.45&&u.id==='orin'&&u.mp>=6)a={kind:'heal',target:injured.id};
   else if(injured.hp/injured.maxHp<.4&&b.items.tonic>0)a={kind:'tonic',target:injured.id};
   else if(u.id==='tavi'&&!b.active.includes('orin'))a={kind:'swap',target:'orin'};
   else if(u.id==='sable'&&u.mp>=5)a={kind:enemies[0].weak as 'tide',target:enemies[0].id};
   else a={kind:'attack',target:enemies[0].id};
   b=act(b,a,b.revision);
  }
  expect(b.outcome,chapters[chapter].name).toBe('won');j=complete(j,b);
  expect(decodeSave(JSON.stringify(j))).toEqual(j);
  report.push(`${chapters[chapter].name}: ${n} committed actions`);
 }
 expect(j.chapter).toBe(5);expect(()=>startBattle(j)).toThrow('complete');
 console.log(`${upgrades?'Upgraded':'Base-stat'} campaign solved\n${report.join('\n')}`);
 return j;
}
test('entire campaign is solvable through public commands with connected upgrades',()=>{runCampaign(true);});
test('entire campaign is solvable even if all progression currency is banked',()=>{const j:Journey=runCampaign(false);expect(j.sparks).toBe(15);});
