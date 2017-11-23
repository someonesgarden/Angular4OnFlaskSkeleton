import { Component, OnInit  } from '@angular/core';
import {DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript} from '@angular/platform-browser';


@Component({
  selector: 'app-myform',
  templateUrl: './myform.component.html',
  styleUrls: ['./myform.component.css']
})
export class MyformComponent implements OnInit {

    // 文字数カウント機能付きテキストエリア
  max = 140;
  tweet = '';
  count = this.max;
  myStyle = {
    color:'#00f', fontWeight:'normal'
  };
  setcolor(){
    console.log("setCollor");
    this.count = this.max - this.tweet.length;
    if(this.count > 10){
      this.myStyle = {color:'#00f', fontWeight:'normal'}
    } else if(this.count >0){
      this.myStyle = {color:'#f0f', fontWeight: 'normal'}
    }else{
      this.myStyle = {color:'#f00', fontWeight:'bold'}
    }
  };

  //テキストボックスの内容を区切り文字で分割
  emails:String[] = [];

  constructor(private sanitizer:DomSanitizer){

  }

  ngOnInit() {
  }

}
