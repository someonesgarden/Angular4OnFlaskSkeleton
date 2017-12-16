#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# リスト 4-3  文ごとに単語に分解し、出現頻度を数えるプログラム例
from collections import Counter
import os
import sys
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
print(rootdir)
sys.path.append(rootdir)

from collections import Counter
import re
import numpy as np
import matplotlib.pyplot as plt
from toolchain.textmining.aozora import Aozora
import MeCab
 
aozora = Aozora("./data/wagahaiwa_nekodearu.txt")
 
# 入力テキストを文に分解する。単純に'。'で分割する
string = '\n'.join(aozora.read())
string = re.sub('　', '', string)
string = re.split('。(?!」)|\n', re.sub('　', '', string))
while '' in string:  string.remove('')      # 空行を除く
 
# 文ごとに形態素解析して、文当たりの語の数を数える
m = MeCab.Tagger("-Ochasen")                # MeCabで単語に分割する
wordcountlist = []
for sentense in string:
    mecablist = []
    wlist = m.parse(sentense).splitlines()  # 結果を単語情報リストのリストに整形する
    for u in wlist:
        xlist = []
        for v in u.split():
           xlist.append(v)
        mecablist.append(xlist)
    # 得られた単語情報リストのリストから、単語の部分だけを取り出したリストを作る
    wordbodylist = []
    for u in mecablist:
        wordbodylist.append(u[0])
    # 単語数のリストを作る
    wordcountlist.append(len(wordbodylist))
 
cnt = Counter(wordcountlist)
# 結果をカウント数の降順にソート
print(sorted(cnt.items(), key=lambda x: x[1], reverse=True)[:100])
u = np.array(wordcountlist)
nstring = u[ np.where(u < 150) ]
plt.hist(nstring, bins=nstring.max())
plt.title('『吾輩は猫である』文ごとの単語数分布')
plt.xlabel('文の単語数')
plt.ylabel('出現頻度')
plt.show()
