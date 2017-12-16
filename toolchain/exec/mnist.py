#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import urllib.request as req
import gzip, os, os.path, sys
import struct
from sklearn import svm, metrics
import numpy as np
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
print(rootdir)
sys.path.append(rootdir)

from chainer import datasets

savepath = rootdir+"/data/mnist"
baseurl = "http://yann.lecun.com/exdb/mnist"
files = [
    "train-images-idx3-ubyte.gz",
    "train-labels-idx1-ubyte.gz",
    "t10k-images-idx3-ubyte.gz",
    "t10k-labels-idx1-ubyte.gz"
]

#1)  ダウンロード MNISTデータ
def download_mnist():
    if not os.path.exists(savepath): os.mkdir(savepath)
    for f in files:
        url = baseurl + "/" + f
        loc = savepath + "/" + f
        print("download:", url)
        if not os.path.exists(loc):
            req.urlretrieve(url, loc)

    # GZIP解凍
    for f in files:
        gz_file = savepath + "/" + f
        raw_file = savepath + "/" + f.replace(".gz", "")
        print("gzip:",f)
        with gzip.open(gz_file, "rb") as fp:
            body = fp.read()
            with open(raw_file, "wb") as w:
                w.write(body)
    print("ok")

#2) MNISTデータをCSVとpgm画像に変換する
def to_csv(name, maxdata):
    lbl_f = open(savepath + "/" + name + "-labels-idx1-ubyte", "rb")
    img_f = open(savepath + "/" + name + "-images-idx3-ubyte", "rb")
    csv_f = open(savepath + "/" + name + ".csv", "w", encoding="utf-8")
    #ヘッダー情報を読み込む
    mag, lbl_count = struct.unpack(">II", lbl_f.read(8))
    mag, img_count = struct.unpack(">II", img_f.read(8))
    rows, cols = struct.unpack(">II", img_f.read(8))
    pixels = rows * cols

    #画像データを読み込んでCSVで保存
    res = []
    for idx in range(lbl_count):
        if idx > maxdata: break;
        label = struct.unpack("B", lbl_f.read(1))[0]
        bdata = img_f.read(pixels)
        sdata = list(map(lambda n: str(n), bdata))
        csv_f.write(str(label)+",")
        csv_f.write(",".join(sdata)+"\r\n")

        if idx < 10:
            s = "P2 28 28 255\n"
            s += " ".join(sdata)
            format_base = savepath+"/{0}-{1}-{2}.pgm"
            iname =  format_base.format(name,idx,label)
            with open(iname, "w", encoding="utf-8") as f:
                f.write(s)
    csv_f.close()
    lbl_f.close()
    img_f.close()


# 3) CSVファイルを読み込み、配列に格納
def load_csv(fname):
    labels = []
    images = []
    with open(fname, "r") as f:
        for line in f:
            cols = line.split(",")
            if len(cols) < 2: continue
            labels.append(int(cols.pop(0)))
            vals = list(map(lambda n: int(n)/256, cols))
            images.append(vals)
    return {"labels":labels, "images":images}


# 4) chainer用にmnistデータを補正する
def mnist_data_for_chainer(csv_loaded_data):
    images = np.array(csv_loaded_data["images"])
    labels = np.array(csv_loaded_data["labels"])

    X = []
    Y = []
    n = len(images)
    for i in range(n):
        d = np.array(images[i].reshape(28,28), dtype=np.float32)
        X.append([d])
        Y.append(labels[i].astype(np.int32))
    X = np.array(X)
    Y = np.array(Y)
    return datasets.TupleDataset(X, Y)


# download_mnist()


def main():
    # TO_CSV: データ数の上下とファイル名を決めてcsvにする
    to_csv("train", 3000)
    to_csv("t10k", 500)
    # LOADCSV: CSVデータの読み込み
    data = load_csv(savepath+"/train.csv")
    test = load_csv(savepath+"/t10k.csv")
    # FIT: データを学習
    clf = svm.SVC()
    clf.fit(data["images"], data["labels"])
    # PREDICT* データから予測
    pre = clf.predict(test["images"])
    # ACCURARY: 正確性の判定
    ac_score = metrics.accuracy_score(test["labels"],pre)
    cl_report = metrics.classification_report(test["labels"], pre)
    print("正解率＝", ac_score)
    print("レポート=")
    print(cl_report)

