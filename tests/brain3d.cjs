const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
 try{
 for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},hasTouch:mobile,isMobile:mobile});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('console:',m.text())});
  await page.goto('http://127.0.0.1:8000/#map/gradient');
  await page.locator('.brain-stage[data-state="ready"]').waitFor({timeout:30000});
  await page.waitForTimeout(600);
  await page.locator('.brain-dot-label.selected:not([hidden])').waitFor();
  if(await page.locator('[data-view]').count())throw Error('Unexpected direction buttons');
  const before=await page.locator('.brain-stage').screenshot();
  await page.screenshot({path:mobile?'/tmp/real-brain-mobile.png':'/tmp/real-brain-desktop.png',fullPage:mobile});
  const stage=page.locator('.brain-stage');const box=await stage.boundingBox();
  await stage.scrollIntoViewIfNeeded();
  const b=await stage.boundingBox();
  if(mobile){const session=await page.context().newCDPSession(page);await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width*.5,y:b.y+b.height*.5}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width*.8,y:b.y+b.height*.6}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  else{await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2+190,b.y+b.height/2,{steps:12});await page.mouse.up();}
  await page.waitForTimeout(600);
  const rotated=await stage.screenshot();if(before.equals(rotated))throw Error('Rotation did not change rendered surface');
  await page.screenshot({path:mobile?'/tmp/real-brain-mobile-rotated.png':'/tmp/real-brain-desktop-rotated.png'});
  await page.locator('[data-concepts]').uncheck();
  if(!await page.locator('.brain-labels').isHidden())throw Error('Labels toggle failed');
  await page.getByRole('button',{name:'처음 각도'}).click();
  if(!mobile){await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2+250,{steps:12});await page.mouse.up();await page.waitForTimeout(700);await stage.screenshot({path:'/tmp/real-brain-top.png'});}
  await page.locator('.brain-concept-select').selectOption('array');
  await page.getByRole('heading',{name:'배열',exact:true}).waitFor();
  await page.locator('.brain-stage[data-state="ready"]').waitFor();
  await page.getByRole('link',{name:'⌂ 홈',exact:true}).click();
  await page.getByRole('link',{name:'개념 탐색하기 →'}).click();
  await page.locator('.brain-stage[data-state="ready"]').waitFor();
  if(errors.length)throw Error(errors.join('\n'));
  console.log('PASS',mobile?'mobile':'desktop','WebGL surface, small visible marker, rotation pixels, toggle, concept navigation, cleanup/remount');
  await page.close();
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
