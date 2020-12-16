"""
Snippet Library
"""
# pylint: disable=E5142
from polymorphic.models import PolymorphicModel
from django.db import models
from django.contrib.auth.models import User


class Snippet(PolymorphicModel):
    """
    Base library for snippet.
    """
    code = models.TextField()
    name = models.TextField()
    description = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='snippets',
        null=True
    )
    liker = models.ManyToManyField(
        User,
        related_name='liked_snippets'
    )
    type = models.CharField(max_length=10)
    variables = models.TextField()
    is_shared = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)


class SnippetScope(Snippet):
    """
    First snippet: Decide scope of stocks to trade
    """
    class Meta:
        db_table = 'snippet_scope'


class SnippetBuy(Snippet):
    """
    Second snippet: Decide what to buy
    """
    class Meta:
        db_table = 'snippet_buy'


class SnippetSell(Snippet):
    """
    Third snippet: Decide what to sell
    """
    class Meta:
        db_table = 'snippet_sell'


class SnippetAmount(Snippet):
    """
    Fourth snippet: Decide trade amount
    """
    class Meta:
        db_table = 'snippet_amount'
