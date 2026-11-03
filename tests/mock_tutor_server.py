"""Isolated browser-test fixture; never used by the application or for real AI responses."""
import json
import os
import sys
import time
from http.server import ThreadingHTTPServer
from pathlib import Path

os.environ['OPENAI_API_KEY'] = 'test-only-placeholder'
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server


class MockHandler(server.Handler):
    def do_GET(self):
        if self.path == '/api/status':
            return self.send_json(200, {'configured':True,'notion_configured':False})
        return super().do_GET()

    def do_POST(self):
        if self.path != '/api/tutor':
            return super().do_POST()
        data=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))))
        latest=data['messages'][-1]['content']
        time.sleep(2)
        review=[{'concept_id':'mean','reason':'평균이 어렵다고 말함','evidence':'평균이 어려워요'}] if '평균이 어려워요' in latest else []
        return self.send_json(200, {'answer':'테스트용 답변입니다.','summary':'테스트 요약','review':review})


if __name__ == '__main__':
    print('TEST FIXTURE ONLY: http://127.0.0.1:8001',flush=True)
    ThreadingHTTPServer(('127.0.0.1',8001),MockHandler).serve_forever()
