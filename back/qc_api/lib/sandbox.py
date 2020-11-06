"""
Sandbox class
"""
# pylint: disable=R0903
from datetime import datetime

from ..models.default_dataset.kospi import Kospi


class SandBox:
    """Sandbox class for Backtesting and Simulating registered algorithms"""

    def __init__(self, budget: float, start: datetime, end: datetime, algorithm):
        self.budget = budget
        self.start = start
        self.end = end
        self.algorithm = algorithm
        self.date_rows = self.get_trading_dates()

    def get_trading_dates(self):
        """
        Get dates used for trading.
        """
        return [
            kospi.date for kospi in Kospi.objects.filter(date__range=[self.start, self.end])
        ]
