import { concepts, edges } from './concepts.js?v=map-1';
import { layers, graphMarkup } from './concept-map.js?v=map-1';
'use strict';
const cases=[{id:'health',field:'공중보건',title:'지역별 건강 지표는 어떻게 다를까?',desc:'작은 표를 읽고 지역별 차이를 비교하며 데이터 분석을 시작합니다.',reason:'지역 간 지표를 비교하면 추가로 살펴볼 질문을 발견할 수 있습니다. 지표 차이만으로 원인을 단정할 수는 없습니다.',learn:'관측 단위, 변수, 평균, 표 읽기',data:'먼저 아래의 가상 데이터를 사용합니다. 실제 데이터 실습 후보로는 공공 보건 통계를 살펴볼 수 있습니다.',link:'https://www.who.int/data/gho',source:'WHO Global Health Observatory',kind:'입문 · 핵심 개념'}, {id:'retail',field:'유통·이커머스',title:'고객별 구매 횟수는 어떻게 구할까?',desc:'주문 기록을 고객별로 묶어 분석에 필요한 지표를 만듭니다.',reason:'고객별 집계는 구매 행태를 살펴보기 위한 기초가 됩니다.',learn:'행과 열, SQL GROUP BY, COUNT',data:'먼저 가상의 주문 데이터를 사용하고, 이후 공개 데이터에 적용합니다.',link:'https://archive.ics.uci.edu/dataset/352/online+retail',source:'UCI Machine Learning Repository, Online Retail',kind:'입문 · 핵심 개념'}, {id:'ml',field:'머신러닝',title:'모델은 오차를 어떻게 줄일까?',desc:'예측과 실제 값의 차이를 살피고 학습의 기본 원리를 이해합니다.',reason:'오차를 평가하고 줄이는 과정은 예측 모델 학습의 핵심입니다.',learn:'예측, 손실함수, 편미분, 경사하강법',data:'작은 가상 예제로 시작합니다.',link:'https://developers.google.com/machine-learning/crash-course/linear-regression/loss',source:'Google Machine Learning Crash Course',kind:'기초 연결 · 핵심 개념'}];
const stages=[['01','데이터와 분석에 익숙해지기','문제 정의 · 데이터 구조 · Python 코드 읽기'],['02','데이터 다루기','Pandas · NumPy · 정리 · 결측치 · 시각화 · 벡터와 행렬'],['03','데이터 가져오기와 기초 통계','SQL · JOIN · 집계 · 분포 · 상관관계'],['04','분석 결과의 신뢰도와 해석','표본 · 추정 · 가설검정 · A/B 테스트 · 편향'],['05','머신러닝의 원리와 평가','회귀 · 분류 · 모델 평가 · 데이터 누수 · 과적합'],['06','신경망과 딥러닝의 원리','퍼셉트론 · 순전파 · 손실함수 · 역전파 · 경사하강법']];
const app=document.querySelector('#app'),search=document.querySelector('#search'),results=document.querySelector('#search-results');
function getStore(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}function setStore(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch{}}
function find(id){return concepts.find(c=>c.id===id)||concepts[0]}function connected(id){return edges.filter(e=>e[0]===id||e[1]===id).map(e=>find(e[0]===id?e[1]:e[0]))}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function conceptLink(c){return `<a class="pill" href="#map/${c.id}">${c.name}</a>`}
function card(c){return `<article class="card"><span class="tag">${c.kind}</span><h3>${c.title}</h3><p>${c.desc}</p><span class="meta">${c.field}</span><br><br><a class="link" href="#case/${c.id}">문제 살펴보기 →</a></article>`}
function home(){const last=getStore('da-last',null);return `<section class="page"><div class="hero"><div><span class="eyebrow">YOUR DATA SCIENCE JOURNEY</span><h1>궁금한 것에서 시작해,<br>나만의 배움으로.</h1><p class="intro">개념의 연결을 발견하고, 실제 문제를 통해 데이터의 의미를 이해해요.</p></div><div class="hero-ornament">✳</div></div>${last?`<div class="continue"><div><strong>지난 학습 이어하기</strong><p>${escapeHTML(last.title)} · 마지막으로 살펴본 내용</p></div><a class="outline" href="${escapeHTML(last.href)}">이어서 보기 →</a></div>`:''}<div class="section-head"><h2>어디에서 시작해 볼까요?</h2><p>두 경로는 언제든 서로 연결됩니다</p></div><div class="tracks"><a class="track" href="#map"><div class="track-icon">⌘</div><h3>개념 지도</h3><p>궁금한 개념에서 출발해 기초와 응용을 연결해요.</p><span class="go">개념 탐색하기 →</span></a><a class="track" href="#cases"><div class="track-icon">▣</div><h3>실무 문제</h3><p>현실의 질문을 따라가며 필요한 개념을 배워요.</p><span class="go">문제 살펴보기 →</span></a></div><div class="section-head"><h2>이런 문제는 어떠세요?</h2><p>중요한 개념을 만나는 첫 번째 질문</p></div><div class="cards">${cases.map(card).join('')}</div><p class="meta" style="margin-top:14px">현재는 핵심 개념 중심의 예시 문제입니다. 최신 시사 추천은 아직 연결되지 않았습니다.</p></section>`}
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
     <div class="detail-top"><span class="tag">${layer.name} <span>· ${c.category}</span></span><span class="detail-index">${String(concepts.indexOf(c)+1).padStart(2,'0')} / ${concepts.length}</span></div>
     <h2 id="detail-title">${c.name}</h2><p class="english-name">${c.english}</p>
     <section class="detail-section"><h3><span aria-hidden="true">▤</span> 개념</h3><p>${c.summary}</p></section>
     <section class="detail-section"><h3><span aria-hidden="true">◎</span> 어떻게 쓰이나요?</h3><p>${c.why}</p></section>
     <section class="detail-section"><h3><span aria-hidden="true">⌘</span> 연결된 개념</h3><div class="related-list">${connected(c.id).map(conceptLink).join('')}</div></section>
     <section class="detail-section"><h3><span aria-hidden="true">↗</span> 더 깊이 알아보기</h3><a class="source" href="${c.url}" target="_blank" rel="noopener noreferrer">${c.source}<span aria-hidden="true"> ↗</span></a></section>
     <div class="detail-review"><button class="${saved ? 'soft' : 'outline'}" data-review="${c.id}" aria-pressed="${saved}">${saved ? '✓ 다시 볼 개념에 추가됨' : '♡ 다시 볼게요'}</button><p>기억하고 싶은 개념을 모아두세요.</p><span id="review-status" role="status"></span></div>
   </aside></div>
 </section>`;
}
function casesPage(){return `<section class="page"><span class="eyebrow">REAL-WORLD QUESTIONS</span><h1>문제에서 시작하는 배움</h1><p class="intro">관심이 가는 질문을 고르고, 필요한 개념을 하나씩 연결해 보세요.</p><div class="notice">현재 준비된 입문용 예시입니다. 시사성에 따른 자동 추천과 분야 직접 입력은 추후 AI 연결이 필요합니다.</div><div class="section-head"><h2>실무 문제 둘러보기</h2></div><div class="case-list">${cases.map(card).join('')}</div></section>`}
function casePage(id){const c=cases.find(x=>x.id===id)||cases[0];const isRetail=id==='retail',isML=id==='ml';const code=isML?`actual = 10\npredicted = 8\nerror = actual - predicted\nsquared_error = error ** 2\nprint(squared_error)`:isRetail?`SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;`:`scores = [72, 68, 74]\naverage = sum(scores) / len(scores)\nprint(average)`;return `<section class="page case-detail"><a class="link" href="#cases">← 실무 문제 목록</a><br><br><span class="tag">${c.kind}</span><h1>${c.title}</h1><p class="intro">${c.desc}</p><div class="steps"><span>1 문제 이해</span><span>2 데이터 살펴보기</span><span>3 코드 읽기</span><span>4 결과 해석</span></div><div class="panel"><h2>왜 살펴볼까요?</h2><p class="intro">${c.reason}</p><h3>무엇을 배우나요?</h3><p>${c.learn}</p><h3>어떤 데이터를 사용하나요?</h3><p class="intro">${c.data}</p><a class="source" target="_blank" rel="noopener noreferrer" href="${c.link}">참고 자료: ${c.source} ↗</a></div><div class="panel"><span class="eyebrow">STEP 01</span><h2>작은 데이터부터 살펴보기</h2><p class="intro">${isML?'실제 값과 모델이 예측한 값을 비교하는 가상 예시입니다.':isRetail?'한 행은 주문 하나를 나타냅니다. 같은 고객이 여러 번 주문할 수 있습니다.':'한 행은 한 지역의 한 해를 나타내는 가상의 예시입니다.'}</p>${isML?'<table><tr><th>실제 값</th><th>예측값</th></tr><tr><td>10</td><td>8</td></tr></table>':isRetail?'<table><tr><th>주문</th><th>고객</th></tr><tr><td>1</td><td>A</td></tr><tr><td>2</td><td>B</td></tr><tr><td>3</td><td>A</td></tr></table>':'<table><tr><th>지역</th><th>연도</th><th>가상 지표</th></tr><tr><td>A</td><td>2024</td><td>72</td></tr><tr><td>B</td><td>2024</td><td>68</td></tr><tr><td>A</td><td>2025</td><td>74</td></tr></table>'}<p class="meta" style="margin-top:16px">연습을 위한 가상 데이터입니다.</p></div><div class="panel"><span class="eyebrow">STEP 02</span><h2>코드를 함께 읽어요</h2><p class="intro">${isML?'실제 값과 예측값의 차이를 구하고 제곱 오차를 계산합니다. 이것은 손실을 이해하기 위한 한 예시입니다.':isRetail?'같은 고객의 주문 행을 묶고 각 그룹의 주문 수를 셉니다.':'세 점수를 리스트에 담고, 합계를 개수로 나누어 평균을 구합니다.'}</p><pre><code>${escapeHTML(code)}</code></pre><div class="related-list">${(isML?[find('loss'),find('gradient')]:isRetail?[find('group'),find('data')]:[find('list'),find('mean')]).map(conceptLink).join('')}</div><br><button class="outline" id="check-understanding">이해도 확인하기 →</button><div id="check-content" hidden><hr><h3>${isML?'실제 값이 10이고 예측값이 8일 때 제곱 오차는 얼마일까요?':isRetail?'고객 A의 주문은 몇 건일까요?':'이 예제에서 값의 개수가 3개라는 것은 어떻게 알 수 있을까요?'}</h3><p class="intro">먼저 생각해 본 뒤 아래 힌트를 확인해 보세요.</p><details><summary>힌트 보기</summary><p class="intro">${isML?'실제 값에서 예측값을 빼고 그 차이를 제곱해 보세요.':isRetail?'고객이 A인 행을 하나씩 세어 보세요.':'리스트의 각 값과 len(scores)의 역할을 살펴보세요.'}</p></details></div><br><p class="meta">대화형 이해도 확인은 AI 연결 후 사용할 수 있습니다.</p></div></section>`}
function roadmap(){return `<section class="page"><span class="eyebrow">ONE YEAR ROADMAP</span><h1>나의 학습 로드맵</h1><p class="intro">달력보다 이해를 우선해요. 개념 지도와 실무 문제 어디에서든 시작할 수 있습니다.</p><div class="roadmap">${stages.map(s=>`<div class="panel road-row"><strong>STAGE ${s[0]}</strong><div><h3>${s[1]}</h3><p>${s[2]}</p></div></div>`).join('')}</div><p class="meta" style="margin-top:20px">세부 강의는 순차적으로 준비할 수 있도록 구성한 커리큘럼 초안입니다.</p></section>`}
function review(){const list=getStore('da-review',[]).map(find);return `<section class="page"><span class="eyebrow">MY LEARNING</span><h1>다시 볼 개념</h1><p class="intro">직접 표시한 개념을 모아두었어요. 현재 브라우저에 저장됩니다.</p>${list.length?`<div class="cards">${list.map(c=>`<div class="card"><span class="tag">${c.category}</span><h3>${c.name}</h3><p>${c.summary}</p><a class="link" href="#map/${c.id}">다시 살펴보기 →</a></div>`).join('')}</div>`:'<div class="panel"><p class="intro">아직 표시한 개념이 없어요. 개념 지도에서 「다시 볼게요」를 눌러보세요.</p><a href="#map" class="link">개념 지도로 가기 →</a></div>'}<br><div class="notice">AI의 자동 복습 제안과 기기 간 동기화는 아직 연결되지 않았습니다.</div></section>`}
let previousPage = '';
function render() {
 let [page,id] = location.hash.slice(1).split('/');
 if (!page) page = 'home';
 const mapScroll = page === 'map' && previousPage === 'map' ? app.querySelector('.map-scroll')?.scrollLeft || 0 : 0;
 const focusNode = page === 'map' && previousPage === 'map' && document.activeElement?.closest('.map-node');
 const focusRelated = page === 'map' && previousPage === 'map' && document.activeElement?.closest('.detail .pill');
 const focusSelect = document.activeElement?.id === 'concept-select';
 const navPage = page === 'case' ? 'cases' : page;
 document.querySelectorAll('[data-nav]').forEach(a => { a.classList.toggle('active',a.dataset.nav === navPage); if (a.dataset.nav === navPage) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
 app.innerHTML = page === 'map' ? mapPage(id) : page === 'cases' ? casesPage() : page === 'case' ? casePage(id) : page === 'roadmap' ? roadmap() : page === 'review' ? review() : home();
 if (page === 'map') {
   const c = concepts.find(c => c.id === id) || find('gradient');
   setStore('da-last',{title:c.name,href:'#map/'+c.id});
   app.querySelector('.map-scroll').scrollLeft = mapScroll;
   if (matchMedia('(max-width:700px)').matches) {
     const scroller = app.querySelector('.map-scroll'), node = app.querySelector('.map-node.selected');
     scroller.scrollLeft = node.offsetLeft + node.offsetWidth / 2 - scroller.clientWidth / 2;
   }
   if (focusNode) app.querySelector(`[data-concept="${c.id}"]`)?.focus({preventScroll:true});
   if (focusSelect) app.querySelector('#concept-select').focus({preventScroll:true});
   if (focusRelated) { const detail = app.querySelector('#concept-detail'); detail.focus({preventScroll:true}); detail.scrollIntoView({block:'start'}); }
 }
 if (page === 'case') { const c = cases.find(x => x.id === id); if (c) setStore('da-last',{title:c.title,href:'#case/'+id}); }
 if (!(page === 'map' && previousPage === 'map')) window.scrollTo(0,0);
 previousPage = page;
}
app.addEventListener('change', e => { if (e.target.id === 'concept-select') location.hash = '#map/' + e.target.value; });
app.addEventListener('click', e => {
 const detailLink = e.target.closest('a[href="#concept-detail"]');
 if (detailLink) { e.preventDefault(); app.querySelector('#concept-detail').focus({preventScroll:true}); app.querySelector('#concept-detail').scrollIntoView({behavior:'smooth',block:'start'}); }
 const btn = e.target.closest('[data-review]');
 if (btn) {
   let list = getStore('da-review',[]);
   const saved = !list.includes(btn.dataset.review);
   list = saved ? [...list,btn.dataset.review] : list.filter(x => x !== btn.dataset.review);
   setStore('da-review',list);
   btn.className = saved ? 'soft' : 'outline';
   btn.setAttribute('aria-pressed',String(saved));
   btn.textContent = saved ? '✓ 다시 볼 개념에 추가됨' : '♡ 다시 볼게요';
   document.querySelector('#review-status').textContent = saved ? '복습 목록에 저장했어요.' : '복습 목록에서 해제했어요.';
 }
 if (e.target.id === 'check-understanding') { document.querySelector('#check-content').hidden = false; e.target.hidden = true; }
});
function searchRender(){const q=search.value.trim().toLowerCase();if(!q){results.hidden=true;return}let matches=concepts.filter(c=>(c.name+' '+c.english+' '+c.category).toLowerCase().includes(q));results.innerHTML=matches.length?`<div class="result-list">${matches.map(c=>`<button type="button" data-result="${c.id}"><span>${c.name}</span><small>${c.category}</small></button>`).join('')}</div><div class="result-preview" aria-label="연결 개념 미리보기">${preview(matches[0])}</div>`:'<div class="search-empty">아직 준비된 개념이 없어요. 다른 검색어를 입력해 보세요.</div>';results.hidden=false}
function preview(c){return `<strong>${c.name}의 연결</strong><div class="preview-links">${connected(c.id).map(n=>`<span>${n.name}</span>`).join('')}</div><small>개념을 선택하면 관계를 자세히 볼 수 있어요.</small>`} function updatePreview(e){const button=e.target.closest('[data-result]');if(button){const pane=results.querySelector('.result-preview');if(pane)pane.innerHTML=preview(find(button.dataset.result))}} results.addEventListener('mouseover',updatePreview);results.addEventListener('focusin',updatePreview);search.addEventListener('input',searchRender);results.addEventListener('click',e=>{const b=e.target.closest('[data-result]');if(!b)return;location.hash='#map/'+b.dataset.result;results.hidden=true;search.value=''});search.addEventListener('keydown',e=>{if(e.key==='Escape')results.hidden=true;if(e.key==='Enter'){const first=results.querySelector('[data-result]');if(first)first.click()}});document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))results.hidden=true});
const dialog=document.querySelector('#tutor');document.querySelector('#tutor-open').addEventListener('click',()=>dialog.showModal());document.querySelector('#tutor-close').addEventListener('click',()=>dialog.close());document.querySelector('#tutor-done').addEventListener('click',()=>dialog.close());window.addEventListener('hashchange',render);render();
document.querySelector('.skip-link').addEventListener('click', e => { e.preventDefault(); app.focus({preventScroll:true}); app.scrollIntoView({block:'start'}); });
