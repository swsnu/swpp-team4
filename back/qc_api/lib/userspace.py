"""userspace.py"""
import pandas as pd

from datetime import date
from typing import List, Dict, Any, Union
from .wallet.stock import Stock


class UserSpace:
    """UserSpace class for predefined set of APIs for qc backtest variables"""

    def __init__(self, universe: pd.DataFrame, today: date, variables: List[str]) -> None:
        """
        Initializes UserSpace class
        attributes:
            store - stock related values from previous dates of backtest for later use
        """
        self.__universe = universe
        self.__today = today
        self.__variables = variables
        # self.__store = None

    @staticmethod
    def query(universe: pd.DataFrame, query_string: str) -> List[Stock]:
        scope = list(map(
            lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[3]),
            universe.query(query_string).to_numpy()
        ))
        print("debug!!!!!")
        print([(stock.get_id(), stock.get_name(), stock.get_price()) for stock in scope])
        return scope
