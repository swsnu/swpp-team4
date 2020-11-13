from django.test import TestCase, Client

from ..utils import get_mock_algo
from ...models import Report, Performance
from ...util.utility import parse_date


class ReportModelTestCase(TestCase):
    def setUp(self):
        self.algo = get_mock_algo("algo")
        self.report = Report.objects.create(algorithm=self.algo, start_date=parse_date("2020-10-09"),
                                            end_date=parse_date("2020-10-10"), initial_budget=100000)
        self.report.save()

    def test_default_status(self):
        self.assertEqual(self.report.status, Report.BackTestStatus.PENDING)
        self.assertEqual(self.report.has_started(), False)
