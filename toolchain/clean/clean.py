#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import sys
import os
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(rootdir)
import pymongo
import pandas as pd
import numpy as np
from app.models.mongofunc import save_to_mongodb, get_mongo_database, mongo_to_dataframe
import json


# 1)# ScrapyでスクレイプしたJSONデータをMONGOに保存する

def save_json_to_mongo():
    print("..save_json_to_mongo..")
    with open(rootdir+'/app/static/data/nobel_winners.json') as f:
        nobel_winners = json.load(f)
        # print(nobel_winners)
        save_to_mongodb('nobel_prize', 'winners', nobel_winners)

# 2) データをDataFrameに読み込み。基本情報を確認する
# df = pd.read_json(open(rootdir+'/app/static/data/nobel_winners.json'))

# save_json_to_mongo() # ScrapyしたデータをJSONにし、それをmongoDBに読み込む

# mondgoの中にあるかどうかを確認
# db = get_mongo_database('nobel_prize')
# coll = db['winners']
# # print(records)
# res = coll.find()
# print(list(res))

df = mongo_to_dataframe('nobel_prize', 'winners')  # データフレームに読み込む
# df2 = pd.read_json(open(rootdir+'/app/static/data/nobel_winners.json')) # jsonから直接データフレームを作る場合

# print(df.describe())
# print(df.info())
# print(df.head())
# print(df.columns)
# df = df.set_index('name')
# print(df.head(2))
# df.reset_index(inplace=True)

bi_col = df.born_in
print(bi_col)
print(type(bi_col))
