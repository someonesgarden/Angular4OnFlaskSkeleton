#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# リスト 4-1(2) 文に分割し、さらに単語に分割して数える例
import matplotlib.pyplot as plt
import numpy as np
import nltk
from nltk.corpus import inaugural
from collections import Counter
sents_Washington = nltk.tokenize.sent_tokenize(inaugural.raw('1789-Washington.txt'))
sents_Kennedy= nltk.tokenize.sent_tokenize(inaugural.raw('1961-Kennedy.txt'))
sents_Obama = nltk.tokenize.sent_tokenize(inaugural.raw('2009-Obama.txt'))

cnt_Washington = Counter(len(sent.split()) for sent in sents_Washington)
cnt_Kennedy = Counter(len(sent.split()) for sent in sents_Kennedy)
cnt_Obama = Counter(len(sent.split()) for sent in sents_Obama)
print(sorted(cnt_Washington.items(), key=lambda x: [x[1], x[0]], reverse=True))
print(sorted(cnt_Kennedy.items(), key=lambda x: [x[1], x[0]], reverse=True))
print(sorted(cnt_Obama.items(), key=lambda x: [x[1], x[0]], reverse=True))

nstring_Washington = np.array( [len(sent.split()) for sent in sents_Washington] )
nstring_Kennedy = np.array( [len(sent.split()) for sent in sents_Kennedy] )
nstring_Obama = np.array( [len(sent.split()) for sent in sents_Obama] )

plt.hist([nstring_Washington, nstring_Kennedy, nstring_Obama],
          color=['blue', 'red', 'green'],
          label=['1789年ワシントン', '1961年ケネディ', '2007年オバマ'])
plt.title('1789年ワシントン/1961年ケネディ/2007年オバマ就任演説の文ごとの単語数分布')

plt.xlabel('文の単語数')
plt.ylabel('出現頻度')
plt.legend()
plt.show()
