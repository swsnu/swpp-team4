"""backtester.py"""
import pandas as pd
import datetime
from ...models import Kospi, Kosdaq, StockData
from ...util.utility import stock_data_columns, parse_date
from ..wallet.wallet import Wallet, Stock


class BackTester:
    """The BackTester Class in which all backtesting functions are defined"""

    def __init__(self, algorithm, budget):
        self.snippet_scope = algorithm.get("snippet_scope_data").get("code")
        self.snippet_sell = algorithm.get("snippet_sell_data").get("code")
        self.snippet_buy = algorithm.get("snippet_buy_data").get("code")
        self.snippet_amount = algorithm.get("snippet_amount_data").get("code")
        self.scope = []
        self.budget = budget
        self.universe = None
        self.buy_amount_list = []
        self.sell_amount_list = []
        self.today = datetime.date(1985, 1, 1)
        self.report = {
            "alpha": 0,
            "profit": 0,
            "MDD": 0,
            "transaction_log": [],
            "daily_profit": []
        }
        self.max_min_dict = {
            "regi": [100, "eq"],  # currVal>preVal=>gt, currVal<preVal=>lt, currVal=preVal=>eq
            "list": []
        }
        self.wallet = Wallet(budget=self.budget)

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

    def make_buy_order(self):
        if len(self.scope) == 0:
            pass
        else:
            scope = self.scope
            chosen_stocks = []
            exec_dict = {}
            _scope = dict(locals(), **globals())
            exec(self.snippet_buy, _scope, exec_dict)
            self.make_amount_list(opt="buy", chosen_stocks=chosen_stocks)
            for index, stock_tuple in enumerate(self.buy_amount_list):
                try:
                    self.wallet.purchase_coin(stock=stock_tuple[0], amount=stock_tuple[1], time=self.today)
                except IndexError:
                    pass

    def make_scope(self):
        universe = self.universe
        exec_dict = {}
        _scope = dict(locals(), **globals())
        exec(self.snippet_scope, _scope, exec_dict)
        self.scope = exec_dict.get("scope")

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

    def make_daily_report(self):
        profit = self.wallet.get_profit()
        self.report.get("transaction_log").append(self.wallet.get_transaction_log(self.today))
        self.report.get("daily_profit").append({"date": str(self.today), "profit": profit})
        self.track_max_min(profit=profit)

    def track_max_min(self, profit):
        """update max_min_dict"""
        yesterday_profit = self.max_min_dict.get("regi")[0]
        yesterday_mode = self.max_min_dict.get("regi")[1]
        if yesterday_mode == 'eq':
            if profit > yesterday_profit:
                self.max_min_dict.get("list").append(self.max_min_dict.get("regi")[0])
                self.max_min_dict.get("regi")[1] = 'gt'
            elif profit < yesterday_profit:
                self.max_min_dict.get("list").append(self.max_min_dict.get("regi")[0])
                self.max_min_dict.get("regi")[1] = 'lt'
            else:
                pass
        elif yesterday_mode == 'gt':
            if profit < yesterday_profit:
                """local maxima"""
                self.max_min_dict.get("list").append(self.max_min_dict.get("regi")[0])
                self.max_min_dict.get("regi")[1] = 'lt'
            elif profit > yesterday_profit:
                self.max_min_dict.get("regi")[1] = 'gt'
            else:
                self.max_min_dict.get("regi")[1] = 'eq'
        else:
            if profit < yesterday_profit:
                self.max_min_dict.get("regi")[1] = 'lt'
            elif profit > yesterday_profit:
                """local minima"""
                self.max_min_dict.get("regi")[1] = 'gt'
                self.max_min_dict.get("list").append(self.max_min_dict.get("regi")[0])
            else:
                self.max_min_dict.get("regi")[1] = 'eq'
        self.max_min_dict.get("regi")[0] = profit

    def report_result(self, start, end):
        self.report["MDD"] = self.calculate_mdd()
        self.report["profit"] = self.report.get("daily_profit")[-1].get("profit")
        self.report["alpha"] = self.calculate_alpha(start, end)
        return self.report

    def calculate_mdd(self):
        max_min_list = self.max_min_dict.get("list")
        max_diff = max_min_list[-2]-max_min_list[-1]
        min_element = max_min_list[-1]
        for i in range(1, len(max_min_list)+1):
            if max_min_list[-1 * i] - min_element > max_diff:
                max_diff = max_min_list[-1 * i] - min_element

            if max_min_list[-1 * i] < min_element:
                min_element = max_min_list[-1 * i]
        return max_diff

    def calculate_alpha(self, start, end):
        kospi_profit = Kospi.objects.get(date=end).close/Kospi.objects.get(date=start).close
        return self.report.get("profit")/float(kospi_profit)
