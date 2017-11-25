#!/usr/bin/env python3
# -*- coding:utf-8 -*-


import os
from app import create_app
from flask.ext.script import Manager, Server

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

manager = Manager(app)
manager.add_command("runserver", Server(port=8080))


if __name__ == '__main__':
    manager.run()

