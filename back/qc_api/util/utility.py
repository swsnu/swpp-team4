""" Utility class and methods"""
from datetime import datetime


def parse_date(date_str: str) -> datetime:
    """Parse dateString into dateTime"""
    return datetime.strptime(date_str, '%Y-%m-%d')
