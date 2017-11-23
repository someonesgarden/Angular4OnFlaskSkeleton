#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import os
import sys
import csv
import json
import datetime
from dateutil import parser

rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(rootdir)

nobel_winners = [
    {
        'category': 'Physics',
        'name': 'Albert Einstein',
        'nationality': 'Swiss',
        'sex': 'male',
        'year': 1921
    },
    {
        'category': 'Physics',
        'name': 'Paul Dirac',
        'nationality': 'British',
        'sex': 'male',
        'year': 1933
    },
    {
        'category': 'Chemistry',
        'name': 'Marie Curie',
        'nationality': 'Polish',
        'sex': 'female',
        'year': 1911
    }
]


class JSONDateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()
        else:
            return json.JSONEncoder.default(self, obj)


def dumps(obj):
    return json.dumps(obj, cls=JSONDateTimeEncoder)


def save_json(filename):
    with open(rootdir+'/data/'+filename, 'w') as f:
        json.dump(nobel_winners, f)


def read_json(filename):
    with open(rootdir+'/data/'+filename) as f:
        nobel_winners2 = json.load(f)
    print(nobel_winners2)


def save_csv(filename):
    cols = nobel_winners[0].keys()
    with open(rootdir+'/data/'+filename, 'w') as f:
        f.write(','.join(cols) + '\n')
        for o in nobel_winners:
            row = [str(o[col]) for col in cols]
            f.write(','.join(row) + '\n')


def read_csv(filename):
    with open(rootdir+'/data/'+filename) as f:
        reader = csv.reader(f)
        for row in reader:
            print(row)


def save_csv2(filename):
    with open(rootdir+'/data/'+filename, 'w') as f:
        fieldnames = nobel_winners[0].keys()

        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for w in nobel_winners:
            w['year'] = int(w['year'])
            writer.writerow(w)


if __name__ == '__main__':
    save_csv('novel_winners.csv')
    read_csv('novel_winners.csv')
    save_csv2('novel_winners2.csv')
    save_json('novel_winners.json')
    read_json('novel_winners.json')

    now_str = dumps({'time': datetime.datetime.now()})
    print(now_str)
