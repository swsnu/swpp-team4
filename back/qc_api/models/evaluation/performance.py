""" Performance Model """
from django.db import models
from django.contrib.auth.models import User
from qc_api.models import Algorithm


class Performance(models.Model):
    """
    Performance model to store the daily simulation result.
    """
    algorithm = models.ForeignKey(
        Algorithm,
        on_delete=models.CASCADE,
        related_name="performances",
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="performances",
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
