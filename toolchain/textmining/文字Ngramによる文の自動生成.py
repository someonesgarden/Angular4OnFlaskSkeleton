#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import os, sys, re
import MeCab
from numpy.random import rand
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
print(rootdir)
sys.path.append(rootdir)

from collections import Counter
import numpy as np
from toolchain.textmining.aozora import Aozora
from toolchain.textmining.sentensegeneration import SentenseGeneration

import nltk
from nltk.corpus import jeita
jeita.readme()

# from nltk.corpus.reader.chasen import *
# jeita = ChasenCorpusReader('/Users/user/nltk_data/corpora/jeita', 'a1000.chasen', encoding='utf-8')
# string = jeita.words()

# aozora = Aozora(rootdir+"/toolchain/textmining/data/wagahaiwa_nekodearu.txt")
# string = '\n'.join(aozora.read())
# 形態素解析して、語の出現頻度を数える
# m = MeCab.Tagger("-Ochasen")          # MeCabで単語に分割する
# mecablist = []
# wlist = m.parse(string).splitlines()  # 結果を単語情報リストのリストに整形する
# for u in wlist:
#     xlist = []
#     for v in u.split():
#        xlist.append(v)
#     mecablist.append(xlist[0])

delimiter = ['「', '」', '…', '　']

# doublets = list(zip(string[:-1], string[1:]))
# print(doublets)

words =  jeita.words('a1000.chasen')

doublets = list(zip(words[:-1], words[1:]))
doublets = list(filter(lambda x: not((x[0] in delimiter) or (x[1] in delimiter)), doublets))

triplets = list(zip(words[:-2], words[1:-1], words[2:]))
triplets = list(filter(lambda x: not((x[0] in delimiter) or (x[1] in delimiter)), triplets))

dic2 = Counter(doublets)
# dic2 = sorted(dic2.items(), key=lambda x: x[1], reverse=True)[:20]
dic3 = Counter(triplets)
# dic3 = sorted(dic3.items(), key=lambda x: x[1], reverse=True)[:20]
# print(dic3)
sg = SentenseGeneration()


# 以下メインプログラム
#words = ['で', 'ある']         # 2-gramの時の初期シーケンス
words = ['','子規', 'の']    # 3-gramの時の初期シーケンス
output = words[1:]            # 出力outputの先頭に初期シーケンスを埋め込む
for i in range(50):          # 最大で50語まで生成（「。」などが来れば停止）
    if len(words) == 2:
        newword = sg.gennext(words, dic2)  # 2-gram時の次の語の生成
    else:
        newword = sg.gennext(words, dic3)  # 3-gram時の次の語の生成
    output.append(newword)              # 出力シーケンスoutputに次の語を加える
    if newword in ['', '。', '？', '！']:  # 次の語が終端なら生成終了
        break
    words = output[-len(words):]      # 次のgentextの入力を準備する
for u in output:
    print(u, end='')
print()