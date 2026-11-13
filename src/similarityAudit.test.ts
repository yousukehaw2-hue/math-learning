import {describe,it,expect} from 'vitest';
import {questions,type Question} from './questions';
import {questionSimilarity,similarQuestionCandidates} from './similarityAudit';
import {auditQuestions} from './contentAudit';

describe('semantic similarity audit',()=>{
 it('detects a wording variant after normalizing numbers and symbols',()=>{const base=questions.find(q=>q.id==='eq1')!,copy={...base,id:'near-copy',prompt:'x＋9＝15 のとき、x はいくつ？'} as Question;expect(questionSimilarity(base,copy)).toBeGreaterThan(.65);expect(similarQuestionCandidates([base,copy])).toHaveLength(1);});
 it('does not confuse unrelated units or structures',()=>{expect(similarQuestionCandidates([questions[0],questions.find(q=>q.unit==='平面図形')!])).toEqual([]);});
 it('reports candidates as review warnings rather than blocking errors',()=>{const base=questions.find(q=>q.id==='eq1')!,copy={...base,id:'near-copy',prompt:'x＋9＝15 のとき、x はいくつ？'} as Question;const issues=auditQuestions([base,copy]);expect(issues.some(i=>i.severity==='warning'&&i.message.includes('類似問題候補'))).toBe(true);expect(issues.some(i=>i.severity==='error'&&i.message.includes('類似問題候補'))).toBe(false);});
});
