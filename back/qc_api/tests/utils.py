from enum import Enum
from django.test import Client

import json

from qc_api.models import Algorithm
from qc_api.models.algorithm.snippet import *


class SnippetType(Enum):
    SCOPE = 1
    SELL = 2
    BUY = 3
    AMOUNT = 4


def get_signed_in_client() -> Client:
    client = Client()
    client.post('/api/sign_in',
                json.dumps({'username': 'user', 'password': "pwd"}),
                content_type='application/json')
    return client


def get_signed_in_user(userId: int) -> User:
    user1 = User.objects.create(username=f"user_{userId}")
    user1.set_password(f'pwd_{userId}')
    user1.save()

    client = Client()
    client.post('/api/sign_in',
                json.dumps({'username': f'user_{userId}', 'password': f"pwd_{userId}"}),
                content_type='application/json')
    return user1


def get_unsigned_in_user(userId: int) -> User:
    user1 = User.objects.create(username=f"user_{userId}")
    user1.set_password(f'pwd_{userId}')
    user1.save()
    return user1


def get_mock_snippet(snippet_type: SnippetType) -> Snippet:
    if snippet_type == SnippetType.SCOPE:
        snippet = SnippetScope.objects.create(name=snippet_type, code=snippet_type)
    elif snippet_type == SnippetType.BUY:
        snippet = SnippetBuy.objects.create(name=snippet_type, code=snippet_type)
    elif snippet_type == SnippetType.SELL:
        snippet = SnippetSell.objects.create(name=snippet_type, code=snippet_type)
    else:
        snippet = SnippetAmount.objects.create(name=snippet_type, code=snippet_type)
    return snippet


def get_mock_algo() -> Algorithm:
    scope = get_mock_snippet(SnippetType.SCOPE)
    buy = get_mock_snippet(SnippetType.BUY)
    sell = get_mock_snippet(SnippetType.SELL)
    amount = get_mock_snippet(SnippetType.AMOUNT)
    algo = Algorithm.objects.create(name="algo", snippet_scope=scope, snippet_buy=buy,
                                    snippet_sell=sell, snippet_amount=amount)
    return algo
