import type {Question} from './questions';
import type {Entry} from './review';

/** Semantic solution pattern first; normalized wording remains a safe fallback for old/custom data. */
export function questionPattern(q:Question){
 return q.patternId||q.unit+'|'+q.skill+'|'+q.prompt.normalize('NFKC').replace(/[−－]/g,'-').replace(/[-+]?\d+(?:\.\d+)?/g,'#').replace(/\s+/g,' ').trim();
}
export function questionFormat(q:Question){return q.type==='choice'?'choice':q.type==='multi-choice'?'multi-choice':q.reasoningType==='図の読み取り'||q.visual?'diagram':q.reasoningType?'word-reasoning':'calculation';}

/** New records carry sessionId. Historical records remain compatible as five-answer sessions. */
export function recentSessionPatterns(history:Entry[],patterns:Map<string,string>,sessionCount=3){
 const sessions:string[][]=[];let currentKey='';
 for(let i=0;i<history.length;i++){
  const h=history[i],pattern=patterns.get(h.id);if(!pattern)continue;
  const key=h.sessionId||'legacy-'+Math.floor(i/5);
  if(key!==currentKey){sessions.push([]);currentKey=key;}
  sessions[sessions.length-1].push(pattern);
 }
 return new Set(sessions.slice(-sessionCount).flat());
}

export function variedSelection(pool:Question[],history:Entry[],count:number,preference:(q:Question)=>number=()=>0):Question[]{
 const latest=new Map<string,{at:number;correct:boolean}>(),frequency=new Map<string,number>();
 const candidates=[...new Map(pool.map(q=>[q.id,q])).values()];
 const patterns=new Map(candidates.map(q=>[q.id,questionPattern(q)]));
 for(const h of history){const at=Date.parse(h.at);if(!Number.isFinite(at)||!patterns.has(h.id))continue;frequency.set(h.id,(frequency.get(h.id)||0)+1);const prev=latest.get(h.id);if(!prev||at>=prev.at)latest.set(h.id,{at,correct:h.correct});}
 const recentPatterns=recentSessionPatterns(history,patterns,3);
 const result:Question[]=[],used=new Set<string>(),selectedPatterns=new Set<string>(),selectedFormats=new Set<string>(),skillCounts=new Map<string,number>();
 const limit=Math.min(Math.max(0,Math.floor(count)),candidates.length);
 while(result.length<limit){let best:Question|undefined,bestScore=Infinity;
  for(const q of candidates){if(used.has(q.id))continue;const prev=latest.get(q.id),pattern=patterns.get(q.id)!;
   const unseenIdAvailable=candidates.some(candidate=>!used.has(candidate.id)&&!latest.has(candidate.id));
   const unusedPatternAvailable=candidates.some(candidate=>!used.has(candidate.id)&&!selectedPatterns.has(patterns.get(candidate.id)!));
   const format=questionFormat(q),unusedFormatAvailable=candidates.some(candidate=>!used.has(candidate.id)&&!selectedFormats.has(questionFormat(candidate)));
   const freshRecentPatternAvailable=candidates.some(candidate=>!used.has(candidate.id)&&!recentPatterns.has(patterns.get(candidate.id)!));
   const idPenalty=prev?(unseenIdAvailable?1000:45)+Math.min(30,(frequency.get(q.id)||0)*5):0;
   const inSessionPenalty=selectedPatterns.has(pattern)&&unusedPatternAvailable?500:0;
   const recentPatternPenalty=recentPatterns.has(pattern)&&freshRecentPatternAvailable?180:0;
   const formatPenalty=selectedFormats.has(format)&&unusedFormatAvailable?40:0;
   const score=idPenalty+inSessionPenalty+recentPatternPenalty+formatPenalty+(skillCounts.get(q.skill)||0)*7+Math.max(-8,Math.min(8,preference(q)));
   if(score<bestScore||(score===bestScore&&q.id.localeCompare(best?.id||'')<0)){best=q;bestScore=score;}
  }
  if(!best)break;result.push(best);used.add(best.id);selectedPatterns.add(patterns.get(best.id)!);selectedFormats.add(questionFormat(best));skillCounts.set(best.skill,(skillCounts.get(best.skill)||0)+1);
 }
 return result;
}
