"""
Utils to inject stock data into database
"""
# pylint: disable=W0511, C0413, W9016, W9012, W0613,
import datetime
import os

import django
import numpy as np
import pandas as pd

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qc_back.settings')
django.setup()

from qc_api.models import Kospi, Kosdaq, StockData

LIB_DIR = f"{os.getcwd()}/static/"


def kospi_to_db(chunk):
    """
    Helper function to inject kospi data to database
    Parameters:
        chunk: db fragments to process.
    Returns:
        chunk of Kospi Objects
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
    return bulk_list


def kosdaq_to_db(chunk):
    """
    Helper function to inject kosdaq data to database
    Parameters:
        chunk: db fragments to process.
    Returns:
        chunk of Kosdaq objects.
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
    return bulk_list


def insert_into_sql(chunk):
    """
    Helper function to inject other data to sqlite
    Parameters:
        chunk: db fragments
    Returns:
        chunk of Stock objects.
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
    return bulk_list


def seed_kospi_or_kosdaq(name, stock_type, chunk_size, start=None, end=None):
    """
    seed kospi and kosdaq data to DB.
    Parameters:
        name: Name of the csv file
        stock_type: either kospi or kosdaq
        chunk_size: size to process the data at one time
        start: starting date of the data to process. If None, start from the first line of the data
        end: ending date of the data to process. If None, finish at the end line of the data.
    Returns:
        parsed data objects.
    """
    objects = []
    for chunk in pd.read_csv(name, chunksize=chunk_size, header=0,
                             names=['date', 'close', 'open', 'high', 'low', 'volume', 'd1_diff_rate']):

        chunk['volume'] = (chunk['volume'].replace(r'[MB]+$', '', regex=True).astype(float) *
                           chunk['volume'].str.extract(r'[\d\.]+([MB]+)', expand=False)
                           .fillna(1)
                           .replace(['M', 'B'], [1, 10 ** 3]).astype(float))  # 1 Million as an unit

        for column in ['close', 'open', 'high', 'low']:
            if chunk.dtypes[f'{column}'] == np.object:
                chunk[f'{column}'] = chunk[f'{column}'].apply(lambda x: x.replace(',', ''))
        chunk['date'] = chunk['date'].apply(lambda x: datetime.datetime.strptime(x, '%b %d, %Y'))

        chunk_as_mat = chunk.to_numpy()
        print(chunk_as_mat[-1][0], chunk_as_mat[0][0])
        # TODO. convert timestamp to datetime
        #  if start is not None and chunk_as_mat[-1][0] < start:
        #      continue
        #  if end is not None and chunk_as_mat[0][0] > end:
        #      break

        if stock_type == 'kospi':
            print(chunk.to_numpy())
            objects += kospi_to_db(chunk.to_numpy())
        else:
            print(chunk.to_numpy())
            objects += kosdaq_to_db(chunk.to_numpy())
    return objects


def seed_other_dataset(name: str, chunk_size: int, start=None, end=None):
    """
    seed other data to DB.
    Parameters:
        name: Name of the csv file
        chunk_size: size to process the data at one time
        start: starting date of the data to process. If None, start from the first line of the data
        end: ending date of the data to process. If None, finish at the end line of the data.
    Returns:
        parsed data objects.
    """
    objects = []
    for chunk in pd.read_csv(name, chunksize=chunk_size, header=1):
        chunk_as_mat = chunk.to_numpy()
        chunk_start = datetime.datetime.strptime(str(chunk_as_mat[0][0]), "%Y%m%d")
        chunk_end = datetime.datetime.strptime(str(chunk_as_mat[-1][0]), "%Y%m%d")
        if start is not None and start > chunk_end:
            continue
        if end is not None and end < chunk_start:
            break
        # print(chunk.to_numpy())
        objects += insert_into_sql(chunk.to_numpy())
    return objects


def run(chunk_size: int, path: str, name: str, start=None, end=None):
    """
    Insert stock data into the database
    Parameters:
        chunk_size: size to process at once.
        path: path to the file.
        name: identifier of the file. For now, it supports 'kospi', and 'kosdaq'
        start: Beginning date of the queried result. If None, it starts from the beginning of the file.
        end: Ending date of the queired result. If None, it processes until the end of the file.
    Returns:
        parsed result.
    """
    # _input = str(input("enter the file name from which the data will be fetched: ")) -> path
    # _to = str(input("enter the db table name to which the fetched data will be injected: ")) -> name
    if name in ('kospi', 'kosdaq'):
        result = seed_kospi_or_kosdaq(name=path, stock_type=name, chunk_size=chunk_size, start=start, end=end)
    else:
        result = seed_other_dataset(name=path, chunk_size=chunk_size, start=start, end=end)

    return result
# run(100)
