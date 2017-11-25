# Toolchain

## STEPS
#### [Scrape] - [Clean] - [Explore/Process] - [Deliver] - [Transform]

### 1.Scrape  / with Scrapy

1-0)Scrapyプログラム内へ移動

`cd scrapy/nobel_winners`

1-1) ノーベル賞受賞者のリストJSON作成
`scrapy crawl nwinners_full -o ../../app/static/data/nobel_winners_full.json`
保存先は、

注意点としては、
[https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country]
このリンクの左サイドバーにある"Wikidata item"
のリンク要素である"https://www.wikidata.org/wiki/Special:EntityPage/Q218964"は、
そのままスクレイプするとセキュリティエラーが起きるので、
nwinners_full_spider.py内で直接"https://www.wikidata.org/wiki/Q218964"を読ませに行っている。


1-2) 個別受賞者のミニバイオのリストJSONを作成
個別のノーベル賞受賞者ページに入り、そこから簡単なバイオを作成する
`scrapy crawl nwinners_minibio -o ../../app/static/data/minibios.json`


プロフィール画像のダウンロードができない！
参考：[https://doc.scrapy.org/en/latest/topics/media-pipeline.html]
ー＞解決！
'MEDIA_ALLOW_REDIRECTS = True'をsettings.pyに１行加えるとダウンロードされる！
参考：[https://stackoverflow.com/questions/44134908/file-code-302-error-downloading-file-in-scrapy-files-pipeline]

1-3) Scrapyの結果を確認。
結果は、scrapy/nobel_winners内に保存されるので、Webサービスとして使う場合は、app/の中に移動する。

### 2. Clean / with Pandas

2-1) Pandasによりjsonを読み込む

Cleanの段階は、データをPandasのDataframeに読み込んだ後、思考錯誤して綺麗にする方法を見つける必要がある。
そのため、以下のようにすると良い。

2-1-1). jupyter notebookでJupyterを開く。起動ファイルはpython3にする。

2-1-2). `%run ../toolchain/clean/clean.py`
のように、修正を加えたい起動ファイルをJupyter上で読み込むことで、動的に変数をチェックすることができる。
こ のプロセスで、mongoDBの"nobel_prize"データベースの中に
winnersとwinners_born_inというコレクションとして保存される。

### 3. Explore/Process
with Ipython + Pandas+ Matplotlib

この段階で、MongoDBの中には４種類のコレクションが作られている。
これを元にd3.jsでグラフを作ってゆく。

    winner_bios 
    winners
    winners_all (winnersとwinner_biosをマージしたもの）
    winners_born_in

### Deliver
Flask RESTful API
Python Eveを利用して、MongoDBベースのRESTful APIを作成できる。
pip install eve

### 5. Transform

with D3, Interactive Nobel Visualization
