"""
testcases for SandBox

Once finished, it must be moved to tests/lib directory.
"""

# from django.test import TestCase
#
# from qc_api.lib import SandBox
# from qc_api.util.utility import parse_date
# from .utils import mock_algo_ser_data
# import default_dataset_seeder
#
#
# class SandBoxTestCase(TestCase):
#     """
#     Tests for Sandbox library
#     """
#
#     def setUp(self) -> None:
#         """ Setup """
#         dir_path = default_dataset_seeder.LIB_DIR
#         for elm in default_dataset_seeder.run(100, f"{dir_path}KOSPI.csv", "kospi", parse_date('2020-7-7'),
#                                               parse_date('2020-7-9')):
#             elm.save()
#         for elm in default_dataset_seeder.run(100, f"{dir_path}csv_stock.csv", "stock",
#                                               parse_date('2020-7-7'), parse_date('2020-7-9')):
#             elm.save()
#
#         for elm in default_dataset_seeder.run(100, f"{dir_path}KOSDAQ.csv", "kosdaq", parse_date('2020-7-7'),
#                                               parse_date('2020-7-9')):
#             elm.save()
#
#     def test_sandbox_backtest(self) -> None:
#         """ Test sandbox backtest """
#         sandbox = SandBox(100000, parse_date('2020-7-7'), parse_date('2020-7-9'), mock_algo_ser_data)
#         self.assertEqual(sandbox.get_budget(), 100000)
