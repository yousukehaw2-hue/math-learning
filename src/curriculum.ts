import {questions,type Question} from './questions';
export const CURRICULUM=[
{unit:'方程式',topic:'一次方程式の解法',skills:['一次方程式','移項','符号','分配法則'],target:15},
{unit:'方程式',topic:'方程式の利用・文章題',skills:['文章題'],target:15},
{unit:'比例・反比例',topic:'比例の式と比例定数',skills:['比例','比例定数'],target:15},
{unit:'比例・反比例',topic:'反比例の式と定数',skills:['反比例','反比例定数'],target:15},
{unit:'比例・反比例',topic:'座標とグラフ',skills:['座標','グラフ'],target:10},
{unit:'平面図形',topic:'角の性質と多角形',skills:['一直線の角','三角形の内角','多角形の外角'],target:20},
{unit:'平面図形',topic:'作図・図形の移動',skills:['作図','図形の移動'],target:10}
] as const;
export const LEVELS5=['導入','基礎','標準','発展','挑戦'] as const;
export type Level5=typeof LEVELS5[number];
export function level5(q:Question):Level5{if(q.level==='知識理解')return '導入';if(q.level==='基本計算')return q.hints.length>1?'標準':'基礎';if(q.skill==='文章題'||q.skill==='比例')return '発展';return '標準';}
export function curriculumReport(pool:Question[]=questions){const units=[...new Set(CURRICULUM.map(c=>c.unit))];return {total:pool.length,byUnit:units.map(unit=>({unit,count:pool.filter(q=>q.unit===unit).length})),byLevel:LEVELS5.map(level=>({level,count:pool.filter(q=>level5(q)===level).length})),topics:CURRICULUM.map(c=>{const items=pool.filter(q=>q.unit===c.unit&&c.skills.some(s=>s===q.skill));return {unit:c.unit,topic:c.topic,count:items.length,target:c.target,missing:c.skills.filter(s=>!items.some(q=>q.skill===s)),coverage:items.length/Math.max(1,c.target)};})};}
export function qualityWarnings(pool:Question[]=questions){const report=curriculumReport(pool);const warnings=report.topics.flatMap(t=>t.missing.map(s=>t.unit+'／'+t.topic+'：未収録スキル '+s));for(const t of report.topics)if(t.count<t.target)warnings.push(t.unit+'／'+t.topic+'：問題数 '+t.count+'/'+t.target);if(report.byLevel.some(x=>x.level==='挑戦'&&x.count===0))warnings.push('挑戦レベルの問題がありません');return warnings;}
