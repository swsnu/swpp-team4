"""
Utils to inject stock data into database
"""

import datetime
import os

import django
import numpy as np
import pandas as pd

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qc_back.settings')
django.setup()

from qc_api.models import Kospi, Kosdaq, StockData


def kospi_to_db(chunk) -> None:
    """
    Helper function to inject kospi data to database
    Parameters:
        chunk:
    """
    bulk_list = []
    for row in chunk:
        bulk_list.append(Kospi(
            date=row[0],
            close=float(row[1]),
            open=float(row[2]),
            high=float(row[3]),
            low=float(row[4]),
            volume=float(row[5]),
            d1_diff_rate=float(row[6])
        ))
    Kospi.objects.bulk_create(bulk_list)


def kosdaq_to_db(chunk) -> None:
    """
    Helper function to inject kosdaq data to database
    Parameters:
        chunk:
    """
    bulk_list = []
    for row in chunk:
        bulk_list.append(Kosdaq(
            date=row[0],
            close=float(row[1]),
            open=float(row[2]),
            high=float(row[3]),
            low=float(row[4]),
            volume=float(row[5]),
            d1_diff_rate=float(row[6])
        ))
    Kosdaq.objects.bulk_create(bulk_list)


def insert_into_sql(chunk) -> None:
    """
    Helper function to inject other data to sqlite
    Parameters:
        chunk:
    """
    print("hello world!")
    bulk_list = []
    for row in chunk:
        bulk_list.append(StockData(
            date=str(row[0])[0:4] + '-' + str(row[0])[4:6] + '-' + str(row[0])[6:8],
            code=row[1],
            code_name=row[2],
            d1_diff_rate=row[3],
            close=row[4],
            open=row[5],
            high=row[6],
            low=row[7],
            volume=row[8],
            clo5=row[9],
            clo10=row[10],
            clo20=row[11],
            clo40=row[12],
            clo60=row[13],
            clo80=row[14],
            clo100=row[15],
            clo120=row[16],
            clo5_diff_rate=row[17],
            clo10_diff_rate=row[18],
            clo20_diff_rate=row[19],
            clo40_diff_rate=row[20],
            clo60_diff_rate=row[21],
            clo80_diff_rate=row[22],
            clo100_diff_rate=row[23],
            clo120_diff_rate=row[24],
            yes_clo_5=row[25],
            yes_clo_10=row[26],
            yes_clo_20=row[27],
            yes_clo_40=row[28],
            yes_clo_60=row[29],
            yes_clo_80=row[30],
            yes_clo_100=row[31],
            yes_clo_120=row[32],
            vol5=row[33],
            vol10=row[34],
            vol20=row[35],
            vol40=row[36],
            vol60=row[37],
            vol80=row[38],
            vol100=row[39],
            vol120=row[40],
        ))
    StockData.objects.bulk_create(bulk_list)


def run(chunk_size) -> None:
    """
    Insert stock data into the database
    Parameters:
        chunk_size
    """
    _input = str(input("enter the file name from which the data will be fetched: "))
    _to = str(input("enter the db table name to which the fetched data will be injected: "))
    if _to in ('kospi', 'kosdaq'):
        for chunk in pd.read_csv(_input,chunksize=chunk_size, header=0,
                                 names=['date', 'close', 'open', 'high',
                                        'low', 'volume', 'd1_diff_rate']):

            chunk['volume'] = (chunk['volume'].replace(r'[MB]+$', '', regex=True).astype(float) *
                               chunk['volume'].str.extract(r'[\d\.]+([MB]+)', expand=False)
                               .fillna(1)
                               .replace(['M', 'B'], [1, 10 ** 3]).astype(float))  # 1 Million as an unit

            for column in ['close', 'open', 'high', 'low']:
                if chunk.dtypes[f'{column}'] == np.object:
                    chunk[f'{column}'] = chunk[f'{column}'].apply(lambda x: x.replace(',', ''))
            chunk['date'] = chunk['date'].apply(lambda x: datetime.datetime.strptime(x, '%b %d, %Y'))

            if _to == 'kospi':
                print(chunk.to_numpy())
                kospi_to_db(chunk.to_numpy())
            else:
                print(chunk.to_numpy())
                kosdaq_to_db(chunk.to_numpy())
    else:
        for chunk in pd.read_csv(_input, chunksize=chunk_size, header=1):
            print(chunk.to_numpy())
            insert_into_sql(chunk.to_numpy())


run(100)
