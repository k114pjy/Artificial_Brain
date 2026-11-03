const KEY = 'da-notion-pending';
let busy = false, configured = false;
const status = document.createElement('span');
status.id = 'notion-sync-status'; status.setAttribute('role','status');
const retry = document.createElement('button'); retry.type='button'; retry.className='link'; retry.textContent='노션 저장 재시도';
const clear = document.createElement('button'); clear.type='button'; clear.className='link'; clear.textContent='대기 기록 지우기'; clear.hidden=true;
document.querySelector('footer').append(status,retry,clear);
function readQueue(){try{const q=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(q)?q:[]}catch{return []}}
function writeQueue(queue){try{localStorage.setItem(KEY,JSON.stringify(queue));return true}catch{return false}}
function day(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function describe(message){const n=readQueue().length;status.textContent=`${message}${n ? ` · ${n}건 대기` : ''}`;clear.hidden=n===0;}
async function refresh(){try{const r=await fetch('/api/status',{cache:'no-store'});if(!r.ok || !(r.headers.get('content-type')||'').includes('application/json'))throw Error();configured=(await r.json()).notion_configured===true}catch{configured=false}describe(configured?'노션 설정됨 · 저장 시 연결 확인':'노션 미연결');if(configured)flush()}
async function flush(){if(busy||!configured)return;busy=true;try{const drain=async()=>{let queue=readQueue();while(queue.length){const response=await fetch('/api/notion-sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(queue[0])});if(!response.ok)throw Error();queue=readQueue();queue.shift();if(!writeQueue(queue))throw Error();describe('노션에 저장 중');}describe('노션에 저장됨')};if(navigator.locks)await navigator.locks.request('da-notion-sync',{ifAvailable:true},async lock=>{if(lock)await drain();else describe('다른 탭에서 노션 저장 중')});else await drain()}catch{describe('노션 저장 실패 · 재시도 필요')}finally{busy=false}}
export function recordLearning(entry){const dedupe=entry.dedupe ? 'da-log:'+day()+':'+entry.dedupe : '';try{if(dedupe&&sessionStorage.getItem(dedupe))return}catch{}const queue=readQueue();if(queue.length>=1000){describe('대기 기록이 가득 찼습니다');return}queue.push({...entry,title:String(entry.title||'').slice(0,250),text:String(entry.text||'').slice(0,6000),code:String(entry.code||'').slice(0,6000),date:day()});if(!writeQueue(queue)){describe('브라우저에 기록을 저장하지 못했습니다');return}try{if(dedupe)sessionStorage.setItem(dedupe,'1')}catch{}describe(configured?'노션 저장 대기':'노션 미연결');if(configured)flush()}
retry.addEventListener('click', refresh);
clear.addEventListener('click',()=>{if(busy){describe('저장 중에는 대기 기록을 지울 수 없습니다');return}if(writeQueue([])){try{Object.keys(sessionStorage).filter(k=>k.startsWith('da-log:')).forEach(k=>sessionStorage.removeItem(k))}catch{}describe(configured?'노션 설정됨':'노션 미연결')}else describe('대기 기록을 지우지 못했습니다')});
window.addEventListener('online',refresh);
refresh();
