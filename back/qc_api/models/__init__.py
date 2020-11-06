"""
Models for qc_api
"""
from django.contrib.auth.models import User

from .algorithm.snippet import Snippet, SnippetAmount, SnippetBuy, SnippetScope, SnippetSell
from .default_dataset.kosdaq import Kosdaq
from .default_dataset.kospi import Kospi
from .default_dataset.stock_data import StockData
