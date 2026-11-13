import type {Question} from './questions';
import {isChoiceSelected,selectedChoices,toggleChoice} from './choiceInput';

export function ChoiceOptions({question,value,onChange,disabled}:{question:Question;value:string;onChange:(value:string)=>void;disabled:boolean}){
 const multiple=question.type==='multi-choice',count=multiple?selectedChoices(value).length:value?1:0;
 return <section className="choice-input" aria-label="選択肢">
  <div className="choice-guide"><p className="muted">{multiple?'当てはまるものをすべて選ぼう':'1つ選ぼう'}</p>{multiple&&<p aria-live="polite">{count?`${count}個選択中`:'まだ選択していません'}</p>}</div>
  <div className="choices">{question.choices?.map(choice=>{const selected=isChoiceSelected(value,choice);return <button type="button" key={choice} aria-pressed={multiple?selected:undefined} className={selected?'selected':'secondary'} onClick={()=>onChange(multiple?toggleChoice(value,choice):choice)} disabled={disabled}><span aria-hidden="true" className="choice-mark">{selected?'✓':'○'}</span>{choice}</button>})}</div>
  {multiple&&count>0&&!disabled&&<button type="button" className="secondary clear-choices" onClick={()=>onChange('')}>選択をすべて解除</button>}
 </section>;
}
