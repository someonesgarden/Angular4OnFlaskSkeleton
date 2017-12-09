#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import sys
import os
import time, datetime
import numpy as np
import pandas as pd
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(rootdir)
import pymongo
import pandas as pd
import numpy as np
from app.models.mongofunc import save_to_mongodb, get_mongo_database, mongo_to_dataframe, dataframe_to_mongo
import app.services.pyrebase_db as pys


# とりあえず今日のh付
today = datetime.datetime.today()

# 1)# ScrapyでスクレイプしたJSONデータをMONGOに保存する
df = pd.read_json(open(rootdir+'/app/static/data/docfeslist.json')) # jsonから直接データフレームを作る場合

# cleaning process

df = df.replace('', np.nan)
df = df.replace('\n', np.nan)
df = df.replace(np.nan, '')

print(df.info())
print(df.tail())
print(df.columns)

# dataframe_to_mongo(df, 'docu_archive', 'docu_from_wiki')


# ローカルのMongoDBではなく、Firebaseに保存する
fbdbClass = pys.PyrebaseClass()
fbdbClass.init_db()

records = df.to_dict('records')
fbdbClass.push_data('docfes_list', records)