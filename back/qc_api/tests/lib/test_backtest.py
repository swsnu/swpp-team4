""" test backtester """
# pylint: disable=C0304,C0115,C0116,W0612,R0201,W0611,C0411
from django.test import TestCase
import pandas as pd
from datetime import date
from ...lib import BackTester, UserSpace
from ...models import Algorithm
from ...serializers import AlgorithmSerializer
from ..utils import get_mock_algo


class UserSpaceTestCase(TestCase):

    def test_init(self):
        algo = get_mock_algo(name="mock_algo")
        algo_data = AlgorithmSerializer(algo).data
        back_tester = BackTester(algorithm=algo_data, budget=1000000)



