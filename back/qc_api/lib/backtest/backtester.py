"""backtester.py"""
import pandas as pd
import datetime
from ...models import Kospi, Kosdaq, StockData
from ...util.utility import stock_data_columns
from ..wallet.wallet import Wallet


class BackTester:
    """The BackTester Class in which all backtesting functions are defined"""

    def __init__(self, algorithm, budget):
        self.snippet_scope = algorithm.snippet_scope_data.code
        self.snippet_sell = algorithm.snippet_sell_data.code
        self.snippet_buy = algorithm.snippet_buy_data.code
        self.snippet_amount = algorithm.snippet_amount_data.code
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
