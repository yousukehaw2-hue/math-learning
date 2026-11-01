export type Question = {id:string;unit:'方程式'|'比例・反比例';skill:string;prompt:string;type:'number'|'choice';answer:string;choices?:string[];hints:string[];solution:string;misconception:string};
export const questions:Question[]=[
{id:'eq1',unit:'方程式',skill:'一次方程式',prompt:'x + 7 = 12 のとき x は？',type:'number',answer:'5',hints:['両辺から7を引こう','12 − 7 を計算しよう'],solution:'x = 12 − 7 = 5',misconception:'移項・加減算'},
{id:'eq2',unit:'方程式',skill:'一次方程式',prompt:'3x = 18 のとき x は？',type:'number',answer:'6',hints:['両辺を3で割ろう'],solution:'x = 18 ÷ 3 = 6',misconception:'乗除算'},
{id:'eq3',unit:'方程式',skill:'符号',prompt:'x − 4 = −9 のとき x は？',type:'number',answer:'-5',hints:['両辺に4を足そう'],solution:'x = −9 + 4 = −5',misconception:'負の数'},
{id:'eq4',unit:'方程式',skill:'分配法則',prompt:'2(x + 3) = 14 のとき x は？',type:'number',answer:'4',hints:['両辺を2で割ろう','x + 3 = 7'],solution:'x + 3 = 7 より x = 4',misconception:'分配法則'},
{id:'eq5',unit:'方程式',skill:'文章題',prompt:'ある数の2倍に3を足すと17。ある数は？',type:'number',answer:'7',hints:['2x + 3 = 17 と置こう'],solution:'2x = 14 なので x = 7',misconception:'立式'},
{id:'pr1',unit:'比例・反比例',skill:'比例',prompt:'y = 3x で x = 4 のとき y は？',type:'number',answer:'12',hints:['x に4を代入しよう'],solution:'y = 3 × 4 = 12',misconception:'代入'},
{id:'pr2',unit:'比例・反比例',skill:'比例定数',prompt:'y = ax で x = 2, y = 10 のとき a は？',type:'number',answer:'5',hints:['a = y ÷ x'],solution:'a = 10 ÷ 2 = 5',misconception:'比例定数'},
{id:'pr3',unit:'比例・反比例',skill:'反比例',prompt:'y = 24/x で x = 6 のとき y は？',type:'number',answer:'4',hints:['24を6で割ろう'],solution:'y = 24 ÷ 6 = 4',misconception:'反比例'},
{id:'pr4',unit:'比例・反比例',skill:'座標',prompt:'点 (−2, 5) の y 座標は？',type:'choice',answer:'5',choices:['−2','2','5','−5'],hints:['座標は (x, y) の順'],solution:'2番目の値が y 座標なので5',misconception:'座標の順序'},
{id:'pr5',unit:'比例・反比例',skill:'グラフ',prompt:'比例 y = −2x のグラフは原点を通る？',type:'choice',answer:'通る',choices:['通る','通らない'],hints:['x = 0 のときの y を考えよう'],solution:'x = 0 なら y = 0。原点を通る',misconception:'比例グラフ'}
];
export function normalizeAnswer(v:string){return v.trim().replace(/[０-９．－＋]/g,c=>String.fromCharCode(c.charCodeAt(0)-65248)).replace(/−/g,'-');}
export function isCorrect(q:Question,v:string){const a=normalizeAnswer(q.answer),b=normalizeAnswer(v);if(q.type==='number'&&b!==''&&a!==''&&Number.isFinite(Number(b))&&Number.isFinite(Number(a)))return Number(a)===Number(b);return a===b;}
export function chooseQuestions(unit:string){return questions.filter(q=>unit==='すべて'||q.unit===unit).slice(0,5);}

/** Original, deterministically generated practice questions. */
for(let i=0;i<30;i++){const x=(i%15)-7,offset=(i%9)+2,mult=(i%5)+2;const y=mult*x+offset;questions.push({id:'eq-auto-'+i,unit:'方程式',skill:i%2?'移項':'一次方程式',prompt:mult+'x + '+offset+' = '+y+' のとき x は？',type:'number',answer:String(x),hints:['両辺から '+offset+' を引こう','両辺を '+mult+' で割ろう'],solution:mult+'x = '+(y-offset)+' なので x = '+x,misconception:'符号・移項・除算'});}
for(let i=0;i<30;i++){const a=(i%9)+1,x=(i%7)+1;const inverse=i%2===1;const y=inverse?a*12/x:a*x;const answer=inverse?a*12:a;questions.push({id:'pr-auto-'+i,unit:'比例・反比例',skill:inverse?'反比例定数':'比例定数',prompt:inverse?'反比例 y = a/x で x = '+x+'、y = '+y+' のとき a は？':'比例 y = ax で x = '+x+'、y = '+y+' のとき a は？',type:'number',answer:String(answer),hints:[inverse?'a = x × y':'a = y ÷ x'],solution:inverse?'a = '+x+' × '+y+' = '+answer:'a = '+y+' ÷ '+x+' = '+answer,misconception:inverse?'反比例の定数':'比例の定数'});}
