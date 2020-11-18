"""
Stock library to manage single stock data.
"""
from functools import reduce
import datetime

from typing import List, Tuple


class Stock:
    """
    Stock class to manage single stock data.
    This class does not depend on user.
    """

    def __init__(self, name: str, stock_id: int, price: float):
        """
        Parameters:
            name: name of the stock
            stock_id: unique id of stock
            price: (current) price of the stock
        """
        self.__name = name
        self.__stock_id = stock_id
        self.__price = price

    def get_name(self) -> str:
        """Get name of Stock"""
        return self.__name

    def get_id(self) -> int:
        """Get Id of stock"""
        return self.__stock_id

    def get_price(self) -> float:
        """Get current price of stock"""
        return self.__price

    def set_price(self, price) -> None:
        """Set price of stock"""
        if price >= 0:
            self.__price = price

    def __str__(self):
        stock_to_dict = dict()
        stock_to_dict.update({'name': self.__name,
                              'id': self.__stock_id})
        return str(stock_to_dict)


class StockCoin(Stock):
    """
    A Stock object stored in a wallet.
    Extended to handle user-specific information.
    """

    def __init__(self,
                 name: str,
                 stock_id: int,
                 price: float,
                 amount: int,
                 purchase_log: List[Tuple[datetime.datetime, int]],
                 sell_log: List[Tuple[datetime.datetime, int]],
                 avg_purchase_price: float):
        """
        TODO: Make all fields in StockCoin private and manage access.
        TODO: purchase log must be not empty if the amount is positive.
        Parameters:
            name: name of the stock
            stock_id: id of the stock
            price: price of the stock
            amount: the amount of the stock the user has, must be non-negative
            purchase_log: purchase history in the form of (dateTime, amount)
            sell_log: sell history
            avg_purchase_price: average purchase price
        """
        super().__init__(name, stock_id, price)
        self.__amount = amount
        self.purchase_log = purchase_log
        self.sell_log = sell_log
        self.avg_purchase_price = avg_purchase_price

    def get_amount(self) -> int:
        """Get possessed amount of the stock"""
        return self.__amount

    def sell_coin(self,
                  date_time: datetime,
                  amount: int) -> None:
        """Amount checking must be done before calling this method"""
        self.__amount -= amount
        self.sell_log.append((date_time, amount))

    def purchase_coin(self,
                      date_time: datetime,
                      amount: int) -> None:
        """Budget checking must be done before calling this method"""
        self.__amount += amount
        self.purchase_log.append((date_time, amount))

    def fix_avg_purchase_price(self, bought_at: float, new_amount: int) -> None:
        """
        Update avg_purchase_rate
        must be called 'before' purchase_coin.
        TODO: Hide the dependency between purchase_coin() and fix_avg_purchase_price().
        This function must be called in purchase_coin()
        """
        self.avg_purchase_price = (self.avg_purchase_price * self.__amount + bought_at * new_amount) / (
                self.__amount + new_amount)

    def check_consistency(self) -> bool:
        """
        Check if the current log is correct.
        """
        checker = sum(x[1] for x in self.purchase_log) - sum(x[1] for x in self.sell_log)
        return self.__amount == checker

    def __str__(self):
        stock_to_dict = dict()
        # stock_to_dict.update(dict(str(super())))
        stock_to_dict.update({'name': self.get_name(),
                              'id': self.get_id(),
                              'amount': self.__amount,
                              'purchase_log': self.purchase_log,
                              'sell_log': self.sell_log,
                              'price': self.get_price()})
        return str(stock_to_dict)
