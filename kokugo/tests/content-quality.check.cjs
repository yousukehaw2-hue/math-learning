const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {questions,jsonConstant}=require('./test-helpers.cjs');

// This digest represents the answer/explanation set reviewed through PRs #41-#47.
// Any教材 edit must be reviewed and then deliberately update this value.
const REVIEWED_CONTENT_SHA256='0c8f089a4678a3ff3e3d80a5018bdd47ec82763f48b70cefb428f38b52333f16';

const normalize=value=>value.normalize('NFKC').replace(/\s+/g,'').trim();
const reviewedFields=questions.map(q=>q.type==='choice'
  ?[q.id,q.cat,q.q,q.choices[q.correct],q.why]
  :[q.id,q.cat,q.q,q.model,q.rubric]);

test('reviewed questions, correct answers and explanations do not drift silently',()=>{
  const digest=crypto.createHash('sha256').update(JSON.stringify(reviewedFields)).digest('hex');
  assert.equal(digest,REVIEWED_CONTENT_SHA256,'教材を変更した場合は正答・解説を再確認して監査値を更新してください');
});

test('all question records have coherent answer and explanation fields',()=>{
  assert.equal(questions.length,100);
  assert.equal(new Set(questions.map(q=>q.id)).size,100);
  assert.equal(questions.filter(q=>q.type==='choice').length,69);
  assert.equal(questions.filter(q=>q.type==='writing').length,31);
  for(const q of questions){
    assert.ok(q.q&&q.q.trim(),`question ${q.id}`);
    if(q.type==='choice'){
      assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.choices.length,`answer ${q.id}`);
      assert.equal(new Set(q.choices.map(normalize)).size,q.choices.length,`choices ${q.id}`);
      assert.ok(q.choices[q.correct].trim(),`correct text ${q.id}`);
      assert.ok(q.why&&Array.from(q.why).length>=8,`explanation ${q.id}`);
    }else{
      assert.ok(q.model&&Array.from(q.model).length<=q.limit,`model ${q.id}`);
      assert.ok(q.rubric.length>=2,`rubric ${q.id}`);
      assert.ok(q.rubric.some(x=>x.includes(String(q.limit))),`length rubric ${q.id}`);
    }
  }
});

test('questions and normalized choices contain no exact duplicates',()=>{
  const prompts=new Map();
  for(const q of questions){
    const fingerprint=normalize([q.cat,q.passage||'',q.q].join('|'));
    assert.ok(!prompts.has(fingerprint),`duplicate question ${prompts.get(fingerprint)} and ${q.id}`);
    prompts.set(fingerprint,q.id);
  }
});

test('every wrong choice has a reviewed diagnosis and a valid review route',()=>{
  const audit=jsonConstant('distractorAudit');
  let wrongChoices=0;
  for(const q of questions.filter(q=>q.type==='choice')){
    for(let i=0;i<q.choices.length;i++){
      if(i===q.correct)continue;
      const item=audit[q.id]?.[i];
      assert.ok(item,`missing diagnosis ${q.id}:${i}`);
      assert.ok(item.reason.includes(q.choices[i]),`diagnosis mismatch ${q.id}:${i}`);
      assert.ok(questions.some(candidate=>candidate.id===item.reviewId),`review route ${q.id}:${i}`);
      assert.notEqual(item.reviewId,q.id,`self review ${q.id}:${i}`);
      wrongChoices++;
    }
  }
  assert.equal(wrongChoices,138);
});
