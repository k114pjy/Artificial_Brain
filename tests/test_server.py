import io
import json
import threading
import unittest
from http.server import ThreadingHTTPServer
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import server


class ServerSecurityTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = 'http://127.0.0.1:' + str(cls.httpd.server_port)

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join()

    def test_secret_paths_cannot_be_downloaded(self):
        for path in ('/.env.local', '/%2eenv.local', '/.git/config', '/server.py'):
            with self.subTest(path=path), self.assertRaises(HTTPError) as error:
                urlopen(self.base + path)
            self.assertEqual(error.exception.code, 404)

    def test_cross_origin_request_is_rejected(self):
        request = Request(self.base + '/api/tutor', data=b'{}', method='POST',
                          headers={'Origin': 'https://untrusted.example', 'Content-Type':'application/json'})
        with self.assertRaises(HTTPError) as error:
            urlopen(request)
        self.assertEqual(error.exception.code, 403)

    def test_exhausted_credit_error_is_explained(self):
        payload = json.dumps({'messages':[{'role':'user','content':'test'}]}).encode()
        request = Request(self.base + '/api/tutor', data=payload, method='POST', headers={'Content-Type':'application/json'})
        remote_error = HTTPError('https://api.openai.com/v1/responses', 429, 'quota', {}, io.BytesIO(b'{"error":{"code":"credit_balance_exhausted"}}'))
        with patch.dict(server.os.environ, {'OPENAI_API_KEY':'test-placeholder'}), patch.object(server, 'urlopen', side_effect=remote_error):
            with self.assertRaises(HTTPError) as error:
                urlopen(request)
            self.assertEqual(error.exception.code, 502)
            self.assertIn('크레딧', json.load(error.exception)['error'])

    def test_review_requires_a_quote_from_latest_user_message(self):
        body = {'answer':'차근차근 살펴볼게요.', 'summary':'평균의 계산 방법', 'review':[
            {'concept_id':'mean','reason':'평균 계산을 어려워함','evidence':'평균이 어려워요'},
            {'concept_id':'gradient','reason':'근거 없음','evidence':'말하지 않은 내용'},
            {'concept_id':'list','reason':'과거 발언','evidence':'리스트를 모르겠어요'},
        ]}
        upstream = {'output':[{'type':'message','content':[{'type':'output_text','text':json.dumps(body,ensure_ascii=False)}]}]}
        payload = json.dumps({'messages':[{'role':'user','content':'리스트를 모르겠어요'},
                                           {'role':'assistant','content':'알겠습니다.'},
                                           {'role':'user','content':'평균이 어려워요'}]}).encode()
        request = Request(self.base + '/api/tutor', data=payload, method='POST', headers={'Content-Type':'application/json'})
        with patch.dict(server.os.environ, {'OPENAI_API_KEY':'test-placeholder'}), patch.object(server, 'urlopen', return_value=io.BytesIO(json.dumps(upstream,ensure_ascii=False).encode())):
            with urlopen(request) as response:
                result=json.load(response)
        self.assertEqual([item['concept_id'] for item in result['review']], ['mean'])


if __name__ == '__main__':
    unittest.main()
