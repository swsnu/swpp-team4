"""
test_algorithm.py
"""
import json

from django.contrib.auth.models import User
from django.test import TestCase, Client

from ..utils import get_mock_algo, get_mock_snippet, SnippetType
from ...models import Algorithm, Kospi


class AlgorithmTestCase(TestCase):
    """
    Tests for Algorithm views
    """

    def setUp(self) -> None:
        """ Setup """
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')

    def tearDown(self) -> None:
        """ tearDown: called after every test:
                delete all previously generated mock algorithms
            """
        Algorithm.objects.all().delete()

    def test_algorithm_list_api_not_logged_in(self):
        """Test for /algo GET in not logged in state"""
        new_client = Client()
        response = new_client.get('/api/algo')
        self.assertEqual(response.status_code, 403)

    def test_algorithm_list_api_logged_in(self):
        """Test for /algo GET in logged in state"""
        algorithm = get_mock_algo(name="mock_algo")
        algorithm.save()
        response = self.client.get('/api/algo')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0].get("name"), "mock_algo")

    def test_algorithm_list_valid_post(self):
        """Test for /algo POST with valid """
        scope = get_mock_snippet(SnippetType.SCOPE)
        sell = get_mock_snippet(SnippetType.SELL)
        buy = get_mock_snippet(SnippetType.BUY)
        amount = get_mock_snippet(SnippetType.AMOUNT)
        response = self.client.post('/api/algo', json.dumps({
            'name': 'test_algorithm',
            'description': 'algorithm for testcase',
            'snippet_scope': scope.id,
            'snippet_sell': sell.id,
            'snippet_buy': buy.id,
            'snippet_amount': amount.id
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_algorithm_list_invalid_post(self):
        """Test for /algo POST with invalid data"""
        response = self.client.post('/api/algo', json.dumps({
            'name': 'test_algorithm',
            'description': 'algorithm for testcase',
            'snippet_scope': 'scope.id',
            'snippet_sell': 'sell.id',
            'snippet_buy': 'buy.id',
            'snippet_amount': 'amount.id'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_backtest(self):
        """Test for backtest api"""
        stub_kospi = Kospi(date='2020-10-10', close=2300, open=2290, high=2301, low=2280, volume=10000000,
                           d1_diff_rate=0.63)
        stub_kospi.save()
        response = self.client.post('/api/algo/backtest', json.dumps({
            'start': '2020-10-9',
            'end': '2020-10-11',
            'budget': '1000000'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_share_or_delete_algorithm(self):
        stub_algo = get_mock_algo(name='')
        stub_algo.save()
        response = self.client.put('/api/algo/1', json.dumps({'public': 'true'}))
        self.assertEqual(response.status_code, 200)
        response = self.client.put('/api/algo/1', json.dumps({'public': 'false'}))
        self.assertEqual(response.status_code, 200)

        response = self.client.delete('/api/algo/1')
        self.assertEqual(response.status_code, 200)

    def test_share_or_delete_algorithm_not_logged_in(self):
        client = Client()
        stub_algo = get_mock_algo(name='')
        stub_algo.save()
        response = client.put('/api/algo/1', json.dumps({'public': 'true'}))
        self.assertEqual(response.status_code, 403)
        response = client.put('/api/algo/1', json.dumps({'public': 'false'}))
        self.assertEqual(response.status_code, 403)

        response = client.delete('/api/algo/1')
        self.assertEqual(response.status_code, 403)
