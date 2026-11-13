import {describe,it,expect} from 'vitest';
import type {Entry} from './review';
import {formatMetrics,questionMetrics} from './learningMetrics';

describe('local learning metrics',()=>{
 const history:Entry[]=[{id:'eq1',correct:true,at:'2026-11-01T00:00:00Z',durationMs:10000,hintCount:0},{id:'eq1',correct:false,at:'2026-11-02T00:00:00Z',durationMs:20000,hintCount:1},{id:'format-eq-equivalent-1',correct:false,at:'2026-11-03T00:00:00Z',durationMs:30000,hintCount:1}];
 it('aggregates accuracy, time and hint use by format',()=>{const calc=formatMetrics(history).find(m=>m.key==='calculation')!;expect(calc).toMatchObject({attempts:2,correct:1,accuracy:.5,averageSeconds:15,hintRate:.5});});
 it('lists low-performing questions first',()=>{expect(questionMetrics(history)[0].accuracy).toBe(0);});
 it('ignores unknown historical ids safely',()=>{expect(formatMetrics([...history,{id:'removed',correct:false,at:'2026-11-04T00:00:00Z'}])).toEqual(formatMetrics(history));});
});
