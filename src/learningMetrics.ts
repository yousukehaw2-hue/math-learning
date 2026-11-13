import {questions} from './questions';
import type {Entry} from './review';
import {questionFormat} from './variety';

export type Metric={key:string;label:string;attempts:number;correct:number;accuracy:number;averageSeconds:number;hintRate:number};
function summarize(key:string,label:string,entries:Entry[]):Metric{const attempts=entries.length,correct=entries.filter(e=>e.correct).length,timed=entries.filter(e=>Number.isFinite(e.durationMs));return {key,label,attempts,correct,accuracy:attempts?correct/attempts:0,averageSeconds:timed.length?timed.reduce((sum,e)=>sum+(e.durationMs||0),0)/timed.length/1000:0,hintRate:attempts?entries.filter(e=>(e.hintCount||0)>0).length/attempts:0};}
const FORMAT_LABELS:Record<string,string>={calculation:'計算入力',choice:'1つ選択','multi-choice':'複数選択',diagram:'図の読み取り','word-reasoning':'文章・条件整理'};
export function formatMetrics(history:Entry[]){const groups=new Map<string,Entry[]>();for(const entry of history){const q=questions.find(q=>q.id===entry.id);if(!q)continue;const key=questionFormat(q);groups.set(key,[...(groups.get(key)||[]),entry]);}return [...groups].map(([key,entries])=>summarize(key,FORMAT_LABELS[key]||key,entries)).sort((a,b)=>a.accuracy-b.accuracy||b.attempts-a.attempts);}
export function questionMetrics(history:Entry[],limit=5){const groups=new Map<string,Entry[]>();for(const entry of history)if(questions.some(q=>q.id===entry.id))groups.set(entry.id,[...(groups.get(entry.id)||[]),entry]);return [...groups].map(([id,entries])=>summarize(id,questions.find(q=>q.id===id)?.prompt||id,entries)).filter(m=>m.attempts>=1).sort((a,b)=>a.accuracy-b.accuracy||b.averageSeconds-a.averageSeconds||b.attempts-a.attempts).slice(0,limit);}
