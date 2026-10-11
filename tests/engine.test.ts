import {expect,test} from 'vitest';
import {fresh,startBattle,current,act,preview} from '../src/engine';
test('a committed guard changes recovery; selecting its preview does not mutate battle',()=>{
 const b=startBattle(fresh()); const before=JSON.stringify(b);
 expect(current(b)?.id).toBe('tavi');
 const p=preview(b,{kind:'guard'});
 expect(JSON.stringify(b)).toBe(before);
 const next=act(b,{kind:'guard'},b.revision);
 expect(next.units.find(u=>u.id==='tavi')?.ready).toBe(45);
 expect(p[0]).toBe(current(next)?.id);
});
test('stale confirmation cannot resolve twice',()=>{const b=startBattle(fresh());const n=act(b,{kind:'attack',target:'foe1'},0);expect(()=>act(n,{kind:'attack',target:'foe1'},0)).toThrow('already resolved');});
