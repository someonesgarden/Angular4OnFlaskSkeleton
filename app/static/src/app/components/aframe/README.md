# Angular4上でAframeを利用する方法

※ 以下の参考に。
[https://stackoverflow.com/questions/42279323/use-untyped-a-frame-components-with-angular-2]

1) aframeライブラリをインストール
`npm install aframe aframe-template-component  aframe-animation-component --save`

2) Type情報をインストール
`npm install @types/aframe --save-dev`

2) polyfills.ts内で読み込む

import 'zone.js/dist/zone'; よりも前に以下のように挿入する：

`
 import 'aframe'; 
 import 'aframe-template-component'; 
 import 'aframe-animation-component'; 
`


