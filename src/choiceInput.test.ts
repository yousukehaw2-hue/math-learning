import {describe,it,expect} from 'vitest';
import {questions,isCorrect,answerLabel} from './questions';
import {isChoiceSelected,toggleChoice} from './choiceInput';

describe('multiple-choice input',()=>{
 const q=questions.find(q=>q.id==='format-eq-equivalent-1')!;
 it('toggles independent options',()=>{let value='';value=toggleChoice(value,q.choices![0]);value=toggleChoice(value,q.choices![1]);expect(isChoiceSelected(value,q.choices![0])).toBe(true);expect(isChoiceSelected(value,q.choices![1])).toBe(true);value=toggleChoice(value,q.choices![0]);expect(isChoiceSelected(value,q.choices![0])).toBe(false);});
 it('accepts the correct set in any order',()=>{const parts=q.answer.split('||');expect(isCorrect(q,parts.reverse().join('||'))).toBe(true);expect(isCorrect(q,parts.slice(1).join('||'))).toBe(false);});
 it('renders a readable answer label',()=>{expect(answerLabel(q)).not.toContain('||');expect(answerLabel(q)).toContain('、');});
});
