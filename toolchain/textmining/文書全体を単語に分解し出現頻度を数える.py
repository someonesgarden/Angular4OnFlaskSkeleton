#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# リスト 4-2 文書全体を単語に分解し、出現頻度を数えるプログラム例
from collections import Counter

import matplotlib.pyplot as plt
import numpy as np
import nltk
from nltk.corpus import inaugural
from collections import Counter
sents = nltk.tokenize.sent_tokenize(inaugural.raw('1789-Washington.txt'))
 
cnt = Counter(len(sent.split()) for sent in sents)
print(sorted(cnt.items(), key=lambda x: [x[1], x[0]], reverse=True))
 
nstring = np.array( [len(sent.split()) for sent in sents] )
plt.hist(nstring)
plt.title('1789年ワシントン就任演説の文ごとの単語数分布')
plt.xlabel('文の単語数')
plt.ylabel('出現頻度')
plt.show()
