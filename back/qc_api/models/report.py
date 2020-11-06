""" Report model for saving backtest result """
from django.db import models


class Report(models.Model):
    """
    Model for reporting backtest status
    """
    class BackTestStatus(models.TextChoices):
        PENDING = 'PEND'  # , _('Pending')
        EXECUTING = 'EXEC'  # , _('Executing')
        DONE = 'DONE'  # , _('Done')
        FAILED = 'FAIL'  # , _('Failed')
        CANCELED = 'QUIT'  # , _('Canceled')

    def has_started(self):  # dummy method to show usage
        """
        Returns:
            true if the status of backtest is not PENDING
        """
        return self.status != self.BackTestStatus.PENDING

    # algorithm = models.ForeignKey()

    # statistics
    alpha = models.FloatField()
    profit = models.FloatField()
    MDD = models.FloatField()
    optional_stat = models.TextField()

    # backtest settings
    created_at = models.DateTimeField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    transaction_log = models.TextField()
    initial_budget = models.IntegerField()

    # status
    status = models.CharField(
        max_length=4,
        choices=BackTestStatus.choices,
        default=BackTestStatus.PENDING,
    )

    def __str__(self):  # dummy
        return "report"
