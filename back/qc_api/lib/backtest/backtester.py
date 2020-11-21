"""backtester.py"""
# pylint: disable=W0122, R0902, W0511, W0703
from copy import copy
from datetime import date, datetime
from typing import List, Dict, Any
import pandas as pd

from ..wallet.wallet import Wallet, Stock
from ...models import Kospi, StockData
from ...serializers import AlgorithmSerializer
from ...util.utility import SnippetType, stock_data_columns


class DefensiveCodeExecutor:
    """
    An executor for executing user code. All its methods are static because it needs not to be instantiated.
    """
    def __init__(self):
        """ init function"""
        return

    @classmethod
    def pre_validate(cls, code: str) -> None:
        """
        Test invalid string occurrences before executing user code.
        Parameters:
            code: code in a string format
        Invalid keywords: import, exec, raise
        """
        assert "import" not in code
        assert "exec(" not in code
        # assert "print" not in code
        assert "raise" not in code
        assert "try" not in code
        assert "except" not in code
        assert "class " not in code
        assert "assert " not in code

    @classmethod
    def run(cls, code: str, accessible_src: Dict[str, Any], accessible_vars: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run pre-validated user code.
        Parameters:
            code: user code in a string format.
            accessible_src: source modules, classes, and functions which user code can have access to.
            accessible_vars: variables which user code can have access to.
        Returns:
            An updated accessible_vars. If post-validation fails, then returns un-updated accessible_vars.
        """
        before_exec = copy(accessible_vars)
        try:
            exec(code, accessible_src, accessible_vars)
        except Exception as exception:
            print(f"exception occurred. {exception}")
        print(accessible_vars.keys())
        can_return = DefensiveCodeExecutor.post_validate(before=before_exec, after=accessible_vars)
        if can_return:
            return accessible_vars
        return before_exec

    @classmethod
    def post_validate(cls, before: Dict[str, Any], after: Dict[str, Any]) -> bool:
        """
        Checks the changes done by the user code.
        Parameters:
            before: information about shared variables before executing user code.
            after: information about shared variables after executing user code.
        Returns:
            True if the test passes.
        """
        before_keys = before.keys()
        after_keys = after.keys()

        # code execution must not erase the existing keys
        if not set(before_keys).issubset(set(after_keys)):
            return False
        # variable type checking
        for key in before_keys:
            if not isinstance(after[key], type(before[key])):
                return False
            if isinstance(after[key], type(list)) and len(after[key]) > 0:
                first_elm = after[key][0]
                if not all(isinstance(elm, type(first_elm)) for elm in after[key]):
                    return False
        # are there any other checking methods?
        return True


class BackTester:
    """The BackTester Class in which all backtesting functions are defined"""

    def __init__(self, algorithm: AlgorithmSerializer.data, budget: float) -> None:
        """
        Initializes Backtester instance that iterates 'date_rows' in sandbox instance.

        params:
            algorithm: Serialized data of an algorithm instance that is called by '/algo/backtest' request.
            budget: initial budget set in the '/algo/backtest' request body that will be used to initialize wallet

        attributes:
            snippet_scope...amount: 'code' embedded in serialized algorithm instance
            scope: A list that contains Stock objects that are eligible for sell/buy action at next iteration
            budget: Budget that gets passed into the wallet at initialization
            universe: (currently) a panda object that holds all stock datas for 'today'
            buy_amount_list: A list of Stocks that are chosen from 'self_scope' by 'snippet_buy'
            sell_amount_list: A list of Stocks that are chosen from 'self_scope' by 'snippet_sell'
            today: The date each iteration of backtest emulates. Updated by set_date, which gets called every
                   iteration through date_rows in sandbox module.
            report: holds stats that will be returned at the end of the backtest by 'backtester.report_result'
                - alpha : calculated and modified once, by 'calculate_alpha' and 'report_result' respectively.
                Performance of the algorithm compared to Kospi growth. The greater the better.
                - profit: 100 * final assets / initial budget
                - MDD: maximal dropdown. calculated by 'calculate_MDD', which is fed up with 'max_min_dict' that has
                       been updated every iteration by 'track_max_min'
                - transaction_log: list of dicts: { date: today, sell: [{name, amount, price}...], buy: [{...}] },
                       each dicts are calculated and updated by self.wallet.get_transaction_log
                - daily_profit: list of dicts: { date: today, profit: ? }. Used for rendering profit graph at front.
            max_min_dict: keeps track of local maxima and local minima.
            wallet: Wallet instance. Keeps track of current budget and assets.
        """
        self.__snippet_scope = algorithm.get("snippet_scope_data").get("code")
        self.__snippet_sell = algorithm.get("snippet_sell_data").get("code")
        self.__snippet_buy = algorithm.get("snippet_buy_data").get("code")
        self.__snippet_amount = algorithm.get("snippet_amount_data").get("code")
        self.__scope = []
        self.__budget = budget
        self.__universe = None
        self.__buy_amount_list = []  # element type?
        self.__sell_amount_list = []
        self.__today = date(1985, 1, 1)
        self.__report = {
            "alpha": 0.0,
            "profit": 0.0,
            "MDD": 0.0,
            "transaction_log": [],
            "daily_profit": []
        }
        self.__max_min_dict = {
            "regi": [100.0, "eq"],  # currVal>preVal=>gt, currVal<preVal=>lt, currVal=preVal=>eq
            "list": []
        }
        self.__wallet = Wallet(budget=self.__budget)

    def set_date(self, today: date) -> None:
        """Sets self.today"""
        self.__today = today

    def set_universe(self) -> None:
        """Brings today (in context of backtesting)'s stock data from StockData DB table into memory"""
        self.__universe = pd.DataFrame(list(StockData.objects.filter(date=self.__today).values()),
                                       columns=stock_data_columns)

    def update_wallet(self) -> None:
        """
        Updates the price of possessed stocks in wallet. For better understanding of the operation, refer to
        'wallet.update_coins'
        """
        self.__wallet.update_coins(universe_today=self.__universe)

    def make_sell_order(self) -> None:
        """
        Executes 'snippet_sell' and 'snippet_amount'.
        Execution result of snippet_sell:
            List of Stock objects in 'chosen_stocks'.
        Execution result of snippet_amount:
            List of tuples => (stock: Stock, amount: int)
        After above sequence of snippet executions, it calls 'wallet.sell_coin', which eventually updates wallet status
        such as budget and possessed_items (used for calculation of daily profit, daily portfolio.
        """
        sell_candidates = self.__wallet.get_coins()
        scope = copy(self.__scope)
        universe = copy(self.__universe)
        accessible_vars = {"sell_candidates": sell_candidates,
                           "scope": scope,
                           "chosen_stocks": [],
                           "universe": universe}
        if len(sell_candidates) == 0:
            return
        exec_result = DefensiveCodeExecutor.run(self.__snippet_sell, accessible_src={}, accessible_vars=accessible_vars)
        self.make_amount_list(opt=SnippetType.SELL, chosen_stocks=exec_result.get("chosen_stocks"))
        for stock_tuple in self.__sell_amount_list:
            self.__wallet.sell_coin(stock=stock_tuple[0], amount=stock_tuple[1], time=self.__today)

    def make_buy_order(self) -> None:
        """
        Executes 'snippet_buy' and 'snippet_amount'.
        Execution result of snippet_buy:
            List of Stock objects in 'chosen_stocks'.
        Execution result of snippet_amount:
            List of tuples => (stock: Stock, amount: int)
        After above sequence of snippet executions, it calls 'wallet.purchase_coin', which eventually
        updates wallet status such as budget and possessed_items used for calculation of daily profit,
        daily portfolio.
        Exception:
            When a stock that was present in 'scope' yesterday disappears, pass buy-action of that specific
            stock as it no longer exists in the stock market.
        """
        if len(self.__scope) == 0:
            return
        scope = copy(self.__scope)
        accessible_vars = {
            "scope": scope,
            "chosen_stocks": []
        }
        exec_result = DefensiveCodeExecutor.run(self.__snippet_buy, {}, accessible_vars)
        self.make_amount_list(opt=SnippetType.BUY, chosen_stocks=exec_result.get('chosen_stocks'))
        for stock_tuple in self.__buy_amount_list:
            try:
                self.__wallet.purchase_coin(stock=stock_tuple[0], amount=stock_tuple[1], time=self.__today)
            except IndexError:
                pass

    def make_scope(self) -> None:
        """
        Executes snippet_scope and updates 'self.scope' that will be fed to snippet_buy and sell tomorrow.
        """
        scope = copy(self.__scope)
        universe = copy(self.__universe)
        accessible_vars = {
            'Stock': Stock,
            'scope': scope,
            'universe': universe
        }
        exec_result = DefensiveCodeExecutor.run(self.__snippet_scope, {'Stock': Stock}, accessible_vars)
        self.__scope = exec_result.get("scope")

    def make_amount_list(self, opt: SnippetType, chosen_stocks: List[Stock]) -> None:
        """
        Executes snippet_amount and updates buy_amount_list and sell_amount_list, depending on where it was called.
        TODO: Stock class does not have any amount field. If we want users to access the amount of their possessed
        TODO: stocks in their code, we must think of how to feed the information in here.
        """
        accessible_vars = {
            'opt': SnippetType,
            'chosen_stocks': chosen_stocks,
            'buy_amount_list': [],
            'sell_amount_list': [],
        }
        exec_result = DefensiveCodeExecutor.run(self.__snippet_amount, {'SnippetType': SnippetType}, accessible_vars)
        if opt == SnippetType.BUY:
            self.__buy_amount_list = exec_result['buy_amount_list']
        elif opt == SnippetType.SELL:
            self.__sell_amount_list = exec_result['sell_amount_list']

    def make_daily_report(self) -> None:
        """updates self.report's transaction_log and daily_profit."""
        profit = self.__wallet.get_profit()
        self.__report.get("transaction_log").append(self.__wallet.get_transaction_log(self.__today))
        self.__report.get("daily_profit").append({"date": str(self.__today), "profit": profit})
        self.__track_max_min(profit=profit)

    def __track_max_min(self, profit: float) -> None:
        """
        Update max_min_dict.
        At the end of every iteration, when 'make_daily_report' is called, this function gets passed 'profit'
        of the date as input. With that profit, 'track_max_min' stores/updates two values: 'regi' (a sort of register)
        that stores whether today's profit was greater than yesterday ('gt'), less than yesterday's ('lt') or equal to
        yesterday's (eq).
        The function decides whether to append today's profit into max_min_dict["list"] by defining whether
        today's profit is local minima/maxima or not based on new regi value (today's profit, yesterday's profit)
        and yesterday's regi.

        self.max_min_dict:
            regi[0]: yesterday's profit.
            regi[1]: yesterday's delta-profit ('gt', 'lt', 'eq')
            list: list of profits that are confirmed to be local minima or maxima.
        """
        yesterday_profit = self.__max_min_dict.get("regi")[0]
        yesterday_mode = self.__max_min_dict.get("regi")[1]

        if yesterday_mode == 'eq':
            if profit > yesterday_profit:
                self.__max_min_dict.get("list").append(self.__max_min_dict.get("regi")[0])
                self.__max_min_dict.get("regi")[1] = 'gt'
            elif profit < yesterday_profit:
                self.__max_min_dict.get("list").append(self.__max_min_dict.get("regi")[0])
                self.__max_min_dict.get("regi")[1] = 'lt'
            else:
                pass
        elif yesterday_mode == 'gt':
            if profit < yesterday_profit:
                # local maxima
                self.__max_min_dict.get("list").append(self.__max_min_dict.get("regi")[0])
                self.__max_min_dict.get("regi")[1] = 'lt'
            elif profit > yesterday_profit:
                self.__max_min_dict.get("regi")[1] = 'gt'
            else:
                self.__max_min_dict.get("regi")[1] = 'eq'
        else:
            if profit < yesterday_profit:
                self.__max_min_dict.get("regi")[1] = 'lt'
            elif profit > yesterday_profit:
                # local minima
                self.__max_min_dict.get("regi")[1] = 'gt'
                self.__max_min_dict.get("list").append(self.__max_min_dict.get("regi")[0])
            else:
                self.__max_min_dict.get("regi")[1] = 'eq'
        self.__max_min_dict.get("regi")[0] = profit

    def report_result(self, start: datetime.date, end: datetime.date) -> Dict[str, Any]:
        """
        finalizes self.report that will be saved in report table of DB by calculating MDD, profit, alpha.
        Since as we have been tracking daily profit, the final profit is last element of the report.daily_profit array.
        """
        self.__report["MDD"] = self.__calculate_mdd()
        self.__report["profit"] = self.__report.get("daily_profit")[-1].get("profit")
        self.__report["alpha"] = self.__calculate_alpha(start=start, end=end)
        return self.__report

    def __calculate_mdd(self) -> float:
        """
        Calculates MDD value from max_min_dict.
        0. Set the right-most element as 'min_element' and its difference with the second right-most elem as
        'max_diff'.
        1. At every iteration, evaluate max_min_list[-1*i] and its difference with 'min_element'.
        => If the evaluation result is greater than max_diff, update max_diff.
        2. At every iteration, update 'min_element' if max_min_list[-1*i] is smaller than current min.

        At the end of the iteration, we can get the maximum dropdown within the backtest period, which can indicate the
        risk of the algorithm.
        """
        max_min_list = self.__max_min_dict.get("list")
        if len(max_min_list) <= 1:
            return 0
        max_diff = max_min_list[-2] - max_min_list[-1]
        min_element = max_min_list[-1]
        for i in range(1, len(max_min_list) + 1):
            if max_min_list[-1 * i] - min_element > max_diff:
                max_diff = max_min_list[-1 * i] - min_element

            if max_min_list[-1 * i] < min_element:
                min_element = max_min_list[-1 * i]
        return max_diff

    def __calculate_alpha(self, start: date, end: date) -> float:
        """
        Calculate and return alpha value for the finished backtest.
        In order to get corresponding KOSPI data for each day, it queries KOSPI table with the 'start' and 'end' value
        of backtest.
        """
        kospi_profit = Kospi.objects.get(date=end).close / Kospi.objects.get(date=start).close
        return self.__report.get("profit") / float(kospi_profit)

    def validate(self) -> bool:
        """
        Validates user code before execution.
        """
        try:
            DefensiveCodeExecutor.pre_validate(self.__snippet_scope)
            DefensiveCodeExecutor.pre_validate(self.__snippet_sell)
            DefensiveCodeExecutor.pre_validate(self.__snippet_buy)
            DefensiveCodeExecutor.pre_validate(self.__snippet_amount)
        except AssertionError as error:
            print(error)
            return False
        return True

    def run(self, trading_dates: List[date]) -> None:
        """
        Run backtest.
        Parameters:
            trading_dates: dates to execute backtest.
        """
        for day in trading_dates:
            print(f"\n\n\n{day}")
            self.set_date(day)
            self.set_universe()
            self.update_wallet()
            self.make_sell_order()
            self.make_buy_order()
            self.make_scope()
            self.make_daily_report()
