#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# リスト 4-2 文書全体を単語に分解し、出現頻度を数えるプログラム例
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
 
aozora = Aozora("./data/wagahaiwa_nekodearu.txt")
 
# 文に分解してから、文ごとに文字数をカウントする
string = '\n'.join(aozora.read())
# 全角空白を取り除く。句点・改行で分割、。」の。は改行しない
string = re.split('。(?!」)|\n', re.sub('　', '', string))
while '' in string:  string.remove('')   # 空行を除く
 
cnt = Counter([len(x) for x in string])  # stringの要素（文）の長さをリストにする
# 文の長さを頻度順にソートして出力する
print(sorted(cnt.items(), key=lambda x: x[1], reverse=True)[:100])

nstring = np.array([len(x) for x in string if len(x) < 150])
print('max', nstring.max())
plt.hist(nstring, bins=nstring.max())
plt.show()

print(sorted(cnt.items(), reverse=True)[:100])  # 文の長さを頻度順にソートして出力する

aozora = Aozora("./data/wagahaiwa_nekodearu.txt")
# 文に分解してから、文ごとに文字数をカウントする
string = '\n'.join(aozora.read())
# 全角空白を取り除く。句点・改行で分割、。」の。は改行しない
string = re.split('。(?!」)|\n', re.sub('　', '', string))
while '' in string:  string.remove('')   # 空行を除く
 
cnt = Counter([len(x) for x in string])  # stringの要素（文）の長さをリストにする
# 文の長さを頻度順にソートして出力する
print(sorted(cnt.items(), key=lambda x: x[1], reverse=True)[:100])

nstring = np.array([len(x) for x in string if len(x) < 150])
print('max', nstring.max())
plt.hist(nstring, bins=nstring.max())
plt.title('『我輩は猫である』文ごとの文字数分布')
plt.xlabel('文の文字数')
plt.ylabel('出現頻度')
plt.show()
