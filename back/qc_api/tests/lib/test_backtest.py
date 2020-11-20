from datetime import datetime
from typing import List

from django.test import TestCase

from qc_api.lib.backtest.backtester import BackTester
from qc_api.models.default_dataset.kospi import Kospi
from qc_api.util.utility import parse_date


def get_trading_dates() -> List[datetime.date]:
    """
    Get dates used for trading.
    """
    return [
        kospi.date for kospi in Kospi.objects.filter(date__range=[parse_date('2020-10-9'), parse_date('2020-10-11')]).order_by('date')
    ]


mock_algo_ser_data = {
    "snippet_scope_data": {
        'code': "scope = list(map(lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[4]), "
                "universe.query('(yes_clo_5 < yes_clo_20) and (clo5 > clo20) and (volume >5000000)').to_numpy())) "
    },
    'snippet_sell_data': {
        'code': "for index, candidate in enumerate(scope):\n\tif index==0:\n\t\tchosen_stocks.append("
                "candidate)\n\t\tbreak "
    },
    'snippet_buy_data': {
        'code': "for candidate in sell_candidates:\n\tif (universe.loc[self.universe['code'] == str(int("
                "candidate.get_id()))].iloc[0]['close'])/candidate.get_avg_purchase_price("
                ")-1>0.05:\n\t\tchosen_stocks.append(candidate) "
    },
    'snippet_amount_data': {
        'code': "if opt == SnippetType.BUY:\n\tfor stock in chosen_stocks:\n\t\tbuy_amount_list.append((stock, 1))" +
                "\nelse:\n\tfor stock in chosen_stocks:\n\t\tsell_amount_list.append((stock, stock.get_amount()))"
    }
}

class BackTestTestCase(TestCase):
    def setUp(self):
        self.backtester = BackTester(algorithm=mock_algo_ser_data, budget=100000)

    def test_backtest(self):
        for day in get_trading_dates():
            print(day)
            self.backtester.set_date(day)
            self.backtester.set_universe()
            self.backtester.update_wallet()
            self.backtester.make_sell_order()
            self.backtester.make_buy_order()
            self.backtester.make_scope()
            self.backtester.make_daily_report()

