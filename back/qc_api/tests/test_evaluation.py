from django.test import TestCase, Client
from unittest.mock import patch
from qc_api.models import Snippet, Algorithm, Report, Performance

def get_mock_snippet():
    return

class ReportModelTestCase(TestCase):
    def Setup(self):
        pass

    @patch('Algorithm.objects')
    def test_create_report(self, mock_algo):
        print(mock_algo)
        report = Report(algorithm=mock_algo)
        self.assertEqual(report.algorithm.id, mock_algo.id)

