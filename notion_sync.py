"""Optional local Notion export. Credentials remain on the local server."""
import json
import os
import re
import threading
import time
from datetime import date
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

SECTIONS = {'concept':'공부한 개념과 출처', 'case':'실무 문제의 분석 과정과 결과', 'chat':'AI 튜터 질문과 핵심 답변'}
_lock = threading.Lock()


def configured():
    return bool(os.environ.get('NOTION_TOKEN') and os.environ.get('NOTION_PARENT_PAGE_ID'))


def api(method, path, payload=None):
    token = os.environ['NOTION_TOKEN']
    headers = {'Authorization':'Bearer ' + token, 'Notion-Version':'2022-06-28', 'Content-Type':'application/json'}
    data = None if payload is None else json.dumps(payload, ensure_ascii=False).encode('utf-8')
    for attempt in range(3):
        try:
            with urlopen(Request('https://api.notion.com/v1/' + path, data=data, headers=headers, method=method), timeout=20) as response:
                return json.load(response)
        except HTTPError as exc:
            if exc.code != 429 or attempt == 2:
                raise
            try:
                delay = max(1, min(10, int(exc.headers.get('Retry-After', '1'))))
            except ValueError:
                delay = 1
            time.sleep(delay)


def children(block_id):
    cursor = None
    while True:
        params = {'page_size':100}
        if cursor:
            params['start_cursor'] = cursor
        result = api('GET', 'blocks/' + block_id + '/children?' + urlencode(params))
        yield from result.get('results', [])
        if not result.get('has_more'):
            break
        cursor = result.get('next_cursor')
        if not cursor:
            raise ValueError('Missing pagination cursor')


def rich(text):
    items = []
    position = 0
    for match in re.finditer(r'https?://[^\s<>]+', text):
        prefix = text[position:match.start()]
        items.extend({'type':'text','text':{'content':prefix[i:i+1800]}} for i in range(0,len(prefix),1800))
        url = match.group()
        if len(url) <= 1800:
            items.append({'type':'text','text':{'content':url,'link':{'url':url}}})
        else:
            items.extend({'type':'text','text':{'content':url[i:i+1800]}} for i in range(0,len(url),1800))
        position = match.end()
    tail = text[position:]
    items.extend({'type':'text','text':{'content':tail[i:i+1800]}} for i in range(0,len(tail),1800))
    return items or [{'type':'text','text':{'content':''}}]


def sync(entry):
    if not configured():
        raise ValueError('Notion is not configured')
    day, kind = entry.get('date'), entry.get('type')
    if not isinstance(day, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', day):
        raise ValueError('Invalid date')
    date.fromisoformat(day)
    if kind not in SECTIONS:
        raise ValueError('Invalid section')
    title, content, code = entry.get('title',''), entry.get('text',''), entry.get('code','')
    if not all(isinstance(x, str) for x in (title, content, code)) or not title.strip() or len(title)>250 or len(content)>6000 or len(code)>6000:
        raise ValueError('Invalid entry')
    parent = os.environ['NOTION_PARENT_PAGE_ID']
    if not re.fullmatch(r'[0-9a-fA-F-]{32,36}', parent):
        raise ValueError('Invalid parent page id')
    daily_title = '학습 기록 · ' + day
    with _lock:
        page_id = next((b['id'] for b in children(parent) if b.get('type') == 'child_page' and b.get('child_page',{}).get('title') == daily_title), None)
        if not page_id:
            headings = [{'object':'block','type':'heading_2','heading_2':{'rich_text':rich(name),'is_toggleable':True}} for name in SECTIONS.values()]
            page = api('POST', 'pages', {'parent':{'type':'page_id','page_id':parent},
                'properties':{'title':{'type':'title','title':rich(daily_title)}},'children':headings})
            page_id = page['id']
        headings = list(children(page_id))
        section_id = next((b['id'] for b in headings if b.get('type') == 'heading_2' and ''.join(x.get('plain_text','') for x in b.get('heading_2',{}).get('rich_text',[])) == SECTIONS[kind]), None)
        if not section_id:
            raise ValueError('The daily page is missing a section')
        blocks = [{'object':'block','type':'paragraph','paragraph':{'rich_text':rich(title + '\n' + content)}}]
        if code:
            language = entry.get('language', 'plain text')
            if language not in ('python','sql','plain text'):
                language = 'plain text'
            blocks.append({'object':'block','type':'code','code':{'rich_text':rich(code),'language':language}})
        api('PATCH', 'blocks/' + section_id + '/children', {'children':blocks})
        return {'page_id':page_id}
