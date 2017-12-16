#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# リスト 3-5 iris データの散布図を描くプログラム例
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
import pandas as pd
iris = load_iris() # irisデータを読み込む。iris.data、iris.target、iris.DESCRからなる
# print(iris.DESCR) # データの説明を表示する
species = [ "Setosa", "Versicolour", "Virginica"]
irispddata = pd.DataFrame(iris.data, columns=iris.feature_names)
irispdtarget = pd.DataFrame(iris.target, columns=[" target "])
irispd = pd.concat([irispddata, irispdtarget], axis=1)

irispd.columns=['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)', 'target']

irispd0 = irispd[irispd.target == 0]
irispd1 = irispd[irispd.target == 1]
irispd2 = irispd[irispd.target == 2]

plt.scatter(irispd0["petal length (cm)"], irispd0["petal width (cm)" ], c= "red" , label=species[0], marker="x")
plt.scatter(irispd1["petal length (cm)"], irispd1["petal width (cm)" ], c= "blue" , label=species[1], marker=".")
plt.scatter(irispd2["petal length (cm)"], irispd2["petal width (cm)"], c="green", label=species[2], marker="+")
plt.title("iris散布図")
plt.xlabel("花弁の長さ(cm)")
plt.ylabel("花弁の幅(cm)")
plt.legend(loc="lower left")
plt.show()
