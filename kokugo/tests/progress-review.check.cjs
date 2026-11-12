const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {html,questions}=require('./test-helpers.cjs');

function progressApi(stored){
  const start=html.indexOf("const KEY='kokugo-progress-v2'");
  const end=html.indexOf('function stats()',start);
  assert.ok(start>=0&&end>start,'progress functions missing');
  let value=stored;
  const localStorage={
    getItem:key=>key==='kokugo-progress-v2'?value:null,
    setItem:(key,next)=>{assert.equal(key,'kokugo-progress-v2');value=next;}
  };
  const api=vm.runInNewContext(`(()=>{${html.slice(start,end)};return {KEY,emptyProgress,normalizeProgress,load,save};})()`,{localStorage,alert(){}});
  return {api,read:()=>value};
}

test('keeps the existing URL and localStorage key',()=>{
  assert.equal(progressApi(null).api.KEY,'kokugo-progress-v2');
  assert.match(html,/kokugo\/index\.html|<title>国語まなび<\/title>/);
});

test('loads legacy progress without deleting attempts, review items or writing records',()=>{
  const legacy={attempts:7,correct:4,mistakes:[2,2,5],writings:[{id:7,answer:'案'}],legacyNote:'keep'};
  const {api}=progressApi(JSON.stringify(legacy));
  const loaded=api.load();
  assert.equal(loaded.attempts,7);
  assert.equal(loaded.correct,4);
  assert.deepEqual([...loaded.mistakes],[2,5]);
  assert.equal(loaded.writings[0].answer,'案');
  assert.equal(loaded.legacyNote,'keep');
  assert.deepEqual([...loaded.choiceHistory],[]);
});

test('normalizes old string IDs and bounds history while preserving valid records',()=>{
  const history=Array.from({length:505},(_,i)=>({id:String(i%100+1),cat:'reading',ok:i%2===0,date:'2026-11-12T00:00:00.000Z'}));
  const {api}=progressApi(null);
  const loaded=api.normalizeProgress({attempts:505,correct:253,mistakes:['2',2,'bad'],choiceHistory:history,writings:[]});
  assert.deepEqual([...loaded.mistakes],[2]);
  assert.equal(loaded.choiceHistory.length,500);
  assert.ok(loaded.choiceHistory.every(x=>Number.isInteger(x.id)));
});

test('malformed storage safely falls back and save remains readable',()=>{
  const state=progressApi('{bad json');
  assert.deepEqual(JSON.parse(JSON.stringify(state.api.load())),{attempts:0,correct:0,writings:[],mistakes:[],choiceHistory:[]});
  state.api.save({attempts:2,correct:1,mistakes:[3],writings:[],choiceHistory:[{id:3,cat:'kanji',ok:false,date:'2026-11-12T00:00:00.000Z'}]});
  assert.equal(JSON.parse(state.read()).choiceHistory[0].id,3);
});

test('review IDs stored by the current bank still resolve to questions',()=>{
  const ids=new Set(questions.map(q=>q.id));
  const state=progressApi(JSON.stringify({attempts:2,correct:0,mistakes:[1,100],writings:[],choiceHistory:[]}));
  assert.ok(state.api.load().mistakes.every(id=>ids.has(id)));
});
