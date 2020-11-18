from django.test import TestCase
from datetime import datetime
from qc_api.lib import Stock, StockCoin


class StockTestCase(TestCase):
    def setUp(self):
        self.stock = Stock(name="CreamCheeseCompany", stock_id=0, price=1000)
        return

    def test_stock_creation(self):
        stock_fields = self.stock.__dict__.keys()
        self.assertIn('_Stock__name', stock_fields)
        self.assertIn('_Stock__stock_id', stock_fields)
        self.assertIn('_Stock__price', stock_fields)

    def test_stock_get_name(self):
        self.assertEqual(self.stock.get_name(), "CreamCheeseCompany")

    def test_stock_get_id(self):
        self.assertEqual(self.stock.get_id(), 0)

    def test_stock_get_price(self):
        self.assertEqual(self.stock.get_price(), 1000)

    def test_stock_set_valid_price(self):
        self.stock.set_price(1200)
        self.assertEqual(self.stock.get_price(), 1200)

    def test_stock_set_invalid_price(self):
        self.stock.set_price(-1000)
        self.assertEqual(self.stock.get_price(), 1000)

    def test_string_representation(self):
        string_repr = self.stock.__str__()
        self.assertEqual(string_repr, "{'name': 'CreamCheeseCompany', 'id': 0}")


class StockCoinTestCase(TestCase):
    def setUp(self):
        self.coin = StockCoin(name="CreamCheeseCompany", stock_id=0, price=1000, amount=5,
                              purchase_log=[(datetime(year=2020, month=1, day=1), 5)],
                              sell_log=[], avg_purchase_price=1000)

    def test_coin_creation(self):
        coin_fields = self.coin.__dict__.keys()
        print(coin_fields)
        self.assertIn('_Stock__name', coin_fields)
        self.assertIn('_Stock__stock_id', coin_fields)
        self.assertIn('_Stock__price', coin_fields)
        self.assertIn('_StockCoin__amount', coin_fields)
        self.assertIn('purchase_log', coin_fields)
        self.assertIn('sell_log', coin_fields)
        self.assertIn('avg_purchase_price', coin_fields)

    def test_get_amount(self):
        self.assertEqual(self.coin.get_amount(), 5)

    def test_sell_stock(self):
        transaction = (datetime(year=2020, month=2, day=1), 1)
        self.coin.sell_coin(date_time=transaction[0], amount=transaction[1])
        self.assertEqual(self.coin.get_amount(), 4)
        self.assertIn(transaction, self.coin.sell_log)

    def test_purchase_stock(self):
        transaction = (datetime(year=2020, month=3, day=1), 2)
        self.coin.purchase_coin(date_time=transaction[0], amount=transaction[1])
        self.assertEqual(self.coin.get_amount(), 7)
        self.assertIn(transaction, self.coin.purchase_log)

    def test_fix_avg_purchase_price(self):
        transaction = (datetime(year=2020, month=3, day=1), 2)
        self.coin.set_price(650)
        self.coin.fix_avg_purchase_price(650, transaction[1])
        self.coin.purchase_coin(date_time=transaction[0], amount=transaction[1])
        self.assertEqual(self.coin.avg_purchase_price, 900)

    def test_checking_consistency(self):
        sell_tx = (datetime(year=2020, month=2, day=1), 1)
        self.coin.sell_coin(date_time=sell_tx[0], amount=sell_tx[1])
        purchase_tx = (datetime(year=2020, month=3, day=1), 2)
        self.coin.purchase_coin(date_time=purchase_tx[0], amount=purchase_tx[1])
        self.assertEqual(self.coin.check_consistency(), True)

    def test_string_representation(self):
        string_repr = self.coin.__str__()
        self.assertIn("'name': 'CreamCheeseCompany'", string_repr)