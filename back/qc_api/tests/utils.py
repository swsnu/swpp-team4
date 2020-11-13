from enum import Enum
from qc_api.models import Algorithm
from qc_api.models.algorithm.snippet import *


class SnippetType(Enum):
    SCOPE = 1
    SELL = 2
    BUY = 3
    AMOUNT = 4


def get_signined_user() -> User:
    user = User.objects.create()
    user.save()
    return user


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
