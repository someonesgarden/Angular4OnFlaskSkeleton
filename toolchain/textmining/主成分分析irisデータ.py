#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# リスト 3-8 iris の主成分分析のプログラム例
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris
from matplotlib import pyplot as plt
 
colors = ['red', 'blue', 'green' ]
markers = ['x', 'point', 'plus' ]
# データを準備する
iris = load_iris()  # scikit-learnのデータライブラリからirisを読み込む
species = ['Setosa', 'Versicolour', 'Virginica']
# データ部分を取り出す
irisdata = pd.DataFrame(iris.data, columns=iris.feature_names)
# どの種かの情報を取り出す
iristarget = pd.DataFrame(iris.target, columns=['target'])
irispd = pd.concat([irisdata, iristarget], axis=1)  # 結合する
pca = PCA(n_components = 4)       # PCAクラスのインスタンス生成、成分数を4にする
pca.fit(irisdata)                 # データ部分だけを主成分分析に与えて解析する
print('主成分', pca.components_)  # 結果を表示
print('平均', pca.mean_)
print('分散', pca.explained_variance_ )
print('寄与率', pca.explained_variance_ratio_)
print('累積寄与率', np.cumsum(pca.explained_variance_ratio_))
 
# 主成分に変換したデータ点をプロットする。表示色を変えるために種ごとに分けて処理する
transformed0 = pca.transform(irisdata[irispd.target==0])
transformed1 = pca.transform(irisdata[irispd.target==1])
transformed2 = pca.transform(irisdata[irispd.target==2])
# scatterメソッドは、xとyを位置の揃った別のリストとして受け取るので、合うように加工
plt.scatter([u[0] for u in transformed0], [u[1] for u in transformed0], c='red', \
             label=species[0], marker='x')
plt.scatter([u[0] for u in transformed1], [u[1] for u in transformed1], c='blue', \
    label=species[1], marker='.')
plt.scatter([u[0] for u in transformed2], [u[1] for u in transformed2], c='green', \
    label=species[2], marker='+')
plt.title('irisデータの主成分分析')
plt.xlabel('pc1')
plt.ylabel('pc2')
plt.legend()
plt.show()

