from django.test import TestCase, Client
from qc_api.lib.sandbox import SandBox

class SandBoxTestCase(TestCase):
    def test_sandbox_backtest(self):
        sandbox = SandBox(0,0,0,0)
        self.assertEqual(sandbox.budget,1000)