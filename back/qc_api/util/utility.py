""" Utility class and methods"""
from datetime import datetime


def parse_date(date_str: str) -> datetime:
    """Parse dateString into dateTime"""
    return datetime.strptime(date_str, '%Y-%m-%d')


stock_data_columns = ['date',
           'code', 'code_name', 'd1_diff_rate', 'close', 'open',
           'high', 'low',
           'volume',
           'clo5', 'clo10', 'clo20', 'clo40', 'clo60', 'clo80',
           'clo100', 'clo120',
           "clo5_diff_rate", "clo10_diff_rate", "clo20_diff_rate",
           "clo40_diff_rate", "clo60_diff_rate",
           "clo80_diff_rate", "clo100_diff_rate",
           "clo120_diff_rate",
           'yes_clo_5', 'yes_clo_10', 'yes_clo_20', 'yes_clo_40',
           'yes_clo_60',
           'yes_clo_80',
           'yes_clo_100', 'yes_clo_120',
           'vol5', 'vol10', 'vol20', 'vol40', 'vol60', 'vol80',
           'vol100', 'vol120']
