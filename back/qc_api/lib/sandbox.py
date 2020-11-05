from ..models.default_dataset.kospi import Kospi


class SandBox:
    """Sandbox class for Backtesting and Simulating registered quant algorithms"""

    def __init__(self, budget, start, end, algorithm):
        self.budget = budget
        self.start = start
        self.end = end
        self.algorithm = algorithm
        self.date_rows = self.get_trading_dates()

    def get_trading_dates(self):
        return [
            kospi.date for kospi in Kospi.objects.filter(date__range=[self.start, self.end])
        ]
