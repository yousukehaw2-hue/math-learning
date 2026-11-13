import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {questions} from './questions';
import {ChoiceOptions} from './ChoiceOptions';

describe('ChoiceOptions',()=>{
 const q=questions.find(q=>q.type==='multi-choice')!;
 it('shows an explicit empty selection state',()=>{const html=renderToStaticMarkup(<ChoiceOptions question={q} value="" onChange={()=>{}} disabled={false}/>);expect(html).toContain('まだ選択していません');expect(html).toContain('aria-pressed="false"');});
 it('shows selection count, check mark and clear action',()=>{const value=q.answer.split('||')[0];const html=renderToStaticMarkup(<ChoiceOptions question={q} value={value} onChange={()=>{}} disabled={false}/>);expect(html).toContain('1個選択中');expect(html).toContain('✓');expect(html).toContain('選択をすべて解除');});
});
