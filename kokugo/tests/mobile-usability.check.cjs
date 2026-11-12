const test=require('node:test');
const assert=require('node:assert/strict');
const {html}=require('./test-helpers.cjs');

test('declares a mobile viewport and a 390px-compatible breakpoint',()=>{
  assert.match(html,/<meta name="viewport" content="width=device-width,initial-scale=1">/);
  assert.match(html,/@media\(max-width:480px\)/);
  assert.doesNotMatch(html,/[{;]min-width:\s*(?:4\d\d|[5-9]\d\d)px/);
});

test('mobile controls use full width, readable text and 48px tap targets',()=>{
  const mobile=html.match(/@media\(max-width:480px\)\{([^]*?)\}@media\(min-width:700px\)/)?.[1]||'';
  assert.match(mobile,/button\{width:100%;min-height:48px/);
  assert.match(mobile,/select,textarea\{width:100%;min-height:48px;font-size:16px/);
  assert.match(html,/\.option\{display:block;width:100%;text-align:left/);
});

test('touch drawing and status updates are exposed without color-only feedback',()=>{
  assert.match(html,/canvas\{[^}]*touch-action:none/);
  assert.match(html,/id="feedback"[^>]*aria-live="polite"/);
  assert.match(html,/id="dashboard"[^>]*aria-live="polite"/);
  assert.match(html,/(正解！|もう一度確認しましょう。)/);
});
