""" Report model for saving backtest result """
from django.db import models
from qc_api.models.algorithm.algorithm import Algorithm


class Report(models.Model):
    """
    Model for reporting backtest status
    """
    class BackTestStatus(models.TextChoices):
        """
        Enum class for backtest status.
        """
        PENDING = 'PEND'  # , _('Pending')
        EXECUTING = 'EXEC'  # , _('Executing')
        DONE = 'DONE'  # , _('Done')
        FAILED = 'FAIL'  # , _('Failed')
        CANCELED = 'QUIT'  # , _('Canceled')

    def has_started(self):  # dummy method to show usage
        """
        Returns:
            bool: true if the status of backtest is not PENDING
        """
        return self.status != self.BackTestStatus.PENDING

    algorithm = models.ForeignKey(
        Algorithm,
        on_delete=models.CASCADE,
        related_name="reports",
    )

    # statistics
    alpha = models.FloatField(default=None, blank=True, null=True)
    profit = models.FloatField(default=None, blank=True, null=True)
    MDD = models.FloatField(default=None, blank=True, null=True)
    optional_stat = models.TextField(default=None, blank=True, null=True)

    # backtest settings
    created_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    daily_profit = models.TextField()
    transaction_log = models.TextField()
    initial_budget = models.IntegerField()

    # status
    status = models.CharField(
        max_length=4,
        choices=BackTestStatus.choices,
        default=BackTestStatus.PENDING,
    )

