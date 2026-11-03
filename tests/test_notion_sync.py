import unittest
from unittest.mock import patch
import notion_sync


class NotionSyncTest(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(notion_sync.os.environ, {'NOTION_TOKEN':'test-placeholder','NOTION_PARENT_PAGE_ID':'a'*32})
        self.env.start()

    def tearDown(self):
        self.env.stop()

    def test_existing_daily_page_receives_code_in_correct_section(self):
        daily = [{'id':'daily-page','type':'child_page','child_page':{'title':'학습 기록 · 2026-11-03'}}]
        headings = [{'id':k+'-section','type':'heading_2','heading_2':{'rich_text':[{'plain_text':v}]}} for k,v in notion_sync.SECTIONS.items()]
        with patch.object(notion_sync,'children',side_effect=[iter(daily),iter(headings)]), patch.object(notion_sync,'api',return_value={}) as api:
            result=notion_sync.sync({'date':'2026-11-03','type':'case','title':'평균','text':'결과는 2','code':'print(2)','language':'python'})
        self.assertEqual(result['page_id'],'daily-page')
        method,path,payload=api.call_args.args
        self.assertEqual((method,path),('PATCH','blocks/case-section/children'))
        self.assertEqual(payload['children'][1]['code']['language'],'python')

    def test_new_day_creates_three_sections(self):
        headings = [{'id':k+'-section','type':'heading_2','heading_2':{'rich_text':[{'plain_text':v}]}} for k,v in notion_sync.SECTIONS.items()]
        with patch.object(notion_sync,'children',side_effect=[iter([]),iter(headings)]), patch.object(notion_sync,'api',side_effect=[{'id':'new-page'},{}]) as api:
            notion_sync.sync({'date':'2026-11-03','type':'chat','title':'질문','text':'핵심 답변','code':''})
        created=api.call_args_list[0].args[2]
        self.assertEqual(len(created['children']),3)
        self.assertEqual(api.call_args_list[1].args[1],'blocks/chat-section/children')

    def test_invalid_input_is_not_sent(self):
        with patch.object(notion_sync,'api') as api, self.assertRaises(ValueError):
            notion_sync.sync({'date':'2026-13-03','type':'concept','title':'x','text':'x'})
        api.assert_not_called()

    def test_source_url_is_a_clickable_link(self):
        values=notion_sync.rich('출처 https://example.org/data')
        self.assertEqual(values[1]['text']['link']['url'],'https://example.org/data')


if __name__ == '__main__':
    unittest.main()
