import {expect,test} from 'vitest';
import {fresh,purchase,decodeSave,buy} from '../src/engine';
test('a disconnected node cannot be bought even when sparks exist',()=>{const j={...fresh(),chapter:1,sparks:3};expect(()=>purchase(j,'tempo')).toThrow();expect(j.sparks).toBe(3);expect(j.nodes).toEqual(['root']);});
test('connected purchases deduct exactly their cost and roundtrip through validation',()=>{const j={...fresh(),chapter:1,sparks:3};const next=purchase(j,'heart');expect(next.sparks).toBe(1);expect(next.nodes).toEqual(['root','heart']);expect(decodeSave(JSON.stringify(next))).toEqual(next);});
test('save validator rejects malformed unknown versions, currencies and disconnected graphs',()=>{
 for(const j of [null,{}, {...fresh(),version:2},{...fresh(),coins:-1},{...fresh(),chapter:8},{...fresh(),nodes:['root','tempo'],chapter:1},{...fresh(),nodes:['root','root']},{...fresh(),sparks:1},{...fresh(),items:{tonic:0,ether:NaN,seed:1}}])expect(decodeSave(JSON.stringify(j))).toBeUndefined();
 expect(decodeSave('{oops')).toBeUndefined();
});
test('shop purchase is atomic and rejects overspend and item overflow',()=>{const j=buy(fresh(),'seed');expect(j.coins).toBe(25);expect(j.items.seed).toBe(3);expect(()=>buy(j,'seed')).toThrow();expect(j.coins).toBe(25);expect(()=>buy({...fresh(),items:{tonic:99,ether:2,seed:2}},'tonic')).toThrow();});
