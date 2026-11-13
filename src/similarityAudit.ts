import type {Question} from './questions';

export type SimilarityCandidate={id:string;similarTo:string;score:number;reason:string};
function normalized(text:string){return text.normalize('NFKC').toLowerCase().replace(/[−－]/g,'-').replace(/[-+]?\d+(?:\.\d+)?/g,'#').replace(/[\s、。,.・「」『』（）()]/g,'');}
function grams(text:string){const value=normalized(text),set=new Set<string>();if(value.length<2){if(value)set.add(value);return set;}for(let i=0;i<value.length-1;i++)set.add(value.slice(i,i+2));return set;}
function jaccard(a:Set<string>,b:Set<string>){const union=new Set([...a,...b]);if(!union.size)return 0;let shared=0;for(const value of a)if(b.has(value))shared++;return shared/union.size;}
export function questionSimilarity(a:Question,b:Question){const wording=jaccard(grams(a.prompt),grams(b.prompt));const pattern=a.patternId&&a.patternId===b.patternId?.trim()?0.16:0;const format=a.type===b.type?0.04:0;return Math.min(1,wording+pattern+format);}
/** Return only the closest earlier candidate for each question to keep audit output reviewable. */
export function similarQuestionCandidates(pool:Question[],threshold=.65){const result:SimilarityCandidate[]=[];for(let i=1;i<pool.length;i++){let best:SimilarityCandidate|undefined;for(let j=0;j<i;j++){if(pool[i].unit!==pool[j].unit)continue;const score=questionSimilarity(pool[i],pool[j]);if(score>=threshold&&(!best||score>best.score))best={id:pool[i].id,similarTo:pool[j].id,score,reason:pool[i].patternId===pool[j].patternId?'同じ解法パターンで問題文も類似':'問題文の構造が類似'};}if(best)result.push(best);}return result;}
