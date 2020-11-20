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
            start, end: datetime objects that defines the beginning and the end of backtest. TODO.Exclusive? Inclusive?
            algorithm: Serialized algorithm data that contains code strings for each snippet.
        attributes:
            budget: the budget that will be used to initilaize backtester.
            start, end, algorithm: same as above.
            date_rows: return value from get_trading_dates. Contains list of dates when the market was open within given
                start and end.
            report: Initially none. This will be replaced by the report returned by backtester.report_result() at the
                end of the backtest.
            back_tester: backtester object.
        """
        self.__budget = budget
        self.__start = start
        self.__end = end
        self.algorithm = algorithm
        self.date_rows = self.get_trading_dates()
        self.report = None
        back_tester = self.prepare()
        self.run(back_tester)

    def get_budget(self) -> float:
        return self.__budget

    def get_start_date(self) -> datetime:
        return self.__start

    def get_end_date(self) -> datetime:
        return self.__end

    def prepare(self) -> BackTester:
        """ Prepare for backtest. """
        return BackTester(algorithm=self.algorithm, budget=self.__budget)

    def run(self, back_tester: BackTester) -> None:
        """
        Executes backtest.
        """
        back_tester.run(self.get_trading_dates())
        self.clean_up(back_tester)

    def clean_up(self, back_tester: BackTester) -> None:
        self.report = back_tester.report_result(start=self.date_rows[0], end=self.date_rows[-1])

    def get_trading_dates(self) -> List[datetime.date]:
        """
        Get dates used for trading.
        """
        print(Kospi.objects.all())
        return [
            kospi.date for kospi in Kospi.objects.filter(date__range=[self.__start, self.__end]).order_by('date')
        ]
