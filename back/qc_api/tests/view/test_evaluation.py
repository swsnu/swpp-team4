from django.test import TestCase, Client

from ..utils import get_mock_algo, get_signed_in_client
from ...models import Report, Performance
from ...util.utility import parse_date


class ReportViewTestCase(TestCase):
    def setUp(self) -> None:
        self.algo = get_mock_algo("algo")
        self.report = Report.objects.create(algorithm=self.algo, start_date=parse_date("2020-10-09"),
                                            end_date=parse_date("2020-10-10"), initial_budget=100000)
        self.report.save()

    def test_access_from_non_signed_in_user(self) -> None:
        """ Is this right to return 403? Maybe it should be 401..."""
        client = Client()
        response = client.get(f'/api/algo/{self.algo.id}/report')
        self.assertEqual(response.status_code, 403)

    def test_filtering_reports(self) -> None:
        client = get_signed_in_client(username="user", password="pd")
        response = client.get(f'/api/algo/{self.algo.id}/report')
        self.assertEqual(response.status_code, 200)


class PerformanceViewTestCase(TestCase):
    def setUp(self):
        self.algo1 = get_mock_algo("algo1", public=True)
        self.algo2 = get_mock_algo("algo2", public=True)

        self.performance1 = Performance.objects.create(name="p1_of_a1", algorithm=self.algo1, alpha=1.0)
        self.performance2 = Performance.objects.create(name="p2_of_a2", algorithm=self.algo2, alpha=5)

        self.performance1.save()
        self.performance2.save()

    def test_get_all_performances(self):
        client = Client()
        response = client.get('/api/performance')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0].get('id'), 2)

    def test_get_existing_performance(self):
        client = get_signed_in_client(username="user", password="pwd")
        response = client.get('/api/algo/1/performance')
        self.assertEqual(response.status_code, 200)

    def test_get_non_existing_performance(self):
        client = get_signed_in_client(username="user", password="pwd")
        response = client.get('/api/algo/3/performance')
        self.assertEqual(response.status_code, 404)