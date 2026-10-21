const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage({viewport:{width:375,height:812}});
  const errors=[];page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://localhost:8082');await page.getByTestId('mock-0').waitFor();
  const button = name => page.getByRole('button',{name,exact:true});
  await page.getByTestId('feed-list').evaluate(e=>e.scrollTop=100);
  await button('이야기 쓰기').click();assert.equal(await button('이야기 쓰기').count(),0);await button('나중에 할게요').click();
  assert.equal(await page.getByTestId('feed-list').evaluate(e=>e.scrollTop),100);
  await button('이야기 쓰기').click();await button('Mock 로그인으로 연결 확인').click();
  await page.getByRole('checkbox',{name:'☐ 모두 동의하기'}).click();
  await button('동의하고 시작하기').click();
  const input=page.getByRole('textbox',{name:'이야기 본문'});
  await input.waitFor();assert.equal(await button('미리보기').isDisabled(),true);
  await input.fill('오늘은 네 생각이 났어.\n잘 지내고 있니?');
  await page.goBack();await button('계속 작성하기').click();assert.ok((await input.inputValue()).length);
  await button('미리보기').click();await button('이 마음 남기기').click();
  assert.equal(await button('익명으로 남기기').isDisabled(),true);
  await button('돌아가서 수정하기').click();assert.equal(await input.inputValue(),'오늘은 네 생각이 났어.\n잘 지내고 있니?');
  await button('뒤로').click();await button('계속 작성하기').click();assert.ok((await input.inputValue()).length);
  await button('뒤로').click();await button('나중에 쓰기').click();await button('이야기 쓰기').click();await button('이어서 쓰기').click();assert.ok((await input.inputValue()).length);
  await page.screenshot({path:'/tmp/tomyx-editor.png'});
  await input.fill('가'.repeat(1001));assert.equal((await input.inputValue()).length,1000);
  await page.goto('http://localhost:8082/write/preview');await button('Mock 로그인으로 연결 확인').waitFor();
  assert.deepEqual(errors,[]);console.log('Flow passed: cancel + feed scroll, mock consent, edit/preview/confirm, retained body, leave/resume, limit, guarded URL');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
