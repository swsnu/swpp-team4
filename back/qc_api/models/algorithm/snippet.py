from polymorphic.models import PolymorphicModel
from django.db import models
from django.contrib.auth.models import User


class Snippet(PolymorphicModel):
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
    is_shared = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)


class SnippetScope(Snippet):
    class Meta:
        db_table = 'snippet_scope'


class SnippetBuy(Snippet):
    class Meta:
        db_table = 'snippet_buy'


class SnippetSell(Snippet):
    class Meta:
        db_table = 'snippet_sell'


class SnippetAmount(Snippet):
    class Meta:
        db_table = 'snippet_amount'
