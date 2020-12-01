"""
Sandbox class
"""
# pylint: disable=R0903
from datetime import datetime, date

from ..models.default_dataset.kospi import Kospi
from ..models.evaluation.report import Report
from ..serializers import AlgorithmSerializer, ReportSerializer
from .backtest.backtester import BackTester
from typing import List, Optional
from ..util.utility import parse_date


class SandBox:
    """Sandbox class for Backtesting and Simulating registered algorithms"""

    def __init__(self, budget: float, start, end, algorithm: AlgorithmSerializer.data) -> None:
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

    def get_start_date(self) -> date:
        return self.__start

    def get_end_date(self) -> date:
        return self.__end

    def prepare(self) -> Optional[BackTester]:
        """ Prepare for backtest. """
        back_tester = BackTester(algorithm=self.algorithm, budget=self.__budget)

        if back_tester.validate():
            return back_tester
        else:
            print("validation process failed, the code will be not executed.")
            return None

    def run(self, back_tester: Optional[BackTester]) -> None:
        """
        Executes backtest.
        """
        if back_tester is not None:
            back_tester.run(self.get_trading_dates())
            self.clean_up(back_tester)

    def clean_up(self, back_tester: BackTester) -> None:
        self.report = back_tester.report_result(start=self.date_rows[0], end=self.date_rows[-1])
        self.report["transaction_log"] = str(self.report["transaction_log"])
        self.report["daily_profit"] = str(self.report["daily_profit"])
        self.report.update({
            "algorithm": self.algorithm.get("id"),
            "optional_stat": "N/A",
            "start_date": parse_date(self.__start),
            "end_date": parse_date(self.__end),
            "initial_budget": self.__budget,
            "status": Report.BackTestStatus.DONE
        })
        print(self.report)
        serializer = ReportSerializer(data=self.report)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
        # TODO: ERROR HANDLING (CH)

    def get_trading_dates(self) -> List[datetime.date]:
        """
        Get dates used for trading.
        """
        return [
            kospi.date for kospi in Kospi.objects.filter(date__range=[self.__start, self.__end]).order_by('date')
        ]
