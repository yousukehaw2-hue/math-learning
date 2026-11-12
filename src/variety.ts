import type {Question} from './questions';import type {Entry} from './review';
/** Distinguish unseen concepts/templates from merely different numbers in the same exercise. */
export function questionPattern(q:Question){return q.unit+'|'+q.skill+'|'+q.prompt.normalize('NFKC').replace(/[−－]/g,'-').replace(/[-+]?\d+(?:\.\d+)?/g,'#').replace(/\s+/g,' ').trim();}
export function variedSelection(pool:Question[],history:Entry[],count:number,preference:(q:Question)=>number=()=>0):Question[]{
 const latest=new Map<string,{at:number;correct:boolean}>();const frequency=new Map<string,number>();const patterns=new Map(pool.map(q=>[q.id,questionPattern(q)]));const seenPatterns=new Set<string>();
 for(const h of history){const at=Date.parse(h.at);if(!Number.isFinite(at)||!patterns.has(h.id))continue;frequency.set(h.id,(frequency.get(h.id)||0)+1);const prev=latest.get(h.id);if(!prev||at>=prev.at)latest.set(h.id,{at,correct:h.correct});seenPatterns.add(patterns.get(h.id)!);}
 const now=Date.now(),recentWindow=3*86400000;const result:Question[]=[],used=new Set<string>(),selectedPatterns=new Set<string>(),skillCounts=new Map<string,number>();
 const candidates=[...pool];const limit=Math.min(Math.max(0,Math.floor(count)),candidates.length);
 while(result.length<limit){let best:Question|undefined,bestScore=Infinity;
  for(const q of candidates){if(used.has(q.id))continue;const prev=latest.get(q.id),pattern=patterns.get(q.id)!;const samePattern=selectedPatterns.has(pattern);const recent=prev&&now-prev.at<recentWindow&&now>=prev.at;
   // Prefer unseen questions and unseen patterns. Repetition is allowed only when the scope is exhausted.
   const novelty=prev?(recent?120:45)+Math.min(30,(frequency.get(q.id)||0)*5):seenPatterns.has(pattern)?12:0;
   const score=novelty+(samePattern?35:0)+(skillCounts.get(q.skill)||0)*7+Math.max(-8,Math.min(8,preference(q)));
   if(score<bestScore||(score===bestScore&&q.id.localeCompare(best?.id||'')<0)){best=q;bestScore=score;}
  }
  if(!best)break;result.push(best);used.add(best.id);selectedPatterns.add(patterns.get(best.id)!);skillCounts.set(best.skill,(skillCounts.get(best.skill)||0)+1);
 }
 return result;
}
