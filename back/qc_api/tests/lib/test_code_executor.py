from django.test import TestCase

from ...lib import DefensiveCodeExecutor
from ..utils import mock_algo_ser_data

class DefensiveCodeExecutorTestCase(TestCase):
    """
    Tests for DefensiveCodeExecutor
    """
    def setUp(self):
        return

    #@patch('qc_api.lib.code_executor.DefensiveCodeExecutor')
    def test_initialization(self):
        executor = DefensiveCodeExecutor()
        self.assertIsInstance(executor, DefensiveCodeExecutor)



