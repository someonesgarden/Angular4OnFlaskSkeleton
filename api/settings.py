# -*- coding:utf-8 -*-
"""
Mongo DBサーバーからデータを取得するためのスキーム設定。
MONGO_DBNAMEにdB名
DOMAINにcollection名
を与える。
"""

# Optional MONGO Variables
# MONGO_HOST = 'localhost'
# MONGO_PORT = 27017
# MONGO_USERNAME = 'user'
# MONGO_PASSWORD = 'user'

URL_PREFIX = 'api'
MONGO_DBNAME = 'nobel_prize'
DOMAIN = {'winners_all': {
    'schema': {
        'country': {'type': 'string'},
        'category': {'type': 'string'},
        'name': {'type': 'string'},
        'year': {'type': 'integer'},
        'gender': {'type': 'string'},
        'link':{'type':'string'},
        'mini_bio':{'type':'string'},
        'bio_image':{'type':'string'}
    },
'url':'winners'
}}

# X_DOMAINS = 'http://localhost:8080'
X_DOMAINS = '*'  # COR for all sites(CORS= Cross-Origin Resource Sharing)
HATEOAS = False
PAGINATION = False


