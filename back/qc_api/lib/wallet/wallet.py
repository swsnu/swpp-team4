"""
Wallet library to handle stocks possessed by the user.
"""
# pylint: disable=C0103
from datetime import datetime
from typing import Optional, Dict, List, Any

from .stock import Stock
from .stock import StockCoin


class Wallet:
    """ Wallet class per user """

    def __init__(self, budget: float, stock_id_to_coin: Optional[Dict[int, StockCoin]] = None):
        """ default constructor """
        # WARNING: stock_id_list only has ids of stock with positive amount
        # this means that stocks which were started as amount > 0 but reduced to == 0 are not included.
        self.__budget = budget
        self.__initial_asset = budget
        self.__transaction_log = {
            "sell": [],
            "buy": []
        }

        if stock_id_to_coin is None:
            self.__stock_id_list = list()
            self.__id_to_coin = dict()
        else:
            self.__id_to_coin = stock_id_to_coin
            self.__stock_id_list = list(map(lambda stock: stock.get_id() if stock.get_amount() > 0 else None,
                                            [self.__id_to_coin[i] for i in self.__id_to_coin]))

    def load_setting(self, budget: float, curr_portfolio: list) -> bool:
        """ load budget, transaction log, and coins (stocks) """
        self.__budget = budget
        print(budget)
        print(curr_portfolio)
        for bought_stock in curr_portfolio:
            if bought_stock['stock_id'] not in self.__stock_id_list:
                stock_coin = StockCoin(
                    name=bought_stock['name'],
                    stock_id=bought_stock['stock_id'],
                    price=bought_stock['price'],
                    amount=0,
                    purchase_log=bought_stock['purchase_log'],
                    sell_log=bought_stock['sell_log'],
                    avg_purchase_price=bought_stock['avg_purchase_price']
                )
                self.__handle_new_coin(stock_coin)
            else:
                stock_coin = self.__id_to_coin[bought_stock['stock_id']]  # will not be called ever
            stock_coin.purchase_coin(date_time=datetime.today(), amount=bought_stock['amount'])
        return True

    def get_budget(self) -> float:
        """ Get budget"""
        return self.__budget

    def get_initial_asset(self) -> float:
        """ Get initial asset"""
        return self.__initial_asset

    def get_coins_simple(self) -> List[str]:
        """ returns only 'id's of possessed stocks """
        return self.__stock_id_list

    def get_coins(self) -> List[StockCoin]:
        """ returns full information of possessed stocks """
        return [self.__id_to_coin[sid] for sid in self.__stock_id_list]
        # map(lambda stock: str(stock), [self.stock_id_to_coin[i] for i in self.stock_id_to_coin])

    def dump_coins(self) -> List[dict]:
        coin_dump = list()
        for coin in self.__id_to_coin:
            coin_dump.append(self.__id_to_coin[coin].dump_data())
        return coin_dump

    def __handle_new_coin(self, coin: StockCoin) -> None:
        self.__stock_id_list.append(coin.get_id())
        self.__id_to_coin[coin.get_id()] = coin

    def __handle_deleted_coin(self, coin_id: int) -> None:
        """
        Erase no longer possessed coin
        Cases: price 0 or amount 0
        """
        self.__stock_id_list.remove(coin_id)
        self.__id_to_coin.pop(coin_id)

    def update_coins(self, universe_today) -> None:
        """ updates information of possessed stocks accordingly to the today's universe"""
        coins = self.get_coins()  # coin => stock_coin instance in the wallet

        for coin in coins:
            try:
                _coin = universe_today.loc[universe_today['code'] == str(int(coin.get_id()))].iloc[0]
                coin.set_price(int(_coin['close']))
            except IndexError:
                coin.set_price(0)
                self.__handle_deleted_coin(coin.get_id())

    def sell_coin(self, stock: Stock, amount: int, time: datetime) -> bool:
        """ Sell stock """
        stock_id = stock.get_id()
        if amount <= 0 or stock_id not in self.__stock_id_list:
            return False

        stock_coin = self.__id_to_coin[stock_id]
        possessed_amount = stock_coin.get_amount()

        if possessed_amount < amount:
            return False
        if possessed_amount == amount:
            self.__handle_deleted_coin(stock_id)
        self.__budget += stock.get_price() * amount
        stock_coin.sell_coin(time, amount)
        self.__transaction_log.get("sell").append({
            "name": stock.get_name(),
            "price": stock.get_price(),
            "amount": amount
        })
        print(f'Sold {amount} {stock.get_name()} at price of {stock.get_price()}')
        return True

    def purchase_coin(self, stock: Stock, amount: int, time: datetime) -> bool:
        """ Purchase stocks """
        stock_id = stock.get_id()
        if self.__budget < stock.get_price() * amount or amount <= 0:
            print("cannot buy")
            return False

        if stock_id not in self.__stock_id_list:
            stock_coin = StockCoin(name=stock.get_name(), stock_id=stock_id, price=stock.get_price(),
                                   amount=0, purchase_log=list(), sell_log=list(), avg_purchase_price=0)
            self.__handle_new_coin(stock_coin)
        else:
            stock_coin = self.__id_to_coin[stock_id]
        self.__budget -= stock.get_price() * amount
        stock_coin.purchase_coin(date_time=time, amount=amount)
        print(f'Bought {amount} {stock.get_name()} at price {stock.get_price()}, now have ${self.__budget}')
        self.__transaction_log.get("buy").append({
            "name": stock.get_name(),
            "price": stock.get_price(),
            "amount": amount
        })
        return True

    def get_summaries(self) -> Dict[str, Any]:
        """ Calculates the statistics of the current status and returns it."""
        possessed_items = [
            (self.__id_to_coin[index].get_name(), self.__id_to_coin[index].get_amount())
            for index in self.__stock_id_list
        ]
        total_profit = sum([self.__id_to_coin[index].get_avg_purchase_price() *
                            self.__id_to_coin[index].get_amount() for index in self.__stock_id_list],
                           self.get_budget())
        total_profit = ((total_profit / self.__initial_asset) - 1) * 100
        stock_profit = sum([self.__id_to_coin[index].get_avg_purchase_price() *
                            self.__id_to_coin[index].get_amount() for index in self.__stock_id_list], 0)
        summaries = {}
        summaries.update({"cash": self.get_budget()})
        summaries.update({"possessed_items": possessed_items})
        summaries.update({"total_profit": total_profit})
        summaries.update({"stock_profit": stock_profit})
        return summaries

    def get_profit(self) -> float:
        """
        Calculate and return profit.
        Returns:
            profit.
        """
        remaining_budget = self.get_budget()
        possessed_stock_value = sum([self.__id_to_coin[index].get_price() * self.__id_to_coin[index].get_amount()
                                     for index in self.__stock_id_list], 0)
        profit = 100 * (remaining_budget + possessed_stock_value) / self.__initial_asset
        return profit

    def get_transaction_log(self, date: datetime) -> Dict[str, Any]:
        """
        Get transaction log of the queried day and empty current log.
        Parameters:
            date: date to query
        Returns:
            transaction log of the day
        """
        rv = dict()
        rv.update(self.__transaction_log)
        rv['date'] = str(date)
        self.__transaction_log = {
            "sell": [],
            "buy": []
        }
        return rv

    def __repr__(self):
        return [str(coin) for coin in self.get_coins()]

    def __str__(self):
        """ String representation of wallet. """
        return f'{self.__repr__()}'
