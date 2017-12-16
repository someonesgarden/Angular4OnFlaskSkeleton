#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import os
import sys
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
print(rootdir)
sys.path.append(rootdir)

import chainer
from chainer import Variable, optimizers, Chain,serializers
import chainer.links as L
import chainer.functions as F

from chainer.datasets import tuple_dataset
from chainer import training, iterators
from chainer.training import extensions


import numpy as np
from sklearn import datasets

# --- Irisデータの読み込み
iris_data = datasets.load_iris()
x = iris_data.data.astype(np.float32)
t = iris_data.target
n = t.size

# ==== 教師データの下処理
t_matrix = np.zeros(3 * n).reshape(n, 3).astype(np.float32)
for i in range(n):
    t_matrix[i, t[i]] = 1.0

# ---　訓練用データとテスト用データ　半分が訓練、半分がテスト
indexes = np.arange(n)
indexes_train = indexes[indexes%2 != 0]
indexes_test = indexes[indexes%2 == 0]

x_train = x[indexes_train, :]
t_train = t_matrix[indexes_train, : ] # 訓練用 正解
x_test = x[indexes_test, :]
t_test = t[indexes_test]


# -- t_test以外をvariablesに変換
train = tuple_dataset.TupleDataset(x_train, t_train)
# x_train_v = Variable(x_train)
# t_train_v = Variable(t_train)
x_test_v = Variable(x_test)

# -- Chainの記述
class IrisChain(Chain):
    def __init__(self):
        super(IrisChain, self).__init__(
            l1 = L.Linear(4, 6),
            l2 = L.Linear(6, 6),
            l3 = L.Linear(6, 3)
        )

    def __call__(self, x, t):
        return F.mean_squared_error(self.predict(x), t)


    def predict(self, x):
        h1 = F.sigmoid(self.l1(x))
        h2 = F.sigmoid(self.l2(h1))
        h3 = self.l3(h2)
        return h3


# モデルとoptimizerの設定

model = IrisChain()
optimizer = optimizers.Adam()
optimizer.setup(model)

# --学習

train_iter = iterators.SerialIterator(train, 30)
updater = training.StandardUpdater(train_iter, optimizer)
trainer = training.Trainer(updater, (5000, 'epoch'))
trainer.extend(extensions.ProgressBar())
trainer.run()

# for i in range(10000):
#     model.cleargrads()
#     y_train_v = model.predict(x_train_v)
#
#     loss = F.mean_squared_error(y_train_v, t_train_v)
#     loss.backward()
#
#     optimizer.update()


# モデルの保存
serializers.save_npz(rootdir+"/data/my_iris.npz", model)

# --テスト

model.cleargrads()
y_test_v = model.predict(x_test_v)
y_test = y_test_v.data


# --正解数のカウント

correct = 0
rowCount = y_test.shape[0]
for i in range(rowCount):
    maxIndex = np.argmax(y_test[i,:]) # np.argmax関数は最大の要素のインデックスを返す
    print(y_test[i, :], maxIndex)
    if maxIndex == t_test[i]:
        correct += 1

# 正解率
print("Correct:", correct, "Total:", rowCount, "Accuracy:", correct/rowCount * 100, "%")







