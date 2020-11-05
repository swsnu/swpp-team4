from django.test import TestCase, Client
from ..lib import SandBox
from ..models import Kospi
from ..util.utility import parse_date


class SandBoxTestCase(TestCase):
    def setUp(self):
        pass

    def test_sandbox_backtest(self):
        stub_kospi = Kospi(date='2020-10-10',close=2300,open=2290,high=2301,low=2280,volume=10000000,d1_diff_rate=0.63)
        stub_kospi.save()
        sandbox = SandBox(1000, parse_date('2020-10-9'), parse_date('2020-10-11'), 0)
        self.assertEqual(sandbox.budget, 1000)
