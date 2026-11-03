import {expect,test} from 'vitest';
import {fresh,purchase,decodeSave,buy} from '../src/engine';
test('a disconnected node cannot be bought even when sparks exist',()=>{const j={...fresh(),chapter:1,sparks:3};expect(()=>purchase(j,'tempo')).toThrow();expect(j.sparks).toBe(3);expect(j.nodes).toEqual(['root']);});
test('connected purchases deduct exactly their cost and roundtrip through validation',()=>{const j={...fresh(),chapter:1,sparks:3};const next=purchase(j,'heart');expect(next.sparks).toBe(1);expect(next.nodes).toEqual(['root','heart']);expect(decodeSave(JSON.stringify(next))).toEqual(next);});
test('save validator rejects malformed unknown versions, currencies and disconnected graphs',()=>{
 for(const j of [null,{}, {...fresh(),version:2},{...fresh(),coins:-1},{...fresh(),chapter:8},{...fresh(),nodes:['root','tempo'],chapter:1},{...fresh(),nodes:['root','root']},{...fresh(),sparks:1},{...fresh(),items:{tonic:0,ether:NaN,seed:1}}])expect(decodeSave(JSON.stringify(j))).toBeUndefined();
 expect(decodeSave('{oops')).toBeUndefined();
});
test('shop purchase is atomic and rejects overspend and item overflow',()=>{const j=buy(fresh(),'seed');expect(j.coins).toBe(25);expect(j.items.seed).toBe(3);expect(()=>buy(j,'seed')).toThrow();expect(j.coins).toBe(25);expect(()=>buy({...fresh(),items:{tonic:99,ether:2,seed:2}},'tonic')).toThrow();});
test('runtime shop item keys reject prototype names without corrupting currency',()=>{for(const item of ['constructor','__proto__','missing']){const j=fresh();expect(()=>buy(j,item as 'tonic')).toThrow();expect(j.coins).toBe(60);}});
test('a personal stat light improves only its selected keeper, including a reserve',async()=>{
 const {startBattle}=await import('../src/engine');
 const j=purchase({...fresh(),chapter:1,sparks:3},'heart','orin');
 expect(j.owners).toEqual({heart:'orin'});expect(decodeSave(JSON.stringify(j))).toEqual(j);
 const battle=startBattle(j);expect(battle.units.find(u=>u.id==='orin')!.maxHp).toBe(210);
 expect(battle.units.find(u=>u.id==='iona')!.maxHp).toBe(220);
});
test('legacy shared lights stay shared and malformed ownership is rejected',async()=>{
 const {startBattle}=await import('../src/engine');const legacy=purchase({...fresh(),chapter:1,sparks:3},'heart');
 const loaded=decodeSave(JSON.stringify(legacy))!;expect(loaded.owners).toBeUndefined();
 const battle=startBattle(loaded);expect(battle.units.find(u=>u.id==='iona')!.maxHp).toBe(260);expect(battle.units.find(u=>u.id==='orin')!.maxHp).toBe(210);
 expect(decodeSave(JSON.stringify({...legacy,owners:{heart:'unknown'}}))).toBeUndefined();
 expect(decodeSave(JSON.stringify({...legacy,owners:{well:'orin'}}))).toBeUndefined();
});
