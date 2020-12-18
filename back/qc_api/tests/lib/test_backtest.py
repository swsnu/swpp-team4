""" test backtester """
from django.test import TestCase
import pandas as pd
from datetime import date
from ...lib import BackTester, UserSpace
from ...models import Algorithm
from ...serializers import AlgorithmSerializer


class UserSpaceTestCase(TestCase):

    def test_init(self):
        userspace = UserSpace(universe=pd.DataFrame(), today=date.today(), variables=[])