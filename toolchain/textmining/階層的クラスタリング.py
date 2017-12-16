#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# リスト 3-6 SciPy パッケージを使った階層的クラスタリングのプログラム例
import numpy as np
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import pdist
import matplotlib.pyplot as plt
X = np.array([[1,2], [2,1], [3,4], [4,3]])
Z = linkage(X, 'single')  # Ward法を使うならば'single'の代わりに'ward'を指定する
dendrogram(
    Z,
    labels = ['a', 'b', 'c', 'd']
)
plt.title('階層的クラスタリングの結果（樹形図）')
plt.ylabel('距離')
plt.show()