#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# リスト 3-7 iris データの k-means 法によるクラスタリングの例
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
import pandas as pd
iris = load_iris()
species = ['Setosa', 'Versicolour', 'Virginica']
irispddata = pd.DataFrame(iris.data, columns=iris.feature_names)
irispdtarget = pd.DataFrame(iris.target, columns=['target'])

kmeans = KMeans(n_clusters=3).fit(irispddata)
 
irispd = pd.concat([irispddata, irispdtarget], axis=1)
iriskmeans = pd.concat([irispd, pd.DataFrame(kmeans.labels_, columns=['kmeans'])], axis=1)
irispd0 = iriskmeans[iriskmeans.kmeans == 0]
irispd1 = iriskmeans[iriskmeans.kmeans == 1]
irispd2 = iriskmeans[iriskmeans.kmeans == 2]
 
dic = {}
dic[ iriskmeans['kmeans'][25] ] = iriskmeans['target'][25]
dic[ iriskmeans['kmeans'][75] ] = iriskmeans['target'][75]
dic[ iriskmeans['kmeans'][125] ] = iriskmeans['target'][125]
d = np.array([dic[u] for u in iriskmeans['kmeans']])
irisdiff = iriskmeans[iriskmeans.target != d ]
 
plt.scatter(irispd0['petal length (cm)'], irispd0['petal width (cm)'], c='red', label=species[dic[0]], marker='x')
plt.scatter(irispd1['petal length (cm)'], irispd1['petal width (cm)'], c='blue', label=species[dic[1]], marker='.')
plt.scatter(irispd2['petal length (cm)'], irispd2['petal width (cm)'], c='green', label=species[dic[2]], marker='+')
plt.scatter(irisdiff['petal length (cm)'], irisdiff['petal width (cm)'], c='black', label='missed', marker='^')

plt.title('iris散布図、k-means法')
plt.xlabel('花弁の長さ(cm)')
plt.ylabel('花弁の幅(cm)')
plt.legend()
plt.show()


