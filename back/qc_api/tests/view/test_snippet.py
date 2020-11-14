"""
test_snippet.py
"""
from django.test import TestCase
from ...models import Snippet, SnippetScope, SnippetSell, SnippetBuy, SnippetAmount
from ..utils import get_mock_algo, get_mock_snippet, SnippetType
from django.contrib.auth.models import User
import json


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
        snippet = get_mock_snippet(SnippetType.SCOPE)
        snippet.save()
        response = self.client.get('/api/snippet')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0].get("name"), 'SnippetType.SCOPE')

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
        types = ['scope', 'sell', 'buy', 'ammount']
        for t in types:
            data['type'] = t
            self.client.post('/api/snippet', json.dumps(data), content_type='application/json')
        snippet_scopes = Snippet.objects.instance_of(SnippetScope)
        self.assertEqual(len(snippet_scopes), 1)
        snippet_sells = Snippet.objects.instance_of(SnippetSell)
        self.assertEqual(len(snippet_sells), 1)
        snippet_buys = Snippet.objects.instance_of(SnippetBuy)
        self.assertEqual(len(snippet_buys), 1)
        snippet_amounts = Snippet.objects.instance_of(SnippetAmount)
        self.assertEqual(len(snippet_amounts), 1)

