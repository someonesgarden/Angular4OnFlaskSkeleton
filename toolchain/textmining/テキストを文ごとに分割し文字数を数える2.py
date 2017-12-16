# -*- coding: utf-8 -*-
# 4.1.2節　テキストを文ごとに分割し文字数を数える　文への分割
import matplotlib.pyplot as plt
import numpy as np
import nltk
from nltk.corpus import inaugural
from collections import Counter
text = inaugural.raw('1789-Washington.txt')
sents = nltk.tokenize.sent_tokenize(text)   # sentsは1文ずつを要素とするリスト
# sentsの文ごとの文字数のリストを作り、Counterで頻度を数える
cnt = Counter(len(x) for x in sents)
# 頻度と長さの降順にソートして表示
print(sorted(cnt.items(), key=lambda x: [x[1], x[0]], reverse=True))

nstring = np.array([len(x) for x in sents])
plt.hist(nstring)
plt.show()
