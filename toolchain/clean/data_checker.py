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



# とりあえず今日のh付
today = datetime.datetime.today()

# 1)# ScrapyでスクレイプしたJSONデータをMONGOに保存する
df = pd.read_json(open(rootdir+'/app/static/data/doclist_jap.json')) # jsonから直接データフレームを作る場合

# cleaning process

df = df.replace('', np.nan)
df = df.replace('\n', np.nan)
df = df.replace(np.nan, '')

print(df.info())
print(df.tail())
print(df.columns)
