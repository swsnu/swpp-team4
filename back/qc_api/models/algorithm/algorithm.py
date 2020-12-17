"""
    Algorithm Model
"""
# pylint: disable=E5142
from django.db import models
from django.contrib.auth.models import User
from .snippet import SnippetBuy, SnippetScope, SnippetSell, SnippetAmount


class Algorithm(models.Model):
    """
        Model for algorithm
    """
    name = models.TextField()
    description = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='algorithms',
        null=True
    )
    is_public = models.BooleanField(default=False)
    snippet_scope = models.ForeignKey(
        SnippetScope,
        on_delete=models.CASCADE,
        related_name='algorithms'
    )
    snippet_sell = models.ForeignKey(
        SnippetSell,
        on_delete=models.CASCADE,
        related_name='algorithms'
    )
    snippet_buy = models.ForeignKey(
        SnippetBuy,
        on_delete=models.CASCADE,
        related_name='algorithms'
    )
    snippet_amount = models.ForeignKey(
        SnippetAmount,
        on_delete=models.CASCADE,
        related_name='algorithms'
    )

    variables = models.TextField()
    optimization = models.TextField(default="none")
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'algorithm'
