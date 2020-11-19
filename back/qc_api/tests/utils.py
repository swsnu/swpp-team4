""" Mocking functions for tests. """
import json

from django.contrib.auth.models import User
from django.test import Client

from qc_api.models import Algorithm
from qc_api.models.algorithm.snippet import Snippet, SnippetScope, SnippetBuy, SnippetSell, SnippetAmount
from qc_api.util.utility import SnippetType


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
        snippet = SnippetScope.objects.create(name=snippet_type, code=snippet_type)
    elif snippet_type == SnippetType.BUY:
        snippet = SnippetBuy.objects.create(name=snippet_type, code=snippet_type)
    elif snippet_type == SnippetType.SELL:
        snippet = SnippetSell.objects.create(name=snippet_type, code=snippet_type)
    else:
        snippet = SnippetAmount.objects.create(name=snippet_type, code=snippet_type)
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
