#/usr/bin/env python3
# -*- coding:utf-8 -*-
"""
PythonでFirebaseを使うためのServiceクラス
2017.12.01 by Daisuke Nishimura
"""

import pyrebase as pyb
from firebase_config import PyrebaseConfig


class PyrebaseClass:

    fb_db = None

    def init_db(self):
        firebase = pyb.initialize_app(PyrebaseConfig.config)
        self.fb_db = firebase.database()

    def push_data(self, child, data):
        self.fb_db.child(child).set(data)

