#!/usr/bin/env python3
# -*- coding:utf-8 -*-


import os
from app import create_app
from flask.ext.script import Manager, Server
from flask_socketio import SocketIO, emit


app = create_app(os.getenv('FLASK_CONFIG') or 'default')
app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')

# socketio = SocketIO(app)
manager = Manager(app)
manager.add_command("runserver", Server(port=8080))

# @socketio.on('connect', namespace='/test')
# def test_connect():
#     print('test_connect')
#     emit('my response', {'data': 'Connected'})


if __name__ == '__main__':
    print('main')
    manager.run()
    # socketio.run(app)

