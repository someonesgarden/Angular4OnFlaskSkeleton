# Angular4でD3を使う方法

1) Type情報をインストール

`npm install @types/d3 --save-dev`

2) d3をインストール

`npm install d3 --save`

3) polyfills.tsに登録

`import 'd3';`


4)modulename.component.tsにライブラリをインポート

`import * as d3 from 'd3';`


