import { recordLearning } from './learning-log.js?v=1';
import { concepts } from './concepts.js?v=map-1';
const dialog = document.querySelector('#tutor');
const info = dialog.querySelector('.tutor-info');
info.innerHTML = `<p id="tutor-state" role="status">연결 상태 확인 중…</p><div id="tutor-messages" aria-live="polite"></div><form id="tutor-form"><label for="tutor-question">질문</label><textarea id="tutor-question" rows="3" maxlength="4000" placeholder="모르는 부분이나 궁금한 점을 적어 주세요."></textarea><button class="primary" type="submit" disabled>질문하기</button></form><p><button class="outline" type="button" id="tutor-voice">음성으로 질문</button> <button class="outline" type="button" id="tutor-speak">마지막 답변 듣기</button></p><button class="outline" type="button" id="tutor-clear">현재 대화 지우기</button>`;
const status = info.querySelector('#tutor-state'), messagesEl = info.querySelector('#tutor-messages');
const question = info.querySelector('#tutor-question'), form = info.querySelector('#tutor-form');
let configured = false, selectedText = '';
const revisions = new Map(), pending = new Set();
const conversationKey = (href = location.hash || '#home') => 'da-chat:' + href;
function readHistory(href = location.hash || '#home') { try { const v = JSON.parse(localStorage.getItem(conversationKey(href))); return Array.isArray(v) ? v.filter(x => x && ['user','assistant'].includes(x.role) && typeof x.content === 'string') : []; } catch { return []; } }
function saveHistory(history, href = location.hash || '#home', title = document.querySelector('#app h1')?.textContent || '학습 대화') { try { localStorage.setItem(conversationKey(href),JSON.stringify(history));const index=JSON.parse(localStorage.getItem('da-chat-index')||'{}');if(history.length)index[href]={href,title,at:Date.now()};else delete index[href];localStorage.setItem('da-chat-index',JSON.stringify(index));return true; } catch { return false; } }
function showHistory() { messagesEl.replaceChildren(); for (const item of readHistory()) { const p = document.createElement('p'); const strong = document.createElement('strong'); strong.textContent = item.role === 'user' ? '나: ' : '튜터: '; p.append(strong,document.createTextNode(item.content)); messagesEl.append(p); } }
async function checkStatus() { configured=false; form.querySelector('button').disabled=true; status.textContent='연결 상태 확인 중…'; try { const response = await fetch('/api/status',{cache:'no-store'}); if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) throw Error(); configured = (await response.json()).configured === true; } catch { configured = false; } status.textContent = configured ? '서버와 키 설정을 확인했습니다. 답변에는 API 크레딧이 필요하며 대화는 이 브라우저에 저장됩니다.' : 'AI 튜터가 연결되지 않았습니다. 이 사이트에 서버 연결과 API 설정이 필요합니다.'; form.querySelector('button').disabled = !configured || pending.has(location.hash||'#home'); }
document.querySelector('#tutor-open').addEventListener('pointerdown', () => { selectedText = String(window.getSelection()).slice(0,2000); });
document.querySelector('#tutor-open').addEventListener('click', () => { showHistory(); checkStatus(); if (selectedText) question.value = `선택한 부분을 설명해 주세요: ${selectedText}`; });
info.querySelector('#tutor-clear').addEventListener('click', () => { const href=location.hash||'#home';revisions.set(href,(revisions.get(href)||0)+1);saveHistory([],href);showHistory();status.textContent='현재 대화를 지웠습니다.'; });
const voiceButton = info.querySelector('#tutor-voice'), speakButton = info.querySelector('#tutor-speak');
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!Recognition) { voiceButton.disabled = true; voiceButton.textContent = '이 브라우저는 음성 입력을 지원하지 않아요'; }
else voiceButton.addEventListener('click', () => {
 const recognition = new Recognition(); recognition.lang = 'ko-KR'; recognition.interimResults = false;
 recognition.onstart = () => { status.textContent = '듣고 있어요. 질문을 말씀해 주세요.'; };
 recognition.onresult = event => { question.value = event.results[0][0].transcript; status.textContent = '인식한 질문을 확인하고 질문하기를 눌러 주세요.'; };
 recognition.onerror = () => { status.textContent = '음성 입력을 사용할 수 없습니다. 마이크 권한을 확인하거나 직접 입력해 주세요.'; };
 try { recognition.start(); } catch { status.textContent = '음성 입력을 시작하지 못했습니다.'; }
});
if (!('speechSynthesis' in window)) { speakButton.disabled = true; speakButton.textContent = '이 브라우저는 음성 출력을 지원하지 않아요'; }
else speakButton.addEventListener('click', () => { const last = readHistory().filter(m => m.role === 'assistant').at(-1); if (!last) { status.textContent = '먼저 튜터의 답변을 받아 주세요.'; return; } const speech = new SpeechSynthesisUtterance(last.content); speech.lang = 'ko-KR'; speechSynthesis.cancel(); speechSynthesis.speak(speech); });
form.addEventListener('submit', async e => {
 e.preventDefault(); const text = question.value.trim(), href=location.hash||'#home'; if (!text || !configured || pending.has(href)) return;
 const title=document.querySelector('#app h1')?.textContent || '학습 대화', revision=revisions.get(href)||0;
 const history = readHistory(href); history.push({role:'user',content:text}); if(!saveHistory(history,href,title)){status.textContent='브라우저에 대화를 저장하지 못했습니다.';return} pending.add(href);question.value = ''; showHistory();
 const button = form.querySelector('button'); button.disabled = true; status.textContent = '답변을 생각하고 있어요…';
 const sources=[...document.querySelectorAll('#app a.source')].slice(0,8).map(a=>a.textContent+' '+a.href).join('\n');
 const context = `학습 위치: ${href}\n선택 내용: ${selectedText}\n현재 페이지: ${(document.querySelector('#app')?.innerText || '').slice(0,4500)}\n화면에 표시된 참고 자료:\n${sources}`;
 try {
  const response=await fetch('/api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({context,messages:history.slice(-20)})});
  const data=await response.json();if(!response.ok)throw Error(data.error||'요청에 실패했습니다.');
  if((revisions.get(href)||0)!==revision)return;
  history.push({role:'assistant',content:data.answer});
  const stored=saveHistory(history,href,title);
  recordLearning({type:'chat',title:'질문과 답변 · '+href,text:'질문: '+text+'\n핵심 답변: '+data.summary});
  if((location.hash||'#home')===href)showHistory();
  let added=0;
  try {
   const saved=JSON.parse(localStorage.getItem('da-review')||'[]'),reasons=JSON.parse(localStorage.getItem('da-review-reasons')||'{}');
   for(const item of data.review||[]){if(!concepts.some(c=>c.id===item.concept_id))continue;if(!saved.includes(item.concept_id)){saved.push(item.concept_id);added++;}if(!reasons[item.concept_id])reasons[item.concept_id]={reason:item.reason,evidence:item.evidence};}
   localStorage.setItem('da-review',JSON.stringify(saved));localStorage.setItem('da-review-reasons',JSON.stringify(reasons));
   if((data.review||[]).length)document.dispatchEvent(new Event('review-updated'));
  } catch {}
  if((location.hash||'#home')===href)status.textContent=!stored?'브라우저에 답변을 저장하지 못했습니다.':added?`대화를 저장하고 복습 개념 ${added}개를 표시했어요. 다시 볼 개념에서 이유를 확인하고 수정할 수 있습니다.`:'대화가 이 브라우저에 저장되었습니다.';
 } catch(err) { if((location.hash||'#home')===href && (revisions.get(href)||0)===revision)status.textContent=err.message||'튜터 연결에 실패했습니다.'; }
 finally { pending.delete(href);if((location.hash||'#home')===href)button.disabled=!configured; }
});
document.querySelector('#app').addEventListener('click', e => { if (e.target.id === 'check-understanding' || e.target.closest('[data-check-code]')) { selectedText = e.target.closest('.panel')?.querySelector('pre code')?.innerText.slice(0,2000) || ''; question.value = '이 코드의 이해도를 확인해 주세요. 먼저 질문 하나를 해 주세요.'; dialog.showModal(); showHistory(); checkStatus().then(() => { if (configured) form.requestSubmit(); }); } });

window.addEventListener('hashchange', () => { if (sessionStorage.getItem('da-open-chat') === location.hash) { sessionStorage.removeItem('da-open-chat'); selectedText=''; dialog.showModal(); showHistory(); checkStatus(); } });

document.querySelector('#app').addEventListener('click', e => { const button=e.target.closest('[data-topic]'); if(!button)return; const field=document.querySelector('#case-search')?.value.trim(); selectedText=''; question.value=button.dataset.topic==='unknown' || !field ? '어떤 분야부터 시작할지 잘 모르겠어요. 입문자에게 적합한 데이터 분석 주제 세 가지와 각각의 추천 이유를 제시하고 관심사를 좁히는 질문을 해 주세요.' : `관심 분야는 ${field.slice(0,100)}입니다. 입문용 데이터 분석 주제 세 가지와 각각의 추천 이유를 제시하고 관심사를 좁히는 질문을 해 주세요.`; dialog.showModal(); showHistory(); checkStatus().then(()=>{if(configured)form.requestSubmit();}); });
document.addEventListener('tutor-question-selection', e=>{selectedText=String(e.detail||'').slice(0,2000);question.value=`선택한 부분을 설명해 주세요: ${selectedText}`;dialog.showModal();showHistory();checkStatus();});

document.addEventListener('open-conversation',()=>{selectedText='';dialog.showModal();showHistory();checkStatus()});
