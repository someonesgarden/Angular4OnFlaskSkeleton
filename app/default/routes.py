from . import default
from flask import Flask, request, render_template, url_for, jsonify


@default.route('/')
def home():
    return default.send_static_file('index.html')


@default.route('/math')
def math():
    return render_template('math.jade')
