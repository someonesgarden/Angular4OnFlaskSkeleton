Flask/Angular 4 - Skeleton
=========================


####  ** [hawzie197/Flask_Angular4_Skeleton] を元に自分なりに発展させてゆく予定です。** 



angular appである"static/src/index.html"をFlaskが呼び出している。
index.htmlを"dist"の中に構築することで読み出している。

サーバーサイドは "python manage.py runserver"コマンドで読み出し、
クライアントサイドは app/staticの中で"ng build --dev --watch"コマンドで起動している。


============
構成
============

    |--- api  Python EVEによるMongo DBサーバー
    |
    |-- app------ static -- Angular4 のapplication
    |     |
    |     |------ default --routes.py FLASKのルーティング用
    |
    |-- jupyter --- 実験用のjupyter notebook
    |
    |-- scrapy  SCRAPYによるスクレイピング用モジュール
    |
    |-- toolchains データの準備のためのプロセスごとのPython
    |
    |-- manage.py  FLASKのメイン


============
設定方法
============

https://github.com/someonesgarden/Flask_Angular4_Skeleton
を参照


1. ターミナルから必要なライブラリをインストール。
`pip install -r requirements.txt`
2. 以下のコマンドでFlask サーバー起動。
`python manage.py runserver`

3. 別のターミナルで `cd app/static`
4 必要ライブラリをインストール。
“npm install“
5. クライアント側のAngular4を起動
`ng build --dev --watch`
6.  http://127.0.0.1:5000/

7.EVEサーバーの起動
`api/server_eve.py`

============
Projectの詳細
============

default:

    - Contains all routes for the project. These routes serve up data from backend for
      the client side to receive.

models:

    - The models hold sqlalchemy classes. These sqlalchemy classes are ORMs or object relational
      mappers, which directory correspond to the tables in the database.

services:

    - The backend services separate out the logic from the routes and modals. These contain
      all the core backend code for manipulating data.

static:

    - The static directory contains all of Angular's client side code. The static directory
      requests and recieves information through api calls to flask's routes.

static/src/app/components:

    - The components directory contains all components composing the client side of the application.
    - To create a new component:
        - cd app/static
        - ng g component [name]

static/src/app/services:

    - The static services separate out logic from the components. They request/recieve data from
      the components and transfer it from the client side to server side through api calls to flask's routes.
    - To create a new service:
        - cd app/static
        - ng g service [name]

templates:

    - The templates hold all html templates to render. All views are handled with Angular.
      These are mostly for warnings. 404s, 403s, 500s, unauthorized, etc..

