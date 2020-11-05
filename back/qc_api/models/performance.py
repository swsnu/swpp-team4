from django.db import models
from django.contrib.auth.models import User


class Performance(models.Model):
    # algorithm = models.ForeignKey()
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="+",
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField()

    # statistics
    alpha = models.FloatField()
    profit = models.FloatField()
    MDD = models.FloatField()
    deposit = models.IntegerField()
    curr_portfolio = models.TextField()
    max_min_dict = models.TextField()
    profit_dict = models.TextField()