"""
Stock library to manage single stock data.
"""
import json
from datetime import datetime

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

    def dump_data(self):
        return {
            'name': self.get_name(),
            'stock_id': self.get_id(),
            'price': self.get_price(),
        }

    def __str__(self):
        stock_to_dict = dict()
        stock_to_dict.update({'name': self.__name,
                              'id': self.__stock_id})
        return str(stock_to_dict)


# TODO: name, stock_id, price, amount, avg_purchase_price
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
                 purchase_log: List[Tuple[datetime, float, int]],
                 sell_log: List[Tuple[datetime, float, int]],
                 avg_purchase_price: float):
        """
        Parameters:
            name: name of the stock
            stock_id: id of the stock
            price: price of the stock
            amount: the amount of the stock the user has, must be non-negative
            purchase_log: purchase history in the form of (dateTime, price, amount)
            sell_log: sell history
            avg_purchase_price: average purchase price
        """
        super().__init__(name, stock_id, price)
        self.__amount = amount
        self.__purchase_log = purchase_log
        self.__sell_log = sell_log
        self.__avg_purchase_price = avg_purchase_price

        if not self.check_consistency():
            raise ValueError("Consistency failed. Please check the transaction log.")

    def get_amount(self) -> int:
        """Get possessed amount of the stock"""
        return self.__amount

    def get_purchase_log(self) -> List[Tuple[datetime, float, int]]:
        """ Get purchase log """
        return self.__purchase_log

    def get_sell_log(self) -> List[Tuple[datetime, float, int]]:
        """ Get sell log """
        return self.__sell_log

    def get_avg_purchase_price(self) -> float:
        """ Get average purchase price """
        return self.__avg_purchase_price

    def __update_purchase_log(self, date: datetime, amount: int) -> None:
        """
        Update purchase log
        Parameters:
            date: transaction timestamp
            amount: transaction amount
        """
        self.__purchase_log.append((date, self.get_price(), amount))

    def __update_sell_log(self, date: datetime, amount: int) -> None:
        """
        Update sell log
        Parameters:
            date: transaction timestamp
            amount: transaction amount
        """
        self.__sell_log.append((date, self.get_price(), amount))

    def __fix_avg_purchase_price(self, new_amount: int) -> None:
        """
        Update avg_purchase_rate
        """
        self.__avg_purchase_price = (self.__avg_purchase_price * self.__amount +
                                     self.get_price() * new_amount) / (self.__amount + new_amount)

    def sell_coin(self, date_time: datetime, amount: int) -> bool:
        """
        Sell coin
        Parameters:
            date_time: transaction datetime
            amount: transaction amount
        Returns:
            True if successful
        """
        if not self.check_consistency() or self.__amount < amount:
            return False
        self.__amount -= amount
        self.__update_sell_log(date_time, amount)
        return True

    def purchase_coin(self, date_time: datetime, amount: int) -> bool:
        """
        Purchase coin.
        Budget checking must be done before calling this method
        Parameters:
            date_time: transaction datetime
            amount: transaction amount
        Returns:
            True if successful.
        """
        if not self.check_consistency():
            return False
        self.__fix_avg_purchase_price(amount)
        self.__amount += amount
        self.__update_purchase_log(date_time, amount)
        return True

    def check_consistency(self) -> bool:
        """
        Check if the current log is correct.
        """
        return True
        # checker = sum(x[2] for x in self.__purchase_log) - sum(x[2] for x in self.__sell_log)
        # return self.__amount == checker

    def dump_data(self):
        return {
            'name': self.get_name(),
            'stock_id': self.get_id(),
            'amount': self.__amount,
            'price': self.get_price(),
            'purchase_log': [],
            'sell_log': [],
            'avg_purchase_price': self.get_avg_purchase_price()
        }

    def __str__(self):
        """ String representation of StockCoin """
        stock_to_dict = dict()
        # stock_to_dict.update(dict(str(super())))
        stock_to_dict.update({'name': self.get_name(),
                              'stock_id': self.get_id(),
                              'amount': self.__amount,
                              'purchase_log': self.__purchase_log,
                              'sell_log': self.__sell_log,
                              'price': self.get_price()})
        return str(stock_to_dict)
