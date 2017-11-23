#!/usr/bin/env python3
# -*- coding:utf-8 -*-


import os
from app import create_app
from flask.ext.script import Manager

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
app.debug = True
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

manager = Manager(app)


if __name__ == '__main__':
    manager.run()

