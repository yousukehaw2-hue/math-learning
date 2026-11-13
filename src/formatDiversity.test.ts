import {describe,it,expect} from 'vitest';
import {questions,isCorrect,type Question} from './questions';
import {auditQuestions} from './contentAudit';
import {questionFormat,variedSelection} from './variety';

describe('format-diverse question bank',()=>{
 const added=questions.filter(q=>q.id.startsWith('format-'));
 it('adds four reviewed contexts to every unit',()=>{expect(added).toHaveLength(12);for(const unit of ['方程式','比例・反比例','平面図形'])expect(added.filter(q=>q.unit===unit)).toHaveLength(4);});
 it('contains multiple choice, error spotting, modeling and judgment tasks',()=>{expect(added.filter(q=>q.type==='multi-choice')).toHaveLength(5);expect(added.filter(q=>q.prompt.includes('誤って')).length).toBeGreaterThanOrEqual(3);expect(added.some(q=>q.patternId?.includes('choose-model'))).toBe(true);expect(added.some(q=>q.patternId?.includes('sufficient-information'))).toBe(true);});
 it('validates every correct set and rejects incomplete selections',()=>{for(const q of added){expect(isCorrect(q,q.answer),q.id).toBe(true);if(q.type==='multi-choice')expect(isCorrect(q,q.answer.split('||')[0]),q.id).toBe(false);}});
 it('passes content audit with distinct semantic patterns',()=>{expect(auditQuestions(added).filter(i=>i.severity==='error')).toEqual([]);expect(new Set(added.map(q=>q.patternId)).size).toBe(added.length);});
 it('can include the new input format in a mixed session',()=>{const pool:Question[]=[...added,questions[0],questions[5]];const selected=variedSelection(pool,[],5);expect(new Set(selected.map(questionFormat))).toContain('multi-choice');});
});
