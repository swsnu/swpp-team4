"""userspace.py"""
import pandas as pd

from datetime import date
from typing import List, Dict, Any, Union
from .wallet.stock import Stock


class UserSpace:
    """UserSpace class for predefined set of APIs for qc backtest variables"""

    def __init__(self, universe: pd.DataFrame, today: date) -> None:
        """
        Initializes UserSpace class
        attributes:
            store - stock related values from previous dates of backtest for later use
        """
        self.__universe = universe
        self.__today = today
        # self.__store = None

    def query(self, query_string: str) -> List[Stock]:
        pass
