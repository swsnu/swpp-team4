"""
Wallet library to handle stocks possessed by the user.
"""
import datetime
from functools import reduce
from typing import Optional, Dict, List, Any

from .stock import Stock
from .stock import StockCoin


class Wallet:
    """ Wallet class per user """

    def __init__(self, budget: float, stock_id_to_coin: Optional[Dict[int, StockCoin]] = None):
        """ default constructor """
        # WARNING: stock_id_list only has ids of stock with positive amount
        # this means that stocks which were started as amount > 0 but reduced to == 0 are not included.
        self.budget = budget
        self.initial_asset = budget

        if stock_id_to_coin is None:
            self.stock_id_list = list()
            self.stock_id_to_coin = dict()
        else:
            self.stock_id_to_coin = stock_id_to_coin
            self.stock_id_list = list(map(lambda stock: stock.get_id() if stock.get_amount() > 0 else None,
                                          [self.stock_id_to_coin[i] for i in self.stock_id_to_coin]))

    def get_budget(self) -> float:
        """ Get budget"""
        return self.budget

    def get_coins_simple(self) -> List[str]:
        """ returns only 'id's of possessed stocks """
        return self.stock_id_list

    def get_coins(self) -> List[StockCoin]:
        """ returns full information of possessed stocks """
        return [self.stock_id_to_coin[i] for i in self.stock_id_list]
        # map(lambda stock: str(stock), [self.stock_id_to_coin[i] for i in self.stock_id_to_coin])

    def update_coins(self, universe_today) -> None:
        """ updates information of possessed stocks accordingly to the today's universe"""
        coins = self.get_coins()  # coin => stock_coin instance in the wallet

        for coin in coins:
            try:
                _coin = universe_today.loc[universe_today['code'] == str(int(coin.get_id()))].iloc[0]
                coin.set_price(_coin['close'])
            except IndexError:
                coin.set_price(0)
                self.stock_id_list.remove(coin.get_id())

    def sell_coin(self,
                  stock: Stock,
                  amount: int,
                  time: datetime) -> bool:
        """ Sell stock """
        stock_id = stock.get_id()
        if amount == 0 or stock_id not in self.stock_id_to_coin.keys():
            return False

        stock_coin = self.stock_id_to_coin[stock_id]
        possessed_amount = stock_coin.get_amount()

        if possessed_amount < amount:
            return False
        if possessed_amount == amount:
            self.budget += stock.get_price() * amount
            stock_coin.sell_coin(time, amount)
            self.stock_id_list.remove(stock_id)
            print(f'Sold {amount} {stock.get_name()} at price of {stock.get_price()}')
        else:
            self.budget += stock.get_price() * amount
            stock_coin.sell_coin(time, amount)
            print(f'Sold {amount} {stock.get_name()} at price of {stock.get_price()}')
        return True

    def purchase_coin(self,
                      stock: Stock,
                      amount: int,
                      time: datetime):
        """ Purchase stocks """
        stock_id = stock.get_id()
        if self.budget < stock.get_price() * amount or amount == 0:
            print("cannot buy")
            return False

        if stock_id not in self.stock_id_to_coin:
            stock_coin = StockCoin(stock.get_name(), stock_id, stock.get_price(),
                                   amount, list(), list(), stock.get_price())
            self.stock_id_to_coin.update({stock_id: stock_coin})
            self.budget -= stock.get_price() * amount
            # stock_coin.purchase_coin(time, amount)
            self.stock_id_list.append(stock_id)
            print(f'Bought {amount} {stock.get_name()} at price {stock.get_price()}')
        else:
            stock_coin = self.stock_id_to_coin[stock_id]
            self.budget -= stock.get_price() * amount
            stock_coin.fix_avg_purchase_price(bought_at=stock.get_price(), new_amount=amount)
            if stock_coin.get_amount() == 0:
                self.stock_id_list.append(stock_id)
            stock_coin.purchase_coin(time, amount)
            print(f'Bought {amount} {stock.get_name()} at price {stock.get_price()}')
        return True

    def get_summaries(self) -> Dict[str, Any]:
        """ Calculates the statistics of the current status and returns it."""
        summaries = {}
        summaries.update({"cash": self.get_budget()})
        summaries.update({"posessed_items": [
            (self.stock_id_to_coin[index].name, self.stock_id_to_coin[index].get_amount()) for index in
            self.stock_id_list]})
        summaries.update(
            {"total_profit": (((reduce(lambda a, b: a + b, [
                self.stock_id_to_coin[index].avg_purchase_price * self.stock_id_to_coin[index].amount for index in
                self.stock_id_list
            ], 0) + self.get_budget()) / self.initial_asset) - 1) * 100
             })
        summaries.update({"stock_profit": reduce(lambda a, b: a + b, [
            self.stock_id_to_coin[index].avg_purchase_price * self.stock_id_to_coin[index].amount for index in
            self.stock_id_list
        ], 0)})
        return summaries

    def __str__(self):
        return str(self.get_coins())
