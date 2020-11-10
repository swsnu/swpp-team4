"""backtester.py"""
import pandas as pd
import datetime
from ...models import Kospi, Kosdaq, StockData
from ...util.utility import stock_data_columns, parse_date
from ..wallet.wallet import Wallet


class BackTester:
    """The BackTester Class in which all backtesting functions are defined"""

    def __init__(self, algorithm, budget):
        self.snippet_scope = algorithm.get("snippet_scope_data").get("code")
        self.snippet_sell = algorithm.get("snippet_sell_data").get("code")
        self.snippet_buy = algorithm.get("snippet_buy_data").get("code")
        self.snippet_amount = algorithm.get("snippet_amount_data").get("code")
        self.budget = budget
        self.wallet = Wallet(budget=self.budget)
        self.universe = None
        self.buy_amount_list = []
        self.sell_amount_list = []
        self.today = datetime.date(1985, 1, 1)
        self.report = {
            "MDD": 0,
            "profit": 0,
            "alpha": 0,
            "beta": 0,
            "daily_portfolio": [],
            "daily_profit": []
        }
        self.max_min_dict = {
            "regi": [100, "eq"],  # currVal>preVal=>gt, currVal<preVal=>lt, currVal=preVal=>eq
            "list": []
        }

    def set_date(self, date: str) -> None:
        """Sets self.today"""
        self.today = parse_date(date)

    def set_universe(self) -> None:
        """Brings today (in context of backtesting)'s stock data from StockData DB table into memory"""
        self.universe = pd.DataFrame(list(StockData.objects.filter(date=self.today).values()),
                                     columns=stock_data_columns)

