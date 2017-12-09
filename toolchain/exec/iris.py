#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import sklearn as sk
from sklearn import datasets
from sklearn import svm
from sklearn import metrics
from sklearn import cross_validation
import pandas as pd
import numpy as np
import random, re

# 1) DATAPREP: DATAの準備
iris = datasets.load_iris()
total_data = iris.data
total_label = iris.target
train_data, test_data, train_label, test_label = cross_validation.train_test_split(total_data, total_label)

# 2) FIT: データの学習
clf = svm.SVC()
clf.fit(train_data, train_label)

# 3) PREDICT: データの予測
pre = clf.predict(test_data)

# 4) ACCURACY: 正確度のチェックと出力
ac_score = metrics.accuracy_score(test_label, pre)
print("正確度＝", ac_score)