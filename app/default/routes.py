#!/usr/bin/env python3
# -*- coding:utf-8 -*-

from . import default
from flask import Flask, request, render_template, url_for, jsonify
import sys
import os
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(rootdir)
import pandas as pd
from bson.json_util import dumps
from app.models.mongofunc import get_mongo_database
db = get_mongo_database('nobel_prize')

import app.services.pyrebase_db as pys


@default.route('/')
@default.route('/core')
@default.route('/main')
@default.route('/docu')
@default.route('/docu_jap_wiki')
@default.route('/yidff')
@default.route('/idfa')
@default.route('/docufeslist')
def home():
    # Angular4 page
    return default.send_static_file('index.html')
    # return render_template('/app/static/src/index.html')


@default.route('/math')
def math():

    # http://localhost:5000/math?country=Mexico このような感じでrequest
    query_dict = {}
    for key in ['country', 'category', 'year']:
        arg = request.args.get(key)
        if arg:
            if key is "year":
                arg = int(arg)
            print(arg)
            query_dict[key] = arg

    winners = db['winners'].find(query_dict)

    if winners:
        df_winners = pd.DataFrame(list(winners))
        print(df_winners)

    return render_template('math.jade')