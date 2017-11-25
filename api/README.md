# EVE server for mongo
参考[http://python-eve.org/]

api/settings.pyに記載した設定により、
`http://127.0.0.1:5000/api/winners`にアクセスすると、そのままMONGODBのnobel_prizeデータベースのwinnersコレクションを参照できる。

`curl- g http://127.0.0.1:5000/api/winners`

ブラウザで
`http://127.0.0.1:5000/api/winners?where={"country":"Japan", "year":2016}`
とすると、日本で2016年にノーベル賞を受賞した人名が出てくる。

APIを作る際に気をつけることは、CORSの設定。
CORS = Cross-Origin Resource Sharings

settings.pyに

`X-DOMAINS = "*"`

と追記することで、すべてのファイルからmongo DBのデータにアクセスできるようになる。
