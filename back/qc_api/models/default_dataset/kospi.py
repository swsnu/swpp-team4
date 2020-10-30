"""kospi.py"""
from django.db import models


class Kospi(models.Model):
    date = models.DateField()  # 해당 데이터 생성일자
    close = models.DecimalField(max_digits=8, decimal_places=3)
    open = models.DecimalField(max_digits=8, decimal_places=3)
    high = models.DecimalField(max_digits=8, decimal_places=3)
    low = models.DecimalField(max_digits=8, decimal_places=3)
    volume = models.FloatField()
    d1_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)

    class Meta:
        """Table Meta"""
        db_table = 'kospi'  # Table 이름
        ordering = ['-pk']  # Default Order
