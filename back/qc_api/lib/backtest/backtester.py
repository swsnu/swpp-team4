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

    def set_date(self, date: datetime.date) -> None:
        """Sets self.today"""
        self.today = date

    def set_universe(self) -> None:
        """Brings today (in context of backtesting)'s stock data from StockData DB table into memory"""
        self.universe = pd.DataFrame(list(StockData.objects.filter(date=self.today).values()),
                                     columns=stock_data_columns)

    def update_wallet(self):
        self.wallet.update_coins(universe_today=self.universe)

    def make_sell_order(self):
        sell_candidates = self.wallet.get_coins()
        if len(sell_candidates) == 0:
            pass
        else:
            chosen_stocks = []
            exec_dict = {}
            scope = dict(locals(), **globals())
            exec(self.snippet_sell, scope, exec_dict)
            if exec_dict.get("chosen_stocks"):
                chosen_stocks = exec_dict.get("chosen_stocks")
            self.make_amount_list(opt="sell", chosen_stocks=chosen_stocks)
            for index, stock_tuple in enumerate(self.sell_amount_list):
                self.wallet.sell_coin(stock=stock_tuple[0], amount=stock_tuple[1], time=self.today)

    def make_amount_list(self, opt, chosen_stocks):
        buy_amount_list = []
        sell_amount_list = []
        exec_dict = {}
        scope = dict(locals(), **globals())
        if opt == "buy":
            exec(self.snippet_amount, scope, exec_dict)
            self.buy_amount_list = buy_amount_list
        else:
            exec(self.snippet_amount, scope, exec_dict)
            self.sell_amount_list = sell_amount_list

