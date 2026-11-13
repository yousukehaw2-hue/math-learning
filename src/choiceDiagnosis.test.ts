import {describe,it,expect} from 'vitest';
import {questions} from './questions';
import {diagnose} from './diagnosis';

describe('choice-specific diagnosis',()=>{
 it('explains the selected misconception and recommends review',()=>{const q=questions.find(q=>q.id==='format-pr-inverse-2')!;const result=diagnose(q,'2倍になる');expect(result).toMatchObject({tag:'比例との混同',confidence:'rule',reviewSkill:'反比例'});expect(result.reason).toContain('復習：反比例');});
 it('keeps generic fallback for choices without a reviewed rule',()=>{const q=questions.find(q=>q.id==='pr4')!;expect(diagnose(q,'2').confidence).toBe('unknown');});
});
