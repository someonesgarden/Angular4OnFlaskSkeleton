#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import sys
import os
import time
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(rootdir)
import pymongo
import pandas as pd
import numpy as np
from app.models.mongofunc import save_to_mongodb, get_mongo_database, mongo_to_dataframe, dataframe_to_mongo
import json


# 1)# ScrapyでスクレイプしたJSONデータをMONGOに保存する
df = pd.read_json(open(rootdir+'/app/static/data/nobel_winners_full.json')) # jsonから直接データフレームを作る場合


# print(df.describe())
# print(df.info())
# print(df.head())
# print(df.columns)
# df = df.set_index('name')
# print(df.head(2))
# df.reset_index(inplace=True)

# bi_col = df.born_in
# print(bi_col)
# print(type(bi_col))

# 3) Data Clearning Function

def clean_data(df):
    print("..start cleaning..")
    """The full clean data function, which returns both the cleaned Nobel data (df) and a DataFrame
    containing those winners with a born_in field."""

    df = df.replace('', np.nan)
    df = df.replace('\n', np.nan)
    df_born_in = df[df.born_in.notnull()]

    df.name = df.name.str.replace('*', '')
    df.name = df.name.str.strip()
    df = df[df.born_in.isnull()]
    df = df.drop('born_in', axis=1)
    df.drop(df[df.year == 1809].index, inplace=True)
    df = df[~(df.name == 'Marie Curie')]
    df.loc[(df.name == u'Marie Sk\u0142odowska-Curie') & (df.year == 1911), 'country'] = 'France'
    df = df[~((df.name == 'Sidney Altman') & (df.year == 1990))]
    df = df.reindex(np.random.permutation(df.index))
    df = df.drop_duplicates(['name', 'year'])
    df = df.sort_index()
    df.ix[df.name == 'Alexis Carrel', 'category'] ='Physiology or Medicine'
    df.ix[df.name == 'Ragnar Granit', 'gender'] = 'male'
    df = df[df.gender.notnull()] # remove institutional prizes
    df.ix[df.name == 'Hiroshi Amano', 'date_of_birth'] ='11 September 1960'
    df.date_of_birth = pd.to_datetime(df.date_of_birth)
    df.date_of_death = [pd.to_datetime(d, unit='D') if not pd.isnull(d) else "alive" for d in df.date_of_death]
    # df.date_of_death = pd.to_datetime(df.date_of_death, errors='coerce')
    #  この方法だとNaTの処理でNaNがNaTになって、mongoに送った時にエラーになる。
    # エラーが出るので上のように回避し、現存しているノーベル賞受賞者は"alive"となるようにした。

    df['award_age'] = df.year - pd.DatetimeIndex(df.date_of_birth).year
    return df, df_born_in

#######################################

df_clean, df_born_in = clean_data(df)
dataframe_to_mongo(df_clean, 'nobel_prize', 'winners')
dataframe_to_mongo(df_born_in, 'nobel_prize', 'winners_born_in')


# 4)Mini-BIosもJSONからMONGODBに保存
df_winner_bios = pd.read_json(open(rootdir+'/app/static/data/minibios.json'))
dataframe_to_mongo(df_winner_bios, 'nobel_prize', 'winner_bios')