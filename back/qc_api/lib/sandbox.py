"""
Sandbox class
"""
# pylint: disable=R0903
from datetime import datetime

from ..models.default_dataset.kospi import Kospi
from ..serializers import AlgorithmSerializer
from .backtest.backtester import BackTester
from typing import List


class SandBox:
    """Sandbox class for Backtesting and Simulating registered algorithms"""

    def __init__(self, budget: float, start: datetime, end: datetime, algorithm: AlgorithmSerializer.data) -> None:
        """
        Runs backtest with settings defined by the '/algo/backtest' request.
        When backtest is complete, Sandbox updates 'report' attribute, which will be fetched by the view for
        '/algo/backtest' and stored in Report table.

        params:
            budget: initial budget set by the api request.
            start, end: datetime objects that defines the beginning and the end of backtest.
            algorithm: Serialized algorithm data that contains code strings for each snippet.
        attributes:
            budget: the budget that will be used to initilaize backtester.
            start, end, algorithm: same as above.
            date_rows: return value from get_trading_dates. Contains list of dates when the market was open within given
                start and end.
            report: Initially none. This will be replaced by the report returned by backtester.report_result() at the
                end of the backtest.
        """
        self.budget = budget
        self.start = start
        self.end = end
        self.algorithm = algorithm
        self.date_rows = self.get_trading_dates()
        self.report = None
        self.run()

    def run(self) -> None:
        """
        Initializes backtester instance and runs it.
        When backtest completes, it updates self.report.
        """
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

    def get_trading_dates(self) -> List[datetime.date]:
        """
        Get dates used for trading.
        """
        return [
            kospi.date for kospi in Kospi.objects.filter(date__range=[self.start, self.end]).order_by('date')
        ]
