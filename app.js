import { coreLessons, coreLessonPage } from './core-lessons.js?v=1';
import { recordLearning } from './learning-log.js?v=1';
import { curriculum, lessonPage, pythonLessonPage, neuralLessonPage } from './curriculum.js?v=1';
import { concepts, edges } from './concepts.js?v=map-1';
import { layers, graphMarkup } from './concept-map.js?v=map-1';
'use strict';
const cases=[{id:'health',field:'공중보건',title:'지역별 건강 지표는 어떻게 다를까?',desc:'작은 표를 읽고 지역별 차이를 비교하며 데이터 분석을 시작합니다.',reason:'지역 간 지표를 비교하면 추가로 살펴볼 질문을 발견할 수 있습니다. 지표 차이만으로 원인을 단정할 수는 없습니다.',learn:'관측 단위, 변수, 평균, 표 읽기',data:'먼저 아래의 가상 데이터를 사용합니다. 실제 데이터 실습 후보로는 공공 보건 통계를 살펴볼 수 있습니다.',link:'https://www.who.int/data/gho',source:'WHO Global Health Observatory',kind:'입문 · 핵심 개념'}, {id:'retail',field:'유통·이커머스',title:'고객별 구매 횟수는 어떻게 구할까?',desc:'주문 기록을 고객별로 묶어 분석에 필요한 지표를 만듭니다.',reason:'고객별 집계는 구매 행태를 살펴보기 위한 기초가 됩니다.',learn:'행과 열, SQL GROUP BY, COUNT',data:'먼저 가상의 주문 데이터를 사용하고, 이후 공개 데이터에 적용합니다.',link:'https://archive.ics.uci.edu/dataset/352/online+retail',source:'UCI Machine Learning Repository, Online Retail',kind:'입문 · 핵심 개념'}, {id:'ml',field:'머신러닝',title:'모델은 오차를 어떻게 줄일까?',desc:'예측과 실제 값의 차이를 살피고 학습의 기본 원리를 이해합니다.',reason:'오차를 평가하고 줄이는 과정은 예측 모델 학습의 핵심입니다.',learn:'예측, 손실함수, 편미분, 경사하강법',data:'작은 가상 예제로 시작합니다.',link:'https://developers.google.com/machine-learning/crash-course/linear-regression/loss',source:'Google Machine Learning Crash Course',kind:'기초 연결 · 핵심 개념'}];
const recommendationInfo={
 health:{label:'최근 보건 지표',date:'2026-05-13',source:'세계보건기구, World Health Statistics 2026',url:'https://www.who.int/publications/i/item/9789240122482'},
 retail:{label:'고전 실무 데이터',date:'2015',source:'Chen, D. (2015), Online Retail [Dataset], UCI',url:'https://doi.org/10.24432/C5BW33'},
 ml:{label:'핵심 원리',date:'발행일 미표시',source:'Google, Machine Learning Crash Course: Loss',url:'https://developers.google.com/machine-learning/crash-course/linear-regression/loss'}
};
const caseKeywords={health:'의료 보건 건강 공중보건',retail:'유통 쇼핑 고객 판매',ml:'머신러닝 인공지능 예측 학습'};
const app=document.querySelector('#app'),search=document.querySelector('#search'),results=document.querySelector('#search-results');
function getStore(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}function setStore(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch{}}
function find(id){return concepts.find(c=>c.id===id)||concepts[0]}function connected(id){return edges.filter(e=>e[0]===id||e[1]===id).map(e=>find(e[0]===id?e[1]:e[0]))}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function conceptLink(c){return `<a class="pill" href="#map/${c.id}">${c.name}</a>`}
function card(c){const info=recommendationInfo[c.id];return `<article class="card" data-case-id="${c.id}"><span class="tag">${c.kind}</span><h3>${c.title}</h3><p>${c.desc}</p><p><strong>추천 이유:</strong> ${c.reason}</p><span class="meta">${info.label} · ${info.date} · 확인 2026-11-03</span><br><a class="source" href="${info.url}" target="_blank" rel="noopener noreferrer">${info.source} ↗</a><br><br><a class="link" href="#case/${c.id}">문제 살펴보기 →</a></article>`}
function home(){const last=getStore('da-last',null),lastChat=Object.values(getStore('da-chat-index',{})).filter(x=>x&&typeof x.href==='string').sort((a,b)=>b.at-a.at)[0];return `<section class="page"><div class="hero"><div><span class="eyebrow">YOUR DATA SCIENCE JOURNEY</span><h1>궁금한 것에서 시작해,<br>나만의 배움으로.</h1><p class="intro">개념의 연결을 발견하고, 실제 문제를 통해 데이터의 의미를 이해해요.</p></div><div class="hero-ornament">✳</div></div>${last?`<div class="continue"><div><strong>지난 학습 이어하기</strong><p>${escapeHTML(last.title)} · 마지막으로 살펴본 내용</p></div><div class="continue-actions"><a class="outline" href="${escapeHTML(last.href)}">이어서 보기 →</a> <a class="link" href="#review">다시 볼 개념 ${getStore('da-review',[]).length}개</a> ${lastChat?`<a class="link" data-last-chat href="${escapeHTML(lastChat.href)}">지난 대화 이어보기 →</a>`:''}</div></div>`:''}<div class="section-head"><h2>어디에서 시작해 볼까요?</h2><p>두 경로는 언제든 서로 연결됩니다</p></div><div class="tracks"><a class="track" href="#map"><div class="track-icon">⌘</div><h3>개념 지도</h3><p>궁금한 개념에서 출발해 기초와 응용을 연결해요.</p><span class="go">개념 탐색하기 →</span></a><a class="track" href="#cases"><div class="track-icon">▣</div><h3>실무 문제로 시작</h3><p>현실의 질문을 따라가며 필요한 개념을 배워요.</p><span class="go">문제 살펴보기 →</span></a></div><p class="intro" style="margin-top:18px">두 경로의 공통 안내: <a class="link" href="#roadmap">1년 학습 로드맵 보기 →</a></p><div class="section-head"><h2>이런 문제는 어떠세요?</h2><p>중요한 개념을 만나는 첫 번째 질문</p></div><div class="cards">${cases.map(card).join('')}</div><p class="meta" style="margin-top:14px">현재는 핵심 개념 중심의 예시 문제입니다. 최신 시사 추천은 아직 연결되지 않았습니다.</p></section>`}
function mapPage(id) {
 const c = concepts.find(c => c.id === id) || find('gradient');
 const saved = getStore('da-review', []).includes(c.id);
 const layer = layers.find(l => l.id === c.layer);
 return `<section class="page map-page">
   <div class="page-heading"><div><span class="eyebrow">EXPLORE THE CONNECTIONS</span><h1>개념 지도<span class="heading-dot">.</span></h1></div><p>기초에서 원리로, 원리에서 응용으로.<br>연결을 따라 데이터 사이언스를 이해해 보세요.</p></div>
   <div class="map-layout"><div class="map-card">${graphMarkup(concepts, edges, c.id)}
     <section class="connection-reasons" aria-label="선택한 개념의 연결 이유"><div class="connection-title"><h2>연결을 읽는 방법</h2><span>${connected(c.id).length}개의 가까운 개념</span></div><div class="reason-list">${edges.filter(e => e[0] === c.id || e[1] === c.id).map(e => { const other = find(e[0] === c.id ? e[1] : e[0]); return `<a href="#map/${other.id}"><span>${other.name}<span aria-hidden="true">↗</span></span><small>${e[2]}</small></a>`; }).join('')}</div></section>
   </div>
   <aside class="panel detail" id="concept-detail" aria-labelledby="detail-title" tabindex="-1">
     ${returnPoint ? `<a class="link return-to-learning" href="${escapeHTML(returnPoint.href)}">← 보던 학습 위치로 돌아가기</a><br><br>` : ''}<div class="detail-top"><span class="tag">${layer.name} <span>· ${c.category}</span></span><span class="detail-index">${String(concepts.indexOf(c)+1).padStart(2,'0')} / ${concepts.length}</span></div>
     <h2 id="detail-title">${c.name}</h2><p class="english-name">${c.english}</p>
     <section class="detail-section"><h3><span aria-hidden="true">▤</span> 개념</h3><p>${c.summary}</p></section>
     <section class="detail-section"><h3><span aria-hidden="true">◎</span> 어떻게 쓰이나요?</h3><p>${c.why}</p></section>
     <section class="detail-section"><h3><span aria-hidden="true">⌘</span> 연결된 개념</h3><div class="related-list">${connected(c.id).map(conceptLink).join('')}</div></section>
     <section class="detail-section"><h3><span aria-hidden="true">↗</span> 더 깊이 알아보기</h3><a class="source" href="${c.url}" target="_blank" rel="noopener noreferrer">${c.source}<span aria-hidden="true"> ↗</span></a></section>
     <div class="detail-review"><button class="${saved ? 'soft' : 'outline'}" data-review="${c.id}" aria-pressed="${saved}">${saved ? '✓ 다시 볼 개념에 추가됨' : '♡ 다시 볼게요'}</button><p>기억하고 싶은 개념을 모아두세요.</p><span id="review-status" role="status"></span></div>
   </aside></div>
 </section>`;
}
function casesPage(){return `<section class="page"><span class="eyebrow">REAL-WORLD QUESTIONS</span><h1>문제에서 시작하는 배움</h1><p class="intro">관심이 가는 질문을 고르고, 필요한 개념을 하나씩 연결해 보세요.</p><div class="notice">입문용 예시와 출처가 확인된 주제를 함께 보여줍니다. AI의 자동 최신 정보 확인은 아직 연결되지 않았습니다.</div><div class="section-head"><h2>실무 문제 둘러보기</h2></div><div class="panel case-search-panel"><label for="case-search">관심 분야 또는 문제 검색</label><input id="case-search" type="search" placeholder="예: 의료, 유통, 머신러닝"><p class="meta">현재 준비된 문제에서 검색합니다.</p><button class="outline" type="button" data-topic="search">AI와 주제 좁히기</button> <button class="outline" type="button" data-topic="unknown">잘 모르겠어요</button><p id="case-search-status" role="status"></p></div><br><div class="case-list">${cases.map(card).join('')}</div><div class="section-head"><h2>최근 살펴볼 주제</h2></div><div class="panel"><span class="tag">에너지 · 2026-04-16</span><h3>AI 데이터센터의 전력 수요는 어떻게 변할까?</h3><p>국제에너지기구는 데이터센터 전력 사용 증가와 전력망의 제약을 분석했습니다. 증가율과 전체 수요에서 차지하는 비중을 구분하는 연습에 적합합니다.</p><p class="meta">실습 콘텐츠 준비 중 · 출처 확인 2026-11-03 · 이후의 최신 변화는 미확인</p><a class="source" href="https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions" target="_blank" rel="noopener noreferrer">IEA, Data centre electricity use surged in 2025 (2026) ↗</a></div></section>`}
function casePage(id){const c=cases.find(x=>x.id===id)||cases[0];const isRetail=id==='retail',isML=id==='ml';const code=isML?`actual = 10\npredicted = 8\nerror = actual - predicted\nsquared_error = error ** 2\nprint(squared_error)`:isRetail?`SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;`:`scores = [72, 68, 74]\naverage = sum(scores) / len(scores)\nprint(average)`;return `<section class="page case-detail"><a class="link" href="#cases">← 실무 문제 목록</a><br><br><span class="tag">${c.kind}</span><h1>${c.title}</h1><p class="intro">${c.desc}</p><div class="steps"><span>1 문제 이해</span><span>2 데이터 살펴보기</span><span>3 코드 읽기</span><span>4 결과 해석</span></div><div class="panel"><h2>왜 살펴볼까요?</h2><p class="intro">${c.reason}</p><h3>무엇을 배우나요?</h3><p>${c.learn}</p><h3>어떤 데이터를 사용하나요?</h3><p class="intro">${c.data}</p><a class="source" target="_blank" rel="noopener noreferrer" href="${c.link}">참고 자료: ${c.source} ↗</a></div><div class="panel"><span class="eyebrow">STEP 01</span><h2>작은 데이터부터 살펴보기</h2><p class="intro">${isML?'실제 값과 모델이 예측한 값을 비교하는 가상 예시입니다.':isRetail?'한 행은 주문 하나를 나타냅니다. 같은 고객이 여러 번 주문할 수 있습니다.':'한 행은 한 지역의 한 해를 나타내는 가상의 예시입니다.'}</p>${isML?'<table><tr><th>실제 값</th><th>예측값</th></tr><tr><td>10</td><td>8</td></tr></table>':isRetail?'<table><tr><th>주문</th><th>고객</th></tr><tr><td>1</td><td>A</td></tr><tr><td>2</td><td>B</td></tr><tr><td>3</td><td>A</td></tr></table>':'<table><tr><th>지역</th><th>연도</th><th>가상 지표</th></tr><tr><td>A</td><td>2024</td><td>72</td></tr><tr><td>B</td><td>2024</td><td>68</td></tr><tr><td>A</td><td>2025</td><td>74</td></tr></table>'}<p class="meta" style="margin-top:16px">연습을 위한 가상 데이터입니다.</p></div><div class="panel"><span class="eyebrow">STEP 02</span><h2>코드를 함께 읽어요</h2><p class="intro">${isML?'실제 값과 예측값의 차이를 구하고 제곱 오차를 계산합니다. 이것은 손실을 이해하기 위한 한 예시입니다.':isRetail?'같은 고객의 주문 행을 묶고 각 그룹의 주문 수를 셉니다.':'세 점수를 리스트에 담고, 합계를 개수로 나누어 평균을 구합니다.'}</p><pre><code>${escapeHTML(code)}</code></pre><div class="related-list">${(isML?[find('loss'),find('gradient')]:isRetail?[find('group'),find('data')]:[find('list'),find('mean')]).map(conceptLink).join('')}</div><br><button class="outline" id="check-understanding">이해도 확인하기 →</button><div id="check-content" hidden><hr><h3>${isML?'실제 값이 10이고 예측값이 8일 때 제곱 오차는 얼마일까요?':isRetail?'고객 A의 주문은 몇 건일까요?':'이 예제에서 값의 개수가 3개라는 것은 어떻게 알 수 있을까요?'}</h3><p class="intro">먼저 생각해 본 뒤 아래 힌트를 확인해 보세요.</p><details><summary>힌트 보기</summary><p class="intro">${isML?'실제 값에서 예측값을 빼고 그 차이를 제곱해 보세요.':isRetail?'고객이 A인 행을 하나씩 세어 보세요.':'리스트의 각 값과 len(scores)의 역할을 살펴보세요.'}</p></details></div><br><p class="meta">대화형 이해도 확인은 AI 연결 후 사용할 수 있습니다.</p></div></section>`}
function roadmap(){const ids=['first','python','numpy','pandas','sql','viz','stat','sampling','regression','classification','neural','neural'];return `<section class="page"><span class="eyebrow">ONE YEAR ROADMAP</span><h1>나의 학습 로드맵</h1><p class="intro">12단계는 두 학습 경로에 공통으로 연결됩니다. 권장 순서이며 실제 진도는 이해도에 맞춰 조절하세요.</p><div class="roadmap">${curriculum.map((s,i)=>`<div class="panel road-row"><strong>STAGE ${s[0]}</strong><div><h3>${s[1]}</h3><p>${s[2].join(' · ')}</p><p><a class="link" href="#lesson/${ids[i]}">핵심 학습 시작하기 →</a></p></div></div>`).join('')}</div><p class="meta" style="margin-top:20px">각 단계에 핵심 학습 예제를 제공하며, 목차의 모든 세부 항목과 프로젝트가 완성된 것은 아닙니다.</p></section>`}
function review(){const list=getStore('da-review',[]).map(find);return `<section class="page"><span class="eyebrow">MY LEARNING</span><h1>다시 볼 개념</h1><p class="intro">직접 표시한 개념을 모아두었어요. 현재 브라우저에 저장됩니다.</p>${list.length?`<div class="cards">${list.map(c=>`<div class="card"><span class="tag">${c.category}</span><h3>${c.name}</h3><p>${c.summary}</p>${getStore('da-review-reasons',{})[c.id]?`<label>AI가 표시한 이유<textarea data-review-reason="${c.id}" rows="3">${escapeHTML(getStore('da-review-reasons',{})[c.id].reason)}</textarea></label><p class="meta">근거: ${escapeHTML(getStore('da-review-reasons',{})[c.id].evidence)}</p><button class="outline" data-save-reason="${c.id}">이유 저장</button><br><br>`:''}<a class="link" href="#map/${c.id}">다시 살펴보기 →</a><br><br><button class="outline" data-remove-review="${c.id}">복습 목록에서 삭제</button></div>`).join('')}</div>`:'<div class="panel"><p class="intro">아직 표시한 개념이 없어요. 개념 지도에서 「다시 볼게요」를 눌러보세요.</p><a href="#map" class="link">개념 지도로 가기 →</a></div>'}<br><div class="notice">AI의 자동 복습 제안과 기기 간 동기화는 아직 연결되지 않았습니다.</div></section>`}
let previousPage = '';
let returnPoint = null, returningToProblem = false;
document.addEventListener('concept-return-point',e=>{returnPoint=e.detail;});
document.addEventListener('review-updated',()=>{if(['map','review'].includes(previousPage))render();});
function render() {
 let [page,id] = location.hash.slice(1).split('/');
 if (!page) page = 'home';
 const mapScroll = page === 'map' && previousPage === 'map' ? app.querySelector('.map-scroll')?.scrollLeft || 0 : 0;
 const focusNode = page === 'map' && previousPage === 'map' && document.activeElement?.closest('.map-node');
 const focusRelated = page === 'map' && previousPage === 'map' && document.activeElement?.closest('.detail .pill');
 const focusSelect = document.activeElement?.id === 'concept-select';
 const navPage = page === 'case' ? 'cases' : page === 'lesson' ? 'roadmap' : page;
 document.querySelectorAll('[data-nav]').forEach(a => { a.classList.toggle('active',a.dataset.nav === navPage); if (a.dataset.nav === navPage) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
 app.innerHTML = page === 'map' ? mapPage(id) : page === 'cases' ? casesPage() : page === 'case' ? casePage(id) : page === 'roadmap' ? roadmap() : page === 'lesson' ? (id === 'python' ? pythonLessonPage() : id === 'neural' ? neuralLessonPage() : coreLessons[id] ? coreLessonPage(id,concepts) : lessonPage()) : page === 'review' ? review() : home();
 if (page === 'map') {
   const c = concepts.find(c => c.id === id) || find('gradient');
   setStore('da-last',{title:c.name,href:'#map/'+c.id});
   recordLearning({type:'concept',dedupe:'concept:'+c.id,title:c.name,text:c.summary+'\n활용: '+c.why+'\n출처: '+c.source+' — '+c.url});
   app.querySelector('.map-scroll').scrollLeft = mapScroll;
   if (matchMedia('(max-width:700px)').matches) {
     const scroller = app.querySelector('.map-scroll'), node = app.querySelector('.map-node.selected');
     scroller.scrollLeft = node.offsetLeft + node.offsetWidth / 2 - scroller.clientWidth / 2;
   }
   if (focusNode) app.querySelector(`[data-concept="${c.id}"]`)?.focus({preventScroll:true});
   if (focusSelect) app.querySelector('#concept-select').focus({preventScroll:true});
   if (focusRelated) { const detail = app.querySelector('#concept-detail'); detail.focus({preventScroll:true}); detail.scrollIntoView({block:'start'}); }
 }
 if (page === 'case') setupCaseFlow(id);
 if (page === 'lesson') {
   const lessonId = id === 'python' || id === 'neural' || coreLessons[id] ? id : 'first';
   const title=app.querySelector('h1')?.textContent || '학습', href='#lesson/'+lessonId;
   setStore('da-last',{title,href});
   const note=app.querySelector('[data-project-notes]');if(note)note.value=getStore('da-project-note:'+lessonId,'');
   const panels=[...app.querySelectorAll('.case-detail > .panel')];
   const sources=[...app.querySelectorAll('.case-detail a.source')].map(a=>a.textContent+' '+a.href).join('\n');
   recordLearning({type:'case',dedupe:'lesson:'+lessonId,title,text:panels.map(p=>p.innerText).join('\n').slice(0,5000)+'\n출처: '+sources,code:[...app.querySelectorAll('.case-detail pre code')].map(el=>el.innerText).join('\n\n').slice(0,6000),language:'python'});
 }
 if (page === 'case') { const c = cases.find(x => x.id === id); if (c) setStore('da-last',{title:c.title,href:'#case/'+id}); }
 if (!(page === 'map' && previousPage === 'map')) window.scrollTo(0,0);
 if (returningToProblem && returnPoint && location.hash === returnPoint.href) { const y=returnPoint.y,mapX=returnPoint.mapX; returnPoint=null; returningToProblem=false; requestAnimationFrame(()=>{const map=app.querySelector('.map-scroll');if(map&&mapX!=null)map.scrollLeft=mapX;window.scrollTo(0,y)}); }
 previousPage = page;
}
function setupCaseFlow(id) {
 const root=app.querySelector('.case-detail'), panels=[...root.querySelectorAll(':scope > .panel')];
 if (panels.length < 3) return;
 const current=cases.find(c=>c.id===id)||cases[0];
 const easy=id==='ml'?['실제 값이 10이고 예측값이 8이면 두 값이 같은가요?','같지 않습니다. 먼저 10과 8의 차이를 읽고 다음에 제곱 오차를 살펴봅니다.']:id==='retail'?['첫 번째 주문의 고객은 누구인가요?','첫 번째 행의 고객은 A입니다. 다음으로 A인 행을 모두 세어 봅니다.']:['2024년 A 지역의 가상 점수는 얼마인가요?','A와 2024가 만나는 행의 점수는 72입니다.'];
 const controls=document.createElement('div'); controls.className='panel case-flow';
 controls.innerHTML=`<h2>어떻게 시작할까요?</h2><p>전체 과정: 질문과 자료 이해 → 데이터 읽기 → 코드 이해 → 결과 해석</p><fieldset><legend>학습 방식</legend><label><input type="radio" name="learning-mode" value="foundation" checked> 기초부터 자세히</label> <label><input type="radio" name="learning-mode" value="guided"> 따라가며 필요한 만큼 배우기</label></fieldset><div class="case-prereqs"><p>먼저 살펴볼 선수 개념</p><div class="related-list">${(id==='ml'?[find('loss'),find('derivative')]:id==='retail'?[find('data'),find('group')]:[find('data'),find('mean')]).map(conceptLink).join('')}</div></div><p class="meta">선수 개념을 보고 이 문제의 학습 위치로 돌아올 수 있습니다.</p><details><summary>같은 주제의 더 쉬운 문제</summary><p>${easy[0]}</p><details><summary>설명과 답</summary><p>${easy[1]}</p></details></details><p id="case-step-status" role="status"></p><button type="button" class="outline" data-step="previous">← 이전 단계</button> <button type="button" class="outline" data-step="next">다음 단계 →</button>`;
 panels[0].after(controls);
 const interpretation=document.createElement('div'); interpretation.className='panel'; interpretation.innerHTML=`<span class="eyebrow">STEP 03</span><h2>결과 해석</h2><p>${current.reason}</p><p>이 예제는 가상 자료입니다. 실제 자료에는 결측값과 표본 편향이 있는지 살펴보고, 결과를 인과관계로 단정하지 마세요.</p><p><a class="source" href="${current.link}" target="_blank" rel="noopener noreferrer">실제 공개 자료: ${current.source} ↗</a></p>`; panels[2].after(interpretation);
 const stages=[panels[1],panels[2],interpretation]; const key='da-case-step:'+current.id;
 let step=Math.max(0,Math.min(2,Number(sessionStorage.getItem(key))||0)); const modeKey=key+':mode'; const mode=sessionStorage.getItem(modeKey)||'foundation'; const modeInput=controls.querySelector(`input[name=learning-mode][value=${mode}]`); if(modeInput)modeInput.checked=true; controls.querySelector('.case-prereqs').hidden=mode==='guided';
 function draw(){stages.forEach((stage,i)=>stage.hidden=i!==step); controls.querySelector('#case-step-status').textContent=`${step+1} / 3 · ${['데이터 살펴보기','코드 읽기','결과 해석'][step]}`; controls.querySelector('[data-step=previous]').disabled=step===0; controls.querySelector('[data-step=next]').disabled=step===2;sessionStorage.setItem(key,String(step));recordLearning({type:'case',dedupe:'case:'+current.id+':'+step,title:current.title+' · '+['데이터 살펴보기','코드 읽기','결과 해석'][step],text:stages[step].innerText+'\n출처: '+current.source+' — '+current.link,code:stages[step].querySelector('pre code')?.innerText||'',language:current.id==='retail'?'sql':'python'});}
 controls.addEventListener('click',e=>{const btn=e.target.closest('[data-step]');if(!btn)return;step=Math.max(0,Math.min(2,step+(btn.dataset.step==='next'?1:-1)));draw();});
 controls.addEventListener('change',e=>{if(e.target.name==='learning-mode') {controls.querySelector('.case-prereqs').hidden=e.target.value==='guided';sessionStorage.setItem(modeKey,e.target.value);}}); draw();
}
app.addEventListener('input',e=>{if(e.target.matches('[data-project-notes]')){setStore('da-project-note:'+e.target.dataset.projectNotes,e.target.value);return}if(e.target.id!=='case-search')return;const term=e.target.value.trim().toLowerCase();let count=0;app.querySelectorAll('.case-list [data-case-id]').forEach(card=>{const c=cases.find(x=>x.id===card.dataset.caseId);const match=(c.field+' '+c.title+' '+c.desc+' '+c.learn+' '+caseKeywords[c.id]).toLowerCase().includes(term);card.hidden=!match;if(match)count++;});app.querySelector('#case-search-status').textContent=`${count}개 문제`;});
app.addEventListener('change', e => { if (e.target.id === 'concept-select') location.hash = '#map/' + e.target.value; if(e.target.matches('[data-project-notes]') && e.target.value.trim()){const panel=e.target.closest('.panel');recordLearning({type:'case',title:(app.querySelector('h1')?.textContent||'프로젝트')+' · 직접 기록한 결과',text:'학습자가 입력한 결과와 해석: '+e.target.value,code:panel.querySelector('pre code')?.innerText||'',language:'python'});} });
app.addEventListener('click', e => {
 const lastChat = e.target.closest('[data-last-chat]');
 if (lastChat) {const href=lastChat.getAttribute('href');if(href===(location.hash||'#home')){e.preventDefault();document.dispatchEvent(new Event('open-conversation'));}else sessionStorage.setItem('da-open-chat',href);}
 const removeReview = e.target.closest('[data-remove-review]');
 if (removeReview) { const id=removeReview.dataset.removeReview; setStore('da-review',getStore('da-review',[]).filter(x=>x!==id)); const reasons=getStore('da-review-reasons',{}); delete reasons[id]; setStore('da-review-reasons',reasons); render(); return; }
 const saveReason=e.target.closest('[data-save-reason]'); if(saveReason){const id=saveReason.dataset.saveReason,reasons=getStore('da-review-reasons',{}),field=app.querySelector(`[data-review-reason="${id}"]`);if(reasons[id]&&field){reasons[id].reason=field.value.slice(0,300);setStore('da-review-reasons',reasons);saveReason.textContent='저장됨';}return;}
 const conceptAnchor = e.target.closest('a[href^="#map/"]');
 if (conceptAnchor && ['case','lesson'].includes(previousPage)) returnPoint = {href:location.hash,y:window.scrollY};
 if (e.target.closest('.return-to-learning')) returningToProblem = true;
 const detailLink = e.target.closest('a[href="#concept-detail"]');
 if (detailLink) { e.preventDefault(); app.querySelector('#concept-detail').focus({preventScroll:true}); app.querySelector('#concept-detail').scrollIntoView({behavior:'smooth',block:'start'}); }
 const btn = e.target.closest('[data-review]');
 if (btn) {
   let list = getStore('da-review',[]);
   const saved = !list.includes(btn.dataset.review);
   list = saved ? [...list,btn.dataset.review] : list.filter(x => x !== btn.dataset.review);
   setStore('da-review',list);
   if (!saved) { const reasons=getStore('da-review-reasons',{}); delete reasons[btn.dataset.review]; setStore('da-review-reasons',reasons); }
   btn.className = saved ? 'soft' : 'outline';
   btn.setAttribute('aria-pressed',String(saved));
   btn.textContent = saved ? '✓ 다시 볼 개념에 추가됨' : '♡ 다시 볼게요';
   document.querySelector('#review-status').textContent = saved ? '복습 목록에 저장했어요.' : '복습 목록에서 해제했어요.';
 }
 if (e.target.id === 'check-understanding') { document.querySelector('#check-content').hidden = false; e.target.hidden = true; }
});
function searchRender(){const q=search.value.trim().toLowerCase();if(!q){results.hidden=true;return}let matches=concepts.filter(c=>(c.name+' '+c.english+' '+c.category).toLowerCase().includes(q));results.innerHTML=matches.length?`<div class="result-list">${matches.map(c=>`<button type="button" data-result="${c.id}"><span>${c.name}</span><small>${c.category}</small></button>`).join('')}</div><div class="result-preview" aria-label="연결 개념 미리보기">${preview(matches[0])}</div>`:'<div class="search-empty">아직 준비된 개념이 없어요. 다른 검색어를 입력해 보세요.</div>';results.hidden=false}
function preview(c){return `<strong>${c.name}의 연결</strong><div class="preview-links">${connected(c.id).map(n=>`<span>${n.name}</span>`).join('')}</div><small>개념을 선택하면 관계를 자세히 볼 수 있어요.</small>`} function updatePreview(e){const button=e.target.closest('[data-result]');if(button){const pane=results.querySelector('.result-preview');if(pane)pane.innerHTML=preview(find(button.dataset.result))}} results.addEventListener('mouseover',updatePreview);results.addEventListener('focusin',updatePreview);search.addEventListener('input',searchRender);results.addEventListener('click',e=>{const b=e.target.closest('[data-result]');if(!b)return;if(matchMedia('(hover: none)').matches && b.dataset.previewed!=='true'){results.querySelectorAll('[data-result]').forEach(x=>delete x.dataset.previewed);b.dataset.previewed='true';results.querySelector('.result-preview').innerHTML=preview(find(b.dataset.result))+'<small>한 번 더 눌러 개념을 여세요.</small>';return}location.hash='#map/'+b.dataset.result;results.hidden=true;search.value=''});search.addEventListener('keydown',e=>{if(e.key==='Escape')results.hidden=true;if(e.key==='Enter'){const first=results.querySelector('[data-result]');if(first){first.dataset.previewed='true';first.click()}}});document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))results.hidden=true});
const dialog=document.querySelector('#tutor');document.querySelector('#tutor-open').addEventListener('click',()=>dialog.showModal());document.querySelector('#tutor-close').addEventListener('click',()=>dialog.close());document.querySelector('#tutor-done').addEventListener('click',()=>dialog.close());window.addEventListener('hashchange',render);render();
document.querySelector('.skip-link').addEventListener('click', e => { e.preventDefault(); app.focus({preventScroll:true}); app.scrollIntoView({block:'start'}); });
