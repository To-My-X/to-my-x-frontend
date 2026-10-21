const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
 const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 const go=async(s)=>{await page.goto('http://localhost:8082/?scenario='+s);};
 await go('normal');await page.getByTestId('mock-0').waitFor();await page.screenshot({path:'/tmp/tomyx-normal.png'});
 const plus=page.getByRole('button',{name:'이야기 쓰기',exact:true});const box=await plus.boundingBox();const list=page.getByTestId('feed-list');
 await list.evaluate(e=>e.scrollTop=81);await page.waitForTimeout(200);assert.equal(await page.getByRole('button',{name:'알림',exact:true}).count(),0);assert.deepEqual(await plus.boundingBox(),box);
 await list.evaluate(e=>e.scrollTop=73);await page.waitForTimeout(200);assert.equal(await page.getByRole('button',{name:'알림',exact:true}).count(),1);
 await list.evaluate(e=>e.scrollTop=500);await page.waitForTimeout(200);await page.screenshot({path:'/tmp/tomyx-scroll.png'});
 for(const s of ['loading','empty','error']){await go(s);await page.waitForTimeout(900);await page.screenshot({path:`/tmp/tomyx-${s}.png`});if(s==='loading'){assert.equal(await page.getByRole('progressbar').count(),1);assert.equal(await page.getByText('아직 남겨진',{exact:false}).count(),0)}if(s==='error'){await page.getByRole('button',{name:'다시 불러오기',exact:true}).click();await page.getByTestId('mock-0').waitFor();}}
 await go('pagination-error');await page.getByTestId('mock-0').waitFor();
 for(let i=0;i<35;i++){await list.evaluate(e=>e.scrollTop=e.scrollHeight);await page.waitForTimeout(150);if(await page.getByRole('button',{name:'다음 이야기 다시 불러오기'}).count())break;}
 await page.getByRole('button',{name:'다음 이야기 다시 불러오기'}).waitFor();assert.ok(await page.getByTestId('mock-19').count());await page.screenshot({path:'/tmp/tomyx-pagination-error.png'});await page.getByRole('button',{name:'다음 이야기 다시 불러오기'}).click();await page.waitForTimeout(800);await list.evaluate(e=>e.scrollTop=e.scrollHeight);await page.waitForTimeout(500);assert.ok(await page.getByTestId('mock-20').count());
 for(const width of [320,430,1280]){await page.setViewportSize({width,height:812});await go('normal');await page.getByTestId('mock-0').waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`/tmp/tomyx-${width}.png`});}
 await page.setViewportSize({width:375,height:812});await go('long-text');await page.getByTestId('mock-0').waitFor();assert.ok((await page.getByTestId('mock-0').boundingBox()).height>1500);await page.addStyleTag({content:'[data-testid="mock-0"] div { font-size: 24px !important; }'});await list.evaluate(e=>e.scrollTop=1500);await page.waitForTimeout(300);await page.screenshot({path:'/tmp/tomyx-long.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 console.log(JSON.stringify({result:'passed',checks:['scroll 81/8px + fixed plus','loading/empty/error + retry','pagination failure + retained list + recovery','320/375/430/1280 widths','long text + enlarged text'],errors}));assert.deepEqual(errors,[]);
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
