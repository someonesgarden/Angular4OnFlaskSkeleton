#!/usr/bin/env python3
# -*- coding:utf-8 -*-
from sklearn import svm, metrics
import pandas as pd


"""
サポートベクターマシンを使った機械学習
"""

# データの準備
xor_input = [
    #P,Q,result
    [0, 0, 0],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 0]
]

xor_df = pd.DataFrame(xor_input)
xor_data = xor_df.ix[:,0:1]
xor_label = xor_df.ix[:,2]

clf = svm.SVC()
clf.fit(xor_data, xor_label)
pre = clf.predict(xor_data)

ac_acore = metrics.accuracy_score(xor_label, pre)
print("正解率：", ac_acore)



