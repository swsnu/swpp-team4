""" TestCases for Evaluation Models """
# pylint: disable=E1101
from django.test import TestCase

from ..utils import get_mock_algo
from ...models import Report
from ...util.utility import parse_date


class ReportModelTestCase(TestCase):
    """ TestCases for Report Model """

    def setUp(self) -> None:
        """ Set up tests. """
        self.algo = get_mock_algo("algo")
        self.report = Report.objects.create(algorithm=self.algo, start_date=parse_date("2020-10-09"),
                                            end_date=parse_date("2020-10-10"), initial_budget=100000)
        self.report.save()

    def test_default_status(self) -> None:
        """ The newly created Report model should have a status of PENDING. """
        self.assertEqual(self.report.status, Report.BackTestStatus.PENDING)
        self.assertEqual(self.report.has_started(), False)
