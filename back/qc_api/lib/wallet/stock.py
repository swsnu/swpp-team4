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
        self.name = name
        self.stock_id = stock_id
        self.price = price

    def get_name(self) -> str:
        """Get name of Stock"""
        return self.name

    def get_id(self) -> int:
        """Get Id of stock"""
        return self.stock_id

    def get_price(self) -> float:
        """Get current price of stock"""
        return self.price

    def set_price(self, price) -> None:
        """Set price of stock"""
        if price > 0:
            self.price = price

    def __str__(self):
        stock_to_dict = dict()
        stock_to_dict.update({'name': self.name,
                              'id': self.stock_id})
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
        Parameters:
            name: name of the stock
            stock_id: id of the stock
            price: price of the stock
            amount: the amount of the stock the user has, must be non-negative
            purchase_log: purchase history in the form of (dateTime, amount)
            sell_log: sell history
            avg_purchase_price: average perchase price
        """
        super().__init__(name, stock_id, price)
        self.amount = amount
        self.purchase_log = purchase_log
        self.sell_log = sell_log
        self.avg_purchase_price = avg_purchase_price

    def get_amount(self) -> int:
        """Get possessed amount of the stock"""
        return self.amount

    def sell_coin(self,
                  date_time: datetime,
                  amount: int) -> None:
        """Amount checking must be done before calling this method"""
        self.amount -= amount
        self.sell_log.append((date_time, amount))

    def purchase_coin(self,
                      date_time: datetime,
                      amount: int) -> None:
        """Budget checking must be done before calling this method"""
        self.amount += amount
        self.purchase_log.append((date_time, amount))

    def fix_avg_purchase_price(self, bought_at: float, new_amount: int) -> None:
        """update avg_purchase_rate"""
        self.avg_purchase_price = (self.avg_purchase_price * self.amount + bought_at * new_amount) / (
                    self.amount + new_amount)

    def check_consistency(self):
        """
        Check if the current log is correct.
        """
        checker = reduce(lambda x, y: x[1] + y[1], self.purchase_log) \
                  - reduce(lambda x, y: x[1] + y[1], self.sell_log)

        return self.amount == checker

    def __str__(self):
        stock_to_dict = dict()
        # stock_to_dict.update(dict(str(super())))
        stock_to_dict.update({'name': self.name,
                              'amount': self.amount,
                              'purchase_log': self.purchase_log,
                              'sell_log': self.sell_log,
                              'price': self.price})
        return str(stock_to_dict)
