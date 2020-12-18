"""
test_snippet.py
"""
# pylint: disable=C0116, W0612
import json

from django.contrib.auth.models import User
from django.test import TestCase, Client

from ..utils import get_mock_snippet, SnippetType
from ...models import Snippet, SnippetScope, SnippetSell, SnippetBuy, SnippetAmount


class SnippetTestCase(TestCase):
    """
    Tests for Snippet views
    """

    def setUp(self) -> None:
        """ Setup """
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')

    def tearDown(self) -> None:
        """ tearDown: called after every test:
                delete all previously generated mock snippets
            """
        SnippetScope.objects.all().delete()
        SnippetSell.objects.all().delete()
        SnippetBuy.objects.all().delete()
        SnippetAmount.objects.all().delete()
        Snippet.objects.all().delete()

    def test_get_snippet_list(self):
        """test for getting snippet lists"""
        snippet = Snippet.objects.create(name='snippet_type', code='snippet_type', author=self.user)
        snippet.save()
        response = self.client.get('/api/snippet')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0].get("name"), 'snippet_type')

    def test_post_snippet_list_invalid(self):
        """test for post request for snippet lists with invalid data"""
        response = self.client.post('/api/snippet', json.dumps({
            'name': 'test_snippet',
            'description': 'snippet for testcase',
            'code': 'hello world!',
            'type': 'scope',
            'is_shared': 1234
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_post_snippet_list_no_type(self):
        """test the case where no type attribute is given"""
        response = self.client.post('/api/snippet', json.dumps({
            'name': 'test_snippet',
            'description': 'snippet for testcase',
            'code': 'hello world!',
            'is_shared': 1234
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_post_snippet_list_valid(self):
        """test the case with valid input for snippet list api"""
        response = self.client.post('/api/snippet', json.dumps({
            'name': 'test_snippet',
            'description': 'snippet for testcase',
            'code': 'hello world!',
            'type': 'scope'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_check_type_and_serialize(self):
        """test 'check_type_and_seriazlie_request' method"""
        data = {
            'name': 'test_snippet',
            'description': 'snippet for testcase',
            'code': 'hello world!',
            'type': 'sell'
        }
        types = ['scope', 'sell', 'buy', 'amount']
        for snippet_type in types:
            data['type'] = snippet_type
            self.client.post('/api/snippet', json.dumps(data), content_type='application/json')
        snippet_scopes = Snippet.objects.instance_of(SnippetScope)
        self.assertEqual(len(snippet_scopes), 1)
        snippet_sells = Snippet.objects.instance_of(SnippetSell)
        self.assertEqual(len(snippet_sells), 1)
        snippet_buys = Snippet.objects.instance_of(SnippetBuy)
        self.assertEqual(len(snippet_buys), 1)
        snippet_amounts = Snippet.objects.instance_of(SnippetAmount)
        self.assertEqual(len(snippet_amounts), 1)

    def test_get_my_snippets(self):
        stub_snippet = get_mock_snippet(SnippetType.SCOPE)
        stub_snippet.save()
        response = self.client.get('/api/snippet/me')
        self.assertEqual(response.status_code, 200)

    def test_like_and_get_liked_snippets(self):
        snippet = Snippet.objects.create(name='snippet_type', code='snippet_type', author=self.user)
        snippet.save()
        response = self.client.put('/api/like/snippet/1', json.dumps({'like': 'true'}))
        self.assertEqual(response.status_code, 200)
        response = self.client.put('/api/like/snippet/1', json.dumps({'like': 'false'}))
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/like/snippet')
        self.assertEqual(response.status_code, 200)

    def test_share_snippet(self):
        snippet = Snippet.objects.create(name='snippet_type', code='snippet_type', author=self.user)
        snippet.save()
        response = self.client.put('/api/snippet/1', json.dumps({'public': 'true'}))
        self.assertEqual(response.status_code, 200)
        response = self.client.put('/api/snippet/1', json.dumps({'public': 'false'}))
        self.assertEqual(response.status_code, 200)
        client = Client()
        response = client.put('/api/snippet/1', json.dumps({'public': 'true'}))
        self.assertEqual(response.status_code, 403)

    # DO NOT DELETE. I REPEAT. DO NOT DELETE BELOW
    def test_like_snippet(self):
        """test 'get_or_post_liked_snippets' method"""
        snippet = Snippet.objects.create(name='snippet_type', code='snippet_type', author=self.user)
        snippet.save()
        get_all = self.client.get('/api/like/snippet', content_type='application/json')
        like = self.client.post('/api/like/snippet', json.dumps({'id': 1, 'value': True}),
                                content_type='application/json')
        unlike = self.client.post('/api/like/snippet', json.dumps({'id': 1, 'value': False}),
                                  content_type='application/json')
        self.assertEqual(get_all.status_code, 200)
