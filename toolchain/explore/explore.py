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
import matplotlib as mpl
import matplotlib.pyplot as plt
from app.models.mongofunc import save_to_mongodb, get_mongo_database, mongo_to_dataframe, dataframe_to_mongo
import json

# 4)Mini-BIosもJSONからMONGODBに保存
df_winner_bios = pd.read_json(open(rootdir+'/app/static/data/minibios.json'))
df_winner_bios = df_winner_bios.where((pd.notnull(df_winner_bios)), None)

# print(df_winner_bios[df_winner_bios.link == 'http://en.wikipedia.org/wiki/Henrik_Dam'])

dataframe_to_mongo(df_winner_bios, 'nobel_prize', 'winner_bios')


# 1) ScrapyでスクレイプしたJSONデータがMONGO DBに保存されているので、
# それを分析のために読み出す。
df_clean = mongo_to_dataframe('nobel_prize', 'winners')  # データフレームに読み込む
df_born_in  = mongo_to_dataframe('nobel_prize', 'winners_born_in')  # データフレームに読み込む
df_winner_bios = mongo_to_dataframe('nobel_prize', 'winners_bios')  # データフレームに読み込む

# 2) PandasのMergeコマンドで二つのデータフレームをマージする
# サイトのアドレス"link"をキーとして結合する
# その後、明らかにマージミスのコラムだけ外して、NaT処理をして、MONGO DBに保存。
df_winners_all = pd.merge(df_clean, df_winner_bios, how='outer', on='link')
df_winners_all = df_winners_all[df_winners_all.name.notnull()]
dataframe_to_mongo(df_winners_all, 'nobel_prize', 'winners_all')

# 2) PLOTの初期設定
mpl.rcParams['lines.linewidth']=2
mpl.rcParams['lines.color']='r'
plt.rcParams['figure.figsize']=(8,4)
plt.gcf().set_size_inches(8,4)
