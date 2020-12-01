""" Performance Model """
from django.db import models

from qc_api.models import Algorithm


class Performance(models.Model):
    """
    TODO: one model per algorithm.
    Performance model to store the daily simulation result.
    """
    algorithm = models.OneToOneField(
        Algorithm,
        on_delete=models.CASCADE,
        related_name="performances",
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # statistics
    alpha = models.FloatField()
    profit = models.FloatField(default=None, blank=True, null=True)
    MDD = models.FloatField(default=None, blank=True, null=True)
    deposit = models.IntegerField(default=None, blank=True, null=True)
    curr_portfolio = models.TextField(default=None, blank=True, null=True)
    max_min_dict = models.TextField(default=None, blank=True, null=True)
    profit_dict = models.TextField(default=None, blank=True, null=True)
