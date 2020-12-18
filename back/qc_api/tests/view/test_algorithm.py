"""
test_algorithm.py
"""
# pylint: disable=E5142, C0116, W0613, R0201, C0103, R0201
import json
from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase, Client

from ..utils import get_mock_algo, get_mock_snippet, get_mock_performance, SnippetType, seed_stock_data
from ...lib import BackTester
from ...models import Algorithm, Performance
from ...serializers.algorithm.algorithm_serializer import AlgorithmSerializer
from ...views.algorithm.algorithm_views import run_helper, run_daily_performance, daily_performance, \
    parse_sorted_algos, opt_helper



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
        algorithm.author = self.user
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
            'author': self.user.id,
            'description': 'algorithm for testcase',
            'snippet_scope': scope.id,
            'snippet_sell': sell.id,
            'snippet_buy': buy.id,
            'snippet_amount': amount.id
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_algorithm_list_invalid_post(self):
        """Test for /algo POST with invalid data"""
        scope = get_mock_snippet(SnippetType.SCOPE)
        sell = get_mock_snippet(SnippetType.SELL)
        buy = get_mock_snippet(SnippetType.BUY)
        amount = get_mock_snippet(SnippetType.AMOUNT)
        response = self.client.post('/api/algo', json.dumps({
            'description': 'algorithm for testcase',
            'snippet_scope': scope.id,
            'snippet_sell': sell.id,
            'snippet_buy': buy.id,
            'snippet_amount': amount.id
        }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_share_or_delete_algorithm(self):
        """ Test sharing or deleting algorithm. """
        stub_algo = get_mock_algo(name='')
        stub_algo.author = self.user
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
        stub_algo.author = self.user
        stub_algo.save()
        response = client.put('/api/algo/1', json.dumps({'public': 'true'}))
        self.assertEqual(response.status_code, 403)
        response = client.put('/api/algo/1', json.dumps({'public': 'false'}))
        self.assertEqual(response.status_code, 403)

        response = client.delete('/api/algo/1')
        self.assertEqual(response.status_code, 403)

    @patch('qc_api.views.algorithm.algorithm_views.run_helper.delay', side_effect=run_helper)
    def test_algorithm_backtest(self, mock_delay):
        seed_stock_data()
        # mock_delay = run_helper
        stub_algo = get_mock_algo(name='')
        stub_algo.author = self.user
        stub_algo.save()
        budget = 10000000
        print(stub_algo.id)
        response = self.client.post('/api/algo/backtest', json.dumps({
            'algo_id': stub_algo.id,
            'budget': budget,
            'start': '2020-01-03',
            'end': '2020-01-10'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    @patch('qc_api.views.algorithm.algorithm_views.daily_performance.delay', side_effect=daily_performance)
    def test_run_daily_performance(self, mock_delay):
        seed_stock_data()
        run_daily_performance()
        stub_algo = get_mock_algo(name='')
        stub_algo.author = self.user
        stub_algo.save()
        daily_performance.delay(performance_date='2020-01-09', algorithm_id=1)

    def test_backtester(self):
        seed_stock_data()
        stub_algo = get_mock_algo(name='')
        stub_algo.author = self.user
        stub_algo.save()
        asd = AlgorithmSerializer(Algorithm.objects.first()).data
        bt = BackTester(budget=100000, algorithm=asd)
        bt.get_budget()
        bt.get_coins()
        bt.make_daily_report()

    def test_parse_sorted_algos(self):
        algorithm = get_mock_algo(name="mock_algo")
        algorithm.save()
        performance = get_mock_performance(name="mock_perf", algo=algorithm)
        performance.save()

        parse_sorted_algos(algo=Algorithm.objects.all().values()[0],
                           perf=Performance.objects.all().values()[0], index=1)

    def test_get_sorted_algorithm(self):
        response = self.client.get('/api/algo/sort')
        #self.assertEqual(response.status_code, 200)

    def test_get_my_algorithm(self):
        response = self.client.get('/api/algo/me')

    def test_opt_helper(self):
        algorithm = get_mock_algo(name="mock_algo")
        algorithm.save()
        opt_helper(algo_id=algorithm.id, req_data="", user_id=self.user.id)

    def test_run_optimization(self):
        algorithm = get_mock_algo(name="mock_algo")
        algorithm.save()
        response1 = self.client.get(f"/api/algo/{algorithm.id}/opt")
        response2 = self.client.post(f"/api/algo/{algorithm.id}/opt")