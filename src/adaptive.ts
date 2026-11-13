import {questionFormat,variedSelection} from './variety';
import {questions,type Question} from './questions';
import type {Entry} from './review';

export function skillEvidence(history:Entry[],unit:string,skill:string){const items=history.filter(h=>{const q=questions.find(q=>q.id===h.id);return q?.unit===unit&&q.skill===skill;});const first=items.filter(h=>h.firstSeen===true);const reliable=items.filter(h=>h.correct&&(h.hintCount||0)===0);const recent=items.slice(-5);const accuracy=recent.length?recent.filter(h=>h.correct).length/recent.length:0;const firstAccuracy=first.length?first.filter(h=>h.correct).length/first.length:null;const medianMs=items.map(h=>h.durationMs).filter((n):n is number=>typeof n==='number'&&n>0).sort((a,b)=>a-b);const duration=medianMs.length?medianMs[Math.floor(medianMs.length/2)]:null;const weak=items.length>0&&(accuracy<.8||(firstAccuracy!==null&&firstAccuracy<.6));const strong=items.length>=3&&accuracy>=.8&&reliable.length>=3&&(firstAccuracy===null||firstAccuracy>=.6);return {attempts:items.length,accuracy,firstAccuracy,duration,weak,strong};}

export function formatEvidence(history:Entry[],unit:string,format:string){const items=history.filter(h=>{const q=questions.find(q=>q.id===h.id);return q&&(unit==='すべて'||q.unit===unit)&&questionFormat(q)===format;}).slice(-8);const accuracy=items.length?items.filter(h=>h.correct).length/items.length:0;return {attempts:items.length,accuracy,weak:items.length>=2&&accuracy<.7,strong:items.length>=3&&accuracy>=.85};}

export function adaptiveSession(unit:string,history:Entry[],count=5):Question[]{
 const pool=questions.filter(q=>unit==='すべて'||q.unit===unit),latest=new Map<string,Entry>();for(const h of history)latest.set(h.id,h);
 const rankScore=(q:Question)=>{const ev=skillEvidence(history,q.unit,q.skill),format=formatEvidence(history,unit,questionFormat(q)),seen=latest.has(q.id),last=latest.get(q.id);const difficulty=q.level==='知識理解'?0:q.level==='基本計算'?1:2,target=ev.strong?2:ev.weak?0:1;return Math.abs(difficulty-target)*10+(seen?4:0)+(last&&!last.correct?-3:0)+(last?.hintCount||0)*-.5+(format.weak?-5:format.strong?2:0);};
 const ranked=[...pool].sort((a,b)=>rankScore(a)-rankScore(b)||a.id.localeCompare(b.id));
 return variedSelection(ranked,history,count,q=>ranked.indexOf(q)/Math.max(1,ranked.length)*8+(formatEvidence(history,unit,questionFormat(q)).weak?-4:0));
}
