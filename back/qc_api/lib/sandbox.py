"""
Sandbox class
"""
# pylint: disable=R0903
from datetime import datetime

from ..models.default_dataset.kospi import Kospi
from .backtest.backtester import BackTester


class SandBox:
    """Sandbox class for Backtesting and Simulating registered algorithms"""

    def __init__(self, budget: float, start: datetime, end: datetime, algorithm):
        self.budget = budget
        self.start = start
        self.end = end
        self.algorithm = algorithm
        self.date_rows = self.get_trading_dates()
        self.report = None
        self.run()

    def run(self):
        back_tester = BackTester(algorithm=self.algorithm, budget=self.budget)
        for index, date in enumerate(self.date_rows):
            back_tester.set_date(date)
            back_tester.set_universe()
            back_tester.update_wallet()
            back_tester.make_sell_order()
            back_tester.make_buy_order()
            back_tester.make_scope()
            back_tester.make_daily_report()
        self.report = back_tester.report_result(start=self.date_rows[0], end=self.date_rows[-1])

    def get_trading_dates(self):
        """
        Get dates used for trading.
        """
        return [
            kospi.date for kospi in Kospi.objects.filter(date__range=[self.start, self.end]).order_by('date')
        ]
