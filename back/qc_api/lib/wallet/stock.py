from functools import reduce
import datetime


class Stock:
    """ this class does not depend on user"""
    """ price를 어떻게 다뤄야 할지 모르겠어. 실시간으로 가격이 바뀔텐데 그럴 때마다 overwrite해주면 오버헤드가 너무 커질 것 같아"""

    def __init__(self,
                 name: str,
                 stock_id,
                 price: int):
        """ data types per attribute """
        """ name: str """
        """ id: str or int """
        """ price: int or long > 0"""
        self.name = name
        self.stock_id = stock_id
        self.price = price

    def get_name(self):
        return self.name

    def get_id(self):
        return self.stock_id

    def get_price(self):
        return self.price

    def set_price(self, price):
        if price > 0:
            self.price = price
        return

    def __str__(self):
        stock_to_dict = dict()
        stock_to_dict.update({'name': self.name,
                              'id': self.stock_id})
        return str(stock_to_dict)


class StockCoin(Stock):
    """ a Stock object stored in a wallet"""
    """ extended to handle user-specific information"""

    def __init__(self,
                 name: str,
                 stock_id,
                 price: int,
                 amount: int,
                 purchase_log: list,
                 sell_log: list,
                 avg_purchase_price: int):
        super().__init__(name, stock_id, price)
        """ data types per attribute """
        """ stock_coin: class StockCoin """
        """ amount: int >= 0 """
        """ purchase_log: list of tuple of (dateTime, amount) """  # need to have price data?
        """ sell_log: list of tuple of (dateTime, amount) """
        self.amount = amount
        self.purchase_log = purchase_log
        self.sell_log = sell_log
        self.avg_purchase_price = avg_purchase_price

    def get_amount(self):
        return self.amount

    def sell_coin(self,
                  date_time: datetime,
                  amount: int):
        """ amount checking must be done before calling this method"""
        self.amount -= amount
        self.sell_log.append((date_time, amount))

    def purchase_coin(self,
                      date_time: datetime,
                      amount: int):
        """ budget checking must be done before calling this method"""
        self.amount += amount
        self.purchase_log.append((date_time, amount))

    def fix_avg_purchase_price(self, bought_at, new_amount):
        """update avg_purchase_rate"""
        self.avg_purchase_price = (self.avg_purchase_price * self.amount + bought_at * new_amount) / (
                    self.amount + new_amount)

    def check_consistency(self):
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
