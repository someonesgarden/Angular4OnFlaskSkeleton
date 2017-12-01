#/usr/bin/env python3
# -*- coding:utf-8 -*-
"""
PythonでFirebaseを使うためのServiceクラス
2017.12.01 by Daisuke Nishimura
"""

import pyrebase as pyb

from config import PyrebaseConfig

fbtestdata = {
    "name": "Daisuke Nishimura"
}


# fbdbClass = pys.PyrebaseClass()
# fbdbClass.init_db()
# fbdbClass.push_data('tatta', {'test':'okoko'})
# # fbdb = pys.init_fbdb()


class PyrebaseClass:

    fb_db = None

    def init_db(self):
        firebase = pyb.initialize_app(PyrebaseConfig.config)
        self.fb_db = firebase.database()

    def push_data(self, child, data):
        self.fb_db.child(child).push(data)

