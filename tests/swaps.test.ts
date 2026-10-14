import {expect,test} from 'vitest';
import {fresh,startBattle,current,act,preview,delay,targets,decodeSave} from '../src/engine';

test('a voluntary reserve swap transfers the current action opportunity immediately',()=>{
 const b=startBattle(fresh());
 const switched=act(b,{kind:'swap',target:'orin'},b.revision);
 expect(switched.active).toEqual(['iona','sable','orin']);
 expect(current(switched)?.id).toBe('orin');
 expect(switched.turns).toBe(0);
 const next=act(switched,{kind:'attack',target:'foe1'},switched.revision);
 expect(next.units.find(u=>u.id==='foe1')!.hp).toBe(73);
 expect(next.turns).toBe(1);
 expect(next.units.find(u=>u.id==='orin')!.ready).toBe(90);
 expect(current(next)?.id).toBe('iona');
});


test('a recovering reserve acts immediately without clearing its earned recovery debt',()=>{
 let b=startBattle(fresh());
 b=act(b,{kind:'swap',target:'orin'},b.revision);
 b=act(b,{kind:'attack',target:'foe1'},b.revision);
 // A reserve with prior action recovery: public Battle fixture, opening delays stay distinct.
 b.active=['iona','sable','tavi'];
 expect(current(b)?.id).toBe('tavi');
 b=act(b,{kind:'swap',target:'orin'},b.revision);
 expect(current(b)?.id).toBe('orin');
 const next=act(b,{kind:'attack',target:'foe1'},b.revision);
 expect(next.units.find(u=>u.id==='orin')!.ready).toBe(180);
 expect(next.turns).toBe(2);
});


test('swap order preview shows the immediate incoming command then resumes the ordinary queue without mutation',()=>{
 const b=startBattle(fresh()),raw=JSON.stringify(b);
 expect(preview(b,{kind:'swap',target:'orin'},4)).toEqual(['orin','iona','sable','foe0']);
 expect(JSON.stringify(b)).toBe(raw);
 const switched=act(b,{kind:'swap',target:'orin'},b.revision),afterSwap=JSON.stringify(switched);
 const projected=preview(switched,{kind:'heal',target:'iona'},4);
 const next=act(switched,{kind:'heal',target:'iona'},switched.revision);
 expect(projected[0]).toBe(current(next)?.id);
 expect(next.units.find(u=>u.id==='orin')!.ready).toBe(110);
 expect(JSON.stringify(switched)).toBe(afterSwap);
});


test('chained swaps retain one opportunity, actor resources and statuses even when readiness ties',()=>{
 let b=startBattle(fresh());
 b.units.forEach(u=>u.ready=u.hero?0:100);
 const iona=b.units.find(u=>u.id==='iona')!,orin=b.units.find(u=>u.id==='orin')!;
 Object.assign(iona,{slow:2,guard:2,charge:37});
 Object.assign(orin,{hp:100,mp:20,slow:3,guard:1,charge:80});
 const initialUnits=structuredClone(b.units),initialItems={...b.items};
 expect(current(b)?.id).toBe('iona');
 for(const target of ['orin','iona','orin','iona','orin']){
  b=act(b,{kind:'swap',target},b.revision);
  expect(current(b)?.id).toBe(target);
  expect(b.turns).toBe(0);
  expect(b.units).toEqual(initialUnits);
  expect(b.items).toEqual(initialItems);
 }
 expect(b.revision).toBe(5);
 expect(delay(b,current(b)!,{kind:'swap'})).toBe(0);
 const after=act(b,{kind:'heal',target:'iona'},b.revision);
 expect(after.turns).toBe(1);
 expect(after.units.find(u=>u.id==='orin')).toMatchObject({hp:100,mp:14,slow:2,guard:0,charge:98,ready:150});
 expect(after.units.find(u=>u.id==='iona')).toMatchObject({mp:18,slow:2,guard:2,charge:37});
 expect(current(after)?.id).toBe('sable');
});

test('invalid, ended and stale swap confirmations leave the opportunity and battle unchanged',()=>{
 const b=startBattle(fresh()),raw=JSON.stringify(b);
 for(const target of ['sable','foe0','missing'])expect(()=>act(b,{kind:'swap',target},b.revision)).toThrow('living reserve');
 b.units.find(u=>u.id==='orin')!.hp=0;
 expect(targets(b,{kind:'swap'})).toEqual([]);
 expect(()=>act(b,{kind:'swap',target:'orin'},b.revision)).toThrow('living reserve');
 b.units.find(u=>u.id==='orin')!.hp=170;
 expect(JSON.stringify(b)).toBe(raw);
 const switched=act(b,{kind:'swap',target:'orin'},b.revision),afterSwap=JSON.stringify(switched);
 expect(()=>act(switched,{kind:'swap',target:'tavi'},b.revision)).toThrow('already resolved');
 expect(()=>act(switched,{kind:'heal',target:'missing'},switched.revision)).toThrow('valid target');
 expect(JSON.stringify(switched)).toBe(afterSwap);
 const ended={...switched,outcome:'won' as const};
 expect(()=>act(ended,{kind:'swap',target:'tavi'},ended.revision)).toThrow('ended');
});

test('free swap state stays in battle and does not alter the versioned encounter checkpoint',()=>{
 const j=fresh(),raw=JSON.stringify(j),b=startBattle(j);
 const switched=act(b,{kind:'swap',target:'orin'},b.revision);
 expect(JSON.stringify(j)).toBe(raw);
 const checkpoint=decodeSave(raw)!;
 expect(checkpoint).toEqual(j);
 expect(startBattle(checkpoint)).toEqual(b);
 expect(decodeSave(JSON.stringify(switched))).toBeUndefined();
});


test('forced fallen-slot replacement preserves its old readiness reset and incoming recovery',()=>{
 let b=startBattle(fresh());
 b=act(b,{kind:'swap',target:'orin'},b.revision);
 b=act(b,{kind:'attack',target:'foe1'},b.revision);
 b.active=['iona','sable','tavi'];
 b.units.find(u=>u.id==='iona')!.hp=0;
 b=act(b,{kind:'swap',target:'orin'},b.revision);
 expect(b.active).toEqual(['orin','sable','tavi']);
 expect(b.units.find(u=>u.id==='orin')!.ready).toBe(0);
 expect(current(b)?.id).toBe('orin');
 const next=act(b,{kind:'attack',target:'foe1'},b.revision);
 expect(next.units.find(u=>u.id==='orin')!.ready).toBe(90);
 expect(next.turns).toBe(3);
});
