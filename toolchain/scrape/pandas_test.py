#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import os
import sys
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
"""
rootdir should be
/Users/user/PycharmProjects/Angular4OnFlaskSkeleton
"""
print(rootdir)
sys.path.append(rootdir)
import pandas as pd


"""
簡単なスクレイピングのテストコード。
BeautifulSoup4で
"""

from app.models.mongofunc import get_mongo_database

from bs4 import BeautifulSoup
import requests
import requests_cache
requests_cache.install_cache()


def mongo_to_dataframe(db_name, collection, query={}, host='localhost', port=27017, username=None, password=None, no_id=True):
    db = get_mongo_database(db_name, host, port, username, password)

    cursor = db[collection].find(query)

    df = pd.DataFrame(list(cursor))

    if no_id:
        del df['_id']

    return df

def dataframe_to_mongo(df, db_name, collection, host='localhost', port=27017, username=None, password=None):
    db = get_mongo_database(db_name, host, port, username, password)
    records = pd.DataFrame.to_dict('records')
    db[collection].insert(records)


