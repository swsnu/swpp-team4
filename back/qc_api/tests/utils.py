""" Mocking functions for tests. """
# pylint: disable=E5142
import json
import os

from django.contrib.auth.models import User
from django.test import Client

import default_dataset_seeder
from qc_api.models import Algorithm
from qc_api.models.algorithm.snippet import Snippet, SnippetScope, SnippetBuy, SnippetSell, SnippetAmount
from qc_api.util.utility import SnippetType, parse_date

mock_algo_ser_data = {
    "snippet_scope_data": {
        'code': "scope = list(map(lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[4]), "
                "universe.query('(volume >5000000)').to_numpy()))"
    },
    'snippet_buy_data': {
        'code': "for index, candidate in enumerate(scope):"
                "\n\tif index==0:"
                "\n\t\tchosen_stocks.append(candidate)"
                "\n\t\tbreak "
    },
    'snippet_sell_data': {
        'code': "for candidate in sell_candidates:"
                "\n\tif (universe.loc[universe['code'] == str(int(candidate.get_id()))].iloc[0]['close'])"
                "/candidate.get_avg_purchase_price()-1>0.05:"
                "\n\t\tchosen_stocks.append(candidate) "
    },
    'snippet_amount_data': {
        'code': "if opt == SnippetType.BUY:"
                "\n\tfor stock in chosen_stocks:"
                "\n\t\tbuy_amount_list.append((stock, 1))" +
                "\nelse:"
                "\n\tfor stock in chosen_stocks:"
                "\n\t\tsell_amount_list.append((stock, stock.get_amount()))"
    }
}


def get_signed_up_user(username: str, password: str) -> User:
    """
    Creates an user object with the given username and password, saves it in the db, and returns it.
    Parameters:
        username: user mame string
        password: password string
    Returns:
        User object which is signed-up to the service, but not yet logged-in.
    """
    user = User.objects.create(username=username)
    user.set_password(password)
    user.save()
    return user


def get_signed_in_client(username: str, password: str) -> Client:
    """
    Creates a user with given username and password, saves the user in database,
    and returns a client which is logged-in as that user.
    Parameters:
        username: user mame string
        password: password string
    Returns:
        Signed-in client object
    """
    get_signed_up_user(username, password)
    client = Client()
    client.post('/api/sign_in',
                json.dumps({'username': username, 'password': password}),
                content_type='application/json')
    return client


def get_mock_snippet(snippet_type: SnippetType) -> Snippet:
    """
    Given a snippet type, returns a snippet object
    Parameters:
        snippet_type: Snippet Type as enum
    Returns:
        Snippet object
    """
    if snippet_type == SnippetType.SCOPE:
        snippet = SnippetScope.objects.create(name=snippet_type, code=mock_algo_ser_data["snippet_scope_data"]["code"])
    elif snippet_type == SnippetType.BUY:
        snippet = SnippetBuy.objects.create(name=snippet_type, code=mock_algo_ser_data["snippet_buy_data"]["code"])
    elif snippet_type == SnippetType.SELL:
        snippet = SnippetSell.objects.create(name=snippet_type, code=mock_algo_ser_data["snippet_sell_data"]["code"])
    else:
        snippet = SnippetAmount.objects.create(name=snippet_type,
                                               code=mock_algo_ser_data["snippet_amount_data"]["code"])
    return snippet


def get_mock_algo(name: str, public: bool = False) -> Algorithm:
    """
    Returns:
        algo: Algorithm model object.
    """
    scope = get_mock_snippet(SnippetType.SCOPE)
    buy = get_mock_snippet(SnippetType.BUY)
    sell = get_mock_snippet(SnippetType.SELL)
    amount = get_mock_snippet(SnippetType.AMOUNT)
    algo = Algorithm.objects.create(name=name, snippet_scope=scope, snippet_buy=buy,
                                    snippet_sell=sell, snippet_amount=amount, is_public=public)
    return algo


def seed_stock_data() -> None:
    """
    Seeds KOSPI, KOSDAQ and STOCK_DATA objects into Test DB (period set to 2020-01-03 ~ 2020-01-10)
    """
    dir_path = f"{os.getcwd()}/qc_api/tests/seed/"
    default_dataset_seeder.run(100, f"{dir_path}seed_kospi.csv",
                               "kospi", parse_date('2020-1-3'), parse_date('2020-1-10'))
    default_dataset_seeder.run(100, f"{dir_path}seed_kosdaq.csv",
                               "kosdaq", parse_date('2020-1-3'), parse_date('2020-1-10'))
    default_dataset_seeder.run(100, f"{dir_path}seed_stock_data.csv",
                               "stock", parse_date('2020-1-3'), parse_date('2020-1-10'))
