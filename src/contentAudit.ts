import {questions,type Question,isCorrect,answerParts,normalizeAnswer} from './questions';

export type AuditIssue={id:string;severity:'error'|'warning';message:string};
export function questionSignature(q:Question){return JSON.stringify({prompt:q.prompt.replace(/\s+/g,'').normalize('NFKC'),answer:q.answer,choices:q.choices||[],diagram:q.diagram||null});}

export function auditQuestions(pool:Question[]=questions):AuditIssue[]{
 const issues:AuditIssue[]=[],ids=new Set<string>(),signatures=new Map<string,string>();
 for(const q of pool){
  const add=(severity:'error'|'warning',message:string)=>issues.push({id:q.id,severity,message});
  if(ids.has(q.id))add('error','ID重複');ids.add(q.id);
  const signature=questionSignature(q);if(signatures.has(signature))add('error','問題内容の完全重複: '+signatures.get(signature));signatures.set(signature,q.id);
  if(!q.patternId)add('error','解法パターンID不足');else if(!/^[a-z]+(?:[.-][a-z]+)+$/.test(q.patternId))add('error','解法パターンID形式不正');
  if(!q.prompt||!q.answer||!q.solution||!q.hints.length)add('error','教材の必須項目不足');
  if((q.type==='choice'||q.type==='multi-choice')&&(!q.choices?.length||new Set(q.choices).size!==q.choices.length))add('error','選択肢の不整合');
  if(q.type==='choice'&&!q.choices?.includes(q.answer))add('error','単一選択の正答が選択肢にない');
  if(q.type==='multi-choice'){const answers=answerParts(q.answer);if(answers.length<2||new Set(answers).size!==answers.length||answers.some(a=>!q.choices?.some(c=>a===normalizeAnswer(c))))add('error','複数選択の正答が不正');}
  if(q.type==='number'&&!Number.isFinite(Number(q.answer)))add('error','数値回答が不正');
  if(!q.objective||!q.level||!q.misconceptionTags?.length||!q.explanationSteps?.length)add('error','学習メタデータ不足');
  if(q.prerequisites?.some(s=>!pool.some(p=>p.unit===q.unit&&p.skill===s)))add('warning','前提スキルに対応する問題なし');
  if(!isCorrect(q,q.answer))add('error','正答判定の不整合');
  if(q.id.startsWith('geo-')){const m=q.prompt.match(/一方が (\d+)°|内角が (\d+)° と ([\d.]+)°|正(\d+)角形/);if(!m){add('error','図形の問題文が解析できない');continue;}const expected=m[1]?180-Number(m[1]):m[2]?180-Number(m[2])-Number(m[3]):360/Number(m[4]);if(Math.abs(expected-Number(q.answer))>1e-8)add('error','図形の正答が計算結果と不一致');}
  if(q.id.startsWith('eq-auto-')){const m=q.prompt.match(/^(\d+)x \+ (\d+) = (-?\d+)/);if(!m||Math.abs((Number(m[3])-Number(m[2]))/Number(m[1])-Number(q.answer))>1e-8)add('error','方程式の正答が不一致');}
  if(q.id.startsWith('pr-auto-')){const m=q.prompt.match(/x = (\d+)、y = ([\d.]+)/);if(!m)add('error','比例問題の数値が解析できない');else{const x=Number(m[1]),y=Number(m[2]);const expected=q.skill==='反比例定数'?x*y:y/x;if(Math.abs(expected-Number(q.answer))>1e-8)add('error','比例・反比例の正答が不一致');}}
 }
 return issues;
}
