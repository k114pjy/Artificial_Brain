import { concepts } from './concepts.js?v=map-1';

const popup = document.createElement('aside');
popup.className = 'glossary-popup'; popup.hidden = true; popup.setAttribute('aria-label','선택한 용어 설명');
document.body.append(popup);
function hide(){popup.hidden=true;popup.replaceChildren()}
function showSelection(){
 const selection=window.getSelection();
 if(!selection || selection.isCollapsed || !selection.rangeCount)return;
 const node=selection.anchorNode?.parentElement;
 if(!node?.closest('#app') || node.closest('button,a,textarea,input'))return;
 const text=selection.toString().trim(); if(text.length<2 || text.length>80)return;
 const concept=concepts.find(c=>c.name.toLowerCase()===text.toLowerCase() || c.english.toLowerCase()===text.toLowerCase());
 popup.replaceChildren();
 const title=document.createElement('strong');title.textContent=concept ? concept.name : '선택한 내용';popup.append(title);
 const summary=document.createElement('p');summary.textContent=concept ? concept.summary : '등록된 짧은 설명을 찾지 못했어요. AI 튜터에게 질문할 수 있습니다.';popup.append(summary);
 if(concept){const link=document.createElement('a');link.href='#map/'+concept.id;link.className='link';link.textContent='자세히 보기 →';link.addEventListener('click',()=>{document.dispatchEvent(new CustomEvent('concept-return-point',{detail:{href:location.hash||'#home',y:window.scrollY,mapX:document.querySelector('.map-scroll')?.scrollLeft||0}}));setTimeout(hide,0)});popup.append(link)}
 const ask=document.createElement('button');ask.type='button';ask.className='link';ask.textContent='AI 튜터에게 묻기';ask.addEventListener('click',()=>{document.dispatchEvent(new CustomEvent('tutor-question-selection',{detail:text}));hide()});popup.append(ask);
 const close=document.createElement('button');close.type='button';close.className='icon-button';close.setAttribute('aria-label','용어 설명 닫기');close.textContent='×';close.addEventListener('click',hide);popup.append(close);
 const rect=selection.getRangeAt(0).getBoundingClientRect();popup.style.left=Math.max(12,Math.min(innerWidth-292,rect.left))+'px';popup.style.top=Math.max(12,Math.min(innerHeight-180,rect.bottom+8))+'px';popup.hidden=false;
}
let selectionTimer;
document.addEventListener('selectionchange',()=>{clearTimeout(selectionTimer);selectionTimer=setTimeout(showSelection,300)});
document.addEventListener('mouseup',e=>{if(!e.target.closest('.glossary-popup'))showSelection()});
document.addEventListener('touchend',e=>{if(!e.target.closest('.glossary-popup'))setTimeout(showSelection,0)},{passive:true});
document.addEventListener('keyup',e=>{if(e.key==='Escape')hide();else if(e.shiftKey)showSelection()});
window.addEventListener('hashchange',hide);
