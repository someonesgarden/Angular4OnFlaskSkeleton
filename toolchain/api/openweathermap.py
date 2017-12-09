#!/usr/bin/env python3
# -*- coding:utf-8 -*-
"""
対応都市の一覧(JSONの圧縮ファイル）
http://bulk.openweathermap.org/sample/city.list.json.gz
"""
import requests
import json

# API Key
apiKey = 'f7037c2b1e53ee9f8531217faea6b41c'
cities = ["Tokyo,JP", "London,UK", "New York,US"]

# API query
api ="http://api.openweathermap.org/data/2.5/weather?q={city}&APPID={key}"

# 温度変換
k2c = lambda k: k - 273.15

for name in cities:
    url = api.format(city=name, key=apiKey)
    r = requests.get(url)
    data = json.loads(r.text)

    print("+都市 = ", data["name"])
    print("| 天気 = ", data["weather"][0]["description"])
    print("| 最低気温 = ", data["main"]["temp_min"])
    print("| 最高気温 = ", data["main"]["temp_max"])
    print("| 湿度 = ", data["main"]["humidity"])
    print("| 気圧 = ", data["main"]["pressure"])
    print("| 風向き = ", data["wind"]["deg"])
    print("| 風速 = ", data["wind"]["speed"])
    print("  ")
