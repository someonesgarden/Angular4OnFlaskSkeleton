#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# リスト 3-10 iris データに対する決定木の生成プログラム例
from sklearn.datasets import load_iris
from sklearn import tree
iris = load_iris()
clf = tree.DecisionTreeClassifier()
clf = clf.fit(iris.data, iris.target)
 
print(iris.data)
for i in range(len(iris.data)):
    print(clf.predict( [iris.data[i]]  ))
 
import pydotplus
dot_data = tree.export_graphviz(clf, out_file=None)
graph = pydotplus.graph_from_dot_data(dot_data)
graph.write_pdf("iris-DecisionTree.pdf")

