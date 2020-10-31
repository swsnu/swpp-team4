"""stock_data.py"""
from django.db import models


class StockData(models.Model):
    date = models.DateField()  # 해당 데이터 생성일자
    code = models.CharField(max_length=10)  # 종목코드
    code_name = models.CharField(max_length=50)  # 종목명 e.g) 삼성전자
    d1_diff_rate = models.DecimalField(max_digits=6, decimal_places=3) # 전날 대비 종가 상승률
    close = models.IntegerField()
    open = models.IntegerField()
    high = models.IntegerField()
    low = models.IntegerField()
    volume = models.IntegerField()
    clo5 = models.IntegerField()
    clo10 = models.IntegerField()
    clo20 = models.IntegerField()
    clo40 = models.IntegerField()
    clo60 = models.IntegerField()
    clo80 = models.IntegerField()
    clo100 = models.IntegerField()
    clo120 = models.IntegerField()
    clo5_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)
    clo10_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)
    clo20_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)
    clo40_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)
    clo60_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)
    clo80_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)
    clo100_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)
    clo120_diff_rate = models.DecimalField(max_digits=6, decimal_places=3)
    yes_clo_5 = models.IntegerField()
    yes_clo_10 = models.IntegerField()
    yes_clo_20 = models.IntegerField()
    yes_clo_40 = models.IntegerField()
    yes_clo_60 = models.IntegerField()
    yes_clo_80 = models.IntegerField()
    yes_clo_100 = models.IntegerField()
    yes_clo_120 = models.IntegerField()
    vol5 = models.IntegerField()
    vol10 = models.IntegerField()
    vol20 = models.IntegerField()
    vol40 = models.IntegerField()
    vol60 = models.IntegerField()
    vol80 = models.IntegerField()
    vol100 = models.IntegerField()
    vol120 = models.IntegerField()

    class Meta:
        """Table Meta"""
        db_table = 'stock_data'  # Table 이름
        ordering = ['-pk']  # Default Order