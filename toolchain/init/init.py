#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# データに必要な世界の国別基本情報を取得し、mongo DBに保存する！（初回のみ必要！）

import sys
import os
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(rootdir)
import requests
from app.models.mongofunc import get_mongo_database

REST_EU_ROOT_URL = "http://restcountries.eu/rest/v1"


def REST_country_request(field='all', name=None, params=None):

    headers={'User-Agent': 'Mozilla/5.0'}

    if not params:
        params = {}

    if field == 'all':
        return requests.get(REST_EU_ROOT_URL + '/all')
    url = '%s/%s/%s' % (REST_EU_ROOT_URL, field, name)
    print('Requesting URL:' + url)

    response = requests.get(url, params=params, headers=headers)

    if not response.status_code == 200:
        raise Exception('Request faild with status code' + str(response.status_code))

    else:
        print("request success")
    return response

# response = REST_country_request('currency', 'usd')
# print(response.json())
# print(response.json())

# 1) 国別の情報を取得しmongoに保存する

db_nobel = get_mongo_database('nobel_prize')
col = db_nobel['country_data']
response = REST_country_request()
country_data = response.json()
col.insert(country_data)