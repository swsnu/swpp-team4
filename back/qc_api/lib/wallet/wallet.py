from .stock import Stock
from .stock import StockCoin
from functools import reduce


class Wallet:
    """ wallet class per user """

    # are there any static attributes needed in wallet class?
    # if so, list them here

    def __init__(self, user, budget):
        """ default constructor """
        # WARNING: stock_id_list only has ids of stock with positive amount
        # this means that stocks which were started as amount > 0 but reduced to == 0 are not included.
        self.user = user
        self.budget = budget
        self.initial_asset = budget
        self.stock_id_to_coin = dict()
        self.stock_id_list = list()

    def __init__(self, user, budget,
                 stock_id_to_coin: dict):
        """ constructor with stock_coin_list """
        self.user = user
        self.budget = budget
        self.initial_asset = budget
        self.stock_id_to_coin = stock_id_to_coin
        self.stock_id_list = list(map(lambda stock: stock.get_id() if stock.get_amount() > 0 else None,
                                      [self.stock_id_to_coin[i] for i in self.stock_id_to_coin]))

    def get_user(self):
        return self.user

    def get_budget(self):
        return self.budget

    def get_coins_simple(self):
        """ returns only 'id's of possessed stocks """
        return self.stock_id_list

    def get_coins(self):
        """ returns full information of possessed stocks """
        return [self.stock_id_to_coin[i] for i in self.stock_id_list]
        # map(lambda stock: str(stock), [self.stock_id_to_coin[i] for i in self.stock_id_to_coin])

    def update_coins(self, universe_today):
        """ updates information of posessed stocks accordingly to the today's universe"""
        coins = self.get_coins()  # coin => stock_coin instance in the wallet

        for coin in coins:
            try:
                _coin = universe_today.loc[universe_today['code'] == str(int(coin.get_id()))].iloc[0]
                coin.set_price(_coin['close'])
            except IndexError as e:
                coin.set_price(0)
                self.stock_id_list.remove(coin.get_id())
                print("this is causing Error!!!!!!!!!")
                print(coin)
                print(coin.get_name())
                print(e)

    def sell_coin(self,
                  stock: Stock,
                  amount: int,
                  datetime):
        stock_id = stock.get_id()
        if amount == 0:
            return False

        if stock_id not in self.stock_id_to_coin:
            return False

        stock_coin = self.stock_id_to_coin[stock_id]
        possessed_amount = stock_coin.get_amount()

        if possessed_amount < amount:
            return False
        elif possessed_amount == amount:
            # remove stock_id from stock_id_list
            self.budget += stock.get_price() * amount
            stock_coin.sell_coin(datetime, amount)
            self.stock_id_list.remove(stock_id)
            print(f'Sold {amount} {stock.get_name()} at price of {stock.get_price()}')
            return True
        else:
            self.budget += stock.get_price() * amount
            stock_coin.sell_coin(datetime, amount)
            print(f'Sold {amount} {stock.get_name()} at price of {stock.get_price()}')
            return True

    def purchase_coin(self,
                      stock: Stock,
                      amount: int,
                      datetime):
        stock_id = stock.get_id()
        if self.budget < stock.get_price() * amount or amount == 0:
            print("cannot buy")
            return False

        elif stock_id not in self.stock_id_to_coin:
            stock_coin = StockCoin(stock.get_name(), stock_id, stock.get_price(),
                                   amount, list(), list(), stock.get_price())
            self.stock_id_to_coin.update({stock_id: stock_coin})
            self.budget -= stock.get_price() * amount
            #stock_coin.purchase_coin(datetime, amount)
            self.stock_id_list.append(stock_id)
            print(f'Bought {amount} {stock.get_name()} at price {stock.get_price()}')
            return True

        else:
            stock_coin = self.stock_id_to_coin[stock_id]
            self.budget -= stock.get_price() * amount
            stock_coin.fix_avg_purchase_price(bought_at=stock.get_price(), new_amount=amount)
            if stock_coin.get_amount() == 0:
                self.stock_id_list.append(stock_id)
            stock_coin.purchase_coin(datetime, amount)
            print(f'Bought {amount} {stock.get_name()} at price {stock.get_price()}')
            return True

    def get_summaries(self):
        summaries = {}
        summaries.update({"cash": self.get_budget()})
        summaries.update({"posessed_items": [(self.stock_id_to_coin[index].name, self.stock_id_to_coin[index].get_amount()) for index in self.stock_id_list]})
        summaries.update(
            {"total_profit": (((reduce(lambda a, b: a + b, [
                self.stock_id_to_coin[index].avg_purchase_price * self.stock_id_to_coin[index].amount for index in
                self.stock_id_list
            ], 0)+self.get_budget())/self.initial_asset)-1)*100
             })
        summaries.update({"stock_profit": reduce(lambda a, b: a + b, [
                self.stock_id_to_coin[index].avg_purchase_price * self.stock_id_to_coin[index].amount for index in
                self.stock_id_list
            ], 0)})
        return summaries

    def __str__(self):
        return str(self.get_coins())