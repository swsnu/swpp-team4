from unittest.mock import patch

from django.test import TestCase
from datetime import datetime
from qc_api.lib import Stock, StockCoin, Wallet


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
                              purchase_log=[(datetime(year=2020, month=1, day=1), 1000, 5)],
                              sell_log=[], avg_purchase_price=1000)

    def test_create_invalid_coin(self):
        with self.assertRaises(ValueError):
            StockCoin(name="CreamCheeseCompany", stock_id=0, price=1000, amount=5,
                      purchase_log=[], sell_log=[], avg_purchase_price=1000)

    def test_create_valid_coin(self):
        self.assertEqual(self.coin.get_id(), 0)
        self.assertEqual(self.coin.get_name(), "CreamCheeseCompany")

    def test_get_amount(self):
        self.assertEqual(self.coin.get_amount(), 5)

    def test_sell_stock(self):
        transaction = (datetime(year=2020, month=2, day=1), self.coin.get_price(), 1)
        result = self.coin.sell_coin(date_time=transaction[0], amount=transaction[2])
        self.assertEqual(self.coin.get_amount(), 4)
        self.assertEqual(result, True)
        self.assertIn(transaction, self.coin.get_sell_log())

    def test_sell_invalid_stock(self):
        transaction = (datetime(year=2020, month=2, day=1), self.coin.get_price(), 6)
        result = self.coin.sell_coin(date_time=transaction[0], amount=transaction[2])
        self.assertEqual(self.coin.get_amount(), 5)
        self.assertEqual(result, False)
        self.assertNotIn(transaction, self.coin.get_sell_log())

    def test_purchase_stock(self):
        transaction = (datetime(year=2020, month=3, day=1), self.coin.get_price(), 2)
        self.coin.purchase_coin(date_time=transaction[0], amount=transaction[2])
        self.assertEqual(self.coin.get_amount(), 7)
        self.assertIn(transaction, self.coin.get_purchase_log())

    @patch('qc_api.lib.StockCoin.check_consistency')
    def test_purchase_invalid_stock(self, mock_check_consistency):
        mock_check_consistency.return_value = False
        transaction = (datetime(year=2020, month=3, day=1), self.coin.get_price(), 0)
        result = self.coin.purchase_coin(date_time=transaction[0], amount=transaction[2])
        self.assertEqual(result, False)

    def test_fix_avg_purchase_price(self):
        transaction = (datetime(year=2020, month=3, day=1), 2)
        self.coin.set_price(650)
        self.coin.purchase_coin(date_time=transaction[0], amount=transaction[1])
        self.assertEqual(self.coin.get_avg_purchase_price(), 900)

    def test_checking_consistency(self):
        sell_tx = (datetime(year=2020, month=2, day=1), 1)
        self.coin.sell_coin(date_time=sell_tx[0], amount=sell_tx[1])
        purchase_tx = (datetime(year=2020, month=3, day=1), 2)
        self.coin.purchase_coin(date_time=purchase_tx[0], amount=purchase_tx[1])
        self.assertEqual(self.coin.check_consistency(), True)

    def test_string_representation(self):
        string_repr = self.coin.__str__()
        self.assertIn("'name': 'CreamCheeseCompany'", string_repr)


class WalletTestCase(TestCase):
    def setUp(self):
        self.stock = Stock(name="CreamCheeseCompany", stock_id=0, price=1000)
        self.coin = StockCoin(name="CreamCheeseCompany", stock_id=0, price=1000, amount=5,
                              purchase_log=[(datetime(year=2020, month=1, day=1), 1000, 5)],
                              sell_log=[], avg_purchase_price=1000)
        self.wallet = Wallet(budget=10000, stock_id_to_coin={0: self.coin})
        return

    def test_create_empty_wallet(self):
        empty_wallet = Wallet(budget=10000)
        wallet_fields = empty_wallet.__dict__.keys()
        self.assertIn('_Wallet__budget', wallet_fields)
        self.assertEqual(empty_wallet.get_coins(), list())

    def test_create_filled_wallet(self):
        self.assertEqual(self.wallet.get_coins(), [self.coin])

    def test_get_budget(self):
        self.assertEqual(self.wallet.get_budget(), 10000)

    def test_get_initial_asset(self):
        self.assertEqual(self.wallet.get_initial_asset(), 10000)

    def test_get_coins_simple(self):
        self.assertEqual(self.wallet.get_coins_simple(), [0])

    def test_get_coins(self):
        self.assertEqual(self.wallet.get_coins(), [self.coin])

    def test_handle_new_coin(self):
        new_coin = StockCoin(name="MonsterCookie", stock_id=1, price=500, amount=1,
                             purchase_log=[(datetime(year=2020, month=1, day=1), 500, 1)],
                             sell_log=[], avg_purchase_price=500)
        self.wallet._Wallet__handle_new_coin(new_coin)
        self.assertIn(new_coin, self.wallet.get_coins())

    def test_handle_deleted_coin(self):
        self.wallet._Wallet__handle_deleted_coin(0)
        self.assertEqual(self.wallet.get_coins(), [])

    def test_sell_coin(self):
        result = self.wallet.sell_coin(self.stock, 3, datetime(year=2020, month=2, day=1))
        self.assertEqual(result, True)

    def test_sell_coin_exceedingly(self):
        result = self.wallet.sell_coin(self.stock, 6, datetime(year=2020, month=2, day=1))
        self.assertEqual(result, False)

    def test_sell_nonexisting_coin(self):
        stock = Stock(name="MonsterCookie", stock_id=1, price=500)
        result = self.wallet.sell_coin(stock, 1, datetime(year=2020, month=2, day=1))
        self.assertEqual(result, False)

    @patch('qc_api.lib.Wallet._Wallet__handle_deleted_coin')
    def test_sell_all_coins(self, mock_delete):
        before_budget = self.wallet.get_budget()
        self.wallet.sell_coin(self.stock, 5, datetime(year=2020, month=2, day=1))
        self.assertEqual(self.wallet.get_budget(), before_budget + 5000)
        self.assertTrue(mock_delete.called)

    def test_get_summaries(self):
        self.assertIn("cash", self.wallet.get_summaries().keys())

    def test_get_profit(self):
        self.assertEqual(self.wallet.get_profit(), 150.0)

    def test_get_tx_log(self):
        date = datetime(year=2020, month=1, day=1)
        tx_log = self.wallet.get_transaction_log(date)
        self.assertEqual(datetime.strptime(tx_log['date'], "%Y-%m-%d %H:%M:%S"), date)

    def test_string_representation(self):
        string_repr = self.wallet.__str__()
        self.assertEqual(string_repr, f'{self.wallet.__repr__()}')