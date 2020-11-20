"""
test_lib.py
"""
import os

from django.test import TestCase

from ..lib import SandBox
from ..models import Kospi
from ..models.default_dataset.kosdaq import Kosdaq
from ..models.default_dataset.stock_data import StockData
from ..util.utility import parse_date
import default_dataset_seeder

mock_algo_ser_data = {
    "snippet_scope_data": {
        'code': "scope = list(map(lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[4]), "
                "universe.query('(yes_clo_5 < yes_clo_20) and (clo5 > clo20) and (volume >5000000)').to_numpy())) "
    },
    'snippet_buy_data': {
        'code': "print(scope, chosen_stocks)\n"
                "for index, candidate in enumerate(scope):"
                "\n\tprint(candidate)"
                "\n\tif index==0:"
                "\n\t\tchosen_stocks.append(candidate)"
                "\n\t\tbreak "
    },
    'snippet_sell_data': {
        'code': "for candidate in sell_candidates:"
                "\n\tif (universe.loc[self.universe['code'] == str(int(candidate.get_id()))].iloc[0]['close'])"
                "/candidate.get_avg_purchase_price()-1>0.05:"
                "\n\t\tchosen_stocks.append(candidate) "
    },
    'snippet_amount_data': {
        'code': "if opt == SnippetType.BUY:\n\tfor stock in chosen_stocks:\n\t\tbuy_amount_list.append((stock, 1))" +
                "\nelse:\n\tfor stock in chosen_stocks:\n\t\tsell_amount_list.append((stock, stock.get_amount()))"
    }
}


class SandBoxTestCase(TestCase):
    """
    Tests for Sandbox library
    """
    def setUp(self) -> None:
        """ Setup """
        dir_path = default_dataset_seeder.LIB_DIR
        for elm in default_dataset_seeder.run(100, f"{dir_path}KOSPI.csv", "kospi", parse_date('2020-7-7'), parse_date('2020-7-9')):
            elm.save()
        for elm in default_dataset_seeder.run(100, f"{dir_path}csv_stock.csv", "stock",
                                              parse_date('2020-7-7'), parse_date('2020-7-9')):
            elm.save()

        for elm in default_dataset_seeder.run(100, f"{dir_path}KOSDAQ.csv", "kosdaq", parse_date('2020-7-7'), parse_date('2020-7-9')):
            elm.save()

    def test_sandbox_backtest(self) -> None:
        """ Test sandbox backtest """
        print(len(Kospi.objects.all()))
        print(Kosdaq.objects.all())
        print(StockData.objects.all())
        sandbox = SandBox(1000, parse_date('2020-7-7'), parse_date('2020-7-9'), mock_algo_ser_data)
        self.assertEqual(sandbox.get_budget(), 1000)
