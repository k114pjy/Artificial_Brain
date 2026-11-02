'use strict';
const concepts=[
{id:'data',name:'데이터',category:'데이터 기초',x:110,y:205,summary:'관찰하거나 측정한 사실을 분석할 수 있도록 기록한 것입니다.',why:'행과 열이 무엇을 나타내는지 알아야 요약과 비교가 의미를 갖습니다.',source:'Wickham, Tidy Data (2014)',url:'https://doi.org/10.18637/jss.v059.i10'},
{id:'variable',name:'변수',category:'Python 기초',x:185,y:105,summary:'값을 가리키는 이름입니다. 예를 들어 score = 72는 점수 72에 이름을 붙입니다.',why:'이름을 사용하면 데이터를 다시 사용하고 코드의 의미를 읽기 쉽습니다.',source:'Python 공식 문서, An Informal Introduction to Python',url:'https://docs.python.org/3/tutorial/introduction.html'},
{id:'list',name:'리스트',category:'Python 기초',x:178,y:290,summary:'여러 값을 순서대로 담는 Python 자료형입니다.',why:'여러 관측값을 함께 보관하고 순서에 따라 꺼내는 데 사용합니다.',source:'Python 공식 문서, Data Structures',url:'https://docs.python.org/3/tutorial/datastructures.html'},
{id:'array',name:'배열',category:'NumPy',x:310,y:100,summary:'같은 종류의 데이터를 여러 차원으로 담아 계산하기 위한 구조입니다.',why:'NumPy 배열은 데이터와 행렬 연산을 간결하게 표현할 수 있습니다.',source:'Harris et al., Array programming with NumPy (2020)',url:'https://doi.org/10.1038/s41586-020-2649-2'},
{id:'matrix',name:'벡터·행렬',category:'수학 기초',x:315,y:290,summary:'벡터는 값의 묶음이고 행렬은 값을 행과 열로 배열한 것입니다.',why:'데이터와 신경망의 가중치를 표현하고 한 번에 계산하는 데 쓰입니다.',source:'NumPy 공식 문서, Linear algebra',url:'https://numpy.org/doc/stable/reference/routines.linalg.html'},
{id:'mean',name:'평균',category:'기초 통계',x:110,y:400,summary:'값을 모두 더해 개수로 나눈 대표값입니다.',why:'집단을 요약해 비교할 때 편리하지만 극단적인 값에 영향을 받습니다.',source:'NIST, Measures of Location',url:'https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm'},
{id:'group',name:'GROUP BY',category:'SQL',x:250,y:425,summary:'같은 값을 가진 행을 묶어 그룹별 집계를 할 수 있게 합니다.',why:'예를 들어 지역별 평균이나 고객별 주문 횟수를 계산할 수 있습니다.',source:'PostgreSQL 공식 문서, GROUP BY',url:'https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP'},
{id:'derivative',name:'편미분',category:'수학 기초',x:425,y:125,summary:'여러 변수가 있는 함수에서 하나의 변수에 따른 변화율을 살펴봅니다.',why:'모델의 각 가중치가 바뀔 때 손실이 어떻게 변하는지 계산하는 데 쓰입니다.',source:'OpenStax, Calculus Volume 3, Partial Derivatives',url:'https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives'},
{id:'loss',name:'손실함수',category:'머신러닝',x:405,y:225,summary:'모델의 예측과 실제 값 사이의 차이를 수치화하는 함수입니다.',why:'학습 과정에서 어떤 방향으로 모델을 개선할지 판단하는 기준이 됩니다.',source:'Google, Machine Learning Crash Course: Loss',url:'https://developers.google.com/machine-learning/crash-course/linear-regression/loss'},
{id:'gradient',name:'경사하강법',category:'머신러닝',x:525,y:190,summary:'손실함수의 기울기를 이용해 손실이 작아지는 방향으로 매개변수를 조정하는 방법입니다.',why:'선형회귀와 신경망 등 여러 모델의 학습에 사용됩니다.',source:'Google, Machine Learning Crash Course: Gradient descent',url:'https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent'},
{id:'neuron',name:'퍼셉트론',category:'딥러닝',x:440,y:345,summary:'입력에 가중치를 곱해 합하고 출력하는 기본적인 인공 뉴런 모형입니다.',why:'신경망에서 입력, 가중치, 편향이 어떻게 연결되는지 이해하는 출발점입니다.',source:'Rosenblatt, The Perceptron (1958)',url:'https://doi.org/10.1037/h0042519'},
{id:'network',name:'신경망',category:'딥러닝',x:550,y:320,summary:'여러 연산 단위를 층으로 연결해 입력에서 출력을 만드는 모델입니다.',why:'가중치를 학습해 데이터의 복잡한 관계를 표현할 수 있습니다.',source:'Goodfellow et al., Deep Learning, Chapter 6 (2016)',url:'https://www.deeplearningbook.org/contents/mlp.html'},
{id:'backprop',name:'역전파',category:'딥러닝',x:640,y:230,summary:'연쇄법칙을 이용해 신경망의 각 가중치에 대한 손실의 기울기를 계산합니다.',why:'계산한 기울기를 경사하강법 등에 전달해 가중치를 갱신합니다.',source:'Goodfellow et al., Deep Learning, Chapter 6 (2016)',url:'https://www.deeplearningbook.org/contents/mlp.html'},
{id:'evaluation',name:'모델 평가',category:'머신러닝',x:650,y:390,summary:'학습하지 않은 데이터에서 모델이 얼마나 잘 작동하는지 살펴봅니다.',why:'목적에 맞는 지표를 선택해야 실제 사용 가능성을 판단할 수 있습니다.',source:'Google, Machine Learning Crash Course: Classification',url:'https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall'}];
const edges=[['data','variable','데이터 표현'],['variable','list','값 모으기'],['list','array','배열로 확장'],['array','matrix','수학적 표현'],['data','mean','데이터 요약'],['data','group','그룹별 집계'],['group','mean','그룹별 평균'],['matrix','neuron','입력과 가중치'],['matrix','network','층별 연산'],['derivative','gradient','변화율'],['loss','gradient','최적화 대상'],['neuron','network','기본 단위'],['network','loss','예측 오차'],['network','backprop','기울기 계산'],['backprop','gradient','갱신에 사용'],['network','evaluation','성능 확인']];
const cases=[{id:'health',field:'공중보건',title:'지역별 건강 지표는 어떻게 다를까?',desc:'작은 표를 읽고 지역별 차이를 비교하며 데이터 분석을 시작합니다.',reason:'지역 간 지표를 비교하면 추가로 살펴볼 질문을 발견할 수 있습니다. 지표 차이만으로 원인을 단정할 수는 없습니다.',learn:'관측 단위, 변수, 평균, 표 읽기',data:'먼저 아래의 가상 데이터를 사용합니다. 실제 데이터 실습 후보로는 공공 보건 통계를 살펴볼 수 있습니다.',link:'https://www.who.int/data/gho',source:'WHO Global Health Observatory',kind:'입문 · 핵심 개념'}, {id:'retail',field:'유통·이커머스',title:'고객별 구매 횟수는 어떻게 구할까?',desc:'주문 기록을 고객별로 묶어 분석에 필요한 지표를 만듭니다.',reason:'고객별 집계는 구매 행태를 살펴보기 위한 기초가 됩니다.',learn:'행과 열, SQL GROUP BY, COUNT',data:'먼저 가상의 주문 데이터를 사용하고, 이후 공개 데이터에 적용합니다.',link:'https://archive.ics.uci.edu/dataset/352/online+retail',source:'UCI Machine Learning Repository, Online Retail',kind:'입문 · 핵심 개념'}, {id:'ml',field:'머신러닝',title:'모델은 오차를 어떻게 줄일까?',desc:'예측과 실제 값의 차이를 살피고 학습의 기본 원리를 이해합니다.',reason:'오차를 평가하고 줄이는 과정은 예측 모델 학습의 핵심입니다.',learn:'예측, 손실함수, 편미분, 경사하강법',data:'작은 가상 예제로 시작합니다.',link:'https://developers.google.com/machine-learning/crash-course/linear-regression/loss',source:'Google Machine Learning Crash Course',kind:'기초 연결 · 핵심 개념'}];
const stages=[['01','데이터와 분석에 익숙해지기','문제 정의 · 데이터 구조 · Python 코드 읽기'],['02','데이터 다루기','Pandas · NumPy · 정리 · 결측치 · 시각화 · 벡터와 행렬'],['03','데이터 가져오기와 기초 통계','SQL · JOIN · 집계 · 분포 · 상관관계'],['04','분석 결과의 신뢰도와 해석','표본 · 추정 · 가설검정 · A/B 테스트 · 편향'],['05','머신러닝의 원리와 평가','회귀 · 분류 · 모델 평가 · 데이터 누수 · 과적합'],['06','신경망과 딥러닝의 원리','퍼셉트론 · 순전파 · 손실함수 · 역전파 · 경사하강법']];
const app=document.querySelector('#app'),search=document.querySelector('#search'),results=document.querySelector('#search-results');
function getStore(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}function setStore(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch{}}
function find(id){return concepts.find(c=>c.id===id)||concepts[0]}function connected(id){return edges.filter(e=>e[0]===id||e[1]===id).map(e=>find(e[0]===id?e[1]:e[0]))}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function conceptLink(c){return `<a class="pill" href="#map/${c.id}">${c.name}</a>`}
function card(c){return `<article class="card"><span class="tag">${c.kind}</span><h3>${c.title}</h3><p>${c.desc}</p><span class="meta">${c.field}</span><br><br><a class="link" href="#case/${c.id}">문제 살펴보기 →</a></article>`}
function home(){const last=getStore('da-last',null);return `<section class="page"><div class="hero"><div><span class="eyebrow">YOUR DATA SCIENCE JOURNEY</span><h1>궁금한 것에서 시작해,<br>나만의 배움으로.</h1><p class="intro">개념의 연결을 발견하고, 실제 문제를 통해 데이터의 의미를 이해해요.</p></div><div class="hero-ornament">✳</div></div>${last?`<div class="continue"><div><strong>지난 학습 이어하기</strong><p>${escapeHTML(last.title)} · 마지막으로 살펴본 내용</p></div><a class="outline" href="${escapeHTML(last.href)}">이어서 보기 →</a></div>`:''}<div class="section-head"><h2>어디에서 시작해 볼까요?</h2><p>두 경로는 언제든 서로 연결됩니다</p></div><div class="tracks"><a class="track" href="#map"><div class="track-icon">⌘</div><h3>개념 지도</h3><p>궁금한 개념에서 출발해 기초와 응용을 연결해요.</p><span class="go">개념 탐색하기 →</span></a><a class="track" href="#cases"><div class="track-icon">▣</div><h3>실무 문제</h3><p>현실의 질문을 따라가며 필요한 개념을 배워요.</p><span class="go">문제 살펴보기 →</span></a></div><div class="section-head"><h2>이런 문제는 어떠세요?</h2><p>중요한 개념을 만나는 첫 번째 질문</p></div><div class="cards">${cases.map(card).join('')}</div><p class="meta" style="margin-top:14px">현재는 핵심 개념 중심의 예시 문제입니다. 최신 시사 추천은 아직 연결되지 않았습니다.</p></section>`}
// The graph is projected from three-dimensional coordinates onto an SVG viewport.
// Keep the camera position while navigating between concepts.
const brainView = { yaw: -0.16, pitch: 0.08 };
// A sculpted side profile, extruded in depth and projected with the concept nodes.
// The stylized silhouette is illustrative rather than an anatomical model.
const brainOutline = [
 [-2.30,.02],[-2.26,.38],[-2.08,.72],[-1.80,1.02],[-1.40,1.26],[-.92,1.39],[-.45,1.48],
 [.08,1.46],[.56,1.39],[1.02,1.24],[1.44,1.01],[1.78,.70],[2.00,.32],[2.08,-.07],
 [2.03,-.41],[1.83,-.64],[1.52,-.66],[1.65,-.88],[1.59,-1.08],[1.35,-1.24],[.98,-1.29],
 [.64,-1.22],[.30,-1.10],[.38,-1.58],[.12,-1.61],[-.15,-1.03],[-.62,-.94],[-.99,-.77],
 [-1.29,-.91],[-1.60,-.76],[-1.86,-.54],[-2.13,-.43],[-2.29,-.24]
];
function inBrain(x,y){let inside=false;for(let i=0,j=brainOutline.length-1;i<brainOutline.length;j=i++){
 const [xi,yi]=brainOutline[i],[xj,yj]=brainOutline[j];
 if(((yi>y)!==(yj>y)) && x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
 }return inside;}
const brainMesh = (() => {
 const points=[], lines=[];const grid=new Map();
 for(let row=0;row<22;row++)for(let col=0;col<33;col++){
  const x=-2.3+col*.14 + Math.sin(row*7+col*3)*.035;
  const y=-1.58+row*.145 + Math.cos(row*4+col*9)*.035;
  if(!inBrain(x,y))continue;
  const z=.28 + .42*Math.sin(col*.43+row*.31)**2;
  const p={x,y,z}; grid.set(`${col},${row}`,points.length);points.push(p);
  for(const [dx,dy] of [[-1,0],[0,-1],[-1,-1],[1,-1]]){
   const other=grid.get(`${col+dx},${row+dy}`);
   if(other!==undefined && Math.sin(col*11+row*19+dx)>-.32)lines.push([other,points.length-1]);
  }
 }
 return {points,lines};
})();
function graph(selected){
 const neighbours=connected(selected.id).map(c=>c.id);
 return `<div class="brain-controls"><span>드래그하거나 손가락으로 밀어 회전하세요</span><div><button type="button" data-turn="left" aria-label="왼쪽으로 회전">↶</button><button type="button" data-turn="right" aria-label="오른쪽으로 회전">↷</button><button type="button" data-turn="reset">정면</button></div></div><svg class="brain brain-3d" viewBox="0 0 760 510" role="group" aria-label="회전 가능한 3D 개념 지도. 개념을 선택하거나 회전 버튼을 이용하세요."><g class="brain-cloud"></g><g class="brain-links">${edges.map(([a,b])=>`<line class="edge ${a===selected.id||b===selected.id?'active':''}" data-edge="${a}:${b}"/>`).join('')}</g><g class="brain-nodes">${concepts.map(c=>`<a href="#map/${c.id}" class="node ${c.id===selected.id?'active':neighbours.includes(c.id)?'related':''}" data-node="${c.id}" aria-label="${c.name} 개념 보기"><circle r="${c.id===selected.id?34:27}"/><text>${c.name}</text></a>`).join('')}</g></svg>`;
}
function setupBrain(){
 const svg=app.querySelector('.brain-3d'); if(!svg)return;
 const cloud=svg.querySelector('.brain-cloud');
 const byId=Object.fromEntries(concepts.map((c,i)=>[c.id,{x:(c.x-380)/160,y:(290-c.y)/155,z:.85+Math.sin(i*2.7)*.12}]));
 let pointer=null, moved=false, startX=0, startY=0;
 const project=point=>{
  const cy=Math.cos(brainView.yaw),sy=Math.sin(brainView.yaw),cx=Math.cos(brainView.pitch),sx=Math.sin(brainView.pitch);
  const x=point.x*cy+point.z*sy, z=point.z*cy-point.x*sy;
  const y=point.y*cx-z*sx, depth=point.y*sx+z*cx;
  const scale=1+depth*0.075;
  return {x:380+x*120*scale,y:255-y*120*scale,depth,scale};
 };
 function draw(){
  // Layered contours rotate in 3D to give the silhouette depth.
  const layers=[-.75,-.5,-.25,0,.25,.5,.75].map(z=>{
   const taper=Math.sqrt(Math.max(.1,1-(z/.92)**2));
   const outline=brainOutline.map(([x,y])=>project({x:x*taper,y:y*taper,z}));
   const d=outline.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')+' Z';
   return `<path d="${d}" class="brain-silhouette"/>`;
  }).join('');
  const projected=brainMesh.points.map(project);
  const lines=brainMesh.lines.map(([a,b])=>`<line x1="${projected[a].x.toFixed(1)}" y1="${projected[a].y.toFixed(1)}" x2="${projected[b].x.toFixed(1)}" y2="${projected[b].y.toFixed(1)}"/>`).join('');
  const dots=projected.map((p,i)=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${i%13===0?2.3:1.1}"/>`).join('');
  cloud.innerHTML=`<g class="brain-shell">${layers}</g><g class="brain-web">${lines}${dots}</g>`;
  const coords=Object.fromEntries(Object.entries(byId).map(([id,p])=>[id,project(p)]));
  svg.querySelectorAll('[data-edge]').forEach(line=>{const [a,b]=line.dataset.edge.split(':');line.setAttribute('x1',coords[a].x);line.setAttribute('y1',coords[a].y);line.setAttribute('x2',coords[b].x);line.setAttribute('y2',coords[b].y)});
  const layer=svg.querySelector('.brain-nodes');
  [...layer.children].sort((a,b)=>coords[a.dataset.node].depth-coords[b.dataset.node].depth).forEach(node=>{const p=coords[node.dataset.node];node.setAttribute('transform',`translate(${p.x} ${p.y}) scale(${Math.max(.8,Math.min(1.15,p.scale))})`);layer.appendChild(node)});
 }
 svg.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;pointer=e.pointerId;startX=e.clientX;startY=e.clientY;moved=false;svg.classList.add('dragging')});
 svg.addEventListener('pointermove',e=>{if(e.pointerId!==pointer)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(!moved && Math.abs(dx)+Math.abs(dy)>3){moved=true;svg.setPointerCapture(pointer)}if(moved){brainView.yaw+=dx*.008;brainView.pitch=Math.max(-1.1,Math.min(1.1,brainView.pitch+dy*.008));startX=e.clientX;startY=e.clientY;draw()}});
 function end(e){if(e.pointerId!==pointer)return;pointer=null;svg.classList.remove('dragging')}
 svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
 svg.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
 app.querySelectorAll('[data-turn]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.turn==='reset'){brainView.yaw=-.16;brainView.pitch=.08}else brainView.yaw+=button.dataset.turn==='left'?-.3:.3;draw()}));
 draw();
}
function mapPage(id){const c=find(id||'gradient');const reviews=getStore('da-review',[]);return `<section class="page"><span class="eyebrow">CONCEPT MAP</span><h1>개념의 연결을 발견해요</h1><p class="intro">개념을 선택하면 가까운 연결과 그 이유를 볼 수 있어요.</p><div class="map-layout"><div class="panel map-card"><div class="map-toolbar"><strong>나의 개념 지도</strong><p>회전해서 살펴보고 점을 선택하세요</p></div>${graph(c)}<div class="notice">선택한 개념과 직접 연결된 관계를 강조했어요. 선은 개념 간 관계를 나타냅니다.</div></div><aside class="panel detail"><span class="tag">${c.category}</span><h2>${c.name}</h2><p>${c.summary}</p><h3>어떻게 쓰이나요?</h3><p>${c.why}</p><a class="source" href="${c.url}" target="_blank" rel="noopener noreferrer">참고 자료 ↗<br>${c.source}</a><hr><h3>연결된 개념</h3><div class="related-list">${connected(c.id).map(conceptLink).join('')}</div><hr><button class="${reviews.includes(c.id)?'soft':'outline'}" data-review="${c.id}">${reviews.includes(c.id)?'✓ 다시 볼 개념에 추가됨':'♡ 다시 볼게요'}</button></aside></div></section>`}
function casesPage(){return `<section class="page"><span class="eyebrow">REAL-WORLD QUESTIONS</span><h1>문제에서 시작하는 배움</h1><p class="intro">관심이 가는 질문을 고르고, 필요한 개념을 하나씩 연결해 보세요.</p><div class="notice">현재 준비된 입문용 예시입니다. 시사성에 따른 자동 추천과 분야 직접 입력은 추후 AI 연결이 필요합니다.</div><div class="section-head"><h2>실무 문제 둘러보기</h2></div><div class="case-list">${cases.map(card).join('')}</div></section>`}
function casePage(id){const c=cases.find(x=>x.id===id)||cases[0];const isRetail=id==='retail',isML=id==='ml';const code=isML?`actual = 10\npredicted = 8\nerror = actual - predicted\nsquared_error = error ** 2\nprint(squared_error)`:isRetail?`SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;`:`scores = [72, 68, 74]\naverage = sum(scores) / len(scores)\nprint(average)`;return `<section class="page case-detail"><a class="link" href="#cases">← 실무 문제 목록</a><br><br><span class="tag">${c.kind}</span><h1>${c.title}</h1><p class="intro">${c.desc}</p><div class="steps"><span>1 문제 이해</span><span>2 데이터 살펴보기</span><span>3 코드 읽기</span><span>4 결과 해석</span></div><div class="panel"><h2>왜 살펴볼까요?</h2><p class="intro">${c.reason}</p><h3>무엇을 배우나요?</h3><p>${c.learn}</p><h3>어떤 데이터를 사용하나요?</h3><p class="intro">${c.data}</p><a class="source" target="_blank" rel="noopener noreferrer" href="${c.link}">참고 자료: ${c.source} ↗</a></div><div class="panel"><span class="eyebrow">STEP 01</span><h2>작은 데이터부터 살펴보기</h2><p class="intro">${isML?'실제 값과 모델이 예측한 값을 비교하는 가상 예시입니다.':isRetail?'한 행은 주문 하나를 나타냅니다. 같은 고객이 여러 번 주문할 수 있습니다.':'한 행은 한 지역의 한 해를 나타내는 가상의 예시입니다.'}</p>${isML?'<table><tr><th>실제 값</th><th>예측값</th></tr><tr><td>10</td><td>8</td></tr></table>':isRetail?'<table><tr><th>주문</th><th>고객</th></tr><tr><td>1</td><td>A</td></tr><tr><td>2</td><td>B</td></tr><tr><td>3</td><td>A</td></tr></table>':'<table><tr><th>지역</th><th>연도</th><th>가상 지표</th></tr><tr><td>A</td><td>2024</td><td>72</td></tr><tr><td>B</td><td>2024</td><td>68</td></tr><tr><td>A</td><td>2025</td><td>74</td></tr></table>'}<p class="meta" style="margin-top:16px">연습을 위한 가상 데이터입니다.</p></div><div class="panel"><span class="eyebrow">STEP 02</span><h2>코드를 함께 읽어요</h2><p class="intro">${isML?'실제 값과 예측값의 차이를 구하고 제곱 오차를 계산합니다. 이것은 손실을 이해하기 위한 한 예시입니다.':isRetail?'같은 고객의 주문 행을 묶고 각 그룹의 주문 수를 셉니다.':'세 점수를 리스트에 담고, 합계를 개수로 나누어 평균을 구합니다.'}</p><pre><code>${escapeHTML(code)}</code></pre><div class="related-list">${(isML?[find('loss'),find('gradient')]:isRetail?[find('group'),find('data')]:[find('list'),find('mean')]).map(conceptLink).join('')}</div><br><button class="outline" id="check-understanding">이해도 확인하기 →</button><div id="check-content" hidden><hr><h3>${isML?'실제 값이 10이고 예측값이 8일 때 제곱 오차는 얼마일까요?':isRetail?'고객 A의 주문은 몇 건일까요?':'이 예제에서 값의 개수가 3개라는 것은 어떻게 알 수 있을까요?'}</h3><p class="intro">먼저 생각해 본 뒤 아래 힌트를 확인해 보세요.</p><details><summary>힌트 보기</summary><p class="intro">${isML?'실제 값에서 예측값을 빼고 그 차이를 제곱해 보세요.':isRetail?'고객이 A인 행을 하나씩 세어 보세요.':'리스트의 각 값과 len(scores)의 역할을 살펴보세요.'}</p></details></div><br><p class="meta">대화형 이해도 확인은 AI 연결 후 사용할 수 있습니다.</p></div></section>`}
function roadmap(){return `<section class="page"><span class="eyebrow">ONE YEAR ROADMAP</span><h1>나의 학습 로드맵</h1><p class="intro">달력보다 이해를 우선해요. 개념 지도와 실무 문제 어디에서든 시작할 수 있습니다.</p><div class="roadmap">${stages.map(s=>`<div class="panel road-row"><strong>STAGE ${s[0]}</strong><div><h3>${s[1]}</h3><p>${s[2]}</p></div></div>`).join('')}</div><p class="meta" style="margin-top:20px">세부 강의는 순차적으로 준비할 수 있도록 구성한 커리큘럼 초안입니다.</p></section>`}
function review(){const list=getStore('da-review',[]).map(find);return `<section class="page"><span class="eyebrow">MY LEARNING</span><h1>다시 볼 개념</h1><p class="intro">직접 표시한 개념을 모아두었어요. 현재 브라우저에 저장됩니다.</p>${list.length?`<div class="cards">${list.map(c=>`<div class="card"><span class="tag">${c.category}</span><h3>${c.name}</h3><p>${c.summary}</p><a class="link" href="#map/${c.id}">다시 살펴보기 →</a></div>`).join('')}</div>`:'<div class="panel"><p class="intro">아직 표시한 개념이 없어요. 개념 지도에서 「다시 볼게요」를 눌러보세요.</p><a href="#map" class="link">개념 지도로 가기 →</a></div>'}<br><div class="notice">AI의 자동 복습 제안과 기기 간 동기화는 아직 연결되지 않았습니다.</div></section>`}
function render(){let [page,id]=location.hash.slice(1).split('/');if(!page)page='home';document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===(page==='case'?'cases':page)));app.innerHTML=page==='map'?mapPage(id):page==='cases'?casesPage():page==='case'?casePage(id):page==='roadmap'?roadmap():page==='review'?review():home();if(page==='map')setupBrain();if(page==='map'&&id)setStore('da-last',{title:find(id).name,href:'#map/'+id});if(page==='case'){let c=cases.find(x=>x.id===id);if(c)setStore('da-last',{title:c.title,href:'#case/'+id})}window.scrollTo(0,0)}
app.addEventListener('click',e=>{const btn=e.target.closest('[data-review]');if(btn){let list=getStore('da-review',[]);list=list.includes(btn.dataset.review)?list.filter(x=>x!==btn.dataset.review):[...list,btn.dataset.review];setStore('da-review',list);render()}if(e.target.id==='check-understanding'){document.querySelector('#check-content').hidden=false;e.target.hidden=true}});
function searchRender(){const q=search.value.trim().toLowerCase();if(!q){results.hidden=true;return}let matches=concepts.filter(c=>(c.name+' '+c.category).toLowerCase().includes(q));results.innerHTML=matches.length?`<div class="result-list">${matches.map(c=>`<button type="button" data-result="${c.id}"><span>${c.name}</span><small>${c.category}</small></button>`).join('')}</div><div class="result-preview" aria-label="연결 개념 미리보기">${preview(matches[0])}</div>`:'<div class="search-empty">아직 준비된 개념이 없어요. 다른 검색어를 입력해 보세요.</div>';results.hidden=false}
function preview(c){return `<strong>${c.name}의 연결</strong><div class="preview-links">${connected(c.id).map(n=>`<span>${n.name}</span>`).join('')}</div><small>개념을 선택하면 관계를 자세히 볼 수 있어요.</small>`} function updatePreview(e){const button=e.target.closest('[data-result]');if(button){const pane=results.querySelector('.result-preview');if(pane)pane.innerHTML=preview(find(button.dataset.result))}} results.addEventListener('mouseover',updatePreview);results.addEventListener('focusin',updatePreview);search.addEventListener('input',searchRender);results.addEventListener('click',e=>{const b=e.target.closest('[data-result]');if(!b)return;location.hash='#map/'+b.dataset.result;results.hidden=true;search.value=''});search.addEventListener('keydown',e=>{if(e.key==='Escape')results.hidden=true;if(e.key==='Enter'){const first=results.querySelector('[data-result]');if(first)first.click()}});document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))results.hidden=true});
const dialog=document.querySelector('#tutor');document.querySelector('#tutor-open').addEventListener('click',()=>dialog.showModal());document.querySelector('#tutor-close').addEventListener('click',()=>dialog.close());document.querySelector('#tutor-done').addEventListener('click',()=>dialog.close());window.addEventListener('hashchange',render);render();
