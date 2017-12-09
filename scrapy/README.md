## scrapy

### Scrapyのプロジェクトを作成する。
`scrapy startproject PROJECTNAME`

### Spiderを作成する
作成したSpiderプロジェクト内に入った後、以下のコマンドを。
`scrapy genspider -t crawl SPIDERNAME TARGETSITE`

例）scrapy genspider -t crawl yidff_works www.yidff.jp/festivals.html