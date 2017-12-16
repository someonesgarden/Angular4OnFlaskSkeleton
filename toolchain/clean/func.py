#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import sys
import os
import json
import time, datetime
import pymongo
import pandas as pd
import numpy as np
from sklearn.preprocessing import Imputer
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(rootdir)
from app.models.mongofunc import save_to_mongodb, get_mongo_database, mongo_to_dataframe, dataframe_to_mongo

print('================================')
print('sklearn:')
print('.preprocessing:')
print('- Imputer')
print('- LabelEncoder')
print('- OneHotEncoder')
print('- MinMaxScaler')
print('- StandardScaler')
print('================================')
print('sklearn:')
print('.model_selection: ')
print('- train_test_split')
print('================================')

